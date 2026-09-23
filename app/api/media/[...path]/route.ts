import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await context.params;
  if (!parts?.length || parts.some((part) => part.includes("..") || part.includes("\\") || part.includes("/"))) {
    return new NextResponse("Not found", { status: 404 });
  }
  const root = path.resolve(process.cwd(), ".data", "uploads");
  const file = path.resolve(root, ...parts);
  if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    return new NextResponse("Not found", { status: 404 });
  }
  const ext = path.extname(file).toLowerCase();
  const type = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
  const data = fs.readFileSync(file);
  return new NextResponse(data, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
