import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { Pain } from "./Pain";

describe("Pain", () => {
  it("renders eyebrow, headline, and body", () => {
    const html = renderToString(
      <Pain t={{ eyebrow: "01 / Знакомо?", headline: "Касса отдельно. Склад отдельно.", body: "Кассир пробивает чек на одном устройстве." }} />,
    );
    expect(html).toContain("01 / Знакомо?");
    expect(html).toContain("Касса отдельно. Склад отдельно.");
    expect(html).toContain("Кассир пробивает чек на одном устройстве.");
    expect(html).toContain("text-balance");
  });
});
