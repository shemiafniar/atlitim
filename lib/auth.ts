import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";

const COOKIE = "atlitim_admin";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "dev-only-atlitim-session-secret";
}

export function demoPassword() {
  return process.env.DEMO_ADMIN_PASSWORD || "atlitim-demo";
}

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdmin(email: string) {
  return adminEmails().includes(email.trim().toLowerCase());
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signDemoToken() {
  const payload = Buffer.from(
    JSON.stringify({ email: "demo@atlitim.local", mode: "demo", exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

async function readDemoSession() {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      email?: string;
      mode?: string;
      exp?: number;
    };
    if (data.mode !== "demo" || !data.exp || data.exp < Date.now()) return null;
    return { email: data.email || "demo@atlitim.local" };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  if (!isSupabaseConfigured()) return readDemoSession();
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  if (!isAllowedAdmin(data.user.email)) return null;
  return { email: data.user.email.toLowerCase() };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function setDemoCookie() {
  const jar = await cookies();
  jar.set(COOKIE, signDemoToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearDemoCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
