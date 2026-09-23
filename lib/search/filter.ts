import { normalizeText } from "@/lib/utils";
import type { BusinessView, SearchFilters } from "@/types";

export function emptyFilters(partial: Partial<SearchFilters> = {}): SearchFilters {
  return {
    q: "",
    openNow: false,
    delivery: false,
    homeService: false,
    homeBusiness: false,
    accessibility: false,
    openFriday: false,
    ...partial,
  };
}

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function parseFilters(
  params: Record<string, string | string[] | undefined>,
  lockedCategory?: string,
): SearchFilters {
  const flag = (key: string) => first(params[key]) === "1";
  return {
    q: first(params.q),
    category: lockedCategory || first(params.category) || undefined,
    subcategory: first(params.subcategory) || undefined,
    openNow: flag("openNow"),
    delivery: flag("delivery"),
    homeService: flag("homeService"),
    homeBusiness: flag("homeBusiness"),
    accessibility: flag("accessibility"),
    openFriday: flag("openFriday"),
  };
}

export function filtersToQuery(filters: SearchFilters, options?: { omitCategory?: boolean }) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category && !options?.omitCategory) params.set("category", filters.category);
  if (filters.subcategory) params.set("subcategory", filters.subcategory);
  if (filters.openNow) params.set("openNow", "1");
  if (filters.delivery) params.set("delivery", "1");
  if (filters.homeService) params.set("homeService", "1");
  if (filters.homeBusiness) params.set("homeBusiness", "1");
  if (filters.accessibility) params.set("accessibility", "1");
  if (filters.openFriday) params.set("openFriday", "1");
  return params.toString();
}

function haystack(business: BusinessView) {
  return normalizeText(
    [
      business.name,
      business.shortDescription,
      business.description,
      ...business.categories.flatMap((item) => [item.category.name, item.subcategory?.name ?? ""]),
      ...business.tags.map((tag) => tag.name),
    ].join(" "),
  );
}

function score(business: BusinessView, query: string) {
  if (!query) return 1;
  const name = normalizeText(business.name);
  if (name === query) return 100;
  if (name.startsWith(query)) return 90;
  if (name.includes(query)) return 80;
  const short = normalizeText(business.shortDescription);
  if (short.includes(query)) return 60;
  const categories = normalizeText(
    business.categories.map((item) => `${item.category.name} ${item.subcategory?.name ?? ""}`).join(" "),
  );
  if (categories.includes(query)) return 55;
  const tags = normalizeText(business.tags.map((tag) => tag.name).join(" "));
  if (tags.includes(query)) return 50;
  if (normalizeText(business.description).includes(query)) return 40;
  if (haystack(business).includes(query)) return 30;
  return 0;
}

export function filterBusinesses(businesses: BusinessView[], filters: SearchFilters) {
  const query = normalizeText(filters.q);
  return businesses
    .filter((business) => business.active && business.locality.isPrimary && business.locality.isActive)
    .filter((business) => {
      if (filters.category && !business.categories.some((item) => item.category.slug === filters.category && item.category.isActive)) {
        return false;
      }
      if (
        filters.subcategory &&
        !business.categories.some((item) => item.subcategory?.slug === filters.subcategory && item.subcategory?.isActive)
      ) {
        return false;
      }
      if (filters.openNow && !business.openNow) return false;
      if (filters.delivery && !business.providesDelivery) return false;
      if (filters.homeService && !business.providesHomeService) return false;
      if (filters.homeBusiness && !business.isHomeBusiness) return false;
      if (filters.accessibility && !business.accessibility) return false;
      if (filters.openFriday && !business.openFriday) return false;
      if (!query) return true;
      return score(business, query) > 0;
    })
    .sort((a, b) => {
      if (query) {
        const diff = score(b, query) - score(a, query);
        if (diff) return diff;
      } else if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return a.name.localeCompare(b.name, "he");
    });
}

export function activeFilterCount(filters: SearchFilters, omitCategory = false) {
  return [
    Boolean(filters.q),
    Boolean(filters.category) && !omitCategory,
    Boolean(filters.subcategory),
    filters.openNow,
    filters.delivery,
    filters.homeService,
    filters.homeBusiness,
    filters.accessibility,
    filters.openFriday,
  ].filter(Boolean).length;
}
