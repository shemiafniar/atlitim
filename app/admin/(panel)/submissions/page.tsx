import Link from "next/link";
import { listSubmissions } from "@/lib/repositories";
import { formatDate } from "@/lib/utils";

const labels = { pending: "ממתין", approved: "אושר", rejected: "נדחה" };

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const all = params.status === "all";
  const items = (await listSubmissions()).filter((item) => (all ? true : item.status === "pending"));
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-bold">פניות</h1>
        <Link href={all ? "/admin/submissions" : "/admin/submissions?status=all"} className="text-sm font-bold text-olive">
          {all ? "רק ממתינות" : "כל הפניות"}
        </Link>
      </div>
      {items.length === 0 ? <Empty text="אין פניות שמחכות לטיפול." /> : null}
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/admin/submissions/${item.id}`} className="block rounded-3xl border border-line bg-card p-4">
              <p className="text-lg font-bold">{item.businessName}</p>
              <p className="mt-1 text-sm text-muted">{labels[item.status]} · {formatDate(item.createdAt)} · {item.contactPerson}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="mt-6 rounded-3xl border border-dashed border-line bg-card px-5 py-8 text-sm">{text}</p>;
}
