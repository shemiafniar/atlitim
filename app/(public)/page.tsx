import Link from "next/link";
import { Clock, Heart, MapPin, Star } from "lucide-react";
import { CategoryGrid } from "@/components/home/category-grid";
import { Discovery } from "@/components/home/discovery";
import { Hero } from "@/components/home/hero";
import { getHomeData } from "@/lib/repositories";

export default async function HomePage() {
  const data = await getHomeData();
  return (
    <>
      <Hero />
      <div className="relative z-10 -mt-14 rounded-t-[2rem] bg-white pb-2 shadow-[0_-20px_40px_-28px_rgba(12,60,62,0.35)] sm:-mt-16">
        <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-7 sm:px-6 sm:pt-8">
          <h2 className="sr-only">קטגוריות</h2>
          <CategoryGrid categories={data.categories} />
        </div>
      </div>
      <div className="bg-[#f6f7f6]">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <div className="grid min-w-0 items-start gap-8 xl:grid-cols-3">
            <Discovery
              title="פתוחים עכשיו"
              href="/search?openNow=1"
              businesses={data.openNow}
              empty="כרגע אין עסקים פתוחים להצגה. שווה לבדוק שוב מאוחר יותר."
              icon={<Clock className="h-4 w-4 text-olive" aria-hidden="true" />}
            />
            <Discovery
              title="עסקים שכדאי להכיר"
              href="/search"
              businesses={data.featured}
              empty="עוד רגע יופיעו כאן עסקים שכדאי להכיר."
              icon={<Star className="h-4 w-4 fill-[#e2b13c] text-[#e2b13c]" aria-hidden="true" />}
            />
            <Discovery
              title="חדשים ב-Atlitim"
              href="/search"
              businesses={data.recent}
              empty="עסקים חדשים יופיעו כאן אחרי שיאושרו."
              icon={<Heart className="h-4 w-4 fill-[#e25b6a] text-[#e25b6a]" aria-hidden="true" />}
            />
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/search" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-olive bg-white px-6 text-sm font-bold text-olive shadow-sm transition hover:bg-olive-soft">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              לכל העסקים בעתלית
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
