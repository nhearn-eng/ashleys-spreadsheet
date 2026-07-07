"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SectionCard } from "./SectionCard";
import { Button, Label, Textarea } from "./ui";
import { saveMarketTheme } from "@/lib/actions";
import { monthLabel } from "@/lib/utils";

type Theme = Record<string, unknown> | null;

const FIELDS = [
  { name: "blankSailings", label: "Blank Sailings" },
  { name: "capacity", label: "Capacity" },
  { name: "spotRateDirection", label: "Spot Rate Direction" },
  { name: "equipmentSituation", label: "Equipment Situation" },
  { name: "keyCustomerRisks", label: "Key Customer Risks" },
  { name: "talkingPoints", label: "Talking Points for Customers" },
] as const;

export function MarketThemesPanel({ month, theme }: { month: string; theme: Theme }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(FIELDS.map((f) => [f.name, String(theme?.[f.name] ?? "")]))
  );

  async function onSave() {
    setSaving(true);
    setSaved(false);
    await saveMarketTheme({ month, ...values });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <SectionCard
      title={`This Month's Market Themes — ${monthLabel(month)}`}
      description="The narrative you'll bring to every customer conversation."
      action={
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-ok">Saved</span>}
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save Themes"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map((f) => (
          <div key={f.name}>
            <Label htmlFor={f.name}>{f.label}</Label>
            <Textarea
              id={f.name}
              value={values[f.name]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [f.name]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
