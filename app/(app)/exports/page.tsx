import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchRows } from "@/lib/queries";
import { getReportData, resolveRange } from "@/lib/reportUtils";
import { startOfToday, formatDate } from "@/lib/utils";
import { ExportsPanel } from "@/components/ExportsPanel";
import { SectionCard } from "@/components/SectionCard";

export default async function ExportsPage() {
  const userId = await requireUserId();
  const [
    issues,
    prospects,
    customers,
    marketIntel,
    opportunities,
    meetings,
    weeklyPriorities,
    dailyPlan,
    logs,
  ] = await Promise.all([
    fetchRows("customer-issues", userId),
    fetchRows("prospects", userId),
    fetchRows("customers", userId),
    fetchRows("market-intelligence", userId),
    fetchRows("opportunities", userId),
    fetchRows("meetings", userId),
    fetchRows("weekly-priorities", userId),
    prisma.dailyPlan.findUnique({
      where: { userId_date: { userId, date: startOfToday() } },
    }),
    prisma.reportExportLog.findMany({
      where: { userId },
      orderBy: { generatedAt: "desc" },
      take: 12,
    }),
  ]);

  const range = resolveRange("week");
  const report = await getReportData(userId, range);
  const reportGroups = [
    { title: "Sales Activity", metrics: report.salesActivity },
    { title: "Customer Issues", metrics: report.customerIssueReport },
    { title: "Market Intelligence", metrics: report.marketReport },
    { title: "CRM Hygiene", metrics: report.crmHygiene },
  ];

  const datasets: Record<string, Record<string, unknown>[]> = {
    "customer-issues": issues,
    prospects,
    customers,
    "market-intelligence": marketIntel,
    opportunities,
    meetings,
    "weekly-priorities": weeklyPriorities,
  };

  return (
    <div className="space-y-6">
      <ExportsPanel
        datasets={datasets}
        dailyPlan={dailyPlan as Record<string, unknown> | null}
        reportGroups={reportGroups}
        executive={report.executive}
        rangeLabel={range.label}
      />

      <SectionCard title="Recent Exports" description="Your export history.">
        {logs.length === 0 ? (
          <p className="py-4 text-sm text-warmgray">No exports yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {logs.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-ink">{l.reportType}</span>
                <span className="text-warmgray">
                  {l.dateRange && <span className="mr-3">{l.dateRange}</span>}
                  {formatDate(l.generatedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
