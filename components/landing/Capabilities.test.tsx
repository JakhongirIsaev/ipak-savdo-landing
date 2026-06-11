import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { Capabilities } from "./Capabilities";
import { dicts } from "@/lib/landing/i18n";

describe("Capabilities", () => {
  it("renders 6 cards with titles and metrics (RU)", () => {
    const html = renderToString(<Capabilities t={dicts.ru} />);
    expect(html).toContain('id="capabilities"');
    expect(html).toContain(dicts.ru.capabilities.headline);
    for (const card of dicts.ru.capabilities.cards) {
      expect(html).toContain(card.title);
      expect(html).toContain(card.metric);
    }
    // One green icon-chip per card.
    const cardCount = (html.match(/rounded-2xl bg-green-50/g) ?? []).length;
    expect(cardCount).toBe(6);
  });

  it("renders 6 cards in UZ", () => {
    const html = renderToString(<Capabilities t={dicts.uz} />);
    // Apostrophes in UZ text are HTML-encoded as &#x27; in SSR output — check eyebrow instead
    expect(html).toContain(dicts.uz.capabilities.eyebrow);
    expect(html.match(/rounded-2xl bg-green-50/g)?.length).toBe(6);
  });
});
