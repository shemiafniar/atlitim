import fs from "fs";
import path from "path";
import { logOps } from "@/lib/log";
import { createSupabaseAdmin, demoCatalogEnabled, hasServiceRole, isSupabaseConfigured } from "@/lib/supabase";

async function sniff(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const jpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const webp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45;
  if (png) return { ext: "png", type: "image/png" };
  if (jpg) return { ext: "jpg", type: "image/jpeg" };
  if (webp) return { ext: "webp", type: "image/webp" };
  return null;
}

export async function storeImage(file: File, folder: string) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("התמונה גדולה מדי. אפשר עד 2MB.");
  }
  const kind = await sniff(file);
  if (!kind) throw new Error("אפשר להעלות תמונת JPG, PNG או WEBP.");
  const safeFolder = folder.replace(/[^a-z0-9/-]/gi, "").replace(/\.\./g, "");
  const filename = `${crypto.randomUUID()}.${kind.ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  if (isSupabaseConfigured()) {
    if (!hasServiceRole()) throw new Error("missing-service-role");
    const admin = createSupabaseAdmin();
    const storagePath = `${safeFolder}/${filename}`;
    const { error } = await admin.storage.from("business-images").upload(storagePath, bytes, {
      contentType: kind.type,
      upsert: false,
    });
    if (error) {
      logOps("image-upload", error);
      throw new Error("לא הצלחנו לשמור את התמונה בענן.");
    }
    const { data } = admin.storage.from("business-images").getPublicUrl(storagePath);
    return data.publicUrl;
  }

  if (!demoCatalogEnabled()) throw new Error("לא הצלחנו לשמור את התמונה.");

  const dir = path.join(process.cwd(), ".data", "uploads", safeFolder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), bytes);
  return `/api/media/${safeFolder}/${filename}`;
}

export function storagePathFromPublicUrl(url: string) {
  const marker = "/business-images/";
  const index = url.indexOf(marker);
  if (index < 0) return null;
  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

export async function removeStoredImage(url: string) {
  if (!url || !isSupabaseConfigured() || !hasServiceRole()) return;
  const storagePath = storagePathFromPublicUrl(url);
  if (!storagePath || storagePath.includes("..")) return;
  const { error } = await createSupabaseAdmin().storage.from("business-images").remove([storagePath]);
  if (error) logOps("image-remove", error);
}
