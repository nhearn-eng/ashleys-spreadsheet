"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input, Button } from "./ui";

const PRESETS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "custom", label: "Custom" },
];

export function RangeTabs() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("range") ?? "week";
  const [from, setFrom] = React.useState(params.get("from") ?? "");
  const [to, setTo] = React.useState(params.get("to") ?? "");

  function go(range: string) {
    if (range === "custom") {
      router.push(`/reporting?range=custom&from=${from}&to=${to}`);
    } else {
      router.push(`/reporting?range=${range}`);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex rounded-lg border border-line bg-white p-1">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => go(p.key)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active === p.key ? "bg-navy text-cream" : "text-warmgray hover:text-ink"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      {active === "custom" && (
        <div className="flex items-center gap-2">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-auto" />
          <span className="text-warmgray">to</span>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-auto" />
          <Button size="sm" variant="secondary" onClick={() => go("custom")} disabled={!from || !to}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
