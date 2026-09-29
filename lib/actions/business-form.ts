import { listCategories, listLocalities, listSubcategories, listTags } from "@/lib/repositories";
import { storeImage } from "@/lib/media";
import {
  checked,
  cleanBlock,
  cleanLine,
  isEmail,
  isPhone,
  many,
  optionalUrl,
  parseCoordinate,
  parseHours,
  parseSlug,
} from "@/lib/validators";
import type { BusinessDraft } from "@/lib/repositories/mutations";

export async function draftFromForm(formData: FormData): Promise<BusinessDraft> {
  const name = cleanLine(formData.get("name"), 80);
  const shortDescription = cleanLine(formData.get("shortDescription"), 160);
  const description = cleanBlock(formData.get("description"), 2000) || shortDescription;
  if (name.length < 2) throw new Error("חסר שם העסק.");
  if (shortDescription.length < 2) throw new Error("חסר תיאור קצר.");
  const phone = cleanLine(formData.get("phone"), 30);
  const whatsapp = cleanLine(formData.get("whatsapp"), 30);
  const email = cleanLine(formData.get("email"), 120);
  if (phone && !isPhone(phone)) throw new Error("מספר הטלפון לא נראה תקין.");
  if (whatsapp && !isPhone(whatsapp)) throw new Error("מספר הוואטסאפ לא נראה תקין.");
  if (email && !isEmail(email)) throw new Error("כתובת האימייל לא נראית תקינה.");
  const website = optionalUrl(cleanLine(formData.get("website"), 300));
  const instagram = optionalUrl(cleanLine(formData.get("instagram"), 300));
  const facebook = optionalUrl(cleanLine(formData.get("facebook"), 300));
  if (cleanLine(formData.get("website"), 300) && !website) throw new Error("כתובת האתר לא תקינה.");
  if (cleanLine(formData.get("instagram"), 300) && !instagram) throw new Error("קישור האינסטגרם לא תקין.");
  if (cleanLine(formData.get("facebook"), 300) && !facebook) throw new Error("קישור הפייסבוק לא תקין.");
  const hours = parseHours(String(formData.get("hours") ?? "[]"));
  if (!hours) throw new Error("שעות הפעילות לא תקינות.");
  const latitude = parseCoordinate(cleanLine(formData.get("latitude"), 20), -90, 90);
  const longitude = parseCoordinate(cleanLine(formData.get("longitude"), 20), -180, 180);
  if (latitude === undefined || longitude === undefined) throw new Error("הקואורדינטות לא תקינות.");
  const [categories, knownSubs, localities, tags] = await Promise.all([
    listCategories(true),
    listSubcategories(true),
    listLocalities(true),
    listTags(),
  ]);
  const subcategoryIds = many(formData, "subcategoryId").filter((id) => knownSubs.some((item) => item.id === id));
  const categoryIds = many(formData, "categoryId").filter((id) => categories.some((item) => item.id === id));
  if (subcategoryIds.length === 0 && categoryIds.length === 0) throw new Error("בחרו לפחות קטגוריה אחת.");
  const requestedLocality = cleanLine(formData.get("localityId"), 80);
  const locality = localities.find((item) => item.id === requestedLocality) ?? localities.find((item) => item.isPrimary);
  if (!locality) throw new Error("לא נמצא יישוב פעיל לשיוך העסק.");
  const showExactAddress = checked(formData, "showExactAddress");
  const images: { url: string; alt: string }[] = [];
  const cover = formData.get("cover");
  let coverImageUrl: string | null | undefined;
  let logoUrl: string | null | undefined;
  if (cover instanceof File && cover.size > 0) {
    const url = await storeImage(cover, "covers");
    if (url) coverImageUrl = url;
  }
  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    const url = await storeImage(logo, "logos");
    if (url) logoUrl = url;
  }
  const galleryAlt = cleanLine(formData.get("galleryAlt"), 160) || `תמונה של ${name}`;
  const galleryFiles = formData.getAll("gallery").filter((file): file is File => file instanceof File && file.size > 0);
  for (const file of galleryFiles) {
    const url = await storeImage(file, "gallery");
    if (url) images.push({ url, alt: galleryAlt });
  }
  const imageEdits = many(formData, "existingImageId").map((id) => ({
    id,
    altText: cleanLine(formData.get(`imageAlt_${id}`), 160),
    displayOrder: Number(formData.get(`imageOrder_${id}`)) || 0,
  }));
  return {
    id: cleanLine(formData.get("id"), 80) || undefined,
    localityId: locality.id,
    name,
    slug: parseSlug(name, cleanLine(formData.get("slug"), 80)),
    shortDescription,
    description,
    phone: phone || null,
    whatsapp: whatsapp || null,
    email: email || null,
    website,
    instagram,
    facebook,
    address: showExactAddress ? cleanLine(formData.get("address"), 180) || null : null,
    latitude,
    longitude,
    showExactAddress,
    logoUrl,
    coverImageUrl,
    isHomeBusiness: checked(formData, "isHomeBusiness"),
    providesDelivery: checked(formData, "providesDelivery"),
    providesHomeService: checked(formData, "providesHomeService"),
    accessibility: checked(formData, "accessibility"),
    kosher: checked(formData, "kosher"),
    verified: checked(formData, "verified"),
    active: checked(formData, "active"),
    featured: checked(formData, "featured"),
    isDemo: formData.get("isDemo") === "1",
    subcategoryIds,
    bareCategoryIds: categoryIds,
    tagIds: many(formData, "tagId").filter((id) => tags.some((tag) => tag.id === id)),
    hours,
    images,
    imageEdits,
    deleteImageIds: many(formData, "deleteImage"),
  };
}
