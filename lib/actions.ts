"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { requireUserId } from "./auth";
import { getResource } from "./resources";
import {
  buildSchema,
  marketThemeSchema,
  scorecardSchema,
  passwordChangeSchema,
  rateSnapshotSchema,
} from "./validations";

export type ActionResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string[] | undefined>; message?: string };

function delegate(model: string) {
  // Dynamic access to the Prisma model delegate. Input is validated per-model
  // via the resource's Zod schema before it ever reaches here.
  return (prisma as unknown as Record<string, {
    create: (a: unknown) => Promise<unknown>;
    updateMany: (a: unknown) => Promise<unknown>;
    deleteMany: (a: unknown) => Promise<unknown>;
    findMany: (a: unknown) => Promise<unknown[]>;
  }>)[model];
}

/** Create (id === null) or update a record for one of the config-driven resources. */
export async function saveRecord(
  resourceKey: string,
  id: string | null,
  data: Record<string, unknown>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const resource = getResource(resourceKey);
  const parsed = buildSchema(resource.fields).safeParse(data);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  const values = parsed.data as Record<string, unknown>;
  const d = delegate(resource.model);

  if (id) {
    // Scope by userId so a record can only be edited by its owner.
    await d.updateMany({ where: { id, userId }, data: values });
  } else {
    // Drop null values on create so DB defaults (e.g. dateOpened) apply.
    const createData: Record<string, unknown> = { userId };
    for (const [k, v] of Object.entries(values)) {
      if (v !== null) createData[k] = v;
    }
    await d.create({ data: createData });
  }

  revalidatePath(`/${resourceKey}`);
  revalidatePath("/dashboard");
  revalidatePath("/reporting");
  revalidatePath("/customers");
  return { ok: true };
}

export async function deleteRecord(
  resourceKey: string,
  id: string
): Promise<ActionResult> {
  const userId = await requireUserId();
  const resource = getResource(resourceKey);
  await delegate(resource.model).deleteMany({ where: { id, userId } });
  revalidatePath(`/${resourceKey}`);
  revalidatePath("/dashboard");
  revalidatePath("/reporting");
  return { ok: true };
}

// --- Daily plan ------------------------------------------------------------

const PLAN_TEXT_KEYS = [
  "top1", "top2", "top3", "mustDo", "shouldDo", "wouldBeNice", "notes",
] as const;
const PLAN_BOOL_KEYS = [
  "inboxProcessed", "trackerUpdated", "prospectsUpdated",
  "crmUpdated", "tomorrowTop3", "expensesChecked",
] as const;

/**
 * Partial upsert: only the keys present in `data` are written, so saving the
 * dashboard's Top 3 never clobbers the planner's other fields (and vice-versa).
 */
export async function saveDailyPlan(data: Record<string, unknown>): Promise<ActionResult> {
  const userId = await requireUserId();

  const rawDate = data.date;
  const day = rawDate ? new Date(String(rawDate)) : new Date();
  if (Number.isNaN(day.getTime())) return { ok: false, errors: { date: ["Invalid date"] } };
  day.setHours(0, 0, 0, 0);

  const payload: Record<string, unknown> = {};
  for (const k of PLAN_TEXT_KEYS) if (k in data) payload[k] = String(data[k] ?? "");
  for (const k of PLAN_BOOL_KEYS) if (k in data) payload[k] = Boolean(data[k]);

  await prisma.dailyPlan.upsert({
    where: { userId_date: { userId, date: day } },
    create: { userId, date: day, ...payload },
    update: payload,
  });
  revalidatePath("/daily-planner");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function saveScorecard(
  dateISO: string,
  scorecard: Record<string, { goal: number; actual: number }>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = scorecardSchema.safeParse(scorecard);
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const day = new Date(dateISO);
  day.setHours(0, 0, 0, 0);
  await prisma.dailyPlan.upsert({
    where: { userId_date: { userId, date: day } },
    create: { userId, date: day, scorecard: parsed.data },
    update: { scorecard: parsed.data },
  });
  revalidatePath("/dashboard");
  return { ok: true };
}

// --- Market themes ---------------------------------------------------------

export async function saveMarketTheme(data: Record<string, unknown>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = marketThemeSchema.safeParse(data);
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const { month, ...rest } = parsed.data;
  await prisma.marketTheme.upsert({
    where: { userId_month: { userId, month } },
    create: { userId, month, ...rest },
    update: rest,
  });
  revalidatePath("/market-intelligence");
  return { ok: true };
}

// --- Rate snapshots (Shipping Market Insights) -----------------------------

export async function saveRateSnapshot(data: Record<string, unknown>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = rateSnapshotSchema.safeParse(data);
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const { date, ...rest } = parsed.data;
  await prisma.rateSnapshot.create({
    data: { userId, ...rest, ...(date ? { date } : {}) },
  });
  revalidatePath("/market-insights");
  return { ok: true };
}

export async function deleteRateSnapshot(id: string): Promise<ActionResult> {
  const userId = await requireUserId();
  await prisma.rateSnapshot.deleteMany({ where: { id, userId } });
  revalidatePath("/market-insights");
  return { ok: true };
}

// --- Security / data --------------------------------------------------------

export async function changePassword(data: Record<string, unknown>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = passwordChangeSchema.safeParse(data);
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, errors: {}, message: "User not found." };

  const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!ok)
    return {
      ok: false,
      errors: { currentPassword: ["Current password is incorrect"] },
    };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return { ok: true };
}

const BUSINESS_MODELS = [
  "dailyPlan",
  "customerIssue",
  "prospect",
  "customer",
  "marketIntelligence",
  "opportunity",
  "meetingLog",
  "weeklyPriority",
  "marketTheme",
  "reportExportLog",
] as const;

export async function exportAllData(): Promise<Record<string, unknown[]>> {
  const userId = await requireUserId();
  const out: Record<string, unknown[]> = {};
  for (const model of BUSINESS_MODELS) {
    out[model] = await delegate(model as string)?.findMany?.({ where: { userId } }) as unknown[]
      ?? [];
  }
  return out;
}

export async function logExport(reportType: string, dateRange = ""): Promise<ActionResult> {
  const userId = await requireUserId();
  await prisma.reportExportLog.create({ data: { userId, reportType, dateRange } });
  revalidatePath("/exports");
  return { ok: true };
}

export async function deleteAllData(): Promise<ActionResult> {
  const userId = await requireUserId();
  for (const model of BUSINESS_MODELS) {
    await delegate(model as string).deleteMany({ where: { userId } });
  }
  revalidatePath("/dashboard");
  return { ok: true };
}

const STRIP_KEYS = new Set(["id", "userId", "createdAt", "updatedAt"]);

/** Replace all data with the contents of a previously-exported JSON backup. */
export async function importData(
  payload: Record<string, unknown[]>
): Promise<ActionResult> {
  const userId = await requireUserId();
  try {
    for (const model of BUSINESS_MODELS) {
      const rows = Array.isArray(payload[model]) ? payload[model] : [];
      await delegate(model).deleteMany({ where: { userId } });
      for (const row of rows) {
        if (!row || typeof row !== "object") continue;
        const clean: Record<string, unknown> = { userId };
        for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
          if (!STRIP_KEYS.has(k)) clean[k] = v;
        }
        await delegate(model).create({ data: clean });
      }
    }
  } catch {
    return { ok: false, errors: {}, message: "Import failed — check the file format." };
  }
  revalidatePath("/dashboard");
  return { ok: true };
}

