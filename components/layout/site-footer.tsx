import Link from "next/link";
import { Logo } from "@/components/layout/wordmark";

const links = [
  { href: "/search", label: "עסקים" },
  { href: "/categories", label: "קטגוריות" },
  { href: "/add-business", label: "הוספת עסק" },
  { href: "/neighbors", label: "השכנים של עתלית" },
];

export function SiteFooter({ demoMode }: { demoMode: boolean }) {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg">
      <img src="/brand/decorative/wave-divider.svg" alt="" aria-hidden="true" className="h-10 w-full object-cover object-[center_62%] sm:h-14" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <img
          src="/brand/decorative/coastal-landscape.svg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-28 w-full object-cover object-bottom sm:block"
        />
        <img
          src="/brand/illustrations/carmel-hills.svg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute end-6 top-2 hidden h-16 w-16 md:block"
        />
        <img
          src="/brand/illustrations/birds.svg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute start-1/2 top-0 hidden h-10 w-10 md:block"
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo variant="footer" />
            <p className="mt-3 text-sm leading-6 text-muted">מקום אחד לגלות את העסקים של עתלית, ולהשאיר את הכסף אצל השכנים.</p>
            <p className="mt-2 text-sm font-semibold text-olive">קונים קרוב. מחזקים את עתלית.</p>
            {demoMode ? (
              <p className="mt-3 text-sm leading-6 text-ink">העסקים שמופיעים כרגע הם נתוני הדגמה, כדי שאפשר יהיה להכיר את המוצר לפני חיבור המאגר.</p>
            ) : null}
          </div>
          <nav aria-label="קישורים" className="relative flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-olive">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="relative border-t border-line/80 px-4 py-3 text-center text-xs text-muted">נבנה בעתלית, בשביל עתלית.</div>
    </footer>
  );
}
