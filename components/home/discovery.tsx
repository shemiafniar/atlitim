import type { ReactNode } from "react";
import Link from "next/link";
import { BusinessCard } from "@/components/business/business-card";
import type { BusinessView } from "@/types";

export function Discovery({
  title,
  href,
  businesses,
  empty,
  icon,
}: {
  title: string;
  href: string;
  businesses: BusinessView[];
  empty: string;
  icon?: ReactNode;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-1.5 text-base font-bold text-ink sm:text-lg">
          {title}
          {icon}
        </h2>
        <Link href={href} className="shrink-0 text-xs font-semibold text-muted hover:text-olive">
          הצג הכל
        </Link>
      </div>
      {businesses.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-white px-4 py-6 text-sm leading-6 text-muted">{empty}</p>
      ) : (
        <div className="no-scrollbar -mx-4 flex min-w-0 snap-x gap-3 overflow-x-auto px-4 pb-2 xl:mx-0 xl:grid xl:grid-cols-2 xl:overflow-visible xl:px-0">
          {businesses.map((business, index) => (
            <div key={business.id} className={`w-[15.5rem] shrink-0 snap-start sm:w-[17rem] xl:w-auto ${index > 1 ? "xl:hidden" : ""}`}>
              <BusinessCard business={business} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
