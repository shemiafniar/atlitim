import type { MetadataRoute } from "next";
import { listCategories, listPublicBusinesses } from "@/lib/repositories";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [categories, businesses] = await Promise.all([listCategories(false), listPublicBusinesses()]);
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/search`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/add-business`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/neighbors`, changeFrequency: "monthly", priority: 0.3 },
    ...categories.map((category) => ({
      url: `${base}/category/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...businesses.map((business) => ({
      url: `${base}/business/${business.slug}`,
      lastModified: business.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
