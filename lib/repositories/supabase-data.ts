import { describeOpenState, isOpenAt, isOpenFriday } from "@/lib/business-hours/hours";
import { createSupabaseAdmin, createSupabaseAnon, hasServiceRole } from "@/lib/supabase";
import type {
  BusinessHour,
  BusinessImage,
  BusinessView,
  Category,
  DayOfWeek,
  Locality,
  Subcategory,
  Tag,
} from "@/types";

type Row = Record<string, unknown>;

function asObject(value: unknown): Row | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Row;
}

function asArray(value: unknown): Row[] {
  return Array.isArray(value) ? (value.filter((item) => item && typeof item === "object") as Row[]) : [];
}

function text(row: Row, key: string) {
  const value = row[key];
  return typeof value === "string" ? value : value == null ? null : String(value);
}

function bool(row: Row, key: string) {
  return row[key] === true;
}

function num(row: Row, key: string) {
  const value = row[key];
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function clock(value: string | null) {
  if (!value) return "00:00";
  return value.slice(0, 5);
}

export const businessSelect = `
  *,
  locality:localities(*),
  business_categories(category_id, subcategory_id, category:categories(*), subcategory:subcategories(*)),
  business_tags(tag_id, tag:tags(*)),
  business_hours(*),
  business_images(*)
`;

function mapCategory(row: Row): Category {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    icon: String(row.icon ?? "Store"),
    displayOrder: Number(row.display_order ?? 0),
    isActive: row.is_active !== false,
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

function mapSubcategory(row: Row): Subcategory {
  return {
    id: String(row.id),
    categoryId: String(row.category_id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    displayOrder: Number(row.display_order ?? 0),
    isActive: row.is_active !== false,
  };
}

function mapTag(row: Row): Tag {
  return { id: String(row.id), name: String(row.name ?? ""), slug: String(row.slug ?? "") };
}

function mapLocality(row: Row): Locality {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    isPrimary: bool(row, "is_primary"),
    isActive: row.is_active !== false,
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

export function mapBusinessRow(row: Row, now = new Date()): BusinessView {
  const localityRow = asObject(row.locality) ?? {
    id: row.locality_id,
    name: "עתלית",
    slug: "atlit",
    is_primary: true,
    is_active: true,
    created_at: new Date().toISOString(),
  };
  const hours: BusinessHour[] = asArray(row.business_hours).map((hour) => ({
    id: String(hour.id),
    businessId: String(hour.business_id ?? row.id),
    dayOfWeek: Number(hour.day_of_week) as DayOfWeek,
    openTime: clock(text(hour, "open_time")),
    closeTime: clock(text(hour, "close_time")),
  }));
  const images: BusinessImage[] = asArray(row.business_images)
    .map((image) => ({
      id: String(image.id),
      businessId: String(image.business_id ?? row.id),
      imageUrl: String(image.image_url ?? ""),
      altText: String(image.alt_text ?? ""),
      displayOrder: Number(image.display_order ?? 0),
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const openState = describeOpenState(hours, now);
  return {
    id: String(row.id),
    localityId: String(row.locality_id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    shortDescription: String(row.short_description ?? ""),
    description: String(row.description ?? ""),
    phone: text(row, "phone"),
    whatsapp: text(row, "whatsapp"),
    email: text(row, "email"),
    website: text(row, "website"),
    instagram: text(row, "instagram"),
    facebook: text(row, "facebook"),
    address: text(row, "address"),
    latitude: num(row, "latitude"),
    longitude: num(row, "longitude"),
    showExactAddress: bool(row, "show_exact_address"),
    logoUrl: text(row, "logo_url"),
    coverImageUrl: text(row, "cover_image_url"),
    isHomeBusiness: bool(row, "is_home_business"),
    providesDelivery: bool(row, "provides_delivery"),
    providesHomeService: bool(row, "provides_home_service"),
    accessibility: bool(row, "accessibility"),
    kosher: bool(row, "kosher"),
    verified: bool(row, "verified"),
    active: row.active !== false,
    featured: bool(row, "featured"),
    isDemo: bool(row, "is_demo"),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    locality: mapLocality(localityRow),
    categories: asArray(row.business_categories)
      .map((link) => {
        const category = asObject(link.category);
        const subcategory = asObject(link.subcategory);
        if (!category) return null;
        return {
          category: mapCategory(category),
          subcategory: subcategory ? mapSubcategory(subcategory) : null,
        };
      })
      .filter((item): item is BusinessView["categories"][number] => Boolean(item)),
    tags: asArray(row.business_tags)
      .map((link) => asObject(link.tag))
      .filter((tag): tag is Row => Boolean(tag))
      .map(mapTag),
    hours,
    images,
    recommendationCount: Number(row.recommendation_count ?? 0),
    openNow: isOpenAt(hours, now),
    openState,
    openFriday: isOpenFriday(hours),
  };
}

export function readClient() {
  return hasServiceRole() ? createSupabaseAdmin() : createSupabaseAnon();
}

export async function fetchBusinessRows(includeInactive = false) {
  let query = readClient().from("businesses").select(businessSelect);
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) {
    console.error(error);
    throw new Error("catalog-unavailable");
  }
  return (data ?? []) as unknown as Row[];
}

export { mapCategory, mapSubcategory, mapTag, mapLocality };
