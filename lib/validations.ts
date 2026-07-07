import { z } from "zod";
import type { FieldDef } from "./resources";

/** Turn "" / undefined into null; otherwise parse the yyyy-mm-dd input into a Date. */
const dateField = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => {
    if (v === undefined || v === null || v === "") return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  });

/** Build a Zod object schema straight from a resource's field definitions. */
export function buildSchema(fields: FieldDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    if (f.type === "boolean") {
      shape[f.name] = z.coerce.boolean().default(false);
    } else if (f.type === "date") {
      shape[f.name] = dateField;
    } else if (f.type === "email") {
      shape[f.name] = f.required
        ? z.string().trim().email("Enter a valid email")
        : z
            .string()
            .trim()
            .optional()
            .transform((v) => v ?? "")
            .refine((v) => v === "" || /.+@.+\..+/.test(v), "Enter a valid email");
    } else {
      const base = z.string().trim();
      shape[f.name] = f.required
        ? base.min(1, `${f.label} is required`)
        : base.optional().transform((v) => v ?? "");
    }
  }
  return z.object(shape);
}

// --- Bespoke schemas -------------------------------------------------------

export const dailyPlanSchema = z.object({
  date: dateField,
  top1: z.string().trim().optional().transform((v) => v ?? ""),
  top2: z.string().trim().optional().transform((v) => v ?? ""),
  top3: z.string().trim().optional().transform((v) => v ?? ""),
  mustDo: z.string().optional().transform((v) => v ?? ""),
  shouldDo: z.string().optional().transform((v) => v ?? ""),
  wouldBeNice: z.string().optional().transform((v) => v ?? ""),
  notes: z.string().optional().transform((v) => v ?? ""),
  inboxProcessed: z.coerce.boolean().default(false),
  trackerUpdated: z.coerce.boolean().default(false),
  prospectsUpdated: z.coerce.boolean().default(false),
  crmUpdated: z.coerce.boolean().default(false),
  tomorrowTop3: z.coerce.boolean().default(false),
  expensesChecked: z.coerce.boolean().default(false),
});

export const marketThemeSchema = z.object({
  month: z.string().min(1),
  blankSailings: z.string().optional().transform((v) => v ?? ""),
  capacity: z.string().optional().transform((v) => v ?? ""),
  spotRateDirection: z.string().optional().transform((v) => v ?? ""),
  equipmentSituation: z.string().optional().transform((v) => v ?? ""),
  keyCustomerRisks: z.string().optional().transform((v) => v ?? ""),
  talkingPoints: z.string().optional().transform((v) => v ?? ""),
});

export const rateSnapshotSchema = z.object({
  tradeLane: z.string().trim().min(1, "Trade lane is required"),
  amount: z.coerce.number().min(0, "Enter a rate"),
  date: dateField,
  notes: z.string().optional().transform((v) => v ?? ""),
});

export const scorecardSchema = z.record(
  z.string(),
  z.object({ goal: z.coerce.number().default(0), actual: z.coerce.number().default(0) })
);

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: z.string().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
});
