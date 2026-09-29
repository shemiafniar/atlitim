import Link from "next/link";
import { toggleBusinessAction } from "@/lib/actions/admin";
import { listAllBusinesses } from "@/lib/repositories";
import { normalizeText } from "@/lib/utils";

export default async function AdminBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = (typeof params.q === "string" ? params.q : "").trim();
  const status = params.status === "active" || params.status === "inactive" ? params.status : "all";
  const featured = params.featured === "1";
  const businesses = (await listAllBusinesses())
    .filter((business) => (q ? normalizeText(`${business.name} ${business.slug} ${business.phone ?? ""}`).includes(normalizeText(q)) : true))
    .filter((business) => (status === "active" ? business.active : status === "inactive" ? !business.active : true))
    .filter((business) => (featured ? business.featured : true))
    .sort((a, b) => a.name.localeCompare(b.name, "he"));
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-bold">עסקים</h1>
        <Link href="/admin/businesses/new" className="inline-flex min-h-12 items-center rounded-full bg-olive px-5 text-sm font-bold text-white">
          עסק חדש
        </Link>
      </div>
      <form className="mt-4 grid gap-2 sm:grid-cols-[1fr_10rem_10rem_auto]" action="/admin/businesses">
        <input name="q" defaultValue={q} placeholder="חיפוש לפי שם או טלפון" className="min-h-12 w-full rounded-2xl border border-line bg-card px-4" />
        <select name="status" defaultValue={status} className="min-h-12 rounded-2xl border border-line bg-card px-3">
          <option value="all">כל המצבים</option>
          <option value="active">פעילים</option>
          <option value="inactive">מוסתרים</option>
        </select>
        <select name="featured" defaultValue={featured ? "1" : ""} className="min-h-12 rounded-2xl border border-line bg-card px-3">
          <option value="">הכול</option>
          <option value="1">מומלצים</option>
        </select>
        <button type="submit" className="min-h-12 rounded-full bg-olive px-4 text-sm font-bold text-white">סינון</button>
      </form>
      {businesses.length === 0 ? <p className="mt-6 rounded-3xl border border-dashed border-line bg-card px-5 py-8 text-sm">אין עסקים שמתאימים לסינון.</p> : null}
      <ul className="mt-5 grid gap-3">
        {businesses.map((business) => (
          <li key={business.id} className="rounded-3xl border border-line bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-bold">{business.name}</p>
                <p className="text-sm text-muted">{business.active ? "פעיל" : "מוסתר"} · {business.verified ? "מאומת" : "לא מאומת"} · {business.featured ? "מומלץ" : "רגיל"}</p>
              </div>
              <Link href={`/admin/businesses/${business.id}`} className="inline-flex min-h-11 items-center rounded-full bg-sand px-4 text-sm font-bold">
                עריכה
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Toggle id={business.id} flag="active" on={!business.active} label={business.active ? "הסתרה" : "הפעלה"} />
              <Toggle id={business.id} flag="verified" on={!business.verified} label={business.verified ? "ביטול אימות" : "אימות"} />
              <Toggle id={business.id} flag="featured" on={!business.featured} label={business.featured ? "הסרה מהמומלצים" : "הוספה למומלצים"} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Toggle({ id, flag, on, label }: { id: string; flag: string; on: boolean; label: string }) {
  return (
    <form action={toggleBusinessAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="flag" value={flag} />
      <input type="hidden" name="value" value={on ? "1" : "0"} />
      <button type="submit" className="min-h-11 rounded-full border border-line px-3 text-sm font-semibold">
        {label}
      </button>
    </form>
  );
}
