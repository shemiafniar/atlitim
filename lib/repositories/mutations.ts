import { assembleBusinesses, readDemoStore, updateDemoStore } from "@/lib/repositories/demo";
import { createSupabaseAdmin, createSupabaseAnon, createSupabaseServer, hasServiceRole, isSupabaseConfigured } from "@/lib/supabase";
import type { HourInput } from "@/lib/validators";
import type { BusinessSubmission, CatalogStore, ReportReason, ReportStatus, SubmissionStatus } from "@/types";

export interface BusinessDraft {
  id?: string;
  localityId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  showExactAddress: boolean;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  isHomeBusiness: boolean;
  providesDelivery: boolean;
  providesHomeService: boolean;
  accessibility: boolean;
  kosher: boolean;
  verified: boolean;
  active: boolean;
  featured: boolean;
  isDemo?: boolean;
  subcategoryIds: string[];
  bareCategoryIds: string[];
  tagIds: string[];
  hours: HourInput[];
  images?: { url: string; alt: string }[];
  deleteImageIds?: string[];
}

function writeClient() {
  if (!isSupabaseConfigured()) return null;
  if (!hasServiceRole()) throw new Error("missing-service-role");
  return createSupabaseAdmin();
}

function publicClient() {
  if (!isSupabaseConfigured()) return null;
  return hasServiceRole() ? createSupabaseAdmin() : createSupabaseAnon();
}

function slugTaken(store: CatalogStore, slug: string, ignoreId?: string) {
  return store.businesses.some((business) => business.slug === slug && business.id !== ignoreId);
}

export async function slugAvailable(slug: string, ignoreId?: string) {
  if (!isSupabaseConfigured()) return !slugTaken(readDemoStore(), slug, ignoreId);
  const client = hasServiceRole() ? createSupabaseAdmin() : createSupabaseAnon();
  const { data, error } = await client.from("businesses").select("id").eq("slug", slug).maybeSingle();
  if (error) {
    console.error(error);
    throw new Error("save-failed");
  }
  return !data || data.id === ignoreId;
}

export async function recommendBusiness(businessId: string, residentKey: string) {
  if (!isSupabaseConfigured()) {
    let already = false;
    updateDemoStore((store) => {
      already = store.recommendations.some((item) => item.businessId === businessId && item.residentKey === residentKey);
      if (already) return;
      if (!store.businesses.some((business) => business.id === businessId && business.active)) {
        throw new Error("missing-business");
      }
      store.recommendations.push({
        id: crypto.randomUUID(),
        businessId,
        residentKey,
        createdAt: new Date().toISOString(),
      });
    });
    const count = readDemoStore().recommendations.filter((item) => item.businessId === businessId).length;
    return { already, count };
  }
  const client = publicClient();
  if (!client) throw new Error("save-failed");
  const { error } = await client.from("recommendations").insert({ business_id: businessId, resident_key: residentKey });
  if (error && error.code !== "23505") {
    console.error(error);
    throw new Error("save-failed");
  }
  const { data } = await client.from("businesses").select("recommendation_count").eq("id", businessId).maybeSingle();
  return { already: error?.code === "23505", count: Number(data?.recommendation_count ?? 0) };
}

export async function createSubmission(input: Omit<BusinessSubmission, "id" | "status" | "reviewerNote" | "createdBusinessId" | "createdAt">) {
  const record: BusinessSubmission = {
    ...input,
    id: crypto.randomUUID(),
    status: "pending",
    reviewerNote: null,
    createdBusinessId: null,
    createdAt: new Date().toISOString(),
  };
  if (!isSupabaseConfigured()) {
    updateDemoStore((store) => {
      store.submissions.unshift(record);
    });
    return record;
  }
  const client = publicClient();
  if (!client) throw new Error("save-failed");
  const { error } = await client.from("business_submissions").insert({
    id: record.id,
    business_name: record.businessName,
    category_id: record.categoryId,
    subcategory_id: record.subcategoryId,
    description: record.description,
    phone: record.phone,
    whatsapp: record.whatsapp,
    contact_person: record.contactPerson,
    image_url: record.imageUrl,
    status: "pending",
  });
  if (error) {
    console.error(error);
    throw new Error("save-failed");
  }
  return record;
}

