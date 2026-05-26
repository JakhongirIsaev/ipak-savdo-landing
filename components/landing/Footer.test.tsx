import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { Footer } from "./Footer";
import { dicts } from "@/lib/landing/i18n";

describe("Footer", () => {
  it("renders 4 columns + logo + phone link + copyright", () => {
    const html = renderToString(
      <Footer t={dicts.ru} locale="ru" switchLocale={() => {}} />,
    );
    // 4 column headers
    expect(html).toContain("Продукт");
    expect(html).toContain("Бизнесу");
    expect(html).toContain("Подключение");
    expect(html).toContain("Контакт");
    // phone as tel: link
    expect(html).toContain('href="tel:+998900000000"');
    expect(html).toContain("+998 90 000-00-00");
    // logo
    expect(html).toContain("/birliy-wordmark.svg");
    // copyright
    expect(html).toContain("© 2026 BirLiy");
    // tagline
    expect(html).toContain("Ваш бизнес. В одном месте.");
  });

  it("renders product links pointing to anchors", () => {
    const html = renderToString(
      <Footer t={dicts.ru} locale="ru" switchLocale={() => {}} />,
    );
    expect(html).toContain('href="#capabilities"');
    expect(html).toContain('href="#how-it-works"');
    expect(html).toContain('href="#faq"');
    expect(html).toContain('href="#lead"');
    expect(html).toContain('href="#equipment"');
    expect(html).toContain('href="#freemium"');
  });
});
