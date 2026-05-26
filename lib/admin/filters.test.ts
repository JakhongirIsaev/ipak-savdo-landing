import { describe, it, expect } from "vitest";
import { parseLeadFilters } from "./filters";

describe("parseLeadFilters", () => {
  it("returns empty object for empty params", () => {
    expect(parseLeadFilters(new URLSearchParams())).toEqual({
      from: null,
      to: null,
      source: null,
      businessType: null,
      equipment: null,
      q: null,
      page: 1,
    });
  });

  it("parses date range", () => {
    const f = parseLeadFilters(new URLSearchParams({ from: "2026-05-01", to: "2026-05-25" }));
    expect(f.from).toEqual(new Date("2026-05-01T00:00:00Z"));
    expect(f.to).toEqual(new Date("2026-05-25T23:59:59.999Z"));
  });

  it("ignores invalid dates", () => {
    const f = parseLeadFilters(new URLSearchParams({ from: "garbage" }));
    expect(f.from).toBeNull();
  });

  it("parses source and businessType", () => {
    const f = parseLeadFilters(new URLSearchParams({ source: "instagram", type: "cafe" }));
    expect(f.source).toBe("instagram");
    expect(f.businessType).toBe("cafe");
  });

  it("rejects unknown businessType", () => {
    const f = parseLeadFilters(new URLSearchParams({ type: "spaceship" }));
    expect(f.businessType).toBeNull();
  });

  it("parses equipment tristate", () => {
    expect(parseLeadFilters(new URLSearchParams({ equipment: "yes" })).equipment).toBe(true);
    expect(parseLeadFilters(new URLSearchParams({ equipment: "no" })).equipment).toBe(false);
    expect(parseLeadFilters(new URLSearchParams({ equipment: "any" })).equipment).toBeNull();
  });

  it("parses q (search)", () => {
    expect(parseLeadFilters(new URLSearchParams({ q: "billz" })).q).toBe("billz");
  });

  it("parses page, defaults to 1, rejects <1", () => {
    expect(parseLeadFilters(new URLSearchParams({ page: "3" })).page).toBe(3);
    expect(parseLeadFilters(new URLSearchParams({ page: "0" })).page).toBe(1);
    expect(parseLeadFilters(new URLSearchParams({ page: "abc" })).page).toBe(1);
  });
});
