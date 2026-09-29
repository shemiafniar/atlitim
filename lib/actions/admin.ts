"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { draftFromForm } from "@/lib/actions/business-form";
import { clearDemoCookie, demoPassword, getAdminSession, isAllowedAdmin, setDemoCookie } from "@/lib/auth";
import { actionError } from "@/lib/errors";
import { logOps } from "@/lib/log";
import {
  approveSubmission,
  deleteBusiness,
  deleteTag,
  markClaim,
  markReport,
  markSubmission,
  moveCategory,
  moveSubcategory,
  saveBusiness,
  saveCategory,
  saveSubcategory,
  saveTag,
  setBusinessFlags,
} from "@/lib/repositories/mutations";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { cleanLine, parseSlug } from "@/lib/validators";
import type { ActionState } from "@/types";
import type { ReportStatus, SubmissionStatus } from "@/types";

function refresh() {
  revalidatePath("/", "layout");
}

async function guard() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const email = cleanLine(formData.get("email"), 120).toLowerCase();
  try {
    if (!isSupabaseConfigured()) {
      if (process.env.NODE_ENV === "production") return { error: "ניהול האתר דורש חיבור ל-Supabase." };
      if (!password || password !== demoPassword()) return { error: "הסיסמה לא נכונה." };
      await setDemoCookie();
    } else {
      if (!email || !password) return { error: "הזינו אימייל וסיסמה." };
      const supabase = await createSupabaseServer();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: "לא הצלחנו להתחבר. בדקו את האימייל והסיסמה." };
      const { data } = await supabase.auth.getUser();
      const userEmail = data.user?.email?.toLowerCase() ?? "";
      if (!isAllowedAdmin(userEmail)) {
        await supabase.auth.signOut();
        return { error: "החשבון הזה לא מורשה לניהול Atlitim." };
      }
    }
  } catch (error) {
    return { error: actionError(error) };
  }
  const next = cleanLine(formData.get("next"), 120);
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
  }
  await clearDemoCookie();
  redirect("/admin/login");
}

export async function saveBusinessAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await guard())) return { error: "אין הרשאה לבצע את הפעולה." };
  let destination = "/admin/businesses";
  try {
    const draft = await draftFromForm(formData);
    const submissionId = cleanLine(formData.get("submissionId"), 80);
    if (submissionId && !draft.id) draft.id = submissionId;
    const id = await saveBusiness(draft);
    if (submissionId) await markSubmission(submissionId, "approved", id);
    refresh();
    destination = submissionId ? "/admin/submissions" : `/admin/businesses/${id}?saved=1`;
  } catch (error) {
    return { error: actionError(error) };
  }
  redirect(destination);
}

export async function toggleBusinessAction(formData: FormData) {
  if (!(await guard())) redirect("/admin/login");
  const id = cleanLine(formData.get("id"), 80);
  const flag = cleanLine(formData.get("flag"), 20);
  const value = formData.get("value") === "1";
  if (!id || !["active", "verified", "featured"].includes(flag)) return;
  try {
    await setBusinessFlags(id, { [flag]: value });
    refresh();
  } catch (error) {
    console.error(error);
  }
  redirect("/admin/businesses");
}

async function statusAction(kind: "submission" | "claim" | "report", formData: FormData) {
  if (!(await guard())) redirect("/admin/login");
  const id = cleanLine(formData.get("id"), 80);
  const status = cleanLine(formData.get("status"), 20);
  const note = cleanLine(formData.get("note"), 300);
  try {
    if (kind === "submission" && (status === "rejected" || status === "pending")) {
      await markSubmission(id, status as SubmissionStatus, undefined, note);
    }
    if (kind === "claim" && (status === "approved" || status === "rejected")) {
      const result = await markClaim(id, status as SubmissionStatus, note);
      refresh();
      return { error: null as string | null, linked: result.linked };
    }
    if (kind === "report" && (status === "resolved" || status === "dismissed")) {
      await markReport(id, status as ReportStatus);
    }
    refresh();
    return { error: null as string | null, linked: false };
  } catch (error) {
    logOps(`${kind}-status`, error);
    return { error: actionError(error), linked: false };
  }
}

export async function submissionStatusAction(formData: FormData) {
  const id = cleanLine(formData.get("id"), 80);
  const result = await statusAction("submission", formData);
  redirect(result.error ? `/admin/submissions/${id}?error=${encodeURIComponent(result.error)}` : "/admin/submissions");
}

