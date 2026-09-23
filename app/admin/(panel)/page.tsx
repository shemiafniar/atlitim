import Link from "next/link";
import { getDashboardCounts } from "@/lib/repositories";

export default async function AdminHome() {
  const counts = await getDashboardCounts();
  const cards = [
    ["עסקים פעילים", counts.activeBusinesses, "/admin/businesses"],
    ["פניות ממתינות", counts.pendingSubmissions, "/admin/submissions"],
    ["בקשות בעלות", counts.pendingClaims, "/admin/claims"],
    ["דיווחים פתוחים", counts.pendingReports, "/admin/reports"],
    ["קטגוריות פעילות", counts.categories, "/admin/categories"],
  ] as const;
  return (
    <div>
      <h1 className="font-display text-4xl font-bold">סקירה</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value, href]) => (
          <Link key={label} href={href} className="rounded-3xl border border-line bg-card p-5 shadow-card">
            <p className="text-sm font-bold text-muted">{label}</p>
            <p className="mt-2 font-display text-4xl font-bold">{value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