export async function createReport(input: {
  businessId: string;
  reason: ReportReason;
  details: string | null;
  contact: string | null;
}) {
  if (!isSupabaseConfigured()) {
    updateDemoStore((store) => {
      if (!store.businesses.some((business) => business.id === input.businessId)) throw new Error("missing-business");
      store.reports.unshift({
        id: crypto.randomUUID(),
        businessId: input.businessId,
        reason: input.reason,
        details: input.details,
        contact: input.contact,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    });
    return;
  }
  const client = publicClient();
  if (!client) throw new Error("save-failed");
  const { error } = await client.from("business_reports").insert({
    business_id: input.businessId,
    reason: input.reason,
    details: input.details,
    contact: input.contact,
    status: "pending",
  });
  if (error) {
    console.error(error);
    throw new Error("save-failed");
  }
}

export async function createClaim(input: {
  businessId: string;
  claimantName: string;
  phone: string;
  email: string;
  message: string;
  claimantUserId: string | null;
}) {
  if (!isSupabaseConfigured()) {
    updateDemoStore((store) => {
      if (!store.businesses.some((business) => business.id === input.businessId)) throw new Error("missing-business");
      store.claims.unshift({
        id: crypto.randomUUID(),
        ...input,
        status: "pending",
        reviewerNote: null,
        createdAt: new Date().toISOString(),
      });
    });
    return;
  }
  const client = publicClient();
  if (!client) throw new Error("save-failed");
  const { error } = await client.from("business_claims").insert({
    business_id: input.businessId,
    claimant_name: input.claimantName,
    phone: input.phone,
    email: input.email,
    message: input.message,
    claimant_user_id: input.claimantUserId,
    status: "pending",
  });
  if (error) {
    console.error(error);
    throw new Error("save-failed");
  }
}

function linksFromDraft(store: CatalogStore, draft: BusinessDraft, businessId: string) {
  const links: { businessId: string; categoryId: string; subcategoryId: string | null }[] = draft.subcategoryIds.map((subcategoryId) => {
    const subcategory = store.subcategories.find((item) => item.id === subcategoryId);
    if (!subcategory) throw new Error("bad-category");
    return { businessId, categoryId: subcategory.categoryId, subcategoryId };
  });
  draft.bareCategoryIds.forEach((categoryId) => {
    if (!store.categories.some((category) => category.id === categoryId)) throw new Error("bad-category");
    if (!links.some((link) => link.categoryId === categoryId)) {
      links.push({ businessId, categoryId, subcategoryId: null });
    }
  });
  if (links.length === 0) throw new Error("bad-category");
  return links;
}

export async function saveBusiness(draft: BusinessDraft) {
  if (!isSupabaseConfigured()) {
    const savedId = draft.id ?? crypto.randomUUID();
    updateDemoStore((store) => {
      if (slugTaken(store, draft.slug, draft.id)) throw new Error("slug-taken");
      const links = linksFromDraft(store, draft, savedId);
      const now = new Date().toISOString();
      const existing = store.businesses.find((business) => business.id === draft.id);
      const record = {
        id: savedId,
        localityId: draft.localityId,
        name: draft.name,
        slug: draft.slug,
        shortDescription: draft.shortDescription,
        description: draft.description,
        phone: draft.phone,
        whatsapp: draft.whatsapp,
        email: draft.email,
        website: draft.website,
        instagram: draft.instagram,
        facebook: draft.facebook,
        address: draft.showExactAddress ? draft.address : draft.address,
        latitude: draft.showExactAddress ? draft.latitude : null,
        longitude: draft.showExactAddress ? draft.longitude : null,
        showExactAddress: draft.showExactAddress,
        logoUrl: draft.logoUrl === undefined ? (existing?.logoUrl ?? null) : draft.logoUrl,
        coverImageUrl: draft.coverImageUrl === undefined ? (existing?.coverImageUrl ?? null) : draft.coverImageUrl,
        isHomeBusiness: draft.isHomeBusiness,
        providesDelivery: draft.providesDelivery,
        providesHomeService: draft.providesHomeService,
        accessibility: draft.accessibility,
        kosher: draft.kosher,
        verified: draft.verified,
        active: draft.active,
        featured: draft.featured,
        isDemo: draft.isDemo ?? existing?.isDemo ?? false,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };
      if (existing) Object.assign(existing, record);
      else store.businesses.unshift(record);
      store.categoryLinks = store.categoryLinks.filter((link) => link.businessId !== savedId).concat(links);
      store.businessTags = store.businessTags
        .filter((link) => link.businessId !== savedId)
        .concat(draft.tagIds.filter((tagId) => store.tags.some((tag) => tag.id === tagId)).map((tagId) => ({ businessId: savedId, tagId })));
      store.hours = store.hours.filter((hour) => hour.businessId !== savedId).concat(
        draft.hours.map((hour) => ({
          id: crypto.randomUUID(),
          businessId: savedId,
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
        })),
      );
      if (draft.deleteImageIds?.length) {
        store.images = store.images.filter((image) => !draft.deleteImageIds?.includes(image.id));
      }
      draft.images?.forEach((image, index) => {
        store.images.push({
          id: crypto.randomUUID(),
          businessId: savedId,
          imageUrl: image.url,
          altText: image.alt,
          displayOrder: 100 + index,
        });
      });
    });
    return savedId;
  }

  const client = writeClient();
  if (!client) throw new Error("save-failed");
  if (!(await slugAvailable(draft.slug, draft.id))) throw new Error("slug-taken");
  const id = draft.id ?? crypto.randomUUID();
  const now = new Date().toISOString();
  const payload = {
    id,
    locality_id: draft.localityId,
    name: draft.name,
    slug: draft.slug,
    short_description: draft.shortDescription,
    description: draft.description,
    phone: draft.phone,
    whatsapp: draft.whatsapp,
    email: draft.email,
    website: draft.website,
    instagram: draft.instagram,
    facebook: draft.facebook,
    address: draft.address,
    latitude: draft.showExactAddress ? draft.latitude : null,
    longitude: draft.showExactAddress ? draft.longitude : null,
    show_exact_address: draft.showExactAddress,
    is_home_business: draft.isHomeBusiness,
    provides_delivery: draft.providesDelivery,
    provides_home_service: draft.providesHomeService,
    accessibility: draft.accessibility,
    kosher: draft.kosher,
    verified: draft.verified,
    active: draft.active,
    featured: draft.featured,
    is_demo: draft.isDemo ?? false,
    updated_at: now,
    ...(draft.logoUrl !== undefined ? { logo_url: draft.logoUrl } : {}),
    ...(draft.coverImageUrl !== undefined ? { cover_image_url: draft.coverImageUrl } : {}),
  };
  const { error } = await client.from("businesses").upsert(payload);
  if (error) {
    console.error(error);
    throw new Error("save-failed");
  }
  const { data: subs, error: subError } = await client.from("subcategories").select("id, category_id").in("id", draft.subcategoryIds.length ? draft.subcategoryIds : ["00000000-0000-0000-0000-000000000000"]);
  if (subError) throw new Error("save-failed");
  const links = (subs ?? []).map((sub) => ({
    business_id: id,
    category_id: sub.category_id,
    subcategory_id: sub.id,
  }));
  draft.bareCategoryIds.forEach((categoryId) => {
    if (!links.some((link) => link.category_id === categoryId)) {
      links.push({ business_id: id, category_id: categoryId, subcategory_id: null });
    }
  });
  if (links.length === 0) throw new Error("bad-category");
  await client.from("business_categories").delete().eq("business_id", id);
  await client.from("business_tags").delete().eq("business_id", id);
  await client.from("business_hours").delete().eq("business_id", id);
  const { error: linkError } = await client.from("business_categories").insert(links);
  if (linkError) throw new Error("save-failed");
  if (draft.tagIds.length) {
    const { error: tagError } = await client.from("business_tags").insert(draft.tagIds.map((tagId) => ({ business_id: id, tag_id: tagId })));
    if (tagError) throw new Error("save-failed");
  }
  if (draft.hours.length) {
    const { error: hourError } = await client.from("business_hours").insert(
      draft.hours.map((hour) => ({
        business_id: id,
        day_of_week: hour.dayOfWeek,
        open_time: hour.openTime,
        close_time: hour.closeTime,
      })),
    );
    if (hourError) throw new Error("save-failed");
  }
  if (draft.deleteImageIds?.length) {
    await client.from("business_images").delete().in("id", draft.deleteImageIds);
  }
  if (draft.images?.length) {
    await client.from("business_images").insert(
      draft.images.map((image, index) => ({
        business_id: id,
        image_url: image.url,
        alt_text: image.alt,
        display_order: 100 + index,
      })),
    );
  }
  return id;
}

export async function setBusinessFlags(id: string, flags: Partial<Pick<BusinessDraft, "active" | "verified" | "featured">>) {
  if (!isSupabaseConfigured()) {
    updateDemoStore((store) => {
      const business = store.businesses.find((item) => item.id === id);
      if (!business) throw new Error("missing-business");
      Object.assign(business, flags, { updatedAt: new Date().toISOString() });
    });
    return;
  }
  const client = writeClient();
  if (!client) throw new Error("save-failed");
  const { error } = await client
    .from("businesses")
    .update({ ...flags, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error("save-failed");
}

export async function markSubmission(id: string, status: SubmissionStatus, createdBusinessId?: string, note?: string) {
  if (!isSupabaseConfigured()) {
    updateDemoStore((store) => {
      const item = store.submissions.find((submission) => submission.id === id);
      if (!item) throw new Error("missing-business");
      item.status = status;
      item.reviewerNote = note ?? item.reviewerNote;
      if (createdBusinessId) item.createdBusinessId = createdBusinessId;
    });
    return;
  }
  const client = writeClient();
  if (!client) throw new Error("save-failed");
  const { error } = await client
    .from("business_submissions")
    .update({ status, reviewer_note: note ?? null, created_business_id: createdBusinessId ?? null })
    .eq("id", id);
  if (error) throw new Error("save-failed");
}

async function findUserIdByEmail(email: string) {
  if (!hasServiceRole()) return null;
  const admin = createSupabaseAdmin();
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) return null;
  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())?.id ?? null;
}

export async function markClaim(id: string, status: SubmissionStatus, note?: string) {
  if (!isSupabaseConfigured()) {
    updateDemoStore((store) => {
      const claim = store.claims.find((item) => item.id === id);
      if (!claim) throw new Error("missing-business");
      claim.status = status;
      claim.reviewerNote = note ?? null;
      if (status === "approved" && claim.claimantUserId && !store.owners.some((owner) => owner.businessId === claim.businessId && owner.userId === claim.claimantUserId)) {
        store.owners.push({
          id: crypto.randomUUID(),
          businessId: claim.businessId,
          userId: claim.claimantUserId,
          role: "owner",
          createdAt: new Date().toISOString(),
        });
      }
    });
    return { linked: false };
  }
  const client = writeClient();
  if (!client) throw new Error("save-failed");
  const { data: claim, error: readError } = await client.from("business_claims").select("*").eq("id", id).maybeSingle();
  if (readError || !claim) throw new Error("missing-business");
  let userId = claim.claimant_user_id as string | null;
  if (status === "approved" && !userId && claim.email) {
    userId = await findUserIdByEmail(String(claim.email));
  }
  const { error } = await client
    .from("business_claims")
    .update({ status, reviewer_note: note ?? null, claimant_user_id: userId })
    .eq("id", id);
  if (error) throw new Error("save-failed");
  let linked = false;
  if (status === "approved" && userId) {
    const { error: ownerError } = await client.from("business_owners").upsert({
      business_id: claim.business_id,
      user_id: userId,
      role: "owner",
    });
    linked = !ownerError;
  }
  return { linked };
}

export async function markReport(id: string, status: ReportStatus) {
  if (!isSupabaseConfigured()) {
    updateDemoStore((store) => {
      const report = store.reports.find((item) => item.id === id);
      if (!report) throw new Error("missing-business");
      report.status = status;
    });
    return;
  }
  const client = writeClient();
  if (!client) throw new Error("save-failed");
  const { error } = await client.from("business_reports").update({ status }).eq("id", id);
  if (error) throw new Error("save-failed");
}

export async function saveCategory(input: { id?: string; name: string; slug: string; icon: string; isActive: boolean }) {
  if (!isSupabaseConfigured()) {
    const id = input.id ?? crypto.randomUUID();
    updateDemoStore((store) => {
      if (store.categories.some((category) => category.slug === input.slug && category.id !== input.id)) throw new Error("slug-taken");
      const existing = store.categories.find((category) => category.id === input.id);
      if (existing) Object.assign(existing, input);
      else {
        store.categories.push({
          id,
          name: input.name,
          slug: input.slug,
          icon: input.icon,
          displayOrder: store.categories.length + 1,
          isActive: input.isActive,
          createdAt: new Date().toISOString(),
        });
      }
    });
    return id;
  }
  const client = writeClient();
  if (!client) throw new Error("save-failed");
  if (input.id) {
    const { error } = await client.from("categories").update({ name: input.name, slug: input.slug, icon: input.icon, is_active: input.isActive }).eq("id", input.id);
    if (error) throw new Error(error.code === "23505" ? "slug-taken" : "save-failed");
    return input.id;
  }
  const { count } = await client.from("categories").select("*", { count: "exact", head: true });
  const { data, error } = await client
    .from("categories")
    .insert({ name: input.name, slug: input.slug, icon: input.icon, is_active: input.isActive, display_order: (count ?? 0) + 1 })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.code === "23505" ? "slug-taken" : "save-failed");
  return data.id as string;
}

export async function moveCategory(id: string, direction: -1 | 1) {
  if (!isSupabaseConfigured()) {
    updateDemoStore((store) => {
      const ordered = store.categories.slice().sort((a, b) => a.displayOrder - b.displayOrder);
      const index = ordered.findIndex((category) => category.id === id);
      const swap = ordered[index + direction];
      if (index < 0 || !swap) return;
      const current = ordered[index];
      const currentOrder = current.displayOrder;
      current.displayOrder = swap.displayOrder;
      swap.displayOrder = currentOrder;
    });
    return;
  }
  const client = writeClient();
  if (!client) throw new Error("save-failed");
  const { data, error } = await client.from("categories").select("id, display_order").order("display_order");
  if (error || !data) throw new Error("save-failed");
  const index = data.findIndex((category) => category.id === id);
  const other = data[index + direction];
  if (index < 0 || !other) return;
  await client.from("categories").update({ display_order: other.display_order }).eq("id", id);
  await client.from("categories").update({ display_order: data[index].display_order }).eq("id", other.id);
}

export async function saveSubcategory(input: { id?: string; categoryId: string; name: string; slug: string; isActive: boolean }) {
  if (!isSupabaseConfigured()) {
    const id = input.id ?? crypto.randomUUID();
    updateDemoStore((store) => {
      if (store.subcategories.some((item) => item.slug === input.slug && item.id !== input.id)) throw new Error("slug-taken");
      const existing = store.subcategories.find((item) => item.id === input.id);
      if (existing) Object.assign(existing, input);
      else {
        const siblings = store.subcategories.filter((item) => item.categoryId === input.categoryId);
        store.subcategories.push({
          id,
          categoryId: input.categoryId,
          name: input.name,
          slug: input.slug,
          displayOrder: siblings.length + 1,
          isActive: input.isActive,
        });
      }
    });
    return id;
  }
  const client = writeClient();
  if (!client) throw new Error("save-failed");
  if (input.id) {
    const { error } = await client
      .from("subcategories")
      .update({ category_id: input.categoryId, name: input.name, slug: input.slug, is_active: input.isActive })
      .eq("id", input.id);
    if (error) throw new Error(error.code === "23505" ? "slug-taken" : "save-failed");
    return input.id;
  }
  const { count } = await client.from("subcategories").select("*", { count: "exact", head: true }).eq("category_id", input.categoryId);
  const { data, error } = await client
    .from("subcategories")
    .insert({ category_id: input.categoryId, name: input.name, slug: input.slug, is_active: input.isActive, display_order: (count ?? 0) + 1 })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.code === "23505" ? "slug-taken" : "save-failed");
  return data.id as string;
}

