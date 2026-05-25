import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-25T00:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows up to N requests in window", () => {
    const limiter = createRateLimiter({ max: 3, windowMs: 60_000 });
    expect(limiter.check("ip1")).toBe(true);
    expect(limiter.check("ip1")).toBe(true);
    expect(limiter.check("ip1")).toBe(true);
  });

  it("blocks the (N+1)th request", () => {
    const limiter = createRateLimiter({ max: 3, windowMs: 60_000 });
    limiter.check("ip1");
    limiter.check("ip1");
    limiter.check("ip1");
    expect(limiter.check("ip1")).toBe(false);
  });

  it("isolates limits per key", () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check("ip1")).toBe(true);
    expect(limiter.check("ip2")).toBe(true);
    expect(limiter.check("ip1")).toBe(false);
  });

  it("allows again after window elapses", () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check("ip1")).toBe(true);
    expect(limiter.check("ip1")).toBe(false);
    vi.advanceTimersByTime(60_001);
    expect(limiter.check("ip1")).toBe(true);
  });

  it("treats null key as a shared bucket", () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 60_000 });
    expect(limiter.check(null)).toBe(true);
    expect(limiter.check(null)).toBe(false);
  });
});
