import Link from "next/link";
import { logoutAction } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

const links = [
  ["/admin", "סקירה"],
  ["/admin/businesses", "עסקים"],
  ["/admin/submissions", "פניות"],
  ["/admin/claims", "בעלות"],
  ["/admin/reports", "דיווחים"],
  ["/admin/categories", "קטגוריות"],
  ["/admin/tags", "תגיות"],
] as const;

export const metadata = {
  robots: { index: false, follow: false },
  title: "ניהול",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-dvh bg-bg">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="font-display text-2xl font-bold text-olive">ניהול Atlitim</p>
            <p className="text-xs text-muted">{session.email}</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="min-h-11 rounded-full border border-line px-4 text-sm font-bold">
              יציאה
            </button>
          </form>
        </div>
        <nav className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6" aria-label="ניהול">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="shrink-0 rounded-full bg-sand px-4 py-2 text-sm font-bold">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      {!isSupabaseConfigured() ? (
        <p className="bg-olive-soft px-4 py-2 text-center text-sm text-olive">מצב הדגמה: השינויים נשמרים מקומית ולא בסופאבייס.</p>
      ) : null}
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">{children}</div>
    </div>
  );
}
