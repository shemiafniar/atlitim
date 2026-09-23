import { cookies } from "next/headers";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase";

export async function residentKey() {
  const jar = await cookies();
  const existing = jar.get("atlitim_resident")?.value;
  if (existing && /^[a-zA-Z0-9-]{16,80}$/.test(existing)) return existing;
  const key = crypto.randomUUID();
  jar.set("atlitim_resident", key, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === "production",
  });
  return key;
}

export async function currentUserId() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function currentUserEmail() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
}
