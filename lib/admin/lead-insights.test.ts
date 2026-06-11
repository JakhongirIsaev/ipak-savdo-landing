import { describe, expect, it } from "vitest";
import {
  computeUnitEconomics,
  fmtSum,
  PILOT_PRICE,
  FULL_PRICE,
  REVENUE_6M,
  REVENUE_12M,
} from "./lead-insights";

describe("pricing constants", () => {
  it("derive from the public landing pricing", () => {
    expect(REVENUE_6M).toBe(49_000 * 6);
    expect(REVENUE_12M).toBe(49_000 * 6 + 149_000 * 6);
  });
});

describe("computeUnitEconomics", () => {
  it("computes the full chain when data exists", () => {
    const e = computeUnitEconomics({
      visitors30: 200,
      leads30: 10,
      totalLeads: 40,
      wonLeads: 8, // win rate 20%
      pipelineActive: 15,
    });
    expect(e.leadRatePct).toBe(5); // 10/200
    expect(e.winRatePct).toBe(20);
    expect(e.visitorToClientPct).toBe(1); // 5% x 20%
    expect(e.valuePerLead12m).toBe(Math.round(0.2 * REVENUE_12M)); // 237 600
    expect(e.valuePerVisitor12m).toBe(Math.round(0.05 * 0.2 * REVENUE_12M)); // 11 880
    expect(e.maxCacPayback6m).toBe(Math.round(0.2 * REVENUE_6M)); // 58 800
    expect(e.pipelineValue12m).toBe(Math.round(15 * 0.2 * REVENUE_12M));
    expect(e.mrrPilot).toBe(8 * PILOT_PRICE);
    expect(e.mrrAfterPilot).toBe(8 * FULL_PRICE);
  });

  it("returns nulls before the first won client (no fabricated rates)", () => {
    const e = computeUnitEconomics({
      visitors30: 100,
      leads30: 5,
      totalLeads: 5,
      wonLeads: 0,
      pipelineActive: 5,
    });
    expect(e.leadRatePct).toBe(5);
    expect(e.winRatePct).toBeNull();
    expect(e.visitorToClientPct).toBeNull();
    expect(e.valuePerLead12m).toBeNull();
    expect(e.maxCacPayback6m).toBeNull();
    expect(e.pipelineValue12m).toBeNull();
    expect(e.mrrPilot).toBe(0);
    expect(e.mrrAfterPilot).toBe(0);
  });

  it("handles zero traffic without dividing by zero", () => {
    const e = computeUnitEconomics({
      visitors30: 0,
      leads30: 0,
      totalLeads: 2,
      wonLeads: 1,
      pipelineActive: 1,
    });
    expect(e.leadRatePct).toBeNull();
    expect(e.winRatePct).toBe(50);
    expect(e.visitorToClientPct).toBeNull();
    expect(e.valuePerVisitor12m).toBeNull();
    expect(e.valuePerLead12m).toBe(Math.round(0.5 * REVENUE_12M));
  });

  it("withholds the lead rate while the visitor sample is too small", () => {
    const e = computeUnitEconomics({
      visitors30: 2, // counter just went live; 10 leads / 2 visitors would be 500%
      leads30: 10,
      totalLeads: 10,
      wonLeads: 2,
      pipelineActive: 8,
    });
    expect(e.leadRatePct).toBeNull();
    expect(e.visitorToClientPct).toBeNull();
    expect(e.winRatePct).toBe(20); // win rate does not depend on the counter
  });

  it("rounds rates to one decimal", () => {
    const e = computeUnitEconomics({
      visitors30: 300,
      leads30: 10,
      totalLeads: 30,
      wonLeads: 10,
      pipelineActive: 0,
    });
    expect(e.leadRatePct).toBe(3.3);
    expect(e.winRatePct).toBe(33.3);
  });
});

describe("fmtSum", () => {
  it("formats small amounts in plain so'm", () => {
    expect(fmtSum(58_800)).toBe(`${(58_800).toLocaleString("ru-RU")} сум`);
  });
  it("formats millions compactly", () => {
    expect(fmtSum(1_188_000)).toBe(`${(1.2).toLocaleString("ru-RU")} млн сум`);
  });
  it("keeps exact millions clean", () => {
    expect(fmtSum(2_000_000)).toBe(`${(2).toLocaleString("ru-RU")} млн сум`);
  });
});
