import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { FAQ } from "./FAQ";
import { dicts } from "@/lib/landing/i18n";

describe("FAQ", () => {
  it("renders 9 Q&A items (RU)", () => {
    expect(dicts.ru.faq.length).toBe(9);
    const html = renderToString(<FAQ t={dicts.ru} />);
    for (const [question] of dicts.ru.faq) {
      expect(html).toContain(question);
    }
  });

  it("renders 9 Q&A items (UZ)", () => {
    expect(dicts.uz.faq.length).toBe(9);
  });

  it("does not mention fiscalization", () => {
    const json = JSON.stringify(dicts);
    expect(json).not.toMatch(/фискал/i);
    expect(json).not.toMatch(/fiskal/i);
    expect(json).not.toMatch(/fiscal/i);
  });
});
