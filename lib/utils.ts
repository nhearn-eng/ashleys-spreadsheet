import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date (or ISO string) as e.g. "Aug 1, 2026". Returns "" for empty. */
export function formatDate(value?: Date | string | null): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** yyyy-mm-dd for <input type="date"> values. */
export function toDateInput(value?: Date | string | null): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

/** Start of today in local time. */
export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isToday(value?: Date | string | null): boolean {
  if (!value) return false;
  const d = typeof value === "string" ? new Date(value) : value;
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

/** True when a due date is strictly before today (overdue). */
export function isOverdue(value?: Date | string | null): boolean {
  if (!value) return false;
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return false;
  return d < startOfToday();
}

/** Whole days since a date (for "issue age"). */
export function daysSince(value?: Date | string | null): number {
  if (!value) return 0;
  const d = typeof value === "string" ? new Date(value) : value;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86_400_000));
}

export function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7); // yyyy-mm
}

export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
