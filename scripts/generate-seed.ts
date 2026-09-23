import fs from "fs";
import { createSeedStore } from "../data/seed";

const store = createSeedStore();

function q(value: string | null | undefined) {
  if (value == null) return "null";
  return `'${value.replace(/'/g, "''")}'`;
}

function b(value: boolean) {
  return value ? "true" : "false";
}

const lines: string[] = [
  "-- Optional demo catalog. Run after supabase/migrations/0001_init.sql on an empty project.",
  "-- Safe to re-run: existing rows are left in place.",
  "begin;",
];

for (const locality of store.localities) {
  lines.push(
    `insert into public.localities (id, name, slug, is_primary, is_active, created_at) values (${q(locality.id)}, ${q(locality.name)}, ${q(locality.slug)}, ${b(locality.isPrimary)}, ${b(locality.isActive)}, ${q(locality.createdAt)}) on conflict (id) do nothing;`,
  );
}
for (const category of store.categories) {
  lines.push(
    `insert into public.categories (id, name, slug, icon, display_order, is_active, created_at) values (${q(category.id)}, ${q(category.name)}, ${q(category.slug)}, ${q(category.icon)}, ${category.displayOrder}, ${b(category.isActive)}, ${q(category.createdAt)}) on conflict (id) do nothing;`,
  );
}
for (const subcategory of store.subcategories) {
  lines.push(
    `insert into public.subcategories (id, category_id, name, slug, display_order, is_active) values (${q(subcategory.id)}, ${q(subcategory.categoryId)}, ${q(subcategory.name)}, ${q(subcategory.slug)}, ${subcategory.displayOrder}, ${b(subcategory.isActive)}) on conflict (id) do nothing;`,
  );
}
for (const tag of store.tags) {
  lines.push(`insert into public.tags (id, name, slug) values (${q(tag.id)}, ${q(tag.name)}, ${q(tag.slug)}) on conflict (id) do nothing;`);
}
for (const business of store.businesses) {
  lines.push(
    `insert into public.businesses (id, locality_id, name, slug, short_description, description, phone, whatsapp, email, website, instagram, facebook, address, latitude, longitude, show_exact_address, logo_url, cover_image_url, is_home_business, provides_delivery, provides_home_service, accessibility, kosher, verified, active, featured, is_demo, recommendation_count, created_at, updated_at) values (${q(business.id)}, ${q(business.localityId)}, ${q(business.name)}, ${q(business.slug)}, ${q(business.shortDescription)}, ${q(business.description)}, ${q(business.phone)}, ${q(business.whatsapp)}, ${q(business.email)}, ${q(business.website)}, ${q(business.instagram)}, ${q(business.facebook)}, ${q(business.address)}, ${business.latitude ?? "null"}, ${business.longitude ?? "null"}, ${b(business.showExactAddress)}, ${q(business.logoUrl)}, ${q(business.coverImageUrl)}, ${b(business.isHomeBusiness)}, ${b(business.providesDelivery)}, ${b(business.providesHomeService)}, ${b(business.accessibility)}, ${b(business.kosher)}, ${b(business.verified)}, ${b(business.active)}, ${b(business.featured)}, ${b(business.isDemo)}, 0, ${q(business.createdAt)}, ${q(business.updatedAt)}) on conflict (id) do nothing;`,
  );
}
for (const link of store.categoryLinks) {
  lines.push(
    `insert into public.business_categories (business_id, category_id, subcategory_id) select ${q(link.businessId)}, ${q(link.categoryId)}, ${q(link.subcategoryId)} where not exists (select 1 from public.business_categories where business_id = ${q(link.businessId)} and category_id = ${q(link.categoryId)} and subcategory_id is not distinct from ${q(link.subcategoryId)});`,
  );
}
for (const link of store.businessTags) {
  lines.push(
    `insert into public.business_tags (business_id, tag_id) values (${q(link.businessId)}, ${q(link.tagId)}) on conflict do nothing;`,
  );
}
for (const hour of store.hours) {
  lines.push(
    `insert into public.business_hours (id, business_id, day_of_week, open_time, close_time) values (${q(hour.id)}, ${q(hour.businessId)}, ${hour.dayOfWeek}, ${q(hour.openTime)}, ${q(hour.closeTime)}) on conflict (id) do nothing;`,
  );
}
for (const image of store.images) {
  lines.push(
    `insert into public.business_images (id, business_id, image_url, alt_text, display_order) values (${q(image.id)}, ${q(image.businessId)}, ${q(image.imageUrl)}, ${q(image.altText)}, ${image.displayOrder}) on conflict (id) do nothing;`,
  );
}
for (const recommendation of store.recommendations) {
  lines.push(
    `insert into public.recommendations (id, business_id, resident_key, created_at) values (${q(recommendation.id)}, ${q(recommendation.businessId)}, ${q(recommendation.residentKey)}, ${q(recommendation.createdAt)}) on conflict (business_id, resident_key) do nothing;`,
  );
}
for (const submission of store.submissions) {
  lines.push(
    `insert into public.business_submissions (id, business_name, category_id, subcategory_id, description, phone, whatsapp, contact_person, image_url, status, created_at) values (${q(submission.id)}, ${q(submission.businessName)}, ${q(submission.categoryId)}, ${q(submission.subcategoryId)}, ${q(submission.description)}, ${q(submission.phone)}, ${q(submission.whatsapp)}, ${q(submission.contactPerson)}, ${q(submission.imageUrl)}, ${q(submission.status)}, ${q(submission.createdAt)}) on conflict (id) do nothing;`,
  );
}
for (const claim of store.claims) {
  lines.push(
    `insert into public.business_claims (id, business_id, claimant_name, phone, email, message, status, created_at) values (${q(claim.id)}, ${q(claim.businessId)}, ${q(claim.claimantName)}, ${q(claim.phone)}, ${q(claim.email)}, ${q(claim.message)}, ${q(claim.status)}, ${q(claim.createdAt)}) on conflict (id) do nothing;`,
  );
}
for (const report of store.reports) {
  lines.push(
    `insert into public.business_reports (id, business_id, reason, details, contact, status, created_at) values (${q(report.id)}, ${q(report.businessId)}, ${q(report.reason)}, ${q(report.details)}, ${q(report.contact)}, ${q(report.status)}, ${q(report.createdAt)}) on conflict (id) do nothing;`,
  );
}
lines.push(`update public.businesses b set recommendation_count = (select count(*) from public.recommendations r where r.business_id = b.id);`);
lines.push("commit;");

fs.mkdirSync("supabase", { recursive: true });
fs.writeFileSync("supabase/seed.sql", `${lines.join("\n")}\n`);
console.log(`Wrote supabase/seed.sql (${store.businesses.length} businesses)`);
