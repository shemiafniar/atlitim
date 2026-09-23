export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function uid(n: number) {
  return `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
}

export function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[״"׳'`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeText(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/\u0000/g, "").trim();
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function toTelHref(phone: string) {
  const digits = digitsOnly(phone);
  if (digits.startsWith("972")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+972${digits.slice(1)}`;
  return `tel:+${digits}`;
}

export function toWhatsAppHref(phone: string) {
  const digits = digitsOnly(phone);
  const normalized = digits.startsWith("972")
    ? digits
    : digits.startsWith("0")
      ? `972${digits.slice(1)}`
      : digits;
  return `https://wa.me/${normalized}`;
}

export function mapsHref(business: {
  showExactAddress: boolean;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
}) {
  if (!business.showExactAddress) return null;
  if (business.latitude != null && business.longitude != null) {
    return `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;
  }
  if (business.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`;
  }
  return null;
}

export function initials(name: string) {
  const clean = name.split(/[—–-]/)[0]?.trim() || name;
  const words = clean.split(/\s+/).filter((word) => word && word !== "של" && word !== "עם");
  const first = words[0]?.[0] ?? "ע";
  const second = words.length > 1 ? words[1]?.[0] : "";
  return `${first}${second ?? ""}`;
}

export function slugify(value: string) {
  const map: Record<string, string> = {
    א: "a",
    ב: "b",
    ג: "g",
    ד: "d",
    ה: "h",
    ו: "v",
    ז: "z",
    ח: "h",
    ט: "t",
    י: "y",
    כ: "k",
    ך: "k",
    ל: "l",
    מ: "m",
    ם: "m",
    נ: "n",
    ן: "n",
    ס: "s",
    ע: "a",
    פ: "p",
    ף: "p",
    צ: "tz",
    ץ: "tz",
    ק: "k",
    ר: "r",
    ש: "sh",
    ת: "t",
  };
  const latin = value
    .trim()
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return latin.slice(0, 60);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "medium",
    timeZone: "Asia/Jerusalem",
  }).format(new Date(iso));
}

export function businessesCountLabel(count: number) {
  if (count === 1) return "נמצא עסק אחד";
  return `נמצאו ${count} עסקים`;
}

export function recommendationLabel(count: number) {
  if (count === 0) return "עדיין אין המלצות";
  if (count === 1) return "תושב אחד ממליץ";
  return `${count} תושבים ממליצים`;
}

export function externalHref(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

export function isSafeImageUrl(value: string) {
  return (
    value.startsWith("/api/media/") ||
    value.startsWith("gradient:") ||
    value.startsWith("https://")
  );
}

const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
