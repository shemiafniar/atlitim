import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { btnPrimary } from "@/lib/constants";

export const metadata: Metadata = {
  title: "השכנים של עתלית",
  description: "Atlitim נשארת קודם כול של עתלית. יישובים שכנים יתווספו בהמשך, בלי לדחוק את העסקים המקומיים.",
};

export default function NeighborsPage() {
  const hero = fs.existsSync(path.join(process.cwd(), "public", "images", "atlit-hero.jpg")) ? "/images/atlit-hero.jpg" : null;
  return (
    <div className="bg-[#f6f7f6]">
      <section className="relative isolate h-56 overflow-hidden sm:h-72">
        {hero ? <img src={hero} alt="" className="h-full w-full object-cover object-[center_40%]" /> : <div className="h-full w-full bg-olive" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c2c2e]/70 via-[#0c2c2e]/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl px-4 pb-6 sm:px-6">
          <p className="text-sm font-bold text-white/85">בהמשך</p>
          <h1 className="mt-1 font-display text-4xl font-bold text-white sm:text-5xl">השכנים של עתלית</h1>
        </div>
      </section>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-lg leading-8 text-muted">
          Atlitim נולדה עבור עתלית, ונשארת קודם כול של עתלית. בהמשך אפשר יהיה להציג גם עסקים מיישובי חוף הכרמל הסמוכים — רק כשזה באמת עוזר לתושבים.
        </p>
        <div className="mt-6 rounded-[1.75rem] border border-line bg-white p-6 shadow-card">
          <h2 className="text-xl font-bold">מה לא יקרה</h2>
          <p className="mt-2 text-base leading-7">
            חיפוש רגיל ימשיך להציג קודם עסקים מעתלית. יישוב שכן לא ייכנס בשקט לתוצאות ולא ידחוק עסק מקומי. זה לא מדריך ארצי ולא רשת ערים.
          </p>
          <p className="mt-4 text-sm font-semibold text-olive">כרגע החיפוש מציג עסקים מעתלית בלבד.</p>
        </div>
        <Link href="/search" className={`${btnPrimary} mt-8`}>
          לעסקים בעתלית
        </Link>
      </div>
    </div>
  );
}
