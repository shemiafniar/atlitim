import type { Metadata } from "next";
import Link from "next/link";
import { btnPrimary } from "@/lib/constants";

export const metadata: Metadata = {
  title: "השכנים של עתלית",
  description: "Atlitim נשארת קודם כול של עתלית. יישובים שכנים יתווספו בהמשך, בלי לדחוק את העסקים המקומיים.",
};

export default function NeighborsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-bold text-clay">בהמשך</p>
      <h1 className="mt-2 font-display text-5xl font-bold leading-tight">השכנים של עתלית</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        Atlitim נולדה עבור עתלית, ונשארת קודם כול של עתלית. בהמשך אפשר יהיה להציג גם עסקים מיישובי חוף הכרמל הסמוכים — רק כשזה באמת עוזר לתושבים.
      </p>
      <div className="mt-8 rounded-[1.75rem] border border-line bg-card p-6 shadow-card">
        <h2 className="font-display text-2xl font-bold">מה לא יקרה</h2>
        <p className="mt-2 text-base leading-7">
          חיפוש רגיל ימשיך להציג קודם עסקים מעתלית. יישוב שכן לא ייכנס בשקט לתוצאות ולא ידחוק עסק מקומי. זה לא מדריך ארצי ולא רשת ערים.
        </p>
        <p className="mt-4 text-sm font-semibold text-olive">כרגע החיפוש מציג עסקים מעתלית בלבד.</p>
      </div>
      <Link href="/search" className={`${btnPrimary} mt-8`}>
        לעסקים בעתלית
      </Link>
    </div>
  );
}
