"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "./ui";
import { SectionCard } from "./SectionCard";
import { saveDailyPlan, saveScorecard } from "@/lib/actions";
import { SCORECARD_ROWS } from "@/lib/constants";
import { cn, toDateInput } from "@/lib/utils";

const todayISO = () => toDateInput(new Date());

export function TodayTop3({
  initial,
}: {
  initial: { top1: string; top2: string; top3: string };
}) {
  const router = useRouter();
  const [vals, setVals] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    await saveDailyPlan({ date: todayISO(), ...vals });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SectionCard
      title="Today's Top 3"
      description="The three that matter most."
      action={
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-ok">Saved</span>}
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      }
    >
      <ol className="space-y-3">
        {[1, 2, 3].map((n) => {
          const key = `top${n}` as "top1" | "top2" | "top3";
          return (
            <li key={n} className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm text-cream">
                {n}
              </span>
              <Input
                value={vals[key]}
                placeholder={`Priority ${n}`}
                onChange={(e) => setVals((v) => ({ ...v, [key]: e.target.value }))}
              />
            </li>
          );
        })}
      </ol>
    </SectionCard>
  );
}

export function Scorecard({
  actuals,
  stored,
}: {
  actuals: Record<string, number>;
  stored: Record<string, { goal: number; actual: number }> | null;
}) {
  const router = useRouter();
  const [rows, setRows] = React.useState(() =>
    Object.fromEntries(
      SCORECARD_ROWS.map((r) => [
        r.key,
        {
          goal: stored?.[r.key]?.goal ?? r.defaultGoal,
          // Prefer the live computed actual; fall back to stored.
          actual: actuals[r.key] ?? stored?.[r.key]?.actual ?? 0,
        },
      ])
    )
  );
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  function set(key: string, field: "goal" | "actual", value: number) {
    setRows((r) => ({ ...r, [key]: { ...r[key], [field]: value } }));
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    await saveScorecard(todayISO(), rows);
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <SectionCard
      title="Daily Scorecard"
      description="Goal vs. actual across today's core activities."
      action={
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-ok">Saved</span>}
          <Button size="sm" variant="secondary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SCORECARD_ROWS.map((r) => {
          const row = rows[r.key];
          const lowerIsBetter = r.key === "issues";
          const onTrack = lowerIsBetter ? row.actual <= row.goal : row.actual >= row.goal;
          return (
            <div
              key={r.key}
              className="rounded-lg border border-line bg-white px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink">{r.label}</p>
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    onTrack ? "bg-ok" : "bg-warn"
                  )}
                  title={onTrack ? "On track" : "Behind"}
                />
              </div>
              <div className="mt-2 flex items-end gap-3">
                <label className="text-xs text-warmgray">
                  Actual
                  <Input
                    type="number"
                    className="mt-0.5 w-16 px-2 py-1 text-center"
                    value={row.actual}
                    onChange={(e) => set(r.key, "actual", Number(e.target.value) || 0)}
                  />
                </label>
                <span className="pb-2 text-warmgray-light">/</span>
                <label className="text-xs text-warmgray">
                  Goal
                  <Input
                    type="number"
                    className="mt-0.5 w-16 px-2 py-1 text-center"
                    value={row.goal}
                    onChange={(e) => set(r.key, "goal", Number(e.target.value) || 0)}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
