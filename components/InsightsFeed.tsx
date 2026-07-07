"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Search as SearchIcon,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { SectionCard } from "./SectionCard";
import { ModalForm } from "./ModalForm";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button, Input, Select } from "./ui";
import { getResource } from "@/lib/resources";
import { deleteRecord } from "@/lib/actions";
import { INSIGHT_CATEGORY_OPTIONS } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";

type Insight = Record<string, unknown> & { id: string };

function Sentiment({ value }: { value: string }) {
  const cfg = {
    Up: { Icon: ArrowUpRight, cls: "bg-warn-soft text-warn" },
    Down: { Icon: ArrowDownRight, cls: "bg-ok-soft text-ok" },
    Steady: { Icon: ArrowRight, cls: "bg-line/50 text-warmgray" },
  }[value] ?? { Icon: ArrowRight, cls: "bg-line/50 text-warmgray" };
  const { Icon } = cfg;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", cfg.cls)}>
      <Icon className="h-3 w-3" />
      {value || "Steady"}
    </span>
  );
}

export function InsightsFeed({ insights }: { insights: Insight[] }) {
  const resource = getResource("market-insights");
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Insight | null>(null);
  const [deleting, setDeleting] = React.useState<Insight | null>(null);

  const filtered = insights.filter((i) => {
    const q = query.trim().toLowerCase();
    if (q && !["title", "tradeLane", "category", "notes"].some((k) => String(i[k] ?? "").toLowerCase().includes(q)))
      return false;
    if (category && String(i.category ?? "") !== category) return false;
    return true;
  });

  return (
    <>
      <SectionCard
        title="Insights Feed"
        description={`${filtered.length} of ${insights.length} shown`}
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Insight
          </Button>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warmgray-light" />
            <Input
              className="pl-9"
              placeholder="Search insights…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select
            className="w-auto min-w-[150px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {INSIGHT_CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-warmgray">
            {insights.length === 0
              ? "No insights yet — capture what you're hearing across the market."
              : "No matches for these filters."}
          </p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((i) => (
              <li
                key={i.id}
                className="rounded-lg border border-line bg-white px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-warmgray">
                  <span>{formatDate(i.date as string)}</span>
                  <span className="text-warmgray-light">·</span>
                  <span className="rounded-full bg-sage-soft px-2 py-0.5 font-medium text-sage-dark">
                    {String(i.category ?? "")}
                  </span>
                  <Sentiment value={String(i.sentiment ?? "Steady")} />
                  {i.tradeLane ? (
                    <>
                      <span className="text-warmgray-light">·</span>
                      <span>{String(i.tradeLane)}</span>
                    </>
                  ) : null}
                  <span className="ml-auto flex gap-1">
                    <button
                      onClick={() => {
                        setEditing(i);
                        setFormOpen(true);
                      }}
                      className="rounded-md p-1 text-warmgray hover:bg-cream hover:text-navy"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleting(i)}
                      className="rounded-md p-1 text-warmgray hover:bg-danger-soft hover:text-danger"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-ink">{String(i.title ?? "")}</p>
                {i.notes ? (
                  <p className="mt-1 text-sm text-warmgray">{String(i.notes)}</p>
                ) : null}
                {i.sourceUrl ? (
                  <a
                    href={String(i.sourceUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-navy hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> Source
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <ModalForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        resource={resource}
        record={editing}
        onSaved={() => router.refresh()}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete insight?"
        message="This permanently removes the insight."
        confirmLabel="Delete"
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting) await deleteRecord("market-insights", deleting.id);
          setDeleting(null);
          router.refresh();
        }}
      />
    </>
  );
}
