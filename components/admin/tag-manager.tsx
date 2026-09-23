"use client";

import { useActionState } from "react";
import { deleteTagAction, tagAction } from "@/lib/actions/admin";
import { fieldClass } from "@/lib/constants";
import type { ActionState, Tag } from "@/types";

export function TagManager({ tags }: { tags: Tag[] }) {
  return (
    <div className="grid gap-3">
      <TagForm />
      {tags.map((tag) => (
        <div key={tag.id} className="rounded-3xl border border-line bg-card p-4">
          <TagForm tag={tag} />
          <form action={deleteTagAction} className="mt-2">
            <input type="hidden" name="id" value={tag.id} />
            <button type="submit" className="min-h-11 rounded-full px-3 text-sm font-bold text-danger">
              מחיקה
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}

function TagForm({ tag }: { tag?: Tag }) {
  const [state, action] = useActionState(tagAction, {} as ActionState);
  return (
    <form action={action} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      {tag ? <input type="hidden" name="id" value={tag.id} /> : null}
      <label className="text-sm font-bold">
        {tag ? "שם" : "תגית חדשה"}
        <input name="name" required defaultValue={tag?.name ?? ""} className={`${fieldClass} mt-1.5`} />
      </label>
      <label className="text-sm font-bold">
        כתובת
        <input name="slug" defaultValue={tag?.slug ?? ""} className={`${fieldClass} mt-1.5`} />
      </label>
      <button type="submit" className="min-h-12 rounded-full bg-olive px-4 text-sm font-bold text-white">
        שמירה
      </button>
      {state.error ? <p className="text-sm font-semibold text-danger sm:col-span-3">{state.error}</p> : null}
    </form>
  );
}
