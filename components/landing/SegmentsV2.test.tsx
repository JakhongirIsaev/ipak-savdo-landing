import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { SegmentsV2 } from "./SegmentsV2";
import { dicts } from "@/lib/landing/i18n";

describe("SegmentsV2", () => {
  it("renders 5 segment cards (RU)", () => {
    const html = renderToString(<SegmentsV2 id="segments" t={dicts.ru.segmentsV2} />);
    expect(html).toContain('id="segments"');
    expect(html).toContain(dicts.ru.segmentsV2.headline);
    for (const card of dicts.ru.segmentsV2.cards) {
      expect(html).toContain(card.title);
    }
    expect(dicts.ru.segmentsV2.cards.length).toBe(5);
  });
});
