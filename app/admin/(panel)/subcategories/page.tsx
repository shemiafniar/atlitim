import { CategoryManager } from "@/components/admin/category-manager";
import { listCategories, listSubcategories } from "@/lib/repositories";

export default async function SubcategoriesAdminPage() {
  const [categories, subcategories] = await Promise.all([listCategories(true), listSubcategories(true)]);
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">תת־קטגוריות</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">תת־קטגוריה היא רשות. עסק יכול להיות משויך לקטגוריה גם בלי אחת. השבתה מסתירה אותה מהטפסים הציבוריים ולא מוחקת שיוכים.</p>
      <div className="mt-6">
        <CategoryManager categories={categories} subcategories={subcategories} />
      </div>
    </div>
  );
}
