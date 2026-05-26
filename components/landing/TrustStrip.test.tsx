import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { TrustStrip } from "./TrustStrip";

describe("TrustStrip", () => {
  it("renders 3 trust items", () => {
    const html = renderToString(
      <TrustStrip
        t={{
          bank: "Продукт Ipak Yuli Bank",
          catalogSize: "9 000+ товаров в базе",
          pilot: "Open pilot 2026",
        }}
      />,
    );
    expect(html).toContain("Продукт Ipak Yuli Bank");
    expect(html).toContain("9 000+ товаров в базе");
    expect(html).toContain("Open pilot 2026");
    expect(html).toContain("border-mist");
  });

  it("renders 3 separator dots between items (not after last)", () => {
    const html = renderToString(
      <TrustStrip t={{ bank: "A", catalogSize: "B", pilot: "C" }} />,
    );
    const separators = (html.match(/aria-hidden/g) ?? []).length;
    expect(separators).toBe(2);
  });
});
