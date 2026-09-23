import Link from "next/link";
import { BusinessCard } from "@/components/business/business-card";
import type { BusinessView } from "@/types";

export function Discovery({
  title,
  href,
  businesses,
  empty,
}: {
  title: string;
  href: string;
  businesses: BusinessView[];
  empty: string;
}) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="font-display text-3xl font-bold text-ink">{title}</h2>
        <Link href={href} className="shrink-0 text-sm font-bold text-olive">
          לכל העסקים
        </Link>
      </div>
      {businesses.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line bg-card px-5 py-8 text-sm leading-6 text-muted">{empty}</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">{businesses.map((business) => <BusinessCard key={business.id} business={business} />)}</div>
      )}
    </section>
  );
}
