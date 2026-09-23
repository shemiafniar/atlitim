import Link from "next/link";
import { BadgeCheck, Phone } from "lucide-react";
import { CoverArt } from "@/components/cover-art";
import { WhatsAppIcon } from "@/components/icons";
import { TrackedAnchor } from "@/components/tracked-anchor";
import { toTelHref, toWhatsAppHref } from "@/lib/utils";
import type { BusinessView } from "@/types";

export function BusinessCard({ business }: { business: BusinessView }) {
  const category = business.categories[0];
  const tags = business.tags.slice(0, 2);
  const cover = business.coverImageUrl || business.images[0]?.imageUrl;
  return (
    <article className="shadow-card flex gap-3 rounded-3xl border border-line bg-card p-3 sm:gap-4 sm:p-4">
      <Link href={`/business/${business.slug}`} className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28" tabIndex={-1} aria-hidden="true">
        <CoverArt seed={business.name} label="" imageUrl={cover} showInitials />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold leading-snug sm:text-lg">
            <Link href={`/business/${business.slug}`} className="hover:text-olive">
              {business.name}
            </Link>
          </h3>
          {business.verified ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-olive-soft px-2 py-1 text-[11px] font-bold text-olive">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              מאומת
            </span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{business.shortDescription}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
          {category ? <span className="rounded-full bg-sand px-2 py-1 font-semibold">{category.category.name}</span> : null}
          <span className={business.openNow ? "rounded-full bg-ok-bg px-2 py-1 font-bold text-ok" : "rounded-full bg-sand px-2 py-1 font-semibold text-muted"}>
            {business.openNow ? "פתוח עכשיו" : "סגור עכשיו"}
          </span>
          {tags.map((tag) => (
            <span key={tag.id} className="rounded-full border border-line px-2 py-1 text-muted">
              {tag.name}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {business.whatsapp ? (
            <TrackedAnchor
              href={toWhatsAppHref(business.whatsapp)}
              event="whatsapp_click"
              eventProps={{ slug: business.slug }}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-olive px-3 text-sm font-semibold text-white"
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </TrackedAnchor>
          ) : null}
          {business.phone ? (
            <TrackedAnchor
              href={toTelHref(business.phone)}
              event="phone_click"
              eventProps={{ slug: business.slug }}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-card px-3 text-sm font-semibold"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              התקשרו
            </TrackedAnchor>
          ) : null}
        </div>
      </div>
    </article>
  );
}
