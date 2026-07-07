"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SectionCard } from "./SectionCard";
import { Button, Input, Label, Textarea } from "./ui";
import { saveDailyPlan } from "@/lib/actions";
import { SHUTDOWN_CHECKLIST } from "@/lib/constants";
import { toDateInput } from "@/lib/utils";

type Plan = Record<string, unknown> | null;

export function DailyPlannerForm({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const [form, setForm] = React.useState({
    date: plan?.date ? toDateInput(plan.date as string) : toDateInput(new Date()),
    top1: String(plan?.top1 ?? ""),
    top2: String(plan?.top2 ?? ""),
    top3: String(plan?.top3 ?? ""),
    mustDo: String(plan?.mustDo ?? ""),
    shouldDo: String(plan?.shouldDo ?? ""),
    wouldBeNice: String(plan?.wouldBeNice ?? ""),
    notes: String(plan?.notes ?? ""),
  });
  const [checks, setChecks] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(SHUTDOWN_CHECKLIST.map((c) => [c.key, Boolean(plan?.[c.key])]))
  );

  function upd<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    await saveDailyPlan({ ...form, ...checks });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Daily Plan"
        description="Set the day's intentions."
        action={
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-ok">Saved</span>}
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save Plan"}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => upd("date", e.target.value)}
            />
          </div>
          <div className="hidden sm:block" />
          {[1, 2, 3].map((n) => (
            <div key={n}>
              <Label>Top Priority {n}</Label>
              <Input
                value={form[`top${n}` as "top1" | "top2" | "top3"]}
                onChange={(e) => upd(`top${n}` as "top1", e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label>Must Do Today</Label>
            <Textarea value={form.mustDo} onChange={(e) => upd("mustDo", e.target.value)} />
          </div>
          <div>
            <Label>Should Do</Label>
            <Textarea value={form.shouldDo} onChange={(e) => upd("shouldDo", e.target.value)} />
          </div>
          <div>
            <Label>Would Be Nice</Label>
            <Textarea value={form.wouldBeNice} onChange={(e) => upd("wouldBeNice", e.target.value)} />
          </div>
        </div>

        <div className="mt-4">
          <Label>Notes</Label>
          <Textarea value={form.notes} onChange={(e) => upd("notes", e.target.value)} />
        </div>
      </SectionCard>

      <SectionCard
        title="End-of-Day Shutdown Checklist"
        description="Close the day cleanly."
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SHUTDOWN_CHECKLIST.map((c) => (
            <label
              key={c.key}
              className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-navy"
                checked={checks[c.key]}
                onChange={(e) =>
                  setChecks((s) => ({ ...s, [c.key]: e.target.checked }))
                }
              />
              {c.label}
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-warmgray">
          Checklist saves with the plan above.
        </p>
      </SectionCard>
    </div>
  );
}
