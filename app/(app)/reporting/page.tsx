import { requireUserId } from "@/lib/auth";
import { getReportData, resolveRange } from "@/lib/reportUtils";
import { ReportCard } from "@/components/ReportCard";
import { RangeTabs } from "@/components/RangeTabs";
import { ExportReportButton } from "@/components/ExportReportButton";
import { SectionCard } from "@/components/SectionCard";

export default async function ReportingPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const userId = await requireUserId();
  const sp = await searchParams;
  const range = resolveRange(sp.range ?? "week", sp.from, sp.to);
  const data = await getReportData(userId, range);

  const groups = [
    { title: "Sales Activity", metrics: data.salesActivity },
    { title: "Customer Issues", metrics: data.customerIssueReport },
    { title: "Market Intelligence", metrics: data.marketReport },
    { title: "CRM Hygiene", metrics: data.crmHygiene },
  ];

  const execSections: [string, string[]][] = [
    ["Top Priorities Completed", data.executive.topCompleted],
    ["Open Risks", data.executive.openRisks],
    ["Market Updates", data.executive.marketUpdates],
    ["Opportunities to Pursue", data.executive.opportunities],
    ["CRM Cleanup Items", data.executive.crmCleanup],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <RangeTabs />
          <p className="mt-2 text-sm text-warmgray">Showing: {range.label}</p>
        </div>
        <ExportReportButton
          groups={groups}
          executive={data.executive}
          rangeLabel={range.label}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {groups.map((g) => (
          <ReportCard key={g.title} title={g.title} metrics={g.metrics} />
        ))}
      </div>

      <SectionCard
        title="Weekly Executive Summary"
        description="The one-glance narrative of the period."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {execSections.map(([heading, items]) => (
            <div key={heading}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-warmgray">
                {heading} · {items.length}
              </h3>
              {items.length === 0 ? (
                <p className="text-sm text-warmgray-light">None.</p>
              ) : (
                <ul className="space-y-1.5">
                  {items.map((it, idx) => (
                    <li
                      key={idx}
                      className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
