"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUserEmail, currentUserId } from "@/lib/auth-user";
import { actionError } from "@/lib/errors";
import { updateOwnedBusiness } from "@/lib/repositories/mutations";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { cleanBlock, cleanLine, isPhone, parseHours } from "@/lib/validators";
import type { ActionState } from "@/types";

export async function ownerLoginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "התחברות בעלים זמינה אחרי חיבור Supabase." };
  const email = cleanLine(formData.get("email"), 120).toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "הזינו אימייל וסיסמה." };
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "לא הצלחנו להתחבר. אם עוד אין לכם חשבון, שלחו קודם בקשת בעלות." };
  redirect("/my-business");
}

export async function ownerLogoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
  }
  redirect("/my-business");
}

export async function ownerSaveAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const userId = await currentUserId();
    if (!userId) return { error: "צריך להתחבר כדי לערוך." };
    const businessId = cleanLine(formData.get("businessId"), 80);
    const shortDescription = cleanLine(formData.get("shortDescription"), 160);
    const description = cleanBlock(formData.get("description"), 2000);
    const phone = cleanLine(formData.get("phone"), 30);
    const whatsapp = cleanLine(formData.get("whatsapp"), 30);
    if (shortDescription.length < 2) return { error: "חסר תיאור קצר." };
    if (phone && !isPhone(phone)) return { error: "מספר הטלפון לא נראה תקין." };
    if (whatsapp && !isPhone(whatsapp)) return { error: "מספר הוואטסאפ לא נראה תקין." };
    const hours = parseHours(String(formData.get("hours") ?? "[]"));
    if (!hours) return { error: "שעות הפעילות לא תקינות." };
    await updateOwnedBusiness(userId, businessId, {
      shortDescription,
      description: description || shortDescription,
      phone: phone || null,
      whatsapp: whatsapp || null,
      address: cleanLine(formData.get("address"), 180) || null,
      showExactAddress: formData.get("showExactAddress") === "on",
      hours,
    });
    revalidatePath("/", "layout");
    return { success: true, message: `הפרטים של ${await currentUserEmail()} נשמרו.` };
  } catch (error) {
    return { error: actionError(error) };
  }
}
