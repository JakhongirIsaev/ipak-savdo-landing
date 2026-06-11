import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { TrustStrip } from "./TrustStrip";

describe("TrustStrip", () => {
  it("renders 3 trust items", () => {
    const html = renderToString(
      <TrustStrip
        t={{
          bank: "Сделано для Узбекистана",
          catalogSize: "9 000+ товаров в базе",
          pilot: "Open pilot 2026",
        }}
      />,
    );
    expect(html).toContain("Сделано для Узбекистана");
    expect(html).toContain("9 000+ товаров в базе");
    expect(html).toContain("Open pilot 2026");
    expect(html).toContain("border-mist");
  });

  it("renders one green check chip per trust item", () => {
    const html = renderToString(
      <TrustStrip t={{ bank: "A", catalogSize: "B", pilot: "C" }} />,
    );
    const chips = (html.match(/rounded-full bg-green-50/g) ?? []).length;
    expect(chips).toBe(3);
  });
});
