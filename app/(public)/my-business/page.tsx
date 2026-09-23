import type { Metadata } from "next";
import Link from "next/link";
import { ownerLogoutAction } from "@/lib/actions/owner";
import { OwnerEditor } from "@/components/forms/owner-editor";
import { OwnerLogin } from "@/components/forms/owner-login";
import { currentUserEmail, currentUserId } from "@/lib/auth-user";
import { listOwnedViews } from "@/lib/repositories";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "העסק שלי",
  robots: { index: false, follow: false },
};

export default async function MyBusinessPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-4xl font-bold">העסק שלי</h1>
        <p className="mt-3 text-base leading-7 text-muted">
          אחרי חיבור Supabase ואישור בקשת בעלות, בעל העסק יוכל לעדכן כאן תיאור, טלפון ושעות. המודל כבר מוכן בטבלת הבעלות, והעמוד הזה יתחבר אליו.
        </p>
        <Link href="/add-business" className="mt-6 inline-flex min-h-12 items-center font-bold text-olive">
          בינתיים אפשר להוסיף עסק לבדיקה
        </Link>
      </div>
    );
  }
  const userId = await currentUserId();
  if (!userId) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-6">
        <h1 className="font-display text-4xl font-bold">העסק שלי</h1>
        <p className="mt-3 text-sm leading-6 text-muted">התחברו עם החשבון שקושר לעסק אחרי אישור הבעלות.</p>
        <div className="mt-6">
          <OwnerLogin />
        </div>
      </div>
    );
  }
  const businesses = await listOwnedViews(userId);
  const email = await currentUserEmail();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-bold">העסק שלי</h1>
          <p className="mt-2 text-sm text-muted">{email}</p>
        </div>
        <OwnerLogout />
      </div>
      {businesses.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-line bg-card px-5 py-8 text-sm leading-6">
          עדיין אין עסק שמקושר לחשבון הזה. אחרי שתביעת הבעלות תאושר, העריכה תופיע כאן.
        </p>
      ) : (
        <div className="mt-8 grid gap-8">
          {businesses.map((business) => (
            <section key={business.id} className="rounded-3xl border border-line bg-card p-5">
              <h2 className="font-display text-2xl font-bold">{business.name}</h2>
              <div className="mt-4">
                <OwnerEditor business={business} />
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function OwnerLogout() {
  return (
    <form action={ownerLogoutAction}>
      <button className="min-h-11 rounded-full border border-line px-4 text-sm font-bold" type="submit">
        יציאה
      </button>
    </form>
  );
}
