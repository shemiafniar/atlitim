"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/admin";
import { SubmitButton } from "@/components/submit-button";
import { fieldClass } from "@/lib/constants";

export function LoginForm({ demo, nextPath, hint }: { demo: boolean; nextPath: string; hint?: string }) {
  const [state, action] = useActionState(loginAction, {});
  return (
    <form action={action} className="grid gap-3 rounded-3xl border border-line bg-card p-5">
      <input type="hidden" name="next" value={nextPath} />
      {demo ? null : (
        <label className="text-sm font-bold" htmlFor="admin-email">
          אימייל
          <input id="admin-email" name="email" type="email" required autoComplete="username" className={`${fieldClass} mt-1.5`} />
        </label>
      )}
      <label className="text-sm font-bold" htmlFor="admin-password">
        סיסמה
        <input id="admin-password" name="password" type="password" required autoComplete="current-password" className={`${fieldClass} mt-1.5`} />
      </label>
      {hint ? <p className="text-xs leading-5 text-muted">{hint}</p> : null}
      {state.error ? <p role="alert" className="text-sm font-semibold text-danger">{state.error}</p> : null}
      <SubmitButton pendingLabel="נכנסים...">כניסה</SubmitButton>
    </form>
  );
}
