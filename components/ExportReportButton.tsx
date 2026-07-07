"use client";

import * as React from "react";
import { FileDown } from "lucide-react";
import { Button } from "./ui";
import { exportReportPdf } from "@/lib/pdfUtils";
import { logExport } from "@/lib/actions";

type Groups = { title: string; metrics: Record<string, number | string> }[];
type Executive = {
  topCompleted: string[];
  openRisks: string[];
  marketUpdates: string[];
  opportunities: string[];
  crmCleanup: string[];
};

export function ExportReportButton({
  groups,
  executive,
  rangeLabel,
}: {
  groups: Groups;
  executive: Executive;
  rangeLabel: string;
}) {
  const [busy, setBusy] = React.useState(false);
  return (
    <Button
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          exportReportPdf(groups, executive, rangeLabel);
          await logExport("Reporting Portal", rangeLabel);
        } finally {
          setBusy(false);
        }
      }}
    >
      <FileDown className="h-4 w-4" /> {busy ? "Preparing…" : "Export PDF"}
    </Button>
  );
}
