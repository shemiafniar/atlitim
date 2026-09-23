"use client";

import { useActionState } from "react";
import { Heart } from "lucide-react";
import { claimAction, recommendAction, reportAction } from "@/lib/actions/public";
import { track } from "@/components/analytics-client";
import { SubmitButton } from "@/components/submit-button";
import { REPORT_REASONS, fieldClass, textAreaClass } from "@/lib/constants";
import { recommendationLabel } from "@/lib/utils";

export function RecommendBox({ slug, count }: { slug: string; count: number }) {
  const [state, action] = useActionState(recommendAction, {});
  return (
    <section id="recommendations" className="rounded-3xl border border-line bg-card p-5">
      <h2 className="font-display text-2xl font-bold">ממליצים על העסק</h2>
      <p className="mt-1 text-sm text-muted">{recommendationLabel(count)}</p>
      <form
        action={action}
        className="mt-4"
        onSubmit={() => track("recommendation", { slug })}
      >
        <input type="hidden" name="slug" value={slug} />
        <button type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-clay px-5 text-base font-semibold text-white">
          <Heart className="h-4 w-4" aria-hidden="true" />
          ממליצים על העסק
        </button>
      </form>
      {state.message ? <p role="status" className="mt-3 text-sm font-semibold text-olive">{state.message}</p> : null}
      {state.error ? <p role="alert" className="mt-3 text-sm font-semibold text-danger">{state.error}</p> : null}
    </section>
  );
}

export function ReportBox({ slug }: { slug: string }) {
  const [state, action] = useActionState(reportAction, {});
  if (state.success) {
    return (
      <section className="rounded-3xl border border-line bg-olive-soft p-5" role="status">
        <h2 className="font-display text-2xl font-bold">הדיווח נשלח</h2>
        <p className="mt-2 text-sm leading-6">{state.message}</p>
      </section>
    );
  }
  return (
    <section className="rounded-3xl border border-line bg-card p-5">
      <h2 className="font-display text-2xl font-bold">המידע כאן לא מעודכן?</h2>
      <p className="mt-1 text-sm leading-6 text-muted">ספרו לנו מה לא מדויק. נבדוק לפני שנשנה משהו.</p>
      <form action={action} className="mt-4 grid gap-3">
        <input type="hidden" name="slug" value={slug} />
        <fieldset className="grid gap-2">
          <legend className="text-sm font-bold">מה לא נכון?</legend>
          {REPORT_REASONS.map((reason) => (
            <label key={reason.id} className="flex min-h-11 items-center gap-2 text-sm">
              <input type="radio" name="reason" value={reason.id} required className="h-4 w-4" />
              {reason.label}
            </label>
          ))}
        </fieldset>
        <label className="text-sm font-bold" htmlFor="report-details">
          פירוט
          <textarea id="report-details" name="details" className={`${textAreaClass} mt-1.5`} maxLength={500} />
        </label>
        <label className="text-sm font-bold" htmlFor="report-contact">
          טלפון לחזרה (לא חובה)
          <input id="report-contact" name="contact" className={`${fieldClass} mt-1.5`} />
        </label>
        {state.error ? <p role="alert" className="text-sm font-semibold text-danger">{state.error}</p> : null}
        <SubmitButton variant="clay">שליחת דיווח</SubmitButton>
      </form>
    </section>
  );
}

export function ClaimBox({ slug }: { slug: string }) {
  const [state, action] = useActionState(claimAction, {});
  if (state.success) {
    return (
      <section className="rounded-3xl border border-line bg-card p-5" role="status">
        <h2 className="font-display text-2xl font-bold">הבקשה התקבלה</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{state.message}</p>
      </section>
    );
  }
  return (
    <section className="rounded-3xl border border-line bg-card p-5">
      <h2 className="font-display text-2xl font-bold">זה העסק שלי</h2>
      <p className="mt-1 text-sm leading-6 text-muted">השאירו פרטים ונחזור אליכם לאישור. אין כאן תהליך זיהוי מסובך.</p>
      <form action={action} className="mt-4 grid gap-3">
        <input type="hidden" name="slug" value={slug} />
        <label className="text-sm font-bold" htmlFor="claim-name">
          שם
          <input id="claim-name" name="claimantName" required className={`${fieldClass} mt-1.5`} />
        </label>
        <label className="text-sm font-bold" htmlFor="claim-phone">
          טלפון
          <input id="claim-phone" name="phone" required inputMode="tel" className={`${fieldClass} mt-1.5`} />
        </label>
        <label className="text-sm font-bold" htmlFor="claim-email">
          אימייל
          <input id="claim-email" name="email" required type="email" className={`${fieldClass} mt-1.5`} />
        </label>
        <label className="text-sm font-bold" htmlFor="claim-message">
          מה הקשר שלכם לעסק?
          <textarea id="claim-message" name="message" required className={`${textAreaClass} mt-1.5`} maxLength={500} />
        </label>
        {state.error ? <p role="alert" className="text-sm font-semibold text-danger">{state.error}</p> : null}
        <SubmitButton>שליחת בקשת בעלות</SubmitButton>
      </form>
    </section>
  );
}
