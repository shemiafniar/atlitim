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
  const businesses = (await listAllBusinesses())
    .filter((business) => (q ? normalizeText(`${business.name} ${business.slug}`).includes(normalizeText(q)) : true))
    .sort((a, b) => a.name.localeCompare(b.name, "he"));
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-bold">עסקים</h1>
        <Link href="/admin/businesses/new" className="inline-flex min-h-12 items-center rounded-full bg-olive px-5 text-sm font-bold text-white">
          עסק חדש
        </Link>
      </div>
      <form className="mt-4" action="/admin/businesses">
        <input name="q" defaultValue={q} placeholder="חיפוש לפי שם" className="min-h-12 w-full rounded-2xl border border-line bg-card px-4" />
      </form>
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
