import { describe, it, expect } from "vitest";
import { tashkentDayStart, tashkentDayEnd, deltaPercent } from "./kpi";

describe("tashkentDayStart", () => {
  it("returns the UTC instant of midnight Tashkent for a given date", () => {
    // Tashkent is UTC+5. 2026-05-26 00:00 Tashkent = 2026-05-25 19:00 UTC
    const start = tashkentDayStart(new Date("2026-05-26T13:42:00Z"));
    expect(start.toISOString()).toBe("2026-05-25T19:00:00.000Z");
  });

  it("returns the same UTC instant when called multiple times in the same Tashkent day", () => {
    const a = tashkentDayStart(new Date("2026-05-26T01:00:00Z"));
    const b = tashkentDayStart(new Date("2026-05-26T18:00:00Z"));
    expect(a.toISOString()).toBe(b.toISOString());
  });
});

describe("tashkentDayEnd", () => {
  it("returns the next-day-midnight Tashkent UTC instant", () => {
    const end = tashkentDayEnd(new Date("2026-05-26T13:42:00Z"));
    expect(end.toISOString()).toBe("2026-05-26T19:00:00.000Z");
  });
});

describe("deltaPercent", () => {
  it("returns null if previous is 0", () => {
    expect(deltaPercent(10, 0)).toBeNull();
  });

  it("returns positive delta when current > previous", () => {
    expect(deltaPercent(15, 10)).toBe(50);
  });

  it("returns negative delta when current < previous", () => {
    expect(deltaPercent(5, 10)).toBe(-50);
  });

  it("returns 0 when equal", () => {
    expect(deltaPercent(10, 10)).toBe(0);
  });
});
