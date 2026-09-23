import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { PhotoCredit } from "@/components/layout/photo-credit";
import { SEARCH_EXAMPLES } from "@/lib/constants";

function heroSrc() {
  const file = path.join(process.cwd(), "public", "images", "atlit-hero.jpg");
  return fs.existsSync(file) ? "/images/atlit-hero.jpg" : null;
}

export function Hero() {
  const src = heroSrc();
  return (
    <section className="relative isolate min-h-[34rem] overflow-hidden sm:min-h-[40rem] lg:min-h-[44rem]">
      <div className="absolute inset-0">
        {src ? (
          <img src={src} alt="מבצר עתלית לחוף הים" className="h-full w-full object-cover object-center" />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(180deg,#f8dcc4_0%,#e7b98a_32%,#6eafc0_68%,#1c5f68_100%)]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.08)_34%,rgba(8,24,32,0.18)_100%)]" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-[34rem] w-full max-w-4xl flex-col items-center justify-center px-4 pb-20 pt-8 text-center sm:min-h-[40rem] sm:pb-24 lg:min-h-[44rem]">
        <h1 className="hero-title font-display text-[2.6rem] font-bold leading-[1.15] text-olive sm:text-6xl lg:text-7xl">כל עתלית במקום אחד</h1>
        <p className="mt-4 max-w-xl text-base font-medium leading-7 text-ink/85 sm:text-lg">
          מגלים עסקים, שירותים ובעלי מקצוע מקומיים
          <span className="mt-1 block">
            ותומכים בכלכלה המקומית שלנו{" "}
            <Heart className="inline h-4 w-4 fill-[#e25b6a] text-[#e25b6a]" aria-hidden="true" />
          </span>
        </p>
        <form action="/search" method="get" role="search" className="mt-6 flex w-full max-w-2xl items-center gap-2 rounded-full bg-white p-1.5 shadow-[0_18px_50px_-18px_rgba(20,40,40,0.55)]">
          <label htmlFor="home-q" className="sr-only">
            מה אתם מחפשים בעתלית?
          </label>
          <Search className="ms-3 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <input
            id="home-q"
            name="q"
            className="min-h-12 min-w-0 flex-1 bg-transparent px-1 text-base text-ink outline-none placeholder:text-[#8a9693]"
            placeholder="מה אתם מחפשים בעתלית?"
          />
          <button type="submit" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-olive px-5 text-sm font-bold text-white transition hover:bg-[#08393a] sm:px-7 sm:text-base">
            חיפוש
          </button>
        </form>
        <div className="no-scrollbar mt-4 flex w-full max-w-2xl gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {SEARCH_EXAMPLES.map((example) => (
            <Link
              key={example}
              href={`/search?q=${encodeURIComponent(example)}`}
              className="shrink-0 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-ink shadow-sm backdrop-blur transition hover:bg-white"
            >
              {example}
            </Link>
          ))}
        </div>
        <PhotoCredit className="pointer-events-auto absolute inset-x-3 bottom-[4.5rem] z-20 text-center text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.75)] sm:bottom-[4.75rem]" />
      </div>
    </section>
  );
}
