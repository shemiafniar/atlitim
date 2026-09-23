export function actionError(error: unknown) {
  if (error instanceof Error && /[\u0590-\u05FF]/.test(error.message)) return error.message;
  const code = error instanceof Error ? error.message : "";
  if (code === "slug-taken") return "הכתובת הזו כבר בשימוש. בחרו כתובת אחרת.";
  if (code === "bad-category") return "בחרו לפחות תת־קטגוריה אחת.";
  if (code === "missing-service-role") return "חסר מפתח שירות של Supabase, ולכן אי אפשר לשמור את שינוי הניהול.";
  if (code === "missing-business") return "לא מצאנו את הפריט שביקשתם לעדכן.";
  if (code === "forbidden") return "אין הרשאה לערוך את העסק הזה.";
  if (code === "demo-owner") return "עריכת בעלים תחובר אחרי חיבור Supabase ואישור בעלות.";
  return "לא הצלחנו לשמור כרגע. נסו שוב בעוד רגע.";
}
