"use client";

import { useState } from "react";
import { initials, cn, isSafeImageUrl } from "@/lib/utils";

const palettes = [
  ["#0c4e4f", "#2a9d96"],
  ["#1d4a44", "#d7b48a"],
  ["#314844", "#8fb8b0"],
  ["#5c3a42", "#e7c3b0"],
  ["#1e3f4a", "#7eb8c9"],
];

function palette(seed: string) {
  let hash = 0;
  for (const char of seed) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return palettes[hash % palettes.length];
}

export function CoverArt({
  seed,
  label,
  imageUrl,
  className,
  showInitials = false,
}: {
  seed: string;
  label: string;
  imageUrl?: string | null;
  className?: string;
  showInitials?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const usable = Boolean(imageUrl && isSafeImageUrl(imageUrl) && !imageUrl.startsWith("gradient:"));
  if (usable && !failed) {
    return (
      <img
        src={imageUrl ?? undefined}
        alt={label}
        className={cn("h-full w-full object-cover", className)}
        onError={() => setFailed(true)}
      />
    );
  }
  const [from, to] = palette(`${seed}:${imageUrl ?? "cover"}`);
  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ backgroundImage: `linear-gradient(145deg, ${from}, ${to})` }}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <span className="absolute -start-6 -top-8 h-28 w-28 rounded-full bg-white/15" />
      <span className="absolute -bottom-8 end-0 h-24 w-24 rounded-full bg-black/10" />
      {showInitials ? (
        <span className="absolute inset-0 grid place-items-center font-wordmark text-3xl font-bold text-white/90">{initials(seed)}</span>
      ) : null}
    </div>
  );
}
