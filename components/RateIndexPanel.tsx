"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { Modal } from "./Modal";
import { Button, Input, Label, FieldError } from "./ui";
import { saveRateSnapshot, deleteRateSnapshot } from "@/lib/actions";
import { TRADE_LANES } from "@/lib/constants";
import { formatDate, toDateInput, cn } from "@/lib/utils";
import type { RateIndex } from "@/lib/reportUtils";

type Snapshot = {
  id: string;
  tradeLane: string;
  amount: number;
  date: string | Date;
  notes: string;
};

const fmtMoney = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}/FEU`;

function Trend({ index }: { index: RateIndex }) {
  const { direction, pct } = index;
  const cfg = {
    up: { Icon: ArrowUpRight, cls: "text-warn", label: "+" },
    down: { Icon: ArrowDownRight, cls: "text-ok", label: "" },
    flat: { Icon: ArrowRight, cls: "text-warmgray", label: "" },
  }[direction];
  const { Icon } = cfg;
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", cfg.cls)}>
      <Icon className="h-4 w-4" />
      {pct === null ? "—" : `${cfg.label}${pct.toFixed(1)}%`}
    </span>
  );
}

export function RateIndexPanel({
  indices,
  snapshots,
}: {
  indices: RateIndex[];
  snapshots: Snapshot[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    tradeLane: "",
    amount: "",
    date: toDateInput(new Date()),
    notes: "",
  });
  const [err, setErr] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr({});
    const res = await saveRateSnapshot(form);
    setBusy(false);
    if (res.ok) {
      setOpen(false);
      setForm({ tradeLane: "", amount: "", date: toDateInput(new Date()), notes: "" });
      router.refresh();
    } else {
      const flat: Record<string, string> = {};
      for (const [k, v] of Object.entries(res.errors)) if (v?.[0]) flat[k] = v[0];
      setErr(flat);
    }
  }

  return (
    <SectionCard
      title="Trade Lane Indices"
      description="Latest spot rate per lane and its move vs. your previous reading."
      action={
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Log Reading
        </Button>
      }
    >
      {indices.length === 0 ? (
        <p className="py-8 text-center text-sm text-warmgray">
          No readings yet. Log a spot rate to start tracking a lane.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {indices.map((idx) => (
            <div key={idx.lane} className="rounded-lg border border-line bg-white px-4 py-3">
              <p className="text-sm font-medium text-ink">{idx.lane}</p>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <span className="font-display text-2xl text-navy">{fmtMoney(idx.amount)}</span>
                <Trend index={idx} />
              </div>
              <p className="mt-1 text-xs text-warmgray">
                {formatDate(idx.date)} · {idx.count} reading{idx.count === 1 ? "" : "s"}
              </p>
            </div>
          ))}
        </div>
      )}

      {snapshots.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-warmgray">
            Recent readings
          </h3>
          <ul className="divide-y divide-line">
            {snapshots.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-ink">
                  <span className="font-medium">{s.tradeLane}</span>
                  <span className="mx-2 text-warmgray-light">·</span>
                  {fmtMoney(s.amount)}
                  <span className="mx-2 text-warmgray-light">·</span>
                  <span className="text-warmgray">{formatDate(s.date)}</span>
                </span>
                <button
                  onClick={async () => {
                    await deleteRateSnapshot(s.id);
                    router.refresh();
                  }}
                  className="rounded-md p-1.5 text-warmgray hover:bg-danger-soft hover:text-danger"
                  aria-label="Delete reading"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Log Rate Reading" size="sm">
        <form onSubmit={save} className="space-y-4">
          <div>
            <Label htmlFor="tradeLane">Trade Lane *</Label>
            <Input
              id="tradeLane"
              list="trade-lanes"
              value={form.tradeLane}
              onChange={(e) => setForm((f) => ({ ...f, tradeLane: e.target.value }))}
              placeholder="Asia – US East Coast"
            />
            <datalist id="trade-lanes">
              {TRADE_LANES.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
            <FieldError message={err.tradeLane} />
          </div>
          <div>
            <Label htmlFor="amount">Spot Rate ($/FEU) *</Label>
            <Input
              id="amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="3200"
            />
            <FieldError message={err.amount} />
          </div>
          <div>
            <Label htmlFor="rate-date">Date</Label>
            <Input
              id="rate-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save Reading"}
            </Button>
          </div>
        </form>
      </Modal>
    </SectionCard>
  );
}
