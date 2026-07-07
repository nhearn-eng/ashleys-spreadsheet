"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  rowClassName,
  empty = "Nothing here yet.",
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  rowClassName?: (row: T) => string;
  empty?: React.ReactNode;
  onRowClick?: (row: T) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 py-14 text-center">
        <p className="text-sm text-warmgray">{empty}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-warmgray",
                  c.align === "right" && "text-right",
                  c.align === "center" && "text-center"
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-b border-line/70 last:border-0 transition-colors hover:bg-cream/60",
                onRowClick && "cursor-pointer",
                rowClassName?.(row)
              )}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "px-3 py-3 align-top text-ink",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.className
                  )}
                >
                  {c.render
                    ? c.render(row)
                    : String((row as Record<string, unknown>)[c.key] ?? "—") || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
