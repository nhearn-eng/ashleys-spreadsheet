import { describe, it, expect } from "vitest";
import { isOverdue, isToday, daysSince, formatDate, toDateInput } from "@/lib/utils";
import { resolveRange } from "@/lib/reportUtils";

const days = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

describe("date helpers", () => {
  it("flags overdue dates but not today or future", () => {
    expect(isOverdue(days(-1))).toBe(true);
    expect(isOverdue(days(1))).toBe(false);
    expect(isOverdue(new Date())).toBe(false);
    expect(isOverdue(null)).toBe(false);
  });

  it("detects today", () => {
    expect(isToday(new Date())).toBe(true);
    expect(isToday(days(1))).toBe(false);
  });

  it("counts days since", () => {
    expect(daysSince(days(-5))).toBeGreaterThanOrEqual(4);
    expect(daysSince(null)).toBe(0);
  });

  it("formats and round-trips date inputs", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate("2026-08-01")).toMatch(/2026/);
    expect(toDateInput("2026-08-01T00:00:00.000Z")).toBe("2026-08-01");
  });
});

describe("resolveRange", () => {
  it("labels presets correctly", () => {
    expect(resolveRange("today").label).toBe("Today");
    expect(resolveRange("month").label).toBe("This Month");
    expect(resolveRange("week").label).toBe("This Week");
    expect(resolveRange("custom", "2026-01-01", "2026-01-31").label).toBe("Custom Range");
  });

  it("orders the from/to boundaries", () => {
    const r = resolveRange("custom", "2026-01-01", "2026-01-31");
    expect(r.from.getTime()).toBeLessThan(r.to.getTime());
  });
});
