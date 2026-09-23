import Link from "next/link";
import { BadgeCheck, Globe, MapPin, Phone } from "lucide-react";
import { CoverArt } from "@/components/cover-art";
import { ClaimBox, RecommendBox, ReportBox } from "@/components/business/community";
import { Gallery } from "@/components/business/gallery";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { TrackedAnchor } from "@/components/tracked-anchor";
import { ViewTracker } from "@/components/analytics-client";
import { groupHours, formatDayHours, getJerusalemParts } from "@/lib/business-hours/hours";
import { externalHref, initials, mapsHref, toTelHref, toWhatsAppHref } from "@/lib/utils";
import type { BusinessView } from "@/types";

export function BusinessProfile({ business }: { business: BusinessView }) {
  const maps = mapsHref(business);
  const today = getJerusalemParts().dayOfWeek;
  const primary = business.categories[0];
  const details = [
    business.showExactAddress && business.address ? { label: "כתובת", value: business.address } : null,
    !business.showExactAddress ? { label: "מיקום", value: "השירות ניתן בעתלית. הכתובת המדויקת נמסרת בתיאום." } : null,
    business.phone ? { label: "טלפון", value: business.phone, href: toTelHref(business.phone) } : null,
    business.email ? { label: "אימייל", value: business.email, href: `mailto:${business.email}` } : null,
    business.providesDelivery ? { label: "משלוחים", value: "כן, יש משלוחים" } : null,
    business.providesHomeService ? { label: "הגעה עד הבית", value: "מגיעים עד הבית" } : null,
    business.isHomeBusiness ? { label: "סוג העסק", value: "עסק ביתי" } : null,
    business.accessibility ? { label: "נגישות", value: "נגיש" } : null,
    business.kosher ? { label: "כשרות", value: "כשר" } : null,
  ].filter((item): item is { label: string; value: string; href?: string } => Boolean(item));

  return (
    <article className="pb-28 lg:pb-0">
      <ViewTracker name="business_profile_view" props={{ slug: business.slug }} />
      <div className="relative h-52 overflow-hidden sm:h-72 lg:h-80">
        <CoverArt seed={business.name} label={`תמונת שער של ${business.name}`} imageUrl={business.coverImageUrl} className="absolute inset-0" />
      </div>
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="-mt-10 flex items-end gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-3xl border-4 border-bg bg-olive font-display text-2xl font-bold text-white shadow-card">
            {business.logoUrl ? <CoverArt seed={business.name} label={`הלוגו של ${business.name}`} imageUrl={business.logoUrl} /> : initials(business.name)}
          </div>
          <div className="min-w-0 pb-1">
            {primary ? (
              <Link href={`/category/${primary.category.slug}`} className="text-sm font-bold text-olive">
                {primary.category.name}
              </Link>
            ) : null}
          </div>
        </div>
        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-4xl font-bold leading-tight">{business.name}</h1>
            {business.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-olive-soft px-2.5 py-1 text-xs font-bold text-olive">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                מאומת
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-lg leading-8 text-muted">{business.shortDescription}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {business.tags.map((tag) => (
              <span key={tag.id} className="rounded-full bg-sand px-3 py-1 text-sm font-semibold">
                {tag.name}
              </span>
            ))}
          </div>
          <p className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-bold ${business.openNow ? "bg-ok-bg text-ok" : "bg-sand text-ink"}`}>
            {business.openState.label}
            {business.openState.detail ? <span className="ms-2 font-semibold">{business.openState.detail}</span> : null}
          </p>
          <div className="mt-5 hidden flex-wrap gap-2 lg:flex">
            <Actions business={business} maps={maps} />
          </div>
        </header>

        <div className="mt-8 grid gap-8">
          {business.description ? (
            <section>
              <h2 className="font-display text-2xl font-bold">אודות</h2>
              <p className="mt-2 whitespace-pre-line text-base leading-8">{business.description}</p>
            </section>
          ) : null}

          <section>
            <h2 className="font-display text-2xl font-bold">שירותים</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {business.categories.map((item) => (
                <li key={`${item.category.id}-${item.subcategory?.id ?? "all"}`}>
                  <Link href={item.subcategory ? `/category/${item.category.slug}?subcategory=${item.subcategory.slug}` : `/category/${item.category.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line bg-card px-4 text-sm font-semibold">
                    {item.category.name}
                    {item.subcategory ? ` · ${item.subcategory.name}` : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">שעות פעילות</h2>
            <p className="mt-1 text-sm text-muted">לפי השעון של ישראל</p>
            {business.hours.length === 0 ? (
              <p className="mt-3 text-sm text-muted">שעות הפעילות יתעדכנו בקרוב.</p>
            ) : (
              <dl className="mt-3 overflow-hidden rounded-3xl border border-line bg-card">
                {groupHours(business.hours).map((day) => (
                  <div key={day.day} className={`flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-0 ${day.day === today ? "bg-olive-soft" : ""}`}>
                    <dt className="text-sm font-bold">{day.label}</dt>
                    <dd className="text-sm">{formatDayHours(day.periods)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          <Gallery images={business.images} name={business.name} />

          {details.length > 0 || business.website || business.instagram || business.facebook ? (
            <section>
              <h2 className="font-display text-2xl font-bold">פרטים נוספים</h2>
              <dl className="mt-3 grid gap-3">
                {details.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-card px-4 py-3">
                    <dt className="text-xs font-bold text-muted">{item.label}</dt>
                    <dd className="mt-1 text-sm leading-6">
                      {item.href ? (
                        <a href={item.href} className="font-semibold text-olive break-all">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                {business.website ? (
                  <a href={externalHref(business.website)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold" target="_blank" rel="noreferrer">
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    אתר
                  </a>
                ) : null}
                {business.instagram ? (
                  <a href={externalHref(business.instagram)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold" target="_blank" rel="noreferrer">
                    <InstagramIcon className="h-4 w-4" />
                    אינסטגרם
                  </a>
                ) : null}
                {business.facebook ? (
                  <a href={externalHref(business.facebook)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold" target="_blank" rel="noreferrer">
                    <FacebookIcon className="h-4 w-4" />
                    פייסבוק
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}

          <RecommendBox slug={business.slug} count={business.recommendationCount} />
          <ReportBox slug={business.slug} />
          <ClaimBox slug={business.slug} />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 p-3 backdrop-blur lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex max-w-3xl gap-2">
          <Actions business={business} maps={maps} compact />
        </div>
      </div>
    </article>
  );
}

function Actions({ business, maps, compact = false }: { business: BusinessView; maps: string | null; compact?: boolean }) {
  const className = compact ? "inline-flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-bold" : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold";
  return (
    <>
      {business.whatsapp ? (
        <TrackedAnchor href={toWhatsAppHref(business.whatsapp)} event="whatsapp_click" eventProps={{ slug: business.slug }} className={`${className} bg-[#1f7a45] text-white`} target="_blank" rel="noreferrer">
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </TrackedAnchor>
      ) : null}
      {business.phone ? (
        <TrackedAnchor href={toTelHref(business.phone)} event="phone_click" eventProps={{ slug: business.slug }} className={`${className} bg-olive text-white`}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          התקשרו
        </TrackedAnchor>
      ) : null}
      {maps ? (
        <TrackedAnchor href={maps} event="navigation_click" eventProps={{ slug: business.slug }} className={`${className} border border-line bg-card text-ink`} target="_blank" rel="noreferrer">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          ניווט
        </TrackedAnchor>
      ) : null}
    </>
  );
}
