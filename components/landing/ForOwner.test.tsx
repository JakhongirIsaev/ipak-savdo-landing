import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { ForOwner } from "./ForOwner";
import { dicts } from "@/lib/landing/i18n";

describe("ForOwner", () => {
  it("renders eyebrow, headline, bullets and a real photo (no drawn mock)", () => {
    const t = dicts.ru;
    const html = renderToString(<ForOwner id="owner" t={t.owner} />);
    expect(html).toContain('id="owner"');
    expect(html).toContain("Вы видите всё");
    for (const bullet of t.owner.bullets) {
      expect(html).toContain(bullet);
    }
    expect(html).toContain("/photos/owners-team.jpg");
    expect(html).not.toContain('alt="Отчёты BirLiy"');
  });
});
