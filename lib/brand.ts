export const CATEGORY_ART: Record<string, string> = {
  food: "/brand/categories/category-food.svg",
  trades: "/brand/categories/category-professional.svg",
  beauty: "/brand/categories/category-beauty.svg",
  kids: "/brand/categories/category-kids.svg",
  health: "/brand/categories/category-health.svg",
  pets: "/brand/categories/category-pets.svg",
  auto: "/brand/categories/category-car.svg",
  home: "/brand/categories/category-home.svg",
  studies: "/brand/categories/category-education.svg",
  events: "/brand/categories/category-leisure.svg",
  professional: "/brand/categories/category-services.svg",
  shopping: "/brand/categories/category-shopping.svg",
};

export function categoryArt(slug: string) {
  return CATEGORY_ART[slug] ?? "/brand/categories/category-food.svg";
}

export function isLocalAtlit(locality?: { slug: string; isPrimary: boolean } | null) {
  return Boolean(locality?.isPrimary && locality.slug === "atlit");
}
