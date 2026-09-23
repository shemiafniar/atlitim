import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "כניסת ניהול",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" && params.next.startsWith("/admin") ? params.next : "/admin";
  const demo = !isSupabaseConfigured();
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-10">
      <p className="font-display text-3xl font-bold text-olive">Atlitim</p>
      <h1 className="mt-6 font-display text-4xl font-bold">כניסה לניהול</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        {demo ? "מצב הדגמה. הניהול נשמר במחשב המקומי ולא בסופאבייס." : "הכניסה פתוחה רק לכתובות אימייל שמופיעות ברשימת המנהלים."}
      </p>
      <div className="mt-6">
        <LoginForm demo={demo} nextPath={next} showDemoHint={demo && process.env.NODE_ENV !== "production"} />
      </div>
    </main>
  );
}
