import Link from "next/link";
import { BadgeCheck, Heart } from "lucide-react";
import { CoverArt } from "@/components/cover-art";
import { isLocalAtlit } from "@/lib/brand";
import { businessCover } from "@/lib/visuals";
import type { BusinessView } from "@/types";

export function BusinessCard({ business }: { business: BusinessView }) {
  const category = business.categories[0]?.category.slug;
  const cover = businessCover(business.slug, category, business.coverImageUrl || business.images[0]?.imageUrl);
  const tag = business.tags[0];
  return (
    <article className="h-full">
      <Link
        href={`/business/${business.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-white shadow-card transition duration-200 hover:-translate-y-0.5"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          <CoverArt seed={business.name} label="" imageUrl={cover} className="transition duration-300 group-hover:scale-[1.03]" />
          {isLocalAtlit(business.locality) ? (
            <img src="/brand/illustrations/local-badge.svg" alt="מקומי" className="absolute end-2 top-2 h-11 w-11 drop-shadow-sm" />
          ) : null}
          {business.verified ? (
            <span className="absolute start-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[11px] font-bold text-olive shadow-sm">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              מאומת
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-3">
          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-ink">{business.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{business.shortDescription}</p>
          {tag ? <span className="mt-2 w-fit rounded-full bg-olive-soft px-2 py-1 text-[11px] font-semibold text-olive">{tag.name}</span> : null}
          <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-muted">
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              {business.recommendationCount}
            </span>
            <span className={business.openNow ? "font-bold text-ok" : "font-semibold text-muted"}>
              {business.openNow ? "פתוח עכשיו" : "סגור עכשיו"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
