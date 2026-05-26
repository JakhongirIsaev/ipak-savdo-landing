import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { EarlyAccess } from "./EarlyAccess";
import { dicts } from "@/lib/landing/i18n";

describe("EarlyAccess", () => {
  it("renders 3 promises with numbered prefix", () => {
    const html = renderToString(<EarlyAccess t={dicts.ru.earlyAccess} />);
    expect(html).toContain(dicts.ru.earlyAccess.headline);
    // React SSR inserts comment nodes between adjacent text: "0<!-- -->1"
    expect(html).toMatch(/0(<!-- -->)?1/);
    expect(html).toMatch(/0(<!-- -->)?2/);
    expect(html).toMatch(/0(<!-- -->)?3/);
    for (const promise of dicts.ru.earlyAccess.promises) {
      expect(html).toContain(promise.title);
    }
    expect(dicts.ru.earlyAccess.promises.length).toBe(3);
  });
});
