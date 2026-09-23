import { SlidersHorizontal } from "lucide-react";
import { activeFilterCount } from "@/lib/search/filter";
import { fieldClass } from "@/lib/constants";
import type { Category, SearchFilters, Subcategory } from "@/types";

function Fields({
  filters,
  categories,
  subcategories,
  lockedCategory,
  idPrefix,
}: {
  filters: SearchFilters;
  categories: Category[];
  subcategories: Subcategory[];
  lockedCategory?: string;
  idPrefix: string;
}) {
  const visibleSubs = subcategories.filter((item) => {
    if (!filters.category) return true;
    const category = categories.find((entry) => entry.slug === filters.category);
    return category ? item.categoryId === category.id : true;
  });
  return (
    <div className="grid gap-3">
      <label className="text-sm font-bold" htmlFor={`${idPrefix}-q`}>
        חיפוש
        <input id={`${idPrefix}-q`} name="q" defaultValue={filters.q} className={`${fieldClass} mt-1.5`} placeholder="שם, תחום או שירות" />
      </label>
      {lockedCategory ? null : (
        <label className="text-sm font-bold" htmlFor={`${idPrefix}-category`}>
          קטגוריה
          <select id={`${idPrefix}-category`} name="category" defaultValue={filters.category ?? ""} className={`${fieldClass} mt-1.5`}>
            <option value="">כל הקטגוריות</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="text-sm font-bold" htmlFor={`${idPrefix}-sub`}>
        תת־קטגוריה
        <select id={`${idPrefix}-sub`} name="subcategory" defaultValue={filters.subcategory ?? ""} className={`${fieldClass} mt-1.5`}>
          <option value="">הכול</option>
          {visibleSubs.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-1">
        <Toggle id={`${idPrefix}-open`} name="openNow" label="פתוח עכשיו" checked={filters.openNow} />
        <Toggle id={`${idPrefix}-delivery`} name="delivery" label="משלוחים" checked={filters.delivery} />
        <Toggle id={`${idPrefix}-visit`} name="homeService" label="מגיעים עד הבית" checked={filters.homeService} />
        <Toggle id={`${idPrefix}-home`} name="homeBusiness" label="עסק ביתי" checked={filters.homeBusiness} />
        <Toggle id={`${idPrefix}-access`} name="accessibility" label="נגיש" checked={filters.accessibility} />
        <Toggle id={`${idPrefix}-friday`} name="openFriday" label="פתוח בשישי" checked={filters.openFriday} />
      </div>
    </div>
  );
}

function Toggle({ id, name, label, checked }: { id: string; name: string; label: string; checked: boolean }) {
  return (
    <label htmlFor={id} className="flex min-h-11 items-center gap-2 text-sm font-semibold">
      <input id={id} type="checkbox" name={name} value="1" defaultChecked={checked} className="h-4 w-4 accent-olive" />
      {label}
    </label>
  );
}

export function SearchFilters({
  filters,
  categories,
  subcategories,
  action,
  lockedCategory,
}: {
  filters: SearchFilters;
  categories: Category[];
  subcategories: Subcategory[];
  action: string;
  lockedCategory?: string;
}) {
  const count = activeFilterCount(filters, Boolean(lockedCategory));
  const form = (prefix: string) => (
    <form action={action} method="get" className="grid gap-4">
      <Fields filters={filters} categories={categories} subcategories={subcategories} lockedCategory={lockedCategory} idPrefix={prefix} />
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-olive px-5 text-sm font-bold text-white">
          הצגת תוצאות
        </button>
        <a href={action} className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-4 text-sm font-bold">
          ניקוי
        </a>
      </div>
    </form>
  );
  return (
    <div>
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-[1.5rem] border border-line bg-white p-4 shadow-card">
          <h2 className="mb-3 text-sm font-bold">סינון</h2>
          {form("desk")}
        </div>
      </aside>
      <details className="rounded-[1.5rem] border border-line bg-white p-4 shadow-card lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            סינון
            {count > 0 ? <span className="rounded-full bg-olive px-2 py-0.5 text-xs text-white">{count}</span> : null}
          </span>
          <span className="text-xs font-semibold text-muted">פתיחה</span>
        </summary>
        <div className="mt-4">{form("mob")}</div>
      </details>
    </div>
  );
}
