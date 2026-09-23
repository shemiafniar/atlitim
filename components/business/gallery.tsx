"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { CoverArt } from "@/components/cover-art";
import { businessGalleryImage } from "@/lib/visuals";
import type { BusinessImage } from "@/types";

export function Gallery({
  images,
  name,
  slug,
  category,
}: {
  images: BusinessImage[];
  name: string;
  slug: string;
  category?: string | null;
}) {
  const [active, setActive] = useState<BusinessImage | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  if (images.length === 0) return null;

  function open(image: BusinessImage) {
    setActive(image);
    dialogRef.current?.showModal();
  }

  return (
    <section>
      <h2 className="font-display text-2xl font-bold">גלריה</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {images.map((image) => (
          <li key={image.id}>
            <button type="button" className="block aspect-[4/3] w-full overflow-hidden rounded-2xl" onClick={() => open(image)}>
              <CoverArt seed={name} label={image.altText || name} imageUrl={businessGalleryImage(slug, category, image.imageUrl, image.displayOrder)} />
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dialogRef} className="lightbox" aria-label="תצוגת תמונה" onClose={() => setActive(null)}>
        {active ? (
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-ink">
              <CoverArt seed={name} label={active.altText || name} imageUrl={businessGalleryImage(slug, category, active.imageUrl, active.displayOrder)} className="h-full" />
            </div>
            <button
              type="button"
              className="absolute end-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-card text-ink"
              onClick={() => dialogRef.current?.close()}
              aria-label="סגירה"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="mt-3 text-center text-sm text-white">{active.altText}</p>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
