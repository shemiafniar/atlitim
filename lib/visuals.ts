import { isSafeImageUrl } from "@/lib/utils";

const cover = (name: string) => `/images/covers/${name}.jpg`;

const bySlug: Record<string, string[]> = {
  "pizzeria-hakikar": [cover("pizza"), cover("kitchen"), cover("cafe")],
  "cafe-moran": [cover("cafe"), cover("bakery"), cover("pizza")],
  "rina-kitchen": [cover("kitchen"), cover("cafe"), cover("bakery")],
  "dagan-bakery": [cover("bakery"), cover("cafe"), cover("kitchen")],
  "yossi-electric": [cover("trades"), cover("plumbing"), cover("office")],
  "carmel-plumbing": [cover("plumbing"), cover("trades"), cover("clean")],
  "liat-cleaning": [cover("clean"), cover("garden"), cover("health")],
  "quiet-pest": [cover("trades"), cover("garden"), cover("plumbing")],
  "or-salon": [cover("salon"), cover("barber"), cover("gifts")],
  "daniel-barber": [cover("barber"), cover("salon"), cover("cafe")],
  "atlit-football": [cover("kids"), cover("garden"), cover("party")],
  "noam-birthdays": [cover("party"), cover("bakery"), cover("kids")],
  "michal-sitter": [cover("clean"), cover("kids"), cover("study")],
  "tnuva-clinic": [cover("health"), cover("clean"), cover("salon")],
  "dr-bar-vet": [cover("pets"), cover("garden"), cover("clean")],
  "carmel-garage": [cover("auto"), cover("trades"), cover("plumbing")],
  "atlit-gardens": [cover("garden"), cover("clean"), cover("cafe")],
  "yael-lessons": [cover("study"), cover("office"), cover("kids")],
  "ronit-books": [cover("office"), cover("study"), cover("cafe")],
  "nor-gifts": [cover("gifts"), cover("bakery"), cover("salon")],
};

const byCategory: Record<string, string[]> = {
  food: [cover("pizza"), cover("cafe"), cover("kitchen")],
  trades: [cover("trades"), cover("plumbing"), cover("clean")],
  beauty: [cover("salon"), cover("barber"), cover("gifts")],
  kids: [cover("kids"), cover("party"), cover("study")],
  health: [cover("health"), cover("clean"), cover("salon")],
  pets: [cover("pets"), cover("garden"), cover("clean")],
  auto: [cover("auto"), cover("trades"), cover("plumbing")],
  home: [cover("garden"), cover("clean"), cover("cafe")],
  studies: [cover("study"), cover("office"), cover("kids")],
  events: [cover("party"), cover("bakery"), cover("gifts")],
  professional: [cover("office"), cover("study"), cover("cafe")],
  shopping: [cover("gifts"), cover("bakery"), cover("cafe")],
};

function isPhoto(url?: string | null) {
  return Boolean(url && isSafeImageUrl(url) && !url.startsWith("gradient:"));
}

function pool(slug: string, category?: string | null) {
  return bySlug[slug] ?? (category ? byCategory[category] : undefined) ?? byCategory.food;
}

export function businessCover(slug: string, category: string | null | undefined, imageUrl?: string | null) {
  if (isPhoto(imageUrl)) return imageUrl as string;
  return pool(slug, category)[0];
}

export function businessGalleryImage(
  slug: string,
  category: string | null | undefined,
  imageUrl: string | null,
  order = 0,
) {
  if (isPhoto(imageUrl)) return imageUrl as string;
  const images = pool(slug, category);
  const fromGradient = imageUrl?.startsWith("gradient:") ? Number(imageUrl.slice("gradient:".length)) : Number.NaN;
  const index = Number.isFinite(fromGradient) ? Math.max(0, fromGradient - 1) : order;
  return images[index % images.length];
}