export async function moveSubcategory(id: string, direction: -1 | 1) {
  if (!isSupabaseConfigured()) {
    updateDemoStore((store) => {
      const current = store.subcategories.find((item) => item.id === id);
      if (!current) return;
      const siblings = store.subcategories.filter((item) => item.categoryId === current.categoryId).sort((a, b) => a.displayOrder - b.displayOrder);
      const index = siblings.findIndex((item) => item.id === id);
      const swap = siblings[index + direction];
      if (!swap) return;
      const order = current.displayOrder;
      current.displayOrder = swap.displayOrder;
      swap.displayOrder = order;
    });
    return;
  }
  const client = writeClient();
  if (!client) throw new Error("save-failed");
  const { data: current } = await client.from("subcategories").select("id, category_id, display_order").eq("id", id).maybeSingle();
  if (!current) return;
  const { data: siblings } = await client.from("subcategories").select("id, display_order").eq("category_id", current.category_id).order("display_order");
  const index = (siblings ?? []).findIndex((item) => item.id === id);
  const other = siblings?.[index + direction];
  if (index < 0 || !other) return;
  await client.from("subcategories").update({ display_order: other.display_order }).eq("id", id);
  await client.from("subcategories").update({ display_order: current.display_order }).eq("id", other.id);
}

export async function saveTag(input: { id?: string; name: string; slug: string }) {
  if (!isSupabaseConfigured()) {
    const id = input.id ?? crypto.randomUUID();
    updateDemoStore((store) => {
      if (store.tags.some((tag) => tag.slug === input.slug && tag.id !== input.id)) throw new Error("slug-taken");
      const existing = store.tags.find((tag) => tag.id === input.id);
      if (existing) Object.assign(existing, input);
      else store.tags.push({ id, name: input.name, slug: input.slug });
    });
    return id;
  }
  const client = writeClient();
  if (!client) throw new Error("save-failed");
  if (input.id) {
    const { error } = await client.from("tags").update({ name: input.name, slug: input.slug }).eq("id", input.id);
    if (error) throw new Error(error.code === "23505" ? "slug-taken" : "save-failed");
    return input.id;
  }
  const { data, error } = await client.from("tags").insert({ name: input.name, slug: input.slug }).select("id").single();
  if (error || !data) throw new Error(error?.code === "23505" ? "slug-taken" : "save-failed");
  return data.id as string;
}

