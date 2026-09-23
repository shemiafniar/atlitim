"use client";

import { useActionState, useState } from "react";
import { submitBusinessAction } from "@/lib/actions/public";
import { SubmitButton } from "@/components/submit-button";
import { fieldClass, textAreaClass } from "@/lib/constants";
import type { Category, Subcategory } from "@/types";

export function AddBusinessForm({ categories, subcategories }: { categories: Category[]; subcategories: Subcategory[] }) {
  const [state, action] = useActionState(submitBusinessAction, {});
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const options = subcategories.filter((item) => item.categoryId === categoryId);

  if (state.success) {
    return (
      <div className="rounded-[1.75rem] border border-line bg-card p-6 shadow-card sm:p-8" role="status">
        <p className="text-sm font-bold text-olive">הפנייה התקבלה</p>
        <h2 className="mt-2 font-display text-3xl font-bold">תודה, נבדוק לפני הפרסום</h2>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-[1.75rem] border border-line bg-card p-5 shadow-card sm:p-7">
      <div className="grid gap-4">
        <Field label="שם העסק" htmlFor="businessName">
          <input id="businessName" name="businessName" required className={fieldClass} maxLength={80} />
        </Field>
        <Field label="קטגוריה" htmlFor="categoryId">
          <select id="categoryId" name="categoryId" className={fieldClass} value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="תת־קטגוריה (לא חובה)" htmlFor="subcategoryId">
          <select id="subcategoryId" name="subcategoryId" className={fieldClass} defaultValue="">
            <option value="">בלי תת־קטגוריה</option>
            {options.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="תיאור קצר" htmlFor="description">
          <textarea id="description" name="description" required className={textAreaClass} maxLength={500} placeholder="מה אתם מציעים, ולמי זה מתאים?" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="טלפון" htmlFor="phone">
            <input id="phone" name="phone" required inputMode="tel" className={fieldClass} placeholder="050-000-0000" />
          </Field>
          <Field label="WhatsApp (לא חובה)" htmlFor="whatsapp">
            <input id="whatsapp" name="whatsapp" inputMode="tel" className={fieldClass} placeholder="050-000-0000" />
          </Field>
        </div>
        <Field label="איש קשר" htmlFor="contactPerson">
          <input id="contactPerson" name="contactPerson" required className={fieldClass} />
        </Field>
        <Field label="תמונה (לא חובה)" htmlFor="image">
          <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm" />
        </Field>
      </div>
      {state.error ? (
        <p role="alert" className="mt-4 rounded-2xl bg-danger-bg px-4 py-3 text-sm font-semibold text-danger">
          {state.error}
        </p>
      ) : null}
      <div className="mt-6">
        <SubmitButton>שליחה לבדיקה</SubmitButton>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-bold">
      {label}
      <div className="mt-1.5 font-normal">{children}</div>
    </label>
  );
}
