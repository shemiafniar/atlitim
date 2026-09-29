import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { btnPrimary } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-4 py-16 text-center">
        <img src="/brand/illustrations/fortress.svg" alt="" className="mb-4 h-20 w-20" />
        <h1 className="font-display text-4xl font-bold">לא מצאנו את העמוד</h1>
        <p className="mt-3 text-base leading-7 text-muted">אפשר לחזור הביתה או לחפש עסק בעתלית.</p>
        <Link href="/" className={`${btnPrimary} mt-6`}>
          לדף הבית
        </Link>
      </main>
      <SiteFooter demoMode={!isSupabaseConfigured()} />
    </>
  );
}
