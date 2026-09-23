import { claimStatusAction } from "@/lib/actions/admin";
import { listAllBusinesses, listClaims } from "@/lib/repositories";
import { formatDate } from "@/lib/utils";

export default async function ClaimsPage() {
  const [claims, businesses] = await Promise.all([listClaims(), listAllBusinesses()]);
  const pending = claims.filter((claim) => claim.status === "pending");
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">בקשות בעלות</h1>
      {pending.length === 0 ? <p className="mt-6 rounded-3xl border border-dashed border-line bg-card px-5 py-8 text-sm">אין בקשות בעלות שמחכות לטיפול.</p> : null}
      <ul className="mt-5 grid gap-3">
        {pending.map((claim) => {
          const business = businesses.find((item) => item.id === claim.businessId);
          return (
            <li key={claim.id} className="rounded-3xl border border-line bg-card p-4">
              <p className="text-lg font-bold">{business?.name ?? "עסק"}</p>
              <p className="mt-1 text-sm leading-6">{claim.claimantName} · {claim.phone} · {claim.email}</p>
              <p className="mt-2 text-sm leading-6">{claim.message}</p>
              <p className="mt-1 text-xs text-muted">{formatDate(claim.createdAt)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusForm id={claim.id} status="approved" label="אישור" />
                <StatusForm id={claim.id} status="rejected" label="דחייה" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatusForm({ id, status, label }: { id: string; status: string; label: string }) {
  return (
    <form action={claimStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className="min-h-11 rounded-full bg-olive px-4 text-sm font-bold text-white">
        {label}
      </button>
    </form>
  );
}
