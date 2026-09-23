import { DAY_NAMES } from "@/lib/constants";
import type { BusinessHour, DayOfWeek, OpenState } from "@/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function toMinutes(value: string) {
  const [hourRaw, minuteRaw] = value.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (hour === 24 && minute === 0) return 24 * 60;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return hour * 60 + minute;
}

export function formatClock(value: string) {
  const [hour, minute] = value.split(":");
  if (!hour || !minute) return value;
  if (hour === "24") return "00:00";
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

export function getJerusalemParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jerusalem",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  const dayIndex = WEEKDAYS.indexOf(weekday);
  return {
    dayOfWeek: (dayIndex < 0 ? 0 : dayIndex) as DayOfWeek,
    minutes: (hour % 24) * 60 + minute,
  };
}

function contains(now: number, open: number, close: number) {
  if (close === open) return false;
  if (close > open) return now >= open && now < close;
  return now >= open || now < close;
}

export function isOpenAt(hours: BusinessHour[], date = new Date()) {
  const now = getJerusalemParts(date);
  return hours.some((period) => {
    if (period.dayOfWeek !== now.dayOfWeek) return false;
    const open = toMinutes(period.openTime);
    const close = toMinutes(period.closeTime);
    if (open == null || close == null) return false;
    return contains(now.minutes, open, close);
  });
}

export function isOpenFriday(hours: BusinessHour[]) {
  return hours.some((period) => period.dayOfWeek === 5);
}

export function describeOpenState(hours: BusinessHour[], date = new Date()): OpenState {
  if (hours.length === 0) {
    return { open: false, label: "שעות יעודכנו בקרוב", detail: null };
  }
  const now = getJerusalemParts(date);
  const today = hours
    .filter((period) => period.dayOfWeek === now.dayOfWeek)
    .map((period) => ({
      ...period,
      open: toMinutes(period.openTime),
      close: toMinutes(period.closeTime),
    }))
    .filter((period) => period.open != null && period.close != null)
    .sort((a, b) => (a.open ?? 0) - (b.open ?? 0));

  for (const period of today) {
    if (contains(now.minutes, period.open as number, period.close as number)) {
      const allDay = period.openTime.startsWith("00:00") && (period.closeTime.startsWith("24:00") || period.closeTime.startsWith("23:59"));
      return {
        open: true,
        label: "פתוח עכשיו",
        detail: allDay ? "לאורך כל היום" : `עד ${formatClock(period.closeTime)}`,
      };
    }
  }

  const later = today.find((period) => (period.open as number) > now.minutes);
  if (later) {
    return {
      open: false,
      label: "סגור עכשיו",
      detail: `נפתח היום ב-${formatClock(later.openTime)}`,
    };
  }
  return { open: false, label: "סגור עכשיו", detail: null };
}

export function formatDayHours(periods: BusinessHour[]) {
  if (periods.length === 0) return "סגור";
  const allDay = periods.some(
    (period) => period.openTime.startsWith("00:00") && (period.closeTime.startsWith("24:00") || period.closeTime.startsWith("23:59")),
  );
  if (allDay && periods.length === 1) return "כל היום";
  return periods
    .slice()
    .sort((a, b) => a.openTime.localeCompare(b.openTime))
    .map((period) => `${formatClock(period.openTime)}–${formatClock(period.closeTime)}`)
    .join(", ");
}

export function groupHours(hours: BusinessHour[]) {
  return DAY_NAMES.map((label, day) => ({
    day: day as DayOfWeek,
    label,
    periods: hours.filter((period) => period.dayOfWeek === day),
  }));
}
