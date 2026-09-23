import { initials, cn, isSafeImageUrl } from "@/lib/utils";

const palettes = [
  ["#1e4636", "#3f6d54"],
  ["#8a4630", "#c48462"],
  ["#3d3832", "#6f675d"],
  ["#5c3a42", "#8f6670"],
  ["#2d4a46", "#5d847c"],
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
  if (imageUrl && isSafeImageUrl(imageUrl) && !imageUrl.startsWith("gradient:")) {
    return <img src={imageUrl} alt={label} className={cn("h-full w-full object-cover", className)} />;
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
      <span className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-white/20" />
      {showInitials ? (
        <span className="absolute inset-0 grid place-items-center font-display text-3xl font-bold text-white/90">{initials(seed)}</span>
      ) : null}
    </div>
  );
}
