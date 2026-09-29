/** Operational logs. Never include keys, tokens, cookies, or request headers. */
export function logOps(scope: string, error: unknown) {
  const record = error && typeof error === "object" ? (error as { message?: unknown; code?: unknown }) : null;
  const message = error instanceof Error ? error.message : typeof record?.message === "string" ? record.message : "unknown";
  const code = typeof record?.code === "string" ? record.code : undefined;
  console.error(`[atlitim] ${scope} failed`, code ? { code, message } : { message });
}
