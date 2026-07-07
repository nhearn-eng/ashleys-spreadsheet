import { describe, it, expect } from "vitest";
import { buildSchema, loginSchema, passwordChangeSchema } from "@/lib/validations";
import { getResource } from "@/lib/resources";

describe("buildSchema (config-driven validation)", () => {
  const schema = buildSchema(getResource("customer-issues").fields);

  it("rejects a missing required field", () => {
    const res = schema.safeParse({ customer: "", issue: "" });
    expect(res.success).toBe(false);
    if (!res.success) {
      const errors = res.error.flatten().fieldErrors;
      expect(errors.customer?.[0]).toMatch(/required/i);
      expect(errors.issue?.[0]).toMatch(/required/i);
    }
  });

  it("accepts a valid record and coerces empty dates to null", () => {
    const res = schema.safeParse({
      customer: "ABC Imports",
      issue: "Rolled container",
      priority: "High",
      status: "Open",
      dueDate: "",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.dueDate).toBeNull();
      expect(res.data.customer).toBe("ABC Imports");
    }
  });

  it("parses a real date string into a Date", () => {
    const res = schema.safeParse({
      customer: "ABC Imports",
      issue: "x",
      dueDate: "2026-08-01",
    });
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.dueDate).toBeInstanceOf(Date);
  });

  it("coerces meeting booleans", () => {
    const s = buildSchema(getResource("meetings").fields);
    const res = s.safeParse({ customer: "ABC", crmUpdated: true, followUpNeeded: false });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.crmUpdated).toBe(true);
      expect(res.data.followUpNeeded).toBe(false);
    }
  });
});

describe("auth schemas", () => {
  it("requires username and password to log in", () => {
    expect(loginSchema.safeParse({ username: "", password: "" }).success).toBe(false);
    expect(loginSchema.safeParse({ username: "ashley", password: "pw" }).success).toBe(true);
  });

  it("enforces password length and confirmation match", () => {
    expect(
      passwordChangeSchema.safeParse({
        currentPassword: "old",
        newPassword: "short",
        confirmPassword: "short",
      }).success
    ).toBe(false);

    expect(
      passwordChangeSchema.safeParse({
        currentPassword: "old",
        newPassword: "longenough1",
        confirmPassword: "different",
      }).success
    ).toBe(false);

    expect(
      passwordChangeSchema.safeParse({
        currentPassword: "old",
        newPassword: "longenough1",
        confirmPassword: "longenough1",
      }).success
    ).toBe(true);
  });
});
