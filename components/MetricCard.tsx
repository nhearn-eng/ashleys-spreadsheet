import * as React from "react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  sub,
  tone = "default",
  icon,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "default" | "danger" | "warn" | "ok";
  icon?: React.ReactNode;
}) {
  const accent = {
    default: "text-navy",
    danger: "text-danger",
    warn: "text-warn",
    ok: "text-ok",
  }[tone];
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white px-5 py-4 shadow-[0_1px_2px_rgba(28,27,25,0.04)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-warmgray">
          {label}
        </p>
        {icon && <span className="text-warmgray-light">{icon}</span>}
      </div>
      <p className={cn("mt-2 font-display text-3xl", accent)}>{value}</p>
      {sub && <p className="mt-1 text-sm text-warmgray">{sub}</p>}
    </div>
  );
}
