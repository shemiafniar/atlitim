"use client";

import { useState } from "react";
import { DAY_OPTIONS } from "@/lib/constants";

type Period = { dayOfWeek: number; openTime: string; closeTime: string };

const weekdayFallback: Period[] = [0, 1, 2, 3, 4].map((dayOfWeek) => ({
  dayOfWeek,
  openTime: "09:00",
  closeTime: "17:00",
}));

export function HoursEditor({ initial, useFallback = false }: { initial: Period[]; useFallback?: boolean }) {
  const [periods, setPeriods] = useState<Period[]>(initial.length || !useFallback ? initial : [...weekdayFallback, { dayOfWeek: 5, openTime: "09:00", closeTime: "13:00" }]);

  function update(index: number, patch: Partial<Period>) {
    setPeriods((current) => current.map((period, itemIndex) => (itemIndex === index ? { ...period, ...patch } : period)));
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-bold">שעות פעילות</legend>
      <input type="hidden" name="hours" value={JSON.stringify(periods)} />
      {DAY_OPTIONS.map((day) => {
        const rows = periods
          .map((period, index) => ({ period, index }))
          .filter((item) => item.period.dayOfWeek === day.id);
        return (
          <div key={day.id} className="rounded-2xl border border-line p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold">{day.label}</p>
              {rows.length === 0 ? <span className="text-xs text-muted">סגור</span> : null}
            </div>
            <div className="mt-2 grid gap-2">
              {rows.map(({ period, index }) => (
                <div key={`${day.id}-${index}`} className="flex flex-wrap items-center gap-2">
                  <input type="time" value={period.openTime.slice(0, 5)} onChange={(event) => update(index, { openTime: event.target.value })} className="min-h-11 rounded-xl border border-line px-2" aria-label={`פתיחה ${day.label}`} />
                  <span className="text-sm text-muted">עד</span>
                  <input type="time" value={period.closeTime === "24:00" ? "23:59" : period.closeTime.slice(0, 5)} onChange={(event) => update(index, { closeTime: event.target.value })} className="min-h-11 rounded-xl border border-line px-2" aria-label={`סגירה ${day.label}`} />
                  <button type="button" className="min-h-11 rounded-full px-3 text-sm font-semibold text-danger" onClick={() => setPeriods((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
                    הסרה
                  </button>
                </div>
              ))}
              {rows.length < 2 ? (
                <button
                  type="button"
                  className="min-h-11 self-start rounded-full bg-sand px-3 text-sm font-semibold"
                  onClick={() => setPeriods((current) => [...current, { dayOfWeek: day.id, openTime: day.id === 5 ? "09:00" : "09:00", closeTime: day.id === 5 ? "13:00" : "17:00" }])}
                >
                  הוספת שעות
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </fieldset>
  );
}
