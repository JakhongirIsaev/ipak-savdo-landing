import { describe, it, expect } from "vitest";
import { buildLeadKeyboard, parseCallbackData } from "./buttons";

describe("buildLeadKeyboard", () => {
  it("returns an inline_keyboard as a column (4 rows of 1 button)", () => {
    const kb = buildLeadKeyboard(42, "new");
    expect(kb.inline_keyboard).toHaveLength(4);
    for (const row of kb.inline_keyboard) expect(row).toHaveLength(1);
  });

  it("each button has callback_data 'lead:{id}:{status}'", () => {
    const kb = buildLeadKeyboard(42, "new");
    const datas = kb.inline_keyboard.flat().map((b) => b.callback_data);
    expect(datas).toEqual([
      "lead:42:contacted",
      "lead:42:demo",
      "lead:42:won",
      "lead:42:lost",
    ]);
  });

  it("wraps the current-status button label with framing dots", () => {
    const kb = buildLeadKeyboard(42, "demo");
    const labels = kb.inline_keyboard.flat().map((b) => b.text);
    expect(labels[1]).toMatch(/^· .+ ·$/);
    expect(labels[0]).not.toMatch(/^· /);
  });

  it("callback_data is under 64 bytes (Telegram limit)", () => {
    const kb = buildLeadKeyboard(999999, "contacted");
    for (const btn of kb.inline_keyboard.flat()) {
      expect(Buffer.byteLength(btn.callback_data, "utf8")).toBeLessThanOrEqual(64);
    }
  });
});

describe("parseCallbackData", () => {
  it("parses well-formed callback_data", () => {
    expect(parseCallbackData("lead:42:contacted")).toEqual({
      leadId: 42,
      toStatus: "contacted",
    });
  });

  it("returns null on malformed input", () => {
    expect(parseCallbackData("garbage")).toBeNull();
    expect(parseCallbackData("lead:abc:won")).toBeNull();
    expect(parseCallbackData("lead:42:notastatus")).toBeNull();
    expect(parseCallbackData("lead:42")).toBeNull();
    expect(parseCallbackData("")).toBeNull();
  });
});
