import Link from "next/link";
import { btnPrimary } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16 text-center sm:px-6">
      <img src="/brand/illustrations/fortress.svg" alt="" className="mx-auto mb-4 h-20 w-20" />
      <h1 className="font-display text-4xl font-bold">לא מצאנו את העמוד</h1>
      <p className="mt-3 text-base leading-7 text-muted">אפשר לחזור הביתה או לחפש עסק בעתלית.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className={btnPrimary}>
          לדף הבית
        </Link>
        <Link href="/search" className="inline-flex min-h-12 items-center rounded-full border border-line px-5 font-semibold">
          לחיפוש
        </Link>
      </div>
    </div>
  );
}
