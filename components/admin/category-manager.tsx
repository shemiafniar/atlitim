"use client";

import { useActionState } from "react";
import { categoryAction, reorderAction, subcategoryAction } from "@/lib/actions/admin";
import { CATEGORY_ICONS, fieldClass } from "@/lib/constants";
import type { ActionState, Category, Subcategory } from "@/types";

export function CategoryManager({ categories, subcategories }: { categories: Category[]; subcategories: Subcategory[] }) {
  const ordered = categories.slice().sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <div className="grid gap-4">
      <CategoryForm />
      {ordered.map((category, index) => (
        <section key={category.id} className="rounded-3xl border border-line bg-card p-4">
          <CategoryForm category={category} />
          <div className="mt-3 flex gap-2">
            <Move kind="category" id={category.id} direction="up" disabled={index === 0} />
            <Move kind="category" id={category.id} direction="down" disabled={index === ordered.length - 1} />
          </div>
          <div className="mt-4 grid gap-3">
            {subcategories
              .filter((item) => item.categoryId === category.id)
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((item, subIndex, list) => (
                <div key={item.id} className="rounded-2xl bg-sand/70 p-3">
                  <SubcategoryForm item={item} categories={ordered} />
                  <div className="mt-2 flex gap-2">
                    <Move kind="subcategory" id={item.id} direction="up" disabled={subIndex === 0} />
                    <Move kind="subcategory" id={item.id} direction="down" disabled={subIndex === list.length - 1} />
                  </div>
                </div>
              ))}
            <SubcategoryForm categories={ordered} categoryId={category.id} />
          </div>
        </section>
      ))}
    </div>
  );
}

function CategoryForm({ category }: { category?: Category }) {
  const [state, action] = useActionState(categoryAction, {} as ActionState);
  return (
    <form action={action} className="grid gap-2 sm:grid-cols-[1fr_10rem_10rem_auto] sm:items-end">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <label className="text-sm font-bold">
        {category ? "שם" : "קטגוריה חדשה"}
        <input name="name" required defaultValue={category?.name ?? ""} className={`${fieldClass} mt-1.5`} />
      </label>
      <label className="text-sm font-bold">
        כתובת
        <input name="slug" defaultValue={category?.slug ?? ""} className={`${fieldClass} mt-1.5`} />
      </label>
      <label className="text-sm font-bold">
        אייקון
        <select name="icon" defaultValue={category?.icon ?? "Store"} className={`${fieldClass} mt-1.5`}>
          {CATEGORY_ICONS.map((icon) => (
            <option key={icon}>{icon}</option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-3">
        <label className="flex min-h-12 items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="isActive" defaultChecked={category ? category.isActive : true} />
          פעילה
        </label>
        <button className="min-h-12 rounded-full bg-olive px-4 text-sm font-bold text-white" type="submit">
          שמירה
        </button>
      </div>
      {state.error ? <p className="text-sm font-semibold text-danger sm:col-span-4">{state.error}</p> : null}
      {state.success ? <p className="text-sm font-semibold text-ok sm:col-span-4">{state.message}</p> : null}
    </form>
  );
}

function SubcategoryForm({ item, categories, categoryId }: { item?: Subcategory; categories: Category[]; categoryId?: string }) {
  const [state, action] = useActionState(subcategoryAction, {} as ActionState);
  return (
    <form action={action} className="grid gap-2">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="text-xs font-bold">
          {item ? "תת־קטגוריה" : "תת־קטגוריה חדשה"}
          <input name="name" required defaultValue={item?.name ?? ""} className={`${fieldClass} mt-1`} />
        </label>
        <label className="text-xs font-bold">
          כתובת
          <input name="slug" defaultValue={item?.slug ?? ""} className={`${fieldClass} mt-1`} />
        </label>
        <label className="text-xs font-bold">
          קטגוריה
          <select name="categoryId" defaultValue={item?.categoryId ?? categoryId} className={`${fieldClass} mt-1`}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={item ? item.isActive : true} />
          פעילה
        </label>
        <button type="submit" className="min-h-11 rounded-full border border-line px-4 text-sm font-bold">
          שמירה
        </button>
        {state.error ? <span className="text-sm font-semibold text-danger">{state.error}</span> : null}
      </div>
    </form>
  );
}

function Move({ kind, id, direction, disabled }: { kind: string; id: string; direction: "up" | "down"; disabled: boolean }) {
  return (
    <form action={reorderAction}>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="direction" value={direction} />
      <button type="submit" disabled={disabled} className="min-h-11 rounded-full bg-sand px-3 text-sm font-bold disabled:opacity-40">
        {direction === "up" ? "למעלה" : "למטה"}
      </button>
    </form>
  );
}
