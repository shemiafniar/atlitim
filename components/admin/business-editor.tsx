"use client";

import { useActionState } from "react";
import { saveBusinessAction } from "@/lib/actions/admin";
import { HoursEditor } from "@/components/hours-editor";
import { SubmitButton } from "@/components/submit-button";
import { fieldClass, textAreaClass } from "@/lib/constants";
import type { BusinessView, Category, Subcategory, Tag } from "@/types";

export function BusinessEditor({
  categories,
  subcategories,
  tags,
  business,
  submissionId,
  defaults,
}: {
  categories: Category[];
  subcategories: Subcategory[];
  tags: Tag[];
  business?: BusinessView | null;
  submissionId?: string;
  defaults?: {
    name?: string;
    shortDescription?: string;
    description?: string;
    phone?: string | null;
    whatsapp?: string | null;
    subcategoryIds?: string[];
  };
}) {
  const [state, action] = useActionState(saveBusinessAction, {});
  const selected = new Set(defaults?.subcategoryIds ?? business?.categories.map((item) => item.subcategory?.id).filter(Boolean) ?? []);
  const selectedTags = new Set(business?.tags.map((tag) => tag.id) ?? []);

  return (
    <form action={action} className="grid gap-5">
      {business ? <input type="hidden" name="id" value={business.id} /> : null}
      {submissionId ? <input type="hidden" name="submissionId" value={submissionId} /> : null}
      <input type="hidden" name="isDemo" value={business?.isDemo ? "1" : "0"} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Label text="שם העסק">
          <input name="name" required defaultValue={defaults?.name ?? business?.name ?? ""} className={fieldClass} />
        </Label>
        <Label text="כתובת עמוד">
          <input name="slug" defaultValue={business?.slug ?? ""} className={fieldClass} placeholder="נוצר אוטומטית אם ריק" />
        </Label>
      </div>
      <Label text="תיאור קצר">
        <input name="shortDescription" required defaultValue={defaults?.shortDescription ?? business?.shortDescription ?? ""} className={fieldClass} />
      </Label>
      <Label text="תיאור מלא">
        <textarea name="description" defaultValue={defaults?.description ?? business?.description ?? ""} className={textAreaClass} />
      </Label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Label text="טלפון"><input name="phone" defaultValue={defaults?.phone ?? business?.phone ?? ""} className={fieldClass} /></Label>
        <Label text="WhatsApp"><input name="whatsapp" defaultValue={defaults?.whatsapp ?? business?.whatsapp ?? ""} className={fieldClass} /></Label>
        <Label text="אימייל"><input name="email" defaultValue={business?.email ?? ""} className={fieldClass} /></Label>
        <Label text="אתר"><input name="website" defaultValue={business?.website ?? ""} className={fieldClass} /></Label>
        <Label text="אינסטגרם"><input name="instagram" defaultValue={business?.instagram ?? ""} className={fieldClass} /></Label>
        <Label text="פייסבוק"><input name="facebook" defaultValue={business?.facebook ?? ""} className={fieldClass} /></Label>
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="showExactAddress" defaultChecked={business?.showExactAddress ?? false} />
        להציג כתובת מדויקת
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <Label text="כתובת"><input name="address" defaultValue={business?.address ?? ""} className={fieldClass} /></Label>
        <Label text="קו רוחב"><input name="latitude" defaultValue={business?.latitude ?? ""} className={fieldClass} /></Label>
        <Label text="קו אורך"><input name="longitude" defaultValue={business?.longitude ?? ""} className={fieldClass} /></Label>
      </div>
      <fieldset className="grid gap-3">
        <legend className="text-sm font-bold">קטגוריות</legend>
        {categories.map((category) => (
          <div key={category.id} className="rounded-2xl bg-sand/60 p-3">
            <p className="text-sm font-bold">{category.name}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {subcategories
                .filter((item) => item.categoryId === category.id)
                .map((item) => (
                  <label key={item.id} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-card px-3 text-sm">
                    <input type="checkbox" name="subcategoryId" value={item.id} defaultChecked={selected.has(item.id)} />
                    {item.name}
                  </label>
                ))}
            </div>
          </div>
        ))}
      </fieldset>
      <fieldset>
        <legend className="text-sm font-bold">תגיות</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label key={tag.id} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-3 text-sm">
              <input type="checkbox" name="tagId" value={tag.id} defaultChecked={selectedTags.has(tag.id)} />
              {tag.name}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-2 sm:grid-cols-2">
        <Check name="providesDelivery" label="משלוחים" defaultChecked={business?.providesDelivery} />
        <Check name="providesHomeService" label="מגיעים עד הבית" defaultChecked={business?.providesHomeService} />
        <Check name="isHomeBusiness" label="עסק ביתי" defaultChecked={business?.isHomeBusiness} />
        <Check name="accessibility" label="נגיש" defaultChecked={business?.accessibility} />
        <Check name="kosher" label="כשר" defaultChecked={business?.kosher} />
        <Check name="verified" label="מאומת" defaultChecked={business?.verified} />
        <Check name="featured" label="מומלץ בעמוד הבית" defaultChecked={business?.featured} />
        <Check name="active" label="פעיל וגלוי" defaultChecked={business ? business.active : true} />
      </div>
      <HoursEditor initial={(business?.hours ?? []).map((hour) => ({ dayOfWeek: hour.dayOfWeek, openTime: hour.openTime, closeTime: hour.closeTime }))} useFallback={!business} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Label text="לוגו"><input name="logo" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" /></Label>
        <Label text="תמונת שער"><input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" /></Label>
        <Label text="תמונה לגלריה"><input name="gallery" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" /></Label>
      </div>
      {business && business.images.length > 0 ? (
        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold">תמונות קיימות למחיקה</legend>
          {business.images.map((image) => (
            <label key={image.id} className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" name="deleteImage" value={image.id} />
              {image.altText || "תמונה"}
            </label>
          ))}
        </fieldset>
      ) : null}
      {state.error ? <p role="alert" className="rounded-2xl bg-danger-bg px-4 py-3 text-sm font-semibold text-danger">{state.error}</p> : null}
      <SubmitButton>{submissionId ? "אישור ופרסום" : business ? "שמירת עסק" : "יצירת עסק"}</SubmitButton>
    </form>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-bold">
      {text}
      <div className="mt-1.5 font-normal">{children}</div>
    </label>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-11 items-center gap-2 rounded-2xl border border-line px-3 text-sm font-semibold">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}
