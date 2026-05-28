import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { ForOwner } from "./ForOwner";

describe("ForOwner", () => {
  it("renders eyebrow, headline, body, bullets, and screenshot", () => {
    const html = renderToString(
      <ForOwner
        id="owner"
        t={{
          eyebrow: "04 / Для собственника",
          headline: "Вы видите всё. С телефона. В любой момент.",
          body: "Касса работает в магазине.",
          bullets: ["Bullet 1", "Bullet 2", "Bullet 3"],
        }}
      />,
    );
    expect(html).toContain('id="owner"');
    expect(html).toContain("Вы видите всё");
    expect(html).toContain("Bullet 1");
    expect(html).toContain("Bullet 2");
    expect(html).toContain("Bullet 3");
    expect(html).toContain('alt="Отчёты BirLiy"');
  });
});
