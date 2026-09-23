import Link from "next/link";

export function SiteFooter({ demoMode }: { demoMode: boolean }) {
  return (
    <footer className="mt-16 border-t border-line bg-[#ebe4d8]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-bold text-olive">Atlitim</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">מקום אחד לגלות את העסקים, השירותים ובעלי המקצוע של עתלית.</p>
          {demoMode ? (
            <p className="mt-4 max-w-sm text-sm leading-6 text-ink">העסקים שמופיעים כרגע הם נתוני הדגמה, כדי שאפשר יהיה להכיר את המוצר לפני חיבור המאגר.</p>
          ) : null}
        </div>
        <div>
          <p className="text-sm font-bold">גילוי</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-olive" href="/search">כל העסקים</Link></li>
            <li><Link className="hover:text-olive" href="/categories">קטגוריות</Link></li>
            <li><Link className="hover:text-olive" href="/neighbors">השכנים של עתלית</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold">לעסקים</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-olive" href="/add-business">הוספת עסק</Link></li>
            <li><Link className="hover:text-olive" href="/my-business">ניהול העסק שלי</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/80 px-4 py-4 text-center text-xs text-muted">נבנה עבור תושבי עתלית</div>
    </footer>
  );
}
