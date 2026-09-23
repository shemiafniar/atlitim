import Link from "next/link";
import { CategoryGrid } from "@/components/home/category-grid";
import { Discovery } from "@/components/home/discovery";
import { HeroSearch } from "@/components/home/hero-search";
import { btnClay } from "@/lib/constants";
import { getHomeData } from "@/lib/repositories";

export default async function HomePage() {
  const data = await getHomeData();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="max-w-3xl">
        <p className="text-sm font-bold text-clay">עתלית</p>
        <h1 className="mt-2 font-display text-5xl font-bold leading-[1.15] text-ink sm:text-6xl">כל עתלית במקום אחד.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          Atlitim עוזרת לתושבות ולתושבים לגלות עסקים, שירותים ובעלי מקצוע מקומיים — בלי לחפש בין קבוצות, פוסטים וחיפושים מפוזרים.
        </p>
        <HeroSearch />
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-3xl font-bold">קטגוריות</h2>
          <Link href="/categories" className="text-sm font-bold text-olive">
            כל הקטגוריות
          </Link>
        </div>
        <CategoryGrid categories={data.categories} />
      </section>

      <Discovery
        title="פתוחים עכשיו"
        href="/search?openNow=1"
        businesses={data.openNow}
        empty="כרגע אין עסקים פתוחים להצגה. שווה לבדוק שוב מאוחר יותר."
      />
      <Discovery
        title="עסקים שכדאי להכיר"
        href="/search"
        businesses={data.featured}
        empty="עוד רגע יופיעו כאן עסקים שכדאי להכיר."
      />
      <Discovery
        title="חדשים ב-Atlitim"
        href="/search"
        businesses={data.recent}
        empty="עסקים חדשים יופיעו כאן אחרי שיאושרו."
      />

      <section className="mt-14 overflow-hidden rounded-[2rem] bg-olive px-6 py-8 text-white sm:px-10">
        <h2 className="font-display text-3xl font-bold">יש לכם עסק בעתלית?</h2>
        <p className="mt-2 max-w-xl text-base leading-7 text-white/85">הוסיפו אותו. נבדוק את הפרטים לפני שהוא מופיע לתושבים.</p>
        <Link href="/add-business" className={`${btnClay} mt-5 bg-white text-olive hover:bg-sand`}>
          הוספת עסק
        </Link>
      </section>
    </div>
  );
}
