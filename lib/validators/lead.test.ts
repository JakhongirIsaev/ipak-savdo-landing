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

  it("accepts empty business_name (optional)", () => {
    const result = leadInputSchema.safeParse({ ...valid, business_name: "" });
    expect(result.success).toBe(true);
  });

  it("accepts a missing business_name (optional)", () => {
    const { business_name, ...withoutName } = valid;
    void business_name;
    const result = leadInputSchema.safeParse(withoutName);
    expect(result.success).toBe(true);
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
});
