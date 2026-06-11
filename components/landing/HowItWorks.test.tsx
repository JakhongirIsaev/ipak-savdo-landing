import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { HowItWorks } from "./HowItWorks";
import { dicts } from "@/lib/landing/i18n";

describe("HowItWorks", () => {
  it("renders a real photo, all 6 steps, headline, cta and id anchor", () => {
    const t = dicts.ru;
    const html = renderToString(
      <HowItWorks id="how-it-works" t={t.howItWorks} ctaLabel={t.cta} />,
    );
    expect(html).toContain('id="how-it-works"');
    expect(html).toContain(t.howItWorks.headline);
    expect(html).toContain(t.howItWorks.intro);
    expect(html).toContain(t.cta);

    // Real photo, not a drawn mockup or a test-data screenshot.
    expect(html).toContain("/photos/pay-counter.jpg");
    expect(html).not.toContain("/product/16-kassa-empty.png");

    for (const step of t.howItWorks.steps) {
      expect(html).toContain(step.label);
    }
  });
});
