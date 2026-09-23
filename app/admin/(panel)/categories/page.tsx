import { CategoryManager } from "@/components/admin/category-manager";
import { listCategories, listSubcategories } from "@/lib/repositories";

export default async function CategoriesAdminPage() {
  const [categories, subcategories] = await Promise.all([listCategories(true), listSubcategories(true)]);
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">קטגוריות</h1>
      <div className="mt-6">
        <CategoryManager categories={categories} subcategories={subcategories} />
      </div>
    </div>
  );
}
