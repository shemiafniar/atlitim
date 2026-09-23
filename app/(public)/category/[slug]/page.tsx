import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/business/business-card";
import { CategoryIcon } from "@/components/icons";
import { SearchFilters } from "@/components/search/search-filters";
import { categoryTone } from "@/lib/constants";
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
  const tone = categoryTone(category.slug);
  return (
    <div className="bg-[#f6f7f6]">
      <div className="border-b border-line bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
          <p className="text-sm font-bold text-olive">
            <Link href="/categories">קטגוריות</Link>
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-full" style={{ backgroundColor: tone.bg, color: tone.fg }}>
              <CategoryIcon name={category.icon} className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-4xl font-bold text-olive">{category.name}</h1>
              <p className="mt-1 text-sm text-muted">{businessesCountLabel(results.length)} בעתלית</p>
            </div>
          </div>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            <Link href={`/category/${slug}`} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${filters.subcategory ? "bg-sand text-ink" : "bg-olive text-white"}`}>
              הכול
            </Link>
            {subs.map((item) => (
              <Link
                key={item.id}
                href={`/category/${slug}?subcategory=${item.slug}`}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${filters.subcategory === item.slug ? "bg-olive text-white" : "bg-sand text-ink"}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <SearchFilters
          filters={filters}
          categories={categories}
          subcategories={subcategories}
          action={`/category/${slug}`}
          lockedCategory={slug}
        />
        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-line bg-white px-5 py-10 sm:col-span-2 xl:col-span-3">
              <h2 className="font-display text-2xl font-bold text-olive">אין כאן עסקים כרגע</h2>
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
