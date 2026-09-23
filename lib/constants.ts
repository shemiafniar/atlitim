import type { ReportReason } from "@/types";

export const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"] as const;

export const DAY_OPTIONS = [
  { id: 0, label: "יום ראשון" },
  { id: 1, label: "יום שני" },
  { id: 2, label: "יום שלישי" },
  { id: 3, label: "יום רביעי" },
  { id: 4, label: "יום חמישי" },
  { id: 5, label: "יום שישי" },
  { id: 6, label: "שבת" },
] as const;

export const REPORT_REASONS: { id: ReportReason; label: string }[] = [
  { id: "wrong_phone", label: "טלפון שגוי" },
  { id: "incorrect_hours", label: "שעות לא נכונות" },
  { id: "business_closed", label: "העסק נסגר" },
  { id: "wrong_address", label: "כתובת לא נכונה" },
  { id: "other", label: "אחר" },
];

export const CATEGORY_ICONS = [
  "UtensilsCrossed",
  "Wrench",
  "Sparkles",
  "Baby",
  "HeartPulse",
  "PawPrint",
  "Car",
  "House",
  "GraduationCap",
  "PartyPopper",
  "Briefcase",
  "ShoppingBag",
  "Store",
  "Hammer",
  "Scissors",
  "Flower2",
  "Dumbbell",
  "Stethoscope",
] as const;

export const SEARCH_EXAMPLES = ["פיצה", "חשמלאי", "עוגת יום הולדת", "ספר", "חוג לילדים"];

export const btnPrimary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-olive px-5 text-base font-semibold text-white transition hover:bg-[#08393a] disabled:cursor-not-allowed disabled:opacity-60";

export const btnClay =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-olive px-5 text-base font-semibold text-white transition hover:bg-[#08393a] disabled:cursor-not-allowed disabled:opacity-60";

export const btnSecondary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-card px-5 text-base font-semibold text-ink transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-60";

export const btnGhost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold text-olive transition hover:bg-olive-soft";

export const fieldClass =
  "min-h-12 w-full rounded-2xl border border-line bg-white px-4 text-base text-ink outline-none transition placeholder:text-[#8a9693] focus:border-olive focus:ring-4 focus:ring-olive/10";

export const textAreaClass =
  "min-h-32 w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-[#8a9693] focus:border-olive focus:ring-4 focus:ring-olive/10";

export const categoryTones: Record<string, { bg: string; fg: string }> = {
  food: { bg: "#FDE7D6", fg: "#C4622D" },
  trades: { bg: "#F8E4C4", fg: "#C47A1A" },
  beauty: { bg: "#F8DCE8", fg: "#C45484" },
  kids: { bg: "#FBE3C8", fg: "#D4893A" },
  health: { bg: "#F8D4D8", fg: "#D14B62" },
  pets: { bg: "#DDF3E8", fg: "#2F9A68" },
  auto: { bg: "#D7ECFB", fg: "#2F74B8" },
  home: { bg: "#D9F3DE", fg: "#2E8F4E" },
  studies: { bg: "#E5F6D8", fg: "#3E8F3A" },
  events: { bg: "#E6E0FA", fg: "#7A64C4" },
  professional: { bg: "#F8E6D4", fg: "#C47A45" },
  shopping: { bg: "#FDE8D4", fg: "#E07A3D" },
};

export function categoryTone(slug: string) {
  return categoryTones[slug] ?? { bg: "#E7F4F2", fg: "#0c4e4f" };
}
