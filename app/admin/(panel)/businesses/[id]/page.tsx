import { notFound } from "next/navigation";
import { BusinessEditor } from "@/components/admin/business-editor";
import { listAllBusinesses, listCategories, listSubcategories, listTags } from "@/lib/repositories";

export default async function EditBusinessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const [businesses, categories, subcategories, tags] = await Promise.all([
    listAllBusinesses(),
    listCategories(true),
    listSubcategories(true),
    listTags(),
  ]);
  const business = businesses.find((item) => item.id === id);
  if (!business) notFound();
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">{business.name}</h1>
      {query.saved === "1" ? <p className="mt-3 rounded-2xl bg-ok-bg px-4 py-3 text-sm font-semibold text-ok">העסק נשמר.</p> : null}
      <div className="mt-6 rounded-3xl border border-line bg-card p-4 sm:p-6">
        <BusinessEditor business={business} categories={categories} subcategories={subcategories} tags={tags} />
      </div>
    </div>
  );
}
