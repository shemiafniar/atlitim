"use client";

import { useEffect } from "react";

export function track(name: string, props?: Record<string, string>) {
  if (!process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER) return;
  const body = JSON.stringify({ name, props: props ?? {} });
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
}

export function ViewTracker({ name, props }: { name: string; props?: Record<string, string> }) {
  const key = JSON.stringify(props ?? {});
  useEffect(() => {
    track(name, props);
    // The payload is captured for this view. A new key retriggers it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, key]);
  return null;
}
