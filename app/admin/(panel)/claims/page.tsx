import Link from "next/link";
import { claimStatusAction } from "@/lib/actions/admin";
import { listAllBusinesses, listClaims } from "@/lib/repositories";
import { formatDate } from "@/lib/utils";

export default async function ClaimsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const [claims, businesses] = await Promise.all([listClaims(), listAllBusinesses()]);
  const pending = claims.filter((claim) => claim.status === "pending");
  const error = typeof params.error === "string" ? params.error : "";
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">בקשות בעלות</h1>
      {error ? <p className="mt-4 rounded-2xl bg-danger-bg px-4 py-3 text-sm font-semibold text-danger">{error}</p> : null}
      {params.linked === "0" ? <p className="mt-4 rounded-2xl bg-sand px-4 py-3 text-sm">הבקשה אושרה, אבל לא נמצא חשבון Supabase עם אותו אימייל, ולכן בעלות לא שויכה.</p> : null}
      {pending.length === 0 ? <p className="mt-6 rounded-3xl border border-dashed border-line bg-card px-5 py-8 text-sm">אין בקשות בעלות שמחכות לטיפול.</p> : null}
      <ul className="mt-5 grid gap-3">
        {pending.map((claim) => {
          const business = businesses.find((item) => item.id === claim.businessId);
          return (
            <li key={claim.id} className="rounded-3xl border border-line bg-card p-4">
              <p className="text-lg font-bold">{business ? <Link href={`/admin/businesses/${business.id}`}>{business.name}</Link> : "עסק"}</p>
              <p className="mt-1 text-sm leading-6">{claim.claimantName} · {claim.phone} · {claim.email}</p>
              <p className="mt-2 text-sm leading-6">{claim.message}</p>
              <p className="mt-1 text-xs text-muted">{formatDate(claim.createdAt)}</p>
              <form action={claimStatusAction} className="mt-3 grid gap-2">
                <input type="hidden" name="id" value={claim.id} />
                <label className="text-sm font-bold">
                  הערת בדיקה
                  <input name="note" className="mt-1.5 min-h-11 w-full rounded-2xl border border-line px-3" />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button type="submit" name="status" value="approved" className="min-h-11 rounded-full bg-olive px-4 text-sm font-bold text-white">אישור</button>
                  <button type="submit" name="status" value="rejected" className="min-h-11 rounded-full border border-line px-4 text-sm font-bold">דחייה</button>
                </div>
              </form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
