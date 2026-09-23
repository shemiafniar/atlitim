"use client";

import { useActionState } from "react";
import { ownerSaveAction } from "@/lib/actions/owner";
import { HoursEditor } from "@/components/hours-editor";
import { SubmitButton } from "@/components/submit-button";
import { fieldClass, textAreaClass } from "@/lib/constants";
import type { BusinessView } from "@/types";

export function OwnerEditor({ business }: { business: BusinessView }) {
  const [state, action] = useActionState(ownerSaveAction, {});
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="businessId" value={business.id} />
      <label className="text-sm font-bold">
        תיאור קצר
        <input name="shortDescription" defaultValue={business.shortDescription} className={`${fieldClass} mt-1.5`} />
      </label>
      <label className="text-sm font-bold">
        אודות
        <textarea name="description" defaultValue={business.description} className={`${textAreaClass} mt-1.5`} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold">
          טלפון
          <input name="phone" defaultValue={business.phone ?? ""} className={`${fieldClass} mt-1.5`} />
        </label>
        <label className="text-sm font-bold">
          WhatsApp
          <input name="whatsapp" defaultValue={business.whatsapp ?? ""} className={`${fieldClass} mt-1.5`} />
        </label>
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="showExactAddress" defaultChecked={business.showExactAddress} />
        להציג כתובת מדויקת
      </label>
      <label className="text-sm font-bold">
        כתובת
        <input name="address" defaultValue={business.address ?? ""} className={`${fieldClass} mt-1.5`} />
      </label>
      <HoursEditor
        initial={business.hours.map((hour) => ({ dayOfWeek: hour.dayOfWeek, openTime: hour.openTime, closeTime: hour.closeTime }))}
      />
      {state.error ? <p role="alert" className="text-sm font-semibold text-danger">{state.error}</p> : null}
      {state.success ? <p role="status" className="text-sm font-semibold text-olive">{state.message}</p> : null}
      <SubmitButton>שמירת פרטים</SubmitButton>
    </form>
  );
}
