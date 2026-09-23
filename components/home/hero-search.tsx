"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SEARCH_EXAMPLES, btnClay, fieldClass } from "@/lib/constants";

export function HeroSearch() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % SEARCH_EXAMPLES.length), 2800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <form action="/search" method="get" role="search" className="mt-6 rounded-[1.75rem] border border-line bg-card p-3 shadow-card sm:p-4">
      <label htmlFor="home-q" className="px-2 text-sm font-bold text-olive">
        מה אתם מחפשים בעתלית?
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input id="home-q" name="q" className={`${fieldClass} ps-12`} placeholder={SEARCH_EXAMPLES[index]} />
        </div>
        <button type="submit" className={`${btnClay} sm:min-w-32`}>
          חיפוש
        </button>
      </div>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
        {SEARCH_EXAMPLES.map((example) => (
          <Link key={example} href={`/search?q=${encodeURIComponent(example)}`} className="shrink-0 rounded-full bg-sand px-3 py-2 text-sm font-semibold text-ink">
            {example}
          </Link>
        ))}
      </div>
    </form>
  );
}
