export const ANALYTICS_EVENTS = [
  "search",
  "business_profile_view",
  "whatsapp_click",
  "phone_click",
  "navigation_click",
  "recommendation",
  "business_submission",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export function analyticsEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER);
}
