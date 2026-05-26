import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { StackedBars, Funnel } from "./svg-chart";

describe("StackedBars", () => {
  it("renders an svg with one <g> per day", () => {
    const data = [
      { day: "2026-05-25", source: "instagram", count: 3 },
      { day: "2026-05-25", source: "direct", count: 2 },
      { day: "2026-05-26", source: "instagram", count: 1 },
    ];
    const html = renderToString(<StackedBars data={data} width={600} height={200} />);
    expect(html).toContain("<svg");
    expect(html).toContain('aria-label="Лиды по дням');
    const groups = html.match(/<g class="day"/g) ?? [];
    expect(groups.length).toBe(2);
  });

  it("renders nothing meaningful with empty data", () => {
    const html = renderToString(<StackedBars data={[]} width={600} height={200} />);
    expect(html).toContain("<svg");
    expect(html).not.toMatch(/<g class="day"/);
    expect(html).toContain("Нет данных за период");
  });

  it("does not duplicate Y-axis tick labels when maxTotal is small", () => {
    // With maxTotal=1, the old code would render "1 1 1 0" (Math.round of 0.25/0.5/0.75/1)
    const data = [{ day: "2026-05-26", source: "instagram", count: 1 }];
    const html = renderToString(<StackedBars data={data} width={600} height={200} />);
    // Extract Y-axis label numbers (text elements with text-anchor=end)
    const labels = [...html.matchAll(/<text[^>]*text-anchor="end"[^>]*>([^<]+)<\/text>/g)]
      .map((m) => m[1]);
    // Should be just ["1"], not ["1","1","1","0"]
    expect(labels).toEqual(["1"]);
  });

  it("uses integer ticks when maxTotal is 4 or less", () => {
    const data = [
      { day: "2026-05-25", source: "instagram", count: 3 },
      { day: "2026-05-26", source: "instagram", count: 1 },
    ];
    const html = renderToString(<StackedBars data={data} width={600} height={200} />);
    const labels = [...html.matchAll(/<text[^>]*text-anchor="end"[^>]*>([^<]+)<\/text>/g)]
      .map((m) => m[1]);
    expect(labels).toEqual(["1", "2", "3"]);
  });

  it("caps bar width at MAX_BAR_WIDTH (48px) for sparse data", () => {
    // With 1 day and width=600, the old code would render a bar ~558px wide
    const data = [{ day: "2026-05-26", source: "instagram", count: 1 }];
    const html = renderToString(<StackedBars data={data} width={600} height={200} />);
    const barWidths = [...html.matchAll(/<rect[^>]*width="([\d.]+)"/g)]
      .map((m) => parseFloat(m[1]));
    const maxBarW = Math.max(...barWidths);
    expect(maxBarW).toBeLessThanOrEqual(48);
  });
});

describe("Funnel", () => {
  it("renders 5 rows (one per status)", () => {
    const data = [
      { status: "new" as const, count: 240 },
      { status: "contacted" as const, count: 142 },
      { status: "demo" as const, count: 78 },
      { status: "won" as const, count: 34 },
      { status: "lost" as const, count: 16 },
    ];
    const html = renderToString(<Funnel data={data} width={600} />);
    expect(html).toContain("<svg");
    const rows = html.match(/<g class="row"/g) ?? [];
    expect(rows.length).toBe(5);
    expect(html).toContain("240");
    expect(html).toContain("100%");
  });

  it("handles zero-total gracefully (no division by zero)", () => {
    const data = [
      { status: "new" as const, count: 0 },
      { status: "contacted" as const, count: 0 },
      { status: "demo" as const, count: 0 },
      { status: "won" as const, count: 0 },
      { status: "lost" as const, count: 0 },
    ];
    const html = renderToString(<Funnel data={data} width={600} />);
    expect(html).toContain("0%");
    expect(html).not.toContain("NaN");
  });
});
