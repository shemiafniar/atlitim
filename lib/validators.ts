import { sanitizeText, slugify, digitsOnly } from "@/lib/utils";
import { toMinutes } from "@/lib/business-hours/hours";
import type { DayOfWeek, ReportReason } from "@/types";

const reasons = new Set<ReportReason>([
  "wrong_phone",
  "incorrect_hours",
  "business_closed",
  "wrong_address",
  "other",
]);

export function cleanLine(value: FormDataEntryValue | null, max: number) {
  return sanitizeText(String(value ?? "")).replace(/\s+/g, " ").slice(0, max);
}

export function cleanBlock(value: FormDataEntryValue | null, max: number) {
  return sanitizeText(String(value ?? ""))
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line, index, all) => line.length > 0 || (index > 0 && all[index - 1]?.length))
    .join("\n")
    .slice(0, max);
}

export function isPhone(value: string) {
  const digits = digitsOnly(value);
  return digits.length >= 9 && digits.length <= 15;
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 120;
}

export function optionalUrl(value: string) {
  if (!value) return null;
  const withProtocol = value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString().slice(0, 300);
  } catch {
    return null;
  }
}

export function parseSlug(name: string, requested: string) {
  const slug = slugify(requested || name);
  return slug || `business-${Date.now().toString(36)}`;
}

export function parseReason(value: string): ReportReason | null {
  return reasons.has(value as ReportReason) ? (value as ReportReason) : null;
}

export interface HourInput {
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
}

export function parseHours(raw: string): HourInput[] | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const hours: HourInput[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") return null;
      const day = Number((item as { dayOfWeek?: unknown }).dayOfWeek);
      const openTime = String((item as { openTime?: unknown }).openTime ?? "");
      const closeTime = String((item as { closeTime?: unknown }).closeTime ?? "");
      if (!Number.isInteger(day) || day < 0 || day > 6) return null;
      if (toMinutes(openTime) == null || toMinutes(closeTime) == null) return null;
      if (openTime === closeTime) continue;
      hours.push({ dayOfWeek: day as DayOfWeek, openTime, closeTime });
    }
    return hours;
  } catch {
    return null;
  }
}

export function parseCoordinate(value: string, min: number, max: number) {
  if (!value.trim()) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) return undefined;
  return Number(number.toFixed(6));
}

export function checked(formData: FormData, name: string) {
  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}

export function many(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .map((value) => String(value))
    .filter(Boolean);
}
