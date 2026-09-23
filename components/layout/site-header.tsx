import Link from "next/link";
import { Menu } from "lucide-react";
import { Wordmark } from "@/components/layout/wordmark";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { btnClay } from "@/lib/constants";

const links = [
  { href: "/search", label: "עסקים" },
  { href: "/categories", label: "קטגוריות" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-[#f7f3ec]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Wordmark />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="ניווט ראשי">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-semibold text-ink hover:bg-sand">
              {link.label}
            </Link>
          ))}
          <Link href="/add-business" className={`${btnClay} ms-2 min-h-11 px-4 text-sm`}>
            הוספת עסק
          </Link>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/add-business" className={`${btnClay} min-h-11 px-4 text-sm`}>
            הוספת עסק
          </Link>
          <MobileMenu
            trigger={
              <span className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card">
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">פתיחת תפריט</span>
              </span>
            }
          />
        </div>
      </div>
    </header>
  );
}
