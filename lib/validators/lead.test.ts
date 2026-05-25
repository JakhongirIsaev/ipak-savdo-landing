import { describe, it, expect } from "vitest";
import { leadInputSchema } from "./lead";

const valid = {
  business_name: "BillzCafe",
  business_type: "cafe",
  owner_name: "Ivan",
  owner_contact: "+998901234567",
  needs_equipment: true,
  language: "ru",
};

describe("leadInputSchema", () => {
  it("accepts a minimal valid payload", () => {
    const result = leadInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects empty business_name", () => {
    const result = leadInputSchema.safeParse({ ...valid, business_name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects business_name shorter than 2 chars", () => {
    const result = leadInputSchema.safeParse({ ...valid, business_name: "X" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown business_type", () => {
    const result = leadInputSchema.safeParse({ ...valid, business_type: "spaceship" });
    expect(result.success).toBe(false);
  });

  it("requires business_type_other when business_type is 'other'", () => {
    const result = leadInputSchema.safeParse({ ...valid, business_type: "other" });
    expect(result.success).toBe(false);
  });

  it("accepts business_type 'other' with business_type_other filled", () => {
    const result = leadInputSchema.safeParse({
      ...valid,
      business_type: "other",
      business_type_other: "Bakery chain",
    });
    expect(result.success).toBe(true);
  });

  it("forbids business_type_other when business_type is not 'other'", () => {
    const result = leadInputSchema.safeParse({
      ...valid,
      business_type_other: "Should not be here",
    });
    expect(result.success).toBe(false);
  });

  it("rejects owner_contact shorter than 5 chars", () => {
    const result = leadInputSchema.safeParse({ ...valid, owner_contact: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects comment longer than 500 chars", () => {
    const result = leadInputSchema.safeParse({ ...valid, comment: "a".repeat(501) });
    expect(result.success).toBe(false);
  });

  it("rejects invalid language", () => {
    const result = leadInputSchema.safeParse({ ...valid, language: "en" });
    expect(result.success).toBe(false);
  });

  it("ignores honeypot when empty", () => {
    const result = leadInputSchema.safeParse({ ...valid, _hp: "" });
    expect(result.success).toBe(true);
  });

  it("accepts honeypot when filled (separate gate handles it)", () => {
    // The schema does not reject _hp; the route handler treats non-empty _hp as silent-200.
    const result = leadInputSchema.safeParse({ ...valid, _hp: "bot" });
    expect(result.success).toBe(true);
  });
});
