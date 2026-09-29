import Link from "next/link";
import { categoryArt } from "@/lib/brand";
import type { Category } from "@/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <ul className="no-scrollbar -mx-4 flex min-w-0 snap-x gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-12 lg:gap-2 lg:overflow-visible lg:px-0">
      {categories.map((category) => (
        <li key={category.id} className="w-[5.4rem] shrink-0 snap-start lg:w-auto">
          <Link href={`/category/${category.slug}`} className="group flex min-h-24 flex-col items-center gap-2 rounded-2xl px-1 py-1 text-center">
            <img
              src={categoryArt(category.slug)}
              alt=""
              className="h-14 w-14 transition duration-200 group-hover:-translate-y-0.5 group-active:scale-95"
            />
            <span className="text-[11px] font-semibold leading-4 text-ink sm:text-xs">{category.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
