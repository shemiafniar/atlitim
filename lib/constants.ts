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
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-olive px-5 text-base font-semibold text-white transition hover:bg-[#163528] disabled:cursor-not-allowed disabled:opacity-60";

export const btnClay =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-clay px-5 text-base font-semibold text-white transition hover:bg-[#8b3c23] disabled:cursor-not-allowed disabled:opacity-60";

export const btnSecondary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-card px-5 text-base font-semibold text-ink transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-60";

export const btnGhost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold text-olive transition hover:bg-olive-soft";

export const fieldClass =
  "min-h-12 w-full rounded-2xl border border-line bg-card px-4 text-base text-ink outline-none transition placeholder:text-[#8a8176] focus:border-olive";

export const textAreaClass =
  "min-h-32 w-full rounded-2xl border border-line bg-card px-4 py-3 text-base text-ink outline-none transition placeholder:text-[#8a8176] focus:border-olive";
