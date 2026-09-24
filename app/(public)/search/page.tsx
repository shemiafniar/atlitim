import type { Metadata } from "next";
import { Search } from "lucide-react";
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
    <div className="bg-bg">
      {filters.q ? <ViewTracker name="search" props={{ q: filters.q }} /> : null}
      <div className="border-b border-line bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
          <h1 className="font-display text-4xl font-bold text-olive sm:text-5xl">{filters.q ? `תוצאות עבור «${filters.q}»` : "עסקים בעתלית"}</h1>
          <p className="mt-2 text-sm text-muted">{businessesCountLabel(results.length)}</p>
          <form action="/search" method="get" role="search" className="mt-5 flex w-full max-w-3xl items-center gap-2 rounded-full border border-line bg-white p-1.5 shadow-card">
            <label htmlFor="search-q" className="sr-only">
              מה אתם מחפשים בעתלית?
            </label>
            <Search className="ms-3 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
            <input
              id="search-q"
              name="q"
              defaultValue={filters.q}
              className="min-h-12 min-w-0 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-[#8a9693]"
              placeholder="מה אתם מחפשים בעתלית?"
            />
            <button type="submit" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-olive px-5 text-sm font-bold text-white">
              חיפוש
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <SearchFilters filters={filters} categories={categories} subcategories={subcategories} action="/search" />
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-line bg-white px-5 py-10 sm:col-span-2 xl:col-span-3">
              <img src="/brand/illustrations/fortress.svg" alt="" className="mb-3 h-16 w-16" />
              <h2 className="font-display text-2xl font-bold text-olive">לא מצאנו עסקים</h2>
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