export async function deleteTag(id: string) {
  if (!isSupabaseConfigured()) {
    updateDemoStore((store) => {
      store.tags = store.tags.filter((tag) => tag.id !== id);
      store.businessTags = store.businessTags.filter((link) => link.tagId !== id);
    });
    return;
  }
  const client = writeClient();
  if (!client) throw new Error("save-failed");
  const { error } = await client.from("tags").delete().eq("id", id);
  if (error) throw new Error("save-failed");
}

export async function currentUserId() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function listOwnedBusinesses(userId: string) {
  if (!isSupabaseConfigured()) return [];
  const client = hasServiceRole() ? createSupabaseAdmin() : await createSupabaseServer();
  const { data: owners, error } = await client.from("business_owners").select("business_id").eq("user_id", userId);
  if (error || !owners?.length) return [];
  const ids = owners.map((owner) => owner.business_id as string);
  const { data, error: businessError } = await client.from("businesses").select("*").in("id", ids);
  if (businessError) return [];
  return data ?? [];
}

export async function updateOwnedBusiness(userId: string, businessId: string, input: {
  shortDescription: string;
  description: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  showExactAddress: boolean;
  hours: HourInput[];
}) {
  if (!isSupabaseConfigured()) throw new Error("demo-owner");
  if (hasServiceRole()) {
    const admin = createSupabaseAdmin();
    const { data: owner } = await admin.from("business_owners").select("id").eq("user_id", userId).eq("business_id", businessId).maybeSingle();
    if (!owner) throw new Error("forbidden");
    const { error } = await admin
      .from("businesses")
      .update({
        short_description: input.shortDescription,
        description: input.description,
        phone: input.phone,
        whatsapp: input.whatsapp,
        address: input.address,
        show_exact_address: input.showExactAddress,
        latitude: input.showExactAddress ? undefined : null,
        longitude: input.showExactAddress ? undefined : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", businessId);
    if (error) throw new Error("save-failed");
    await admin.from("business_hours").delete().eq("business_id", businessId);
    if (input.hours.length) {
      await admin.from("business_hours").insert(
        input.hours.map((hour) => ({
          business_id: businessId,
          day_of_week: hour.dayOfWeek,
          open_time: hour.openTime,
          close_time: hour.closeTime,
        })),
      );
    }
    return;
  }
  const supabase = await createSupabaseServer();
  const { error } = await supabase.rpc("update_owned_business", {
    target_id: businessId,
    new_short: input.shortDescription,
    new_description: input.description,
    new_phone: input.phone ?? "",
    new_whatsapp: input.whatsapp ?? "",
    new_address: input.address ?? "",
    new_show_address: input.showExactAddress,
  });
  if (error) throw new Error("save-failed");
  const { error: hoursError } = await supabase.rpc("replace_owned_hours", {
    target_id: businessId,
    new_hours: input.hours.map((hour) => ({
      day_of_week: hour.dayOfWeek,
      open_time: hour.openTime,
      close_time: hour.closeTime,
    })),
  });
  if (hoursError) throw new Error("save-failed");
}

export function demoBusinessById(id: string) {
  return assembleBusinesses(readDemoStore()).find((business) => business.id === id) ?? null;
}
