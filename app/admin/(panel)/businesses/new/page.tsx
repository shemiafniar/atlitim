import { BusinessEditor } from "@/components/admin/business-editor";
import { listCategories, listSubcategories, listTags } from "@/lib/repositories";

export default async function NewBusinessPage() {
  const [categories, subcategories, tags] = await Promise.all([listCategories(true), listSubcategories(true), listTags()]);
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">עסק חדש</h1>
      <div className="mt-6 rounded-3xl border border-line bg-card p-4 sm:p-6">
        <BusinessEditor categories={categories} subcategories={subcategories} tags={tags} />
      </div>
    </div>
  );
}
