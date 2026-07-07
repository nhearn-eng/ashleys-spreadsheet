"use client";

import * as React from "react";
import { FileDown } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { Button } from "./ui";
import { RESOURCES } from "@/lib/resources";
import {
  exportTablePdf,
  exportReportPdf,
  exportDailyPlanPdf,
  type PdfColumn,
} from "@/lib/pdfUtils";
import { logExport } from "@/lib/actions";

type Rows = Record<string, unknown>[];

function columnsFor(resourceKey: string): PdfColumn[] {
  return RESOURCES[resourceKey].columns.map((c) => ({
    header: c.label,
    key: c.key,
    format: c.type === "date" ? "date" : c.type === "yesno" ? "yesno" : "text",
  }));
}

export function ExportsPanel({
  datasets,
  dailyPlan,
  reportGroups,
  executive,
  rangeLabel,
}: {
  datasets: Record<string, Rows>;
  dailyPlan: Record<string, unknown> | null;
  reportGroups: { title: string; metrics: Record<string, number | string> }[];
  executive: {
    topCompleted: string[];
    openRisks: string[];
    marketUpdates: string[];
    opportunities: string[];
    crmCleanup: string[];
  };
  rangeLabel: string;
}) {
  const [busy, setBusy] = React.useState<string | null>(null);

  async function run(name: string, fn: () => void) {
    setBusy(name);
    try {
      fn();
      await logExport(name, rangeLabel);
    } finally {
      setBusy(null);
    }
  }

  const tableExports = Object.values(RESOURCES).map((r) => ({
    name: `${r.title} PDF`,
    description: `${datasets[r.key]?.length ?? 0} records`,
    action: () =>
      run(r.title, () =>
        exportTablePdf(r.title, columnsFor(r.key), datasets[r.key] ?? [])
      ),
  }));

  const otherExports = [
    {
      name: "Daily Plan PDF",
      description: "Today's plan and priorities",
      action: () => run("Daily Plan", () => exportDailyPlanPdf(dailyPlan)),
    },
    {
      name: "Reporting Portal PDF",
      description: "All summary metrics + executive summary",
      action: () =>
        run("Reporting Portal", () =>
          exportReportPdf(reportGroups, executive, rangeLabel)
        ),
    },
    {
      name: "Weekly Executive Summary PDF",
      description: "Priorities, risks, market, opportunities",
      action: () =>
        run("Weekly Executive Summary", () =>
          exportReportPdf(reportGroups, executive, rangeLabel)
        ),
    },
  ];

  const all = [...tableExports, ...otherExports];

  return (
    <SectionCard
      title="Export to PDF"
      description="Polished, branded, and generated privately in your browser — no data leaves the app."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((e) => (
          <div
            key={e.name}
            className="flex flex-col justify-between rounded-lg border border-line bg-white p-4"
          >
            <div>
              <p className="font-medium text-ink">{e.name}</p>
              <p className="mt-0.5 text-sm text-warmgray">{e.description}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3 self-start"
              disabled={busy === e.name}
              onClick={e.action}
            >
              <FileDown className="h-4 w-4" />
              {busy === e.name ? "Preparing…" : "Export"}
            </Button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
