import { ANALYTICS_EVENTS, type AnalyticsEventName } from "@/lib/analytics";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER) return new NextResponse(null, { status: 204 });
  let payload: { name?: string; props?: Record<string, string> };
  try {
    payload = (await request.json()) as { name?: string; props?: Record<string, string> };
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!payload.name || !ANALYTICS_EVENTS.includes(payload.name as AnalyticsEventName)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const webhook = process.env.ANALYTICS_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: payload.name, props: payload.props ?? {}, at: new Date().toISOString() }),
    }).catch((error) => {
      console.error(error);
    });
  }
  return new NextResponse(null, { status: 204 });
}
