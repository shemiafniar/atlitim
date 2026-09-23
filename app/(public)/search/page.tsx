import type { Metadata } from "next";
import { BusinessCard } from "@/components/business/business-card";
import { ViewTracker } from "@/components/analytics-client";
import { SearchFilters } from "@/components/search/search-filters";
import { listCategories, listPublicBusinesses, listSubcategories } from "@/lib/repositories";
import { parseFilters, filterBusinesses } from "@/lib/search/filter";
import { businessesCountLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "עסקים בעתלית",
  description: "חיפוש עסקים, שירותים ובעלי מקצוע בעתלית.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const [businesses, categories, subcategories] = await Promise.all([
    listPublicBusinesses(),
    listCategories(false),
    listSubcategories(false),
  ]);
  const results = filterBusinesses(businesses, filters);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      {filters.q ? <ViewTracker name="search" props={{ q: filters.q }} /> : null}
      <h1 className="font-display text-4xl font-bold">{filters.q ? `תוצאות עבור «${filters.q}»` : "עסקים בעתלית"}</h1>
      <p className="mt-2 text-sm text-muted">{businessesCountLabel(results.length)}</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <SearchFilters filters={filters} categories={categories} subcategories={subcategories} action="/search" />
        <div className="grid min-w-0 gap-3">
          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-card px-5 py-10">
              <h2 className="font-display text-2xl font-bold">לא מצאנו עסקים</h2>
              <p className="mt-2 text-sm leading-6 text-muted">נסו מילה אחרת, או הסירו חלק מהסינון.</p>
            </div>
          ) : (
            results.map((business) => <BusinessCard key={business.id} business={business} />)
          )}
        </div>
      </div>
    </div>
  );
}
