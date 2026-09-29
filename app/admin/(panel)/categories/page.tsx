import { CategoryManager } from "@/components/admin/category-manager";
import { listCategories, listSubcategories } from "@/lib/repositories";

export default async function CategoriesAdminPage() {
  const [categories, subcategories] = await Promise.all([listCategories(true), listSubcategories(true)]);
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">קטגוריות</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">השבתת קטגוריה מסתירה אותה מהאתר. היא לא מוחקת עסקים שכבר משויכים אליה. אין כאן מחיקה, כדי לא לשבור שיוכים קיימים.</p>
      <div className="mt-6">
        <CategoryManager categories={categories} subcategories={subcategories} />
      </div>
    </div>
  );
}
