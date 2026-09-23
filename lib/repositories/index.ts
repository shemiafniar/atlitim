import { cache } from "react";
import { assembleBusinesses, readDemoStore } from "@/lib/repositories/demo";
import { businessSelect, fetchBusinessRows, mapBusinessRow, mapCategory, mapLocality, mapSubcategory, mapTag, readClient } from "@/lib/repositories/supabase-data";
import { createSupabaseAdmin, createSupabaseServer, hasServiceRole, isSupabaseConfigured } from "@/lib/supabase";
import type { BusinessClaim, BusinessReport, BusinessSubmission, BusinessView, Category, Locality, Subcategory, Tag } from "@/types";

async function loadBusinesses(includeInactive: boolean): Promise<BusinessView[]> {
  if (!isSupabaseConfigured()) {
    const views = assembleBusinesses(readDemoStore());
    return includeInactive ? views : views.filter((business) => business.active);
  }
  const rows = await fetchBusinessRows(includeInactive);
  return rows.map((row) => mapBusinessRow(row));
}

export const listPublicBusinesses = cache(() => loadBusinesses(false));
export const listAllBusinesses = cache(() => loadBusinesses(true));

export const listCategories = cache(async (includeInactive = false): Promise<Category[]> => {
  if (!isSupabaseConfigured()) {
    return readDemoStore()
      .categories.filter((category) => includeInactive || category.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  let query = readClient().from("categories").select("*").order("display_order");
  if (!includeInactive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) {
    console.error(error);
    throw new Error("catalog-unavailable");
  }
  return (data ?? []).map((row) => mapCategory(row as unknown as Record<string, unknown>));
});

export const listSubcategories = cache(async (includeInactive = false): Promise<Subcategory[]> => {
  if (!isSupabaseConfigured()) {
    return readDemoStore()
      .subcategories.filter((item) => includeInactive || item.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }
  let query = readClient().from("subcategories").select("*").order("display_order");
  if (!includeInactive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) {
    console.error(error);
    throw new Error("catalog-unavailable");
  }
  return (data ?? []).map((row) => mapSubcategory(row as unknown as Record<string, unknown>));
});

export const listTags = cache(async (): Promise<Tag[]> => {
  if (!isSupabaseConfigured()) {
    return readDemoStore().tags.slice().sort((a, b) => a.name.localeCompare(b.name, "he"));
  }
  const { data, error } = await readClient().from("tags").select("*").order("name");
  if (error) {
    console.error(error);
    throw new Error("catalog-unavailable");
  }
  return (data ?? []).map((row) => mapTag(row as unknown as Record<string, unknown>));
});

export const getPrimaryLocality = cache(async (): Promise<Locality> => {
  if (!isSupabaseConfigured()) {
    const locality = readDemoStore().localities.find((item) => item.isPrimary);
    if (!locality) throw new Error("catalog-unavailable");
    return locality;
  }
  const { data, error } = await readClient().from("localities").select("*").eq("is_primary", true).limit(1).maybeSingle();
  if (error || !data) {
    console.error(error);
    throw new Error("catalog-unavailable");
  }
  return mapLocality(data as unknown as Record<string, unknown>);
});

export async function listOwnedViews(userId: string): Promise<BusinessView[]> {
  if (!isSupabaseConfigured()) return [];
  const client = hasServiceRole() ? createSupabaseAdmin() : await createSupabaseServer();
  const { data: owners, error } = await client.from("business_owners").select("business_id").eq("user_id", userId);
  if (error || !owners?.length) return [];
  const ids = owners.map((owner) => String(owner.business_id));
  const { data, error: businessError } = await client.from("businesses").select(businessSelect).in("id", ids);
  if (businessError || !data) return [];
  return (data as unknown as Record<string, unknown>[]).map((row) => mapBusinessRow(row));
}

export async function getBusinessBySlug(slug: string) {
  const businesses = await listAllBusinesses();
  return businesses.find((business) => business.slug === slug) ?? null;
}

export async function getHomeData() {
  const [businesses, categories] = await Promise.all([listPublicBusinesses(), listCategories(false)]);
  return {
    categories,
    openNow: businesses.filter((business) => business.openNow).slice(0, 8),
    featured: businesses.filter((business) => business.featured).slice(0, 8),
    recent: businesses.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8),
  };
}

function mapSubmission(row: Record<string, unknown>): BusinessSubmission {
  return {
    id: String(row.id),
    businessName: String(row.business_name ?? ""),
    categoryId: String(row.category_id ?? ""),
    subcategoryId: row.subcategory_id ? String(row.subcategory_id) : null,
    description: String(row.description ?? ""),
    phone: String(row.phone ?? ""),
    whatsapp: row.whatsapp ? String(row.whatsapp) : null,
    contactPerson: String(row.contact_person ?? ""),
    imageUrl: row.image_url ? String(row.image_url) : null,
    status: row.status as BusinessSubmission["status"],
    reviewerNote: row.reviewer_note ? String(row.reviewer_note) : null,
    createdBusinessId: row.created_business_id ? String(row.created_business_id) : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

function mapClaim(row: Record<string, unknown>): BusinessClaim {
  return {
    id: String(row.id),
    businessId: String(row.business_id),
    claimantName: String(row.claimant_name ?? ""),
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    message: String(row.message ?? ""),
    claimantUserId: row.claimant_user_id ? String(row.claimant_user_id) : null,
    status: row.status as BusinessClaim["status"],
    reviewerNote: row.reviewer_note ? String(row.reviewer_note) : null,
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

function mapReport(row: Record<string, unknown>): BusinessReport {
  return {
    id: String(row.id),
    businessId: String(row.business_id),
    reason: row.reason as BusinessReport["reason"],
    details: row.details ? String(row.details) : null,
    contact: row.contact ? String(row.contact) : null,
    status: row.status as BusinessReport["status"],
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

export async function listSubmissions() {
  if (!isSupabaseConfigured()) return readDemoStore().submissions.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const { data, error } = await readClient().from("business_submissions").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    throw new Error("catalog-unavailable");
  }
  return (data ?? []).map((row) => mapSubmission(row as unknown as Record<string, unknown>));
}

export async function listClaims() {
  if (!isSupabaseConfigured()) return readDemoStore().claims.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const { data, error } = await readClient().from("business_claims").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    throw new Error("catalog-unavailable");
  }
  return (data ?? []).map((row) => mapClaim(row as unknown as Record<string, unknown>));
}

export async function listReports() {
  if (!isSupabaseConfigured()) return readDemoStore().reports.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const { data, error } = await readClient().from("business_reports").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    throw new Error("catalog-unavailable");
  }
  return (data ?? []).map((row) => mapReport(row as unknown as Record<string, unknown>));
}

export async function getDashboardCounts() {
  const [businesses, submissions, claims, reports, categories] = await Promise.all([
    listAllBusinesses(),
    listSubmissions(),
    listClaims(),
    listReports(),
    listCategories(true),
  ]);
  return {
    activeBusinesses: businesses.filter((business) => business.active).length,
    pendingSubmissions: submissions.filter((item) => item.status === "pending").length,
    pendingClaims: claims.filter((item) => item.status === "pending").length,
    pendingReports: reports.filter((item) => item.status === "pending").length,
    categories: categories.filter((category) => category.isActive).length,
  };
}
