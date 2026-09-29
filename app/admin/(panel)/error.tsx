"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="rounded-3xl border border-line bg-card px-5 py-8">
      <h1 className="font-display text-3xl font-bold">לא הצלחנו לטעון את הניהול</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
        בדקו את חיבור Supabase ואת מפתח השירות בשרת. פרטי התקלה נרשמו בלי מפתחות או סיסמאות.
      </p>
      <button type="button" onClick={reset} className="mt-5 min-h-12 rounded-full bg-olive px-5 text-sm font-bold text-white">
        נסו שוב
      </button>
    </div>
  );
}
