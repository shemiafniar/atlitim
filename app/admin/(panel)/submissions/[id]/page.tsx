import { notFound } from "next/navigation";
import { submissionStatusAction } from "@/lib/actions/admin";
import { BusinessEditor } from "@/components/admin/business-editor";
import { listCategories, listSubcategories, listSubmissions, listTags } from "@/lib/repositories";

export default async function SubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [submissions, categories, subcategories, tags] = await Promise.all([
    listSubmissions(),
    listCategories(true),
    listSubcategories(true),
    listTags(),
  ]);
  const submission = submissions.find((item) => item.id === id);
  if (!submission) notFound();
  const category = categories.find((item) => item.id === submission.categoryId);
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-4xl font-bold">{submission.businessName}</h1>
        <p className="mt-2 text-sm text-muted">איש קשר: {submission.contactPerson} · {submission.phone}</p>
        {submission.imageUrl ? <img src={submission.imageUrl} alt="" className="mt-4 h-40 w-full rounded-3xl object-cover" /> : null}
      </div>
      {submission.status === "pending" ? (
        <>
          <section className="rounded-3xl border border-line bg-card p-4 sm:p-6">
            <h2 className="text-xl font-bold">פרסום אחרי עריכה</h2>
            <p className="mt-1 text-sm text-muted">אפשר לתקן פרטים לפני שהעסק עולה לאתר. הקטגוריה המקורית: {category?.name ?? "לא צוינה"}.</p>
            <div className="mt-4">
              <BusinessEditor
                categories={categories}
                subcategories={subcategories}
                tags={tags}
                submissionId={submission.id}
                defaults={{
                  name: submission.businessName,
                  shortDescription: submission.description.slice(0, 160),
                  description: submission.description,
                  phone: submission.phone,
                  whatsapp: submission.whatsapp,
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
