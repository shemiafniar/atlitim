"use client";

import Link from "next/link";
import { useRef } from "react";
import { X } from "lucide-react";

const links = [
  { href: "/search", label: "עסקים" },
  { href: "/categories", label: "קטגוריות" },
  { href: "/add-business", label: "הוספת עסק" },
  { href: "/neighbors", label: "השכנים של עתלית" },
];

export function MobileMenu({ trigger }: { trigger: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="rounded-full" aria-haspopup="dialog" onClick={() => dialogRef.current?.showModal()}>
        {trigger}
      </button>
      <dialog
        ref={dialogRef}
        className="sheet"
        aria-label="תפריט"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="font-display text-2xl font-bold text-olive">Atlitim</p>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-sand" onClick={() => dialogRef.current?.close()} aria-label="סגירה">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3" aria-label="ניווט">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl px-4 py-4 text-lg font-semibold hover:bg-sand"
              onClick={() => dialogRef.current?.close()}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </dialog>
    </>
  );
}
