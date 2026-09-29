import Link from "next/link";
import { notFound } from "next/navigation";
import { approveSubmissionAction, submissionStatusAction } from "@/lib/actions/admin";
import { BusinessEditor } from "@/components/admin/business-editor";
import { listCategories, listLocalities, listSubcategories, listSubmissions, listTags } from "@/lib/repositories";

export default async function SubmissionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const [submissions, categories, subcategories, tags, localities] = await Promise.all([
    listSubmissions(),
    listCategories(true),
    listSubcategories(true),
    listTags(),
    listLocalities(true),
  ]);
  const submission = submissions.find((item) => item.id === id);
  if (!submission) notFound();
  const category = categories.find((item) => item.id === submission.categoryId);
  const error = typeof query.error === "string" ? query.error : "";
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-4xl font-bold">{submission.businessName}</h1>
        <p className="mt-2 text-sm text-muted">איש קשר: {submission.contactPerson} · {submission.phone}</p>
        <p className="mt-1 text-sm text-muted">קטגוריה: {category?.name ?? "לא צוינה"}</p>
        {submission.reviewerNote ? <p className="mt-2 text-sm">הערת בדיקה: {submission.reviewerNote}</p> : null}
        {submission.imageUrl ? <img src={submission.imageUrl} alt="" className="mt-4 h-40 w-full rounded-3xl object-cover" /> : null}
        {submission.createdBusinessId ? (
          <p className="mt-3 text-sm font-bold">
            <Link href={`/admin/businesses/${submission.createdBusinessId}`}>לעריכת העסק שנוצר</Link>
          </p>
        ) : null}
      </div>
      {error ? <p className="rounded-2xl bg-danger-bg px-4 py-3 text-sm font-semibold text-danger">{error}</p> : null}
      {submission.status === "pending" ? (
        <>
          <form action={approveSubmissionAction} className="rounded-3xl border border-line bg-card p-4">
            <input type="hidden" name="id" value={submission.id} />
            <h2 className="text-xl font-bold">אישור ויצירת עסק</h2>
            <p className="mt-1 text-sm leading-6 text-muted">נוצר עסק מוסתר במאגר, בלי כפילות אם הפעולה רצה שוב. אחר כך אפשר לערוך ולפרסם אותו.</p>
            <label className="mt-3 block text-sm font-bold">
              הערת בדיקה
              <input name="note" className="mt-1.5 min-h-12 w-full rounded-2xl border border-line px-4" />
            </label>
            <button className="mt-3 min-h-12 rounded-full bg-olive px-5 text-sm font-bold text-white" type="submit">
              אישור ויצירת עסק
            </button>
          </form>
          <section className="rounded-3xl border border-line bg-card p-4 sm:p-6">
            <h2 className="text-xl font-bold">עריכה לפני פרסום</h2>
            <p className="mt-1 text-sm text-muted">אפשר לתקן פרטים ולסמן את העסק כפעיל כדי לפרסם אותו מיד.</p>
            <div className="mt-4">
              <BusinessEditor
                categories={categories}
                subcategories={subcategories}
                tags={tags}
                localities={localities}
                submissionId={submission.id}
                defaults={{
                  name: submission.businessName,
                  shortDescription: submission.description.slice(0, 160),
                  description: submission.description,
                  phone: submission.phone,
                  whatsapp: submission.whatsapp,
                  categoryIds: submission.categoryId ? [submission.categoryId] : [],
                  subcategoryIds: submission.subcategoryId ? [submission.subcategoryId] : [],
                }}
              />
            </div>
          </section>
          <form action={submissionStatusAction} className="rounded-3xl border border-line bg-card p-4">
            <input type="hidden" name="id" value={submission.id} />
            <input type="hidden" name="status" value="rejected" />
            <label className="text-sm font-bold">
              הערת דחייה
              <input name="note" className="mt-1.5 min-h-12 w-full rounded-2xl border border-line px-4" />
            </label>
            <button className="mt-3 min-h-12 rounded-full bg-danger px-5 text-sm font-bold text-white" type="submit">
              דחיית הפנייה
            </button>
          </form>
        </>
      ) : (
        <p className="rounded-3xl bg-sand px-4 py-4 text-sm">הפנייה כבר סומנה כ{submission.status === "approved" ? "מאושרת" : "נדחית"}.</p>
      )}
    </div>
  );
}
