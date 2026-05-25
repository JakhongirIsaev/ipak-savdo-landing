import { describe, it, expect } from "vitest";
import { getClientIp } from "./get-ip";

const makeRequest = (headers: Record<string, string>): Request =>
  new Request("http://example.com", { headers });

describe("getClientIp", () => {
  it("returns first IP from X-Forwarded-For", () => {
    const req = makeRequest({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("trims whitespace around IP", () => {
    const req = makeRequest({ "x-forwarded-for": "  1.2.3.4  " });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to X-Real-IP when XFF missing", () => {
    const req = makeRequest({ "x-real-ip": "9.9.9.9" });
    expect(getClientIp(req)).toBe("9.9.9.9");
  });

  it("returns null when no IP headers", () => {
    const req = makeRequest({});
    expect(getClientIp(req)).toBeNull();
  });
});
