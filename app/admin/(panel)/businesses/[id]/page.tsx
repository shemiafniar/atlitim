import { notFound } from "next/navigation";
import { deleteBusinessAction } from "@/lib/actions/admin";
import { BusinessEditor } from "@/components/admin/business-editor";
import { listAllBusinesses, listCategories, listLocalities, listSubcategories, listTags } from "@/lib/repositories";

export default async function EditBusinessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const [businesses, categories, subcategories, tags, localities] = await Promise.all([
    listAllBusinesses(),
    listCategories(true),
    listSubcategories(true),
    listTags(),
    listLocalities(true),
  ]);
  const business = businesses.find((item) => item.id === id);
  if (!business) notFound();
  const error = typeof query.error === "string" ? query.error : "";
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">{business.name}</h1>
      {query.saved === "1" ? <p className="mt-3 rounded-2xl bg-ok-bg px-4 py-3 text-sm font-semibold text-ok">העסק נשמר. {business.active ? "הוא גלוי באתר." : "הוא עדיין מוסתר מהאתר עד שתסמנו אותו כפעיל."}</p> : null}
      {error ? <p className="mt-3 rounded-2xl bg-danger-bg px-4 py-3 text-sm font-semibold text-danger">{error}</p> : null}
      <div className="mt-6 rounded-3xl border border-line bg-card p-4 sm:p-6">
        <BusinessEditor business={business} categories={categories} subcategories={subcategories} tags={tags} localities={localities} />
      </div>
      <form action={deleteBusinessAction} className="mt-4 rounded-3xl border border-danger/30 bg-card p-4">
        <input type="hidden" name="id" value={business.id} />
        <p className="text-sm font-bold">מחיקה לצמיתות</p>
        <p className="mt-1 text-sm leading-6 text-muted">ההסתרה משאירה את העסק במאגר. מחיקה מוחקת את העסק, השעות, התמונות והקשרים. אי אפשר לשחזר.</p>
        <label className="mt-3 flex min-h-11 items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="confirm" value="yes" required />
          אני מאשר מחיקה לצמיתות
        </label>
        <button type="submit" className="mt-3 min-h-11 rounded-full bg-danger px-4 text-sm font-bold text-white">
          מחיקת העסק
        </button>
      </form>
    </div>
  );
}
