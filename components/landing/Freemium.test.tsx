import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { Freemium } from "./Freemium";
import { dicts } from "@/lib/landing/i18n";

describe("Freemium", () => {
  it("renders price rail, body, bullets, and CTA pointing to lead form", () => {
    const html = renderToString(<Freemium id="freemium" t={dicts.ru.freemium} />);
    expect(html).toContain('id="freemium"');
    expect(html).toContain(dicts.ru.freemium.priceAmount);
    expect(html).toContain(dicts.ru.freemium.priceUnit);
    expect(html).toContain(dicts.ru.freemium.priceNote);
    expect(html).toContain(dicts.ru.freemium.body);
    expect(html).toContain(dicts.ru.freemium.cta);
    expect(html).toContain('href="#lead"');
    for (const bullet of dicts.ru.freemium.bullets) {
      expect(html).toContain(bullet.title);
    }
  });
});
