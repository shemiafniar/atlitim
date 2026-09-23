import fs from "fs";
import path from "path";
import { SEED_VERSION, createSeedStore } from "@/data/seed";
import { describeOpenState, isOpenAt, isOpenFriday } from "@/lib/business-hours/hours";
import type { BusinessView, CatalogStore } from "@/types";

const filePath = path.join(process.cwd(), ".data", "store.json");
let memory: CatalogStore | null = null;

function load(): CatalogStore {
  try {
    if (fs.existsSync(filePath)) {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as CatalogStore;
      if (parsed.version === SEED_VERSION) return parsed;
    }
  } catch {
    if (memory) return structuredClone(memory);
  }
  return createSeedStore();
}

function persist(store: CatalogStore) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const temp = `${filePath}.tmp`;
    fs.writeFileSync(temp, JSON.stringify(store));
    fs.renameSync(temp, filePath);
    memory = null;
  } catch {
    memory = store;
  }
}

export function readDemoStore() {
  if (memory) return structuredClone(memory);
  const store = load();
  if (!fs.existsSync(filePath)) persist(store);
  return store;
}

export function updateDemoStore(mutator: (store: CatalogStore) => void) {
  const store = memory ? structuredClone(memory) : load();
  mutator(store);
  persist(store);
  return store;
}

export function assembleBusinesses(store: CatalogStore, now = new Date()): BusinessView[] {
  return store.businesses.map((business) => {
    const locality = store.localities.find((item) => item.id === business.localityId);
    if (!locality) throw new Error("Missing locality");
    const hours = store.hours.filter((item) => item.businessId === business.id);
    const openState = describeOpenState(hours, now);
    return {
      ...business,
      locality,
      categories: store.categoryLinks
        .filter((link) => link.businessId === business.id)
        .map((link) => ({
          category: store.categories.find((item) => item.id === link.categoryId)!,
          subcategory: link.subcategoryId
            ? (store.subcategories.find((item) => item.id === link.subcategoryId) ?? null)
            : null,
        }))
        .filter((item) => item.category),
      tags: store.businessTags
        .filter((link) => link.businessId === business.id)
        .map((link) => store.tags.find((tag) => tag.id === link.tagId))
        .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag)),
      hours,
      images: store.images
        .filter((image) => image.businessId === business.id)
        .sort((a, b) => a.displayOrder - b.displayOrder),
      recommendationCount: store.recommendations.filter((item) => item.businessId === business.id).length,
      openNow: isOpenAt(hours, now),
      openState,
      openFriday: isOpenFriday(hours),
    };
  });
}
