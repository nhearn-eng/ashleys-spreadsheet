import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { APP_NAME } from "./constants";
import { formatDate } from "./utils";

const NAVY: [number, number, number] = [30, 47, 77];
const CREAM: [number, number, number] = [244, 239, 228];
const INK: [number, number, number] = [44, 43, 39];
const WARMGRAY: [number, number, number] = [122, 118, 110];

function addHeader(doc: jsPDF, title: string, rangeLabel?: string): number {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, w, 66, "F");
  doc.setTextColor(...CREAM);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(APP_NAME, 40, 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(title, 40, 50);

  doc.setFontSize(8);
  doc.setTextColor(210, 205, 195);
  const generated = `Generated ${formatDate(new Date())}`;
  doc.text(generated, w - 40, 26, { align: "right" });
  if (rangeLabel) doc.text(`Range: ${rangeLabel}`, w - 40, 40, { align: "right" });
  return 90;
}

function addFooters(doc: jsPDF) {
  const pages = doc.getNumberOfPages();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 213, 200);
    doc.line(40, h - 34, w - 40, h - 34);
    doc.setFontSize(8);
    doc.setTextColor(...WARMGRAY);
    doc.text("Confidential — Sales Command Center", 40, h - 20);
    doc.text(`Page ${i} of ${pages}`, w - 40, h - 20, { align: "right" });
  }
}

function tableStyles() {
  return {
    theme: "striped" as const,
    headStyles: { fillColor: NAVY, textColor: CREAM, fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: INK },
    alternateRowStyles: { fillColor: [250, 247, 240] as [number, number, number] },
    styles: { cellPadding: 5, overflow: "linebreak" as const },
    margin: { left: 40, right: 40 },
  };
}

export interface PdfColumn {
  header: string;
  key: string;
  format?: "date" | "yesno" | "text";
}

function cell(value: unknown, format?: string): string {
  if (format === "date") return formatDate(value as string) || "—";
  if (format === "yesno") return value ? "Yes" : "No";
  const s = String(value ?? "");
  return s.length ? s : "—";
}

/** Export a data table (Customer Issues, Prospects, etc.). */
export function exportTablePdf(
  title: string,
  columns: PdfColumn[],
  rows: Record<string, unknown>[]
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const startY = addHeader(doc, title);
  doc.setTextColor(...WARMGRAY);
  doc.setFontSize(9);
  doc.text(`${rows.length} record${rows.length === 1 ? "" : "s"}`, 40, startY - 8);

  autoTable(doc, {
    startY,
    head: [columns.map((c) => c.header)],
    body: rows.map((r) => columns.map((c) => cell(r[c.key], c.format))),
    ...tableStyles(),
  });
  addFooters(doc);
  doc.save(`${slug(title)}.pdf`);
}

type MetricGroup = { title: string; metrics: Record<string, number | string> };

/** Export the reporting portal: summary metric groups + executive summary. */
export function exportReportPdf(
  groups: MetricGroup[],
  executive: {
    topCompleted: string[];
    openRisks: string[];
    marketUpdates: string[];
    opportunities: string[];
    crmCleanup: string[];
  },
  rangeLabel: string
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = addHeader(doc, "Reporting Portal", rangeLabel);

  for (const g of groups) {
    autoTable(doc, {
      startY: y,
      head: [[g.title, ""]],
      body: Object.entries(g.metrics).map(([k, v]) => [k, String(v)]),
      columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
      ...tableStyles(),
    });
    // @ts-expect-error lastAutoTable is added by the plugin at runtime
    y = (doc.lastAutoTable?.finalY ?? y) + 18;
    if (y > doc.internal.pageSize.getHeight() - 120) {
      doc.addPage();
      y = 60;
    }
  }

  doc.addPage();
  y = addHeader(doc, "Weekly Executive Summary", rangeLabel);
  const sections: [string, string[]][] = [
    ["Top Priorities Completed", executive.topCompleted],
    ["Open Risks", executive.openRisks],
    ["Market Updates", executive.marketUpdates],
    ["Opportunities to Pursue", executive.opportunities],
    ["CRM Cleanup Items", executive.crmCleanup],
  ];
  doc.setFontSize(10);
  for (const [heading, items] of sections) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text(heading, 40, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...INK);
    if (items.length === 0) {
      doc.setTextColor(...WARMGRAY);
      doc.text("• None", 50, y);
      y += 16;
    } else {
      for (const it of items) {
        const lines = doc.splitTextToSize(`• ${it}`, doc.internal.pageSize.getWidth() - 100);
        doc.text(lines, 50, y);
        y += 14 * lines.length;
        if (y > doc.internal.pageSize.getHeight() - 60) {
          doc.addPage();
          y = 60;
        }
      }
    }
    y += 10;
  }
  addFooters(doc);
  doc.save("reporting-portal.pdf");
}

/** Export the current daily plan. */
export function exportDailyPlanPdf(plan: Record<string, unknown> | null) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const y = addHeader(doc, "Daily Plan");
  const p = plan ?? {};
  autoTable(doc, {
    startY: y,
    head: [["Section", "Detail"]],
    body: [
      ["Date", formatDate((p.date as string) ?? new Date())],
      ["Top Priority 1", String(p.top1 ?? "—")],
      ["Top Priority 2", String(p.top2 ?? "—")],
      ["Top Priority 3", String(p.top3 ?? "—")],
      ["Must Do", String(p.mustDo ?? "—")],
      ["Should Do", String(p.shouldDo ?? "—")],
      ["Would Be Nice", String(p.wouldBeNice ?? "—")],
      ["Notes", String(p.notes ?? "—")],
    ],
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 130 } },
    ...tableStyles(),
  });
  addFooters(doc);
  doc.save("daily-plan.pdf");
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
