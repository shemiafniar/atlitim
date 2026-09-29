import Link from "next/link";
import { Menu, Plus, Search } from "lucide-react";
import { Logo } from "@/components/layout/wordmark";
import { MobileMenu } from "@/components/layout/mobile-menu";

const links = [
  { href: "/search", label: "עסקים" },
  { href: "/categories", label: "קטגוריות" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto grid h-[4.5rem] w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-2 px-3 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
        <Logo />
        <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="ניווט ראשי">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 text-sm font-semibold text-ink/80 transition hover:bg-sand hover:text-ink">
              {link.label}
            </Link>
          ))}
          <Link href="/neighbors" className="inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold text-ink/80 transition hover:bg-sand hover:text-ink">
            השכנים של עתלית
            <span className="ms-1.5 rounded-full bg-olive-soft px-1.5 py-0.5 text-[10px] font-bold text-olive">בקרוב</span>
          </Link>
        </nav>
        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <Link href="/search" className="hidden h-11 w-11 place-items-center rounded-full text-ink transition hover:bg-sand sm:grid" aria-label="חיפוש">
            <Search className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link href="/add-business" className="inline-flex min-h-11 items-center gap-1 rounded-full bg-olive px-3 text-sm font-bold text-white shadow-sm transition hover:bg-olive-deep sm:px-4">
            <Plus className="h-4 w-4" aria-hidden="true" />
            הוספת עסק
          </Link>
          <div className="lg:hidden">
            <MobileMenu
              trigger={
                <span className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">פתיחת תפריט</span>
                </span>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}
