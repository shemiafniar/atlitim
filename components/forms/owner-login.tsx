"use client";

import { useActionState } from "react";
import { ownerLoginAction } from "@/lib/actions/owner";
import { SubmitButton } from "@/components/submit-button";
import { fieldClass } from "@/lib/constants";

export function OwnerLogin() {
  const [state, action] = useActionState(ownerLoginAction, {});
  return (
    <form action={action} className="grid gap-3 rounded-3xl border border-line bg-card p-5">
      <label className="text-sm font-bold" htmlFor="owner-email">
        אימייל
        <input id="owner-email" name="email" type="email" required className={`${fieldClass} mt-1.5`} />
      </label>
      <label className="text-sm font-bold" htmlFor="owner-password">
        סיסמה
        <input id="owner-password" name="password" type="password" required className={`${fieldClass} mt-1.5`} />
      </label>
      {state.error ? <p role="alert" className="text-sm font-semibold text-danger">{state.error}</p> : null}
      <SubmitButton>כניסה</SubmitButton>
    </form>
  );
}
