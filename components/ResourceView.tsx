"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Search as SearchIcon, Eye } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { DataTable, type Column } from "./DataTable";
import { ModalForm } from "./ModalForm";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { DateBadge } from "./DateBadge";
import { Button, Input, Select } from "./ui";
import { getResource, type ColumnDef } from "@/lib/resources";
import { deleteRecord } from "@/lib/actions";
import { cn, isOverdue } from "@/lib/utils";
import { PRIORITY_OPTIONS } from "@/lib/constants";

type Row = Record<string, unknown> & { id: string };

const PAGE_SIZE = 10;
const DATE_KEYS = ["dueDate", "nextFollowUp", "followUpDueDate"];

function renderCell(col: ColumnDef, row: Row): React.ReactNode {
  const value = row[col.key];
  switch (col.type) {
    case "date":
      return <DateBadge value={value as string | null} highlight={DATE_KEYS.includes(col.key)} />;
    case "priority":
      return <PriorityBadge priority={String(value ?? "")} />;
    case "status":
      return <StatusBadge status={String(value ?? "")} />;
    case "yesno":
      return value ? (
        <span className="text-ok">Yes</span>
      ) : (
        <span className="font-medium text-warn">No</span>
      );
    case "truncate":
      return (
        <span className="block max-w-[220px] truncate text-warmgray" title={String(value ?? "")}>
          {String(value ?? "") || "—"}
        </span>
      );
    default:
      return <span>{String(value ?? "") || "—"}</span>;
  }
}

export function ResourceView({
  resourceKey,
  rows,
  detail,
  detailTitle,
}: {
  resourceKey: string;
  rows: Row[];
  detail?: (row: Row) => React.ReactNode;
  detailTitle?: (row: Row) => string;
}) {
  const resource = getResource(resourceKey);
  const router = useRouter();

  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [page, setPage] = React.useState(0);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Row | null>(null);
  const [deleting, setDeleting] = React.useState<Row | null>(null);
  const [viewing, setViewing] = React.useState<Row | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !resource.searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)))
        return false;
      if (filter && resource.filterField && String(r[resource.filterField.key] ?? "") !== filter)
        return false;
      if (priority && String(r.priority ?? "") !== priority) return false;
      return true;
    });
  }, [rows, query, filter, priority, resource]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  // Reset to the first page whenever a filter narrows the result set.
  const onQuery = (v: string) => {
    setQuery(v);
    setPage(0);
  };
  const onFilter = (v: string) => {
    setFilter(v);
    setPage(0);
  };
  const onPriority = (v: string) => {
    setPriority(v);
    setPage(0);
  };

  const columns: Column<Row>[] = [
    ...resource.columns.map((col) => ({
      key: col.key,
      label: col.label,
      render: (row: Row) => renderCell(col, row),
    })),
    {
      key: "_actions",
      label: "",
      align: "right" as const,
      render: (row: Row) => (
        <div className="flex justify-end gap-1">
          {detail && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewing(row);
              }}
              className="rounded-md p-1.5 text-warmgray hover:bg-cream hover:text-navy"
              aria-label="View"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(row);
              setFormOpen(true);
            }}
            className="rounded-md p-1.5 text-warmgray hover:bg-cream hover:text-navy"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleting(row);
            }}
            className="rounded-md p-1.5 text-warmgray hover:bg-danger-soft hover:text-danger"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  function rowClassName(row: Row): string {
    const status = String(row.status ?? "");
    const muted = ["Closed", "Completed", "Expired"].includes(status);
    if (muted) return "opacity-55";
    const overdue = DATE_KEYS.some((k) => row[k] && isOverdue(row[k] as string));
    const high = row.priority === "High";
    const crmMiss = "crmUpdated" in row && row.crmUpdated === false;
    return cn(
      overdue && "bg-danger-soft/40",
      !overdue && crmMiss && "bg-warn-soft/25",
      high && "border-l-2 border-l-danger"
    );
  }

  return (
    <>
      <SectionCard
        title={resource.title}
        description={`${filtered.length} of ${rows.length} shown`}
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add {resource.singular}
          </Button>
        }
        bodyClassName="pt-2"
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warmgray-light" />
            <Input
              className="pl-9"
              placeholder={`Search ${resource.title.toLowerCase()}…`}
              value={query}
              onChange={(e) => onQuery(e.target.value)}
            />
          </div>
          {resource.priorityFilter && (
            <Select
              className="w-auto min-w-[140px]"
              value={priority}
              onChange={(e) => onPriority(e.target.value)}
            >
              <option value="">All priorities</option>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          )}
          {resource.filterField && (
            <Select
              className="w-auto min-w-[160px]"
              value={filter}
              onChange={(e) => onFilter(e.target.value)}
            >
              <option value="">All {resource.filterField.label.toLowerCase()}</option>
              {resource.filterField.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          )}
        </div>

        <DataTable
          columns={columns}
          rows={pageRows}
          rowClassName={rowClassName}
          onRowClick={detail ? (row) => setViewing(row) : undefined}
          empty={
            rows.length === 0
              ? `No ${resource.title.toLowerCase()} yet — add your first one.`
              : "No matches for these filters."
          }
        />

        {pageCount > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-warmgray">
            <span>
              Page {current + 1} of {pageCount}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={current >= pageCount - 1}
                onClick={() => setPage(current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      <ModalForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        resource={resource}
        record={editing}
        onSaved={() => router.refresh()}
      />

      {detail && (
        <Modal
          open={!!viewing}
          onClose={() => setViewing(null)}
          title={viewing && detailTitle ? detailTitle(viewing) : resource.singular}
        >
          {viewing && detail(viewing)}
        </Modal>
      )}

      <ConfirmDialog
        open={!!deleting}
        title={`Delete ${resource.singular}?`}
        message="This permanently removes the record. This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting) await deleteRecord(resourceKey, deleting.id);
          setDeleting(null);
          router.refresh();
        }}
      />
    </>
  );
}
