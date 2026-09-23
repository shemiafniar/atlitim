"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { residentKey, currentUserId } from "@/lib/auth-user";
import { actionError } from "@/lib/errors";
import { storeImage } from "@/lib/media";
import { createClaim, createReport, createSubmission, recommendBusiness } from "@/lib/repositories/mutations";
import { getBusinessBySlug, listCategories, listSubcategories } from "@/lib/repositories";
import { rateLimit } from "@/lib/utils";
import { cleanBlock, cleanLine, isEmail, isPhone, parseReason } from "@/lib/validators";
import type { ActionState } from "@/types";

async function limit(scope: string, max: number) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return rateLimit(`${scope}:${ip}`, max, 10 * 60 * 1000);
}

export async function recommendAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    if (!(await limit("recommend", 30))) return { error: "אפשר להמליץ שוב בעוד כמה דקות." };
    const slug = cleanLine(formData.get("slug"), 80);
    const business = await getBusinessBySlug(slug);
    if (!business || !business.active) return { error: "העסק לא נמצא." };
    const key = await residentKey();
    const result = await recommendBusiness(business.id, key);
    revalidatePath(`/business/${slug}`);
    return {
      success: true,
      message: result.already ? "כבר המלצתם על העסק הזה. תודה." : "תודה, ההמלצה נרשמה.",
    };
  } catch (error) {
    return { error: actionError(error) };
  }
}

export async function reportAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    if (!(await limit("report", 8))) return { error: "קיבלנו כמה דיווחים מכם עכשיו. נסו שוב מאוחר יותר." };
    const slug = cleanLine(formData.get("slug"), 80);
    const business = await getBusinessBySlug(slug);
    if (!business) return { error: "העסק לא נמצא." };
    const reason = parseReason(cleanLine(formData.get("reason"), 40));
    if (!reason) return { error: "בחרו מה לא מעודכן." };
    const details = cleanBlock(formData.get("details"), 500);
    if (reason === "other" && details.length < 3) return { error: "ספרו בקצרה מה לא מדויק." };
    await createReport({
      businessId: business.id,
      reason,
      details: details || null,
      contact: cleanLine(formData.get("contact"), 80) || null,
    });
    return { success: true, message: "תודה, הדיווח הגיע לבדיקה. נעדכן את המידע אם צריך." };
  } catch (error) {
    return { error: actionError(error) };
  }
}

export async function claimAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    if (!(await limit("claim", 6))) return { error: "אפשר לשלוח עוד בקשה מאוחר יותר." };
    const slug = cleanLine(formData.get("slug"), 80);
    const business = await getBusinessBySlug(slug);
    if (!business) return { error: "העסק לא נמצא." };
    const claimantName = cleanLine(formData.get("claimantName"), 80);
    const phone = cleanLine(formData.get("phone"), 30);
    const email = cleanLine(formData.get("email"), 120);
    const message = cleanBlock(formData.get("message"), 500);
    if (claimantName.length < 2) return { error: "איך קוראים לכם?" };
    if (!isPhone(phone)) return { error: "צריך טלפון כדי שנוכל לחזור אליכם." };
    if (!isEmail(email)) return { error: "צריך אימייל תקין." };
    if (message.length < 4) return { error: "ספרו בקצרה מה הקשר שלכם לעסק." };
    await createClaim({
      businessId: business.id,
      claimantName,
      phone,
      email,
      message,
      claimantUserId: await currentUserId(),
    });
    return { success: true, message: "קיבלנו את הבקשה. ניצור קשר כדי לאשר את הבעלות." };
  } catch (error) {
    return { error: actionError(error) };
  }
}

export async function submitBusinessAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    if (!(await limit("submit", 5))) return { error: "אפשר לשלוח עוד עסק מאוחר יותר." };
    const businessName = cleanLine(formData.get("businessName"), 80);
    const description = cleanBlock(formData.get("description"), 500);
    const phone = cleanLine(formData.get("phone"), 30);
    const whatsapp = cleanLine(formData.get("whatsapp"), 30);
    const contactPerson = cleanLine(formData.get("contactPerson"), 80);
    const categoryId = cleanLine(formData.get("categoryId"), 80);
    const subcategoryId = cleanLine(formData.get("subcategoryId"), 80);
    if (businessName.length < 2) return { error: "חסר שם העסק." };
    if (description.length < 8) return { error: "ספרו בכמה מילים מה העסק מציע." };
    if (!isPhone(phone)) return { error: "צריך מספר טלפון תקין." };
    if (whatsapp && !isPhone(whatsapp)) return { error: "מספר הוואטסאפ לא נראה תקין." };
    if (contactPerson.length < 2) return { error: "איך קוראים לאיש הקשר?" };
    const categories = await listCategories(false);
    const subcategories = await listSubcategories(false);
    if (!categories.some((category) => category.id === categoryId)) return { error: "בחרו קטגוריה." };
    if (subcategoryId && !subcategories.some((item) => item.id === subcategoryId && item.categoryId === categoryId)) {
      return { error: "תת־הקטגוריה לא שייכת לקטגוריה שנבחרה." };
    }
    let imageUrl: string | null = null;
    let imageNote = "";
    const image = formData.get("image");
    if (image instanceof File && image.size > 0) {
      imageUrl = await storeImage(image, "submissions");
      if (!imageUrl) imageNote = " הפרטים נשמרו. את התמונה נוסיף כשאחסון הענן יהיה מוגדר.";
    }
    await createSubmission({
      businessName,
      categoryId,
      subcategoryId: subcategoryId || null,
      description,
      phone,
      whatsapp: whatsapp || null,
      contactPerson,
      imageUrl,
    });
    revalidatePath("/admin/submissions");
    return {
      success: true,
      message: `קיבלנו את הפרטים. נעבור עליהם לפני שהעסק יופיע באתר.${imageNote}`,
    };
  } catch (error) {
    return { error: actionError(error) };
  }
}