export async function claimStatusAction(formData: FormData) {
  const result = await statusAction("claim", formData);
  const params = new URLSearchParams();
  if (result.error) params.set("error", result.error);
  else if (!result.linked && formData.get("status") === "approved") params.set("linked", "0");
  const query = params.toString();
  redirect(query ? `/admin/claims?${query}` : "/admin/claims");
}

export async function reportStatusAction(formData: FormData) {
  const result = await statusAction("report", formData);
  redirect(result.error ? `/admin/reports?error=${encodeURIComponent(result.error)}` : "/admin/reports");
}

export async function approveSubmissionAction(formData: FormData) {
  if (!(await guard())) redirect("/admin/login");
  const id = cleanLine(formData.get("id"), 80);
  const note = cleanLine(formData.get("note"), 300);
  let destination = `/admin/submissions/${id}`;
  try {
    const result = await approveSubmission(id, note);
    refresh();
    destination = `/admin/businesses/${result.businessId}?saved=1`;
  } catch (error) {
    logOps("approve-submission", error);
    destination = `/admin/submissions/${id}?error=${encodeURIComponent(actionError(error))}`;
  }
  redirect(destination);
}

export async function deleteBusinessAction(formData: FormData) {
  if (!(await guard())) redirect("/admin/login");
  const id = cleanLine(formData.get("id"), 80);
  if (formData.get("confirm") !== "yes") {
    redirect(`/admin/businesses/${id}?error=${encodeURIComponent("סמנו אישור למחיקה לצמיתות.")}`);
  }
  let destination = "/admin/businesses";
  try {
    await deleteBusiness(id);
    refresh();
  } catch (error) {
    logOps("delete-business", error);
    destination = `/admin/businesses/${id}?error=${encodeURIComponent(actionError(error))}`;
  }
  redirect(destination);
}

export async function categoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await guard())) return { error: "אין הרשאה לבצע את הפעולה." };
  try {
    const name = cleanLine(formData.get("name"), 40);
    if (name.length < 2) return { error: "חסר שם קטגוריה." };
    const slug = parseSlug(name, cleanLine(formData.get("slug"), 60));
    const icon = cleanLine(formData.get("icon"), 40) || "Store";
    await saveCategory({
      id: cleanLine(formData.get("id"), 80) || undefined,
      name,
      slug,
      icon,
      isActive: formData.get("isActive") === "on" || formData.get("isActive") === "1",
    });
    refresh();
    return { success: true, message: "הקטגוריה נשמרה." };
  } catch (error) {
    return { error: actionError(error) };
  }
}

export async function subcategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await guard())) return { error: "אין הרשאה לבצע את הפעולה." };
  try {
    const name = cleanLine(formData.get("name"), 40);
    const categoryId = cleanLine(formData.get("categoryId"), 80);
    if (name.length < 2 || !categoryId) return { error: "חסרים שם או קטגוריה." };
    await saveSubcategory({
      id: cleanLine(formData.get("id"), 80) || undefined,
      categoryId,
      name,
      slug: parseSlug(name, cleanLine(formData.get("slug"), 60)),
      isActive: formData.get("isActive") === "on" || formData.get("isActive") === "1",
    });
    refresh();
    return { success: true, message: "תת־הקטגוריה נשמרה." };
  } catch (error) {
    return { error: actionError(error) };
  }
}

export async function reorderAction(formData: FormData) {
  if (!(await guard())) redirect("/admin/login");
  const id = cleanLine(formData.get("id"), 80);
  const direction = formData.get("direction") === "up" ? -1 : 1;
  const kind = cleanLine(formData.get("kind"), 20);
  try {
    if (kind === "category") await moveCategory(id, direction);
    if (kind === "subcategory") await moveSubcategory(id, direction);
    refresh();
  } catch (error) {
    console.error(error);
  }
  redirect("/admin/categories");
}

export async function tagAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await guard())) return { error: "אין הרשאה לבצע את הפעולה." };
  try {
    const name = cleanLine(formData.get("name"), 40);
    if (name.length < 2) return { error: "חסר שם לתגית." };
    await saveTag({
      id: cleanLine(formData.get("id"), 80) || undefined,
      name,
      slug: parseSlug(name, cleanLine(formData.get("slug"), 60)),
    });
    refresh();
    return { success: true, message: "התגית נשמרה." };
  } catch (error) {
    return { error: actionError(error) };
  }
}

export async function deleteTagAction(formData: FormData) {
  if (!(await guard())) redirect("/admin/login");
  try {
    await deleteTag(cleanLine(formData.get("id"), 80));
    refresh();
  } catch (error) {
    console.error(error);
  }
  redirect("/admin/tags");
}
