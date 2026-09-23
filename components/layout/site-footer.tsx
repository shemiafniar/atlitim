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
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm leading-6 text-muted">מקום אחד לגלות את העסקים של עתלית, ולהשאיר את הכסף אצל השכנים.</p>
          {demoMode ? (
            <p className="mt-3 text-sm leading-6 text-ink">העסקים שמופיעים כרגע הם נתוני הדגמה, כדי שאפשר יהיה להכיר את המוצר לפני חיבור המאגר.</p>
          ) : null}
        </div>
        <nav aria-label="קישורים" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-olive">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-line/80 px-4 py-3 text-center text-xs text-muted">Atlitim · נבנה עבור תושבי עתלית</div>
    </footer>
  );
}
