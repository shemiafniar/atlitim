import Link from "next/link";
import { reportStatusAction } from "@/lib/actions/admin";
import { REPORT_REASONS } from "@/lib/constants";
import { listAllBusinesses, listReports } from "@/lib/repositories";
import { formatDate } from "@/lib/utils";

export default async function ReportsPage() {
  const [reports, businesses] = await Promise.all([listReports(), listAllBusinesses()]);
  const pending = reports.filter((report) => report.status === "pending");
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">דיווחים</h1>
      {pending.length === 0 ? <p className="mt-6 rounded-3xl border border-dashed border-line bg-card px-5 py-8 text-sm">אין דיווחים שמחכים לטיפול.</p> : null}
      <ul className="mt-5 grid gap-3">
        {pending.map((report) => {
          const business = businesses.find((item) => item.id === report.businessId);
          const reason = REPORT_REASONS.find((item) => item.id === report.reason)?.label ?? report.reason;
          return (
            <li key={report.id} className="rounded-3xl border border-line bg-card p-4">
              <p className="text-lg font-bold">{business ? <Link href={`/business/${business.slug}`}>{business.name}</Link> : "עסק"}</p>
              <p className="mt-1 text-sm font-semibold">{reason}</p>
              {report.details ? <p className="mt-2 text-sm leading-6">{report.details}</p> : null}
              {report.contact ? <p className="mt-1 text-sm text-muted">יצירת קשר: {report.contact}</p> : null}
              <p className="mt-1 text-xs text-muted">{formatDate(report.createdAt)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ReportButton id={report.id} status="resolved" label="טופל" />
                <ReportButton id={report.id} status="dismissed" label="סגירה" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ReportButton({ id, status, label }: { id: string; status: string; label: string }) {
  return (
    <form action={reportStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className="min-h-11 rounded-full border border-line px-4 text-sm font-bold">
        {label}
      </button>
    </form>
  );
}
