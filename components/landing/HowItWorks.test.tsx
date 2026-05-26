import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { HowItWorks } from "./HowItWorks";

describe("HowItWorks", () => {
  it("renders 6 steps with screenshots and id anchor", () => {
    const t = {
      eyebrow: "02 / Как проходит продажа",
      headline: "Продажа за 15 секунд",
      intro: "Один экран. Шесть шагов.",
      steps: [
        { num: "01", label: "Скан товара", caption: "Сканер или поиск" },
        { num: "02", label: "Корзина", caption: "Меняйте кол-во" },
        { num: "03", label: "К оплате", caption: "Выберите способ" },
        { num: "04", label: "Оплата", caption: "Наличные/QR/Карта" },
        { num: "05", label: "Оплачено", caption: "Подтверждение" },
        { num: "06", label: "Чек в Telegram", caption: "Уходит покупателю" },
      ],
    };
    const html = renderToString(<HowItWorks id="how-it-works" t={t} />);
    expect(html).toContain('id="how-it-works"');
    expect(html).toContain("Продажа за 15 секунд");
    expect(html).toContain("Один экран. Шесть шагов.");
    const liCount = (html.match(/<li[^>]*class="step"/g) ?? []).length;
    expect(liCount).toBe(6);
    expect(html).toContain("/product/16-kassa-empty.png");
    expect(html).toContain("/product/17-kassa-item-added.png");
    expect(html).toContain("/product/18-payment-screen.png");
    expect(html).toContain("/product/19-payment-cash.png");
    expect(html).toContain("/product/20-payment-success.png");
    expect(html).toContain("/product/06-telegram-receipt-mockup.svg");
  });
});
