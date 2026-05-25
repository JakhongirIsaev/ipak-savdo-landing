import { describe, it, expect } from "vitest";
import { escapeHtml } from "./html-escape";

describe("escapeHtml", () => {
  it("escapes < and >", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes &", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("escapes quotes", () => {
    expect(escapeHtml(`"foo" 'bar'`)).toBe("&quot;foo&quot; &#39;bar&#39;");
  });

  it("returns empty string for null/undefined input", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("Hello, world")).toBe("Hello, world");
  });
});
