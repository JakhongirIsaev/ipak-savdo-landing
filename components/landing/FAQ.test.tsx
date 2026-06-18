import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { FAQ } from "./FAQ";
import { dicts } from "@/lib/landing/i18n";

describe("FAQ", () => {
  it("renders every Q&A item (RU)", () => {
    expect(dicts.ru.faq.length).toBeGreaterThanOrEqual(10);
    const html = renderToString(<FAQ t={dicts.ru} />);
    for (const [question] of dicts.ru.faq) {
      expect(html).toContain(question);
    }
  });

  it("keeps RU and UZ FAQ counts in parity", () => {
    expect(dicts.uz.faq.length).toBe(dicts.ru.faq.length);
  });

  it("no longer includes the removed shutdown/security questions", () => {
    const json = JSON.stringify(dicts);
    expect(json).not.toContain("А если BirLiy закроют?");
    expect(json).not.toContain("Что насчёт безопасности?");
    expect(json).not.toContain("BirLiy yopilib qolsa-chi?");
    expect(json).not.toContain("Xavfsizlik qanday?");
  });

  it("does not mention fiscalization", () => {
    const json = JSON.stringify(dicts);
    expect(json).not.toMatch(/фискал/i);
    expect(json).not.toMatch(/fiskal/i);
    expect(json).not.toMatch(/fiscal/i);
  });
});
