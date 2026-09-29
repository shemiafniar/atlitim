import { BusinessEditor } from "@/components/admin/business-editor";
import { listCategories, listLocalities, listSubcategories, listTags } from "@/lib/repositories";

export default async function NewBusinessPage() {
  const [categories, subcategories, tags, localities] = await Promise.all([
    listCategories(true),
    listSubcategories(true),
    listTags(),
    listLocalities(true),
  ]);
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">עסק חדש</h1>
      <div className="mt-6 rounded-3xl border border-line bg-card p-4 sm:p-6">
        <BusinessEditor categories={categories} subcategories={subcategories} tags={tags} localities={localities} />
      </div>
    </div>
  );
}
