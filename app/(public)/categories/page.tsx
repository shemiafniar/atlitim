import type { Metadata } from "next";
import Link from "next/link";
import { CategoryIcon } from "@/components/icons";
import { listCategories, listSubcategories } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "קטגוריות",
  description: "כל הקטגוריות לחיפוש עסקים ושירותים בעתלית.",
};

export default async function CategoriesPage() {
  const [categories, subcategories] = await Promise.all([listCategories(false), listSubcategories(false)]);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-4xl font-bold">קטגוריות</h1>
      <p className="mt-2 max-w-2xl text-base leading-7 text-muted">בחרו תחום כדי לראות מי בעתלית עושה את מה שאתם צריכים.</p>
      <div className="mt-8 grid gap-4">
        {categories.map((category) => (
          <section key={category.id} className="rounded-3xl border border-line bg-card p-5">
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-olive-soft text-olive">
                <CategoryIcon name={category.icon} className="h-5 w-5" />
              </span>
              <Link href={`/category/${category.slug}`} className="hover:text-olive">
                {category.name}
              </Link>
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {subcategories
                .filter((item) => item.categoryId === category.id)
                .map((item) => (
                  <li key={item.id}>
                    <Link href={`/category/${category.slug}?subcategory=${item.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-sand px-3 text-sm font-semibold">
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
