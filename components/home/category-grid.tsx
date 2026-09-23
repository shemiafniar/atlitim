import Link from "next/link";
import { CategoryIcon } from "@/components/icons";
import type { Category } from "@/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/category/${category.slug}`}
            className="flex min-h-28 flex-col justify-between rounded-3xl border border-line bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:border-olive/30"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-olive-soft text-olive">
              <CategoryIcon name={category.icon} className="h-5 w-5" />
            </span>
            <span className="mt-4 text-sm font-bold leading-5">{category.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
