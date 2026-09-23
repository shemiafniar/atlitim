import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/business/business-card";
import { SearchFilters } from "@/components/search/search-filters";
import { listCategories, listPublicBusinesses, listSubcategories } from "@/lib/repositories";
import { filterBusinesses, parseFilters } from "@/lib/search/filter";
import { businessesCountLabel } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categories = await listCategories(false);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  return {
    title: category.name,
    description: `עסקים בתחום ${category.name} בעתלית.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const [categories, subcategories, businesses] = await Promise.all([
    listCategories(false),
    listSubcategories(false),
    listPublicBusinesses(),
  ]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const filters = parseFilters(query, slug);
  const results = filterBusinesses(businesses, filters);
  const subs = subcategories.filter((item) => item.categoryId === category.id);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-sm font-bold text-olive">
        <Link href="/categories">קטגוריות</Link>
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold">{category.name}</h1>
      <p className="mt-2 text-sm text-muted">{businessesCountLabel(results.length)} בעתלית</p>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        <Link href={`/category/${slug}`} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${filters.subcategory ? "bg-sand" : "bg-olive text-white"}`}>
          הכול
        </Link>
        {subs.map((item) => (
          <Link
            key={item.id}
            href={`/category/${slug}?subcategory=${item.slug}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${filters.subcategory === item.slug ? "bg-olive text-white" : "bg-sand"}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <SearchFilters
          filters={filters}
          categories={categories}
          subcategories={subcategories}
          action={`/category/${slug}`}
          lockedCategory={slug}
        />
        <div className="grid min-w-0 gap-3">
          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-card px-5 py-10">
              <h2 className="font-display text-2xl font-bold">אין כאן עסקים כרגע</h2>
              <p className="mt-2 text-sm leading-6 text-muted">נסו תת־קטגוריה אחרת, או הסירו סינון.</p>
            </div>
          ) : (
            results.map((business) => <BusinessCard key={business.id} business={business} />)
          )}
        </div>
      </div>
    </div>
  );
}
