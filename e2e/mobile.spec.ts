import { test, expect, type Page } from "@playwright/test";

// ──────────────────────────────────────────────────────────────
// BirLiy — mobile regression suite (live ConceptLanding + blog).
// Locale is URL-driven: / = Uzbek (primary), /ru = Russian.
// Covers: no horizontal overflow, mobile menu, hero CTA, sticky CTA
// visibility logic, lead form open/close, demo role toggle, demo
// horizontal nav touch targets, and blog chrome touch targets — at
// 320 / 360 / 390 / 430px, with RU and UZ parity.
// ──────────────────────────────────────────────────────────────

const WIDTHS = [320, 360, 390, 430] as const;

const LOCALES = [
  { path: "/", lang: "uz", cta: "Ariza qoldirish", close: "Yopish" },
  { path: "/ru", lang: "ru", cta: "Оставить заявку", close: "Закрыть" },
] as const;

const ARTICLE = "pos-tizimi-uzbekistan-minimarket";

async function expectNoHOverflow(page: Page, label: string) {
  const { scrollW, clientW } = await page.evaluate(() => {
    const d = document.documentElement;
    return { scrollW: d.scrollWidth, clientW: d.clientWidth };
  });
  expect(scrollW, `${label}: horizontal overflow (${scrollW} > ${clientW})`).toBeLessThanOrEqual(clientW + 1);
}

// ─── Layout: no document-level horizontal overflow, all widths × locales ───
for (const width of WIDTHS) {
  test.describe(`layout @${width}px`, () => {
    test.use({ viewport: { width, height: 820 }, hasTouch: true });

    for (const { path, lang } of LOCALES) {
      test(`${path} (${lang}) landing has no horizontal overflow`, async ({ page }) => {
        const res = await page.goto(path);
        expect(res?.status()).toBe(200);
        await expectNoHOverflow(page, `landing ${path}`);
      });
    }

    test("blog index + article have no horizontal overflow (uz + ru parity)", async ({ page }) => {
      for (const url of ["/blog", `/blog/${ARTICLE}`, "/ru/blog", `/ru/blog/${ARTICLE}`]) {
        await page.goto(url);
        await expectNoHOverflow(page, url);
      }
    });
  });
}

// ─── Interactions: representative width, both locales ───
test.describe("interactions @390px", () => {
  test.use({ viewport: { width: 390, height: 820 }, hasTouch: true });

  for (const { path, lang, cta, close } of LOCALES) {
    test(`${path} (${lang}) mobile menu opens and closes`, async ({ page }) => {
      await page.goto(path);
      const menu = page.locator("#concept-mobile-menu");
      await expect(menu).toBeHidden();
      await page.getByRole("button", { name: "Menu" }).click();
      await expect(menu).toBeVisible();
      await page.getByRole("button", { name: "Menu" }).click();
      await expect(menu).toBeHidden();
    });

    test(`${path} (${lang}) hero/menu CTA opens the lead modal, scrolls to submit, closes`, async ({ page }) => {
      await page.goto(path);
      // The header CTA is desktop-only; on mobile the lead modal opens from the menu.
      await page.getByRole("button", { name: "Menu" }).click();
      await page.locator("#concept-mobile-menu").getByRole("button", { name: cta }).click();

      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();

      const submit = dialog.locator('button[type="submit"]');
      await submit.scrollIntoViewIfNeeded();
      await expect(submit).toBeVisible();

      // Close via the visible close button (not only Escape).
      await dialog.getByRole("button", { name: close }).click();
      await expect(dialog).toBeHidden();
    });

    test(`${path} (${lang}) lead modal also closes on Escape`, async ({ page }) => {
      await page.goto(path);
      await page.getByRole("button", { name: "Menu" }).click();
      await page.locator("#concept-mobile-menu").getByRole("button", { name: cta }).click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    });

    test(`${path} (${lang}) sticky CTA: hidden in hero, visible mid-page, hidden at lead + footer`, async ({ page }) => {
      await page.goto(path);
      const sticky = page.getByTestId("mobile-sticky");

      // Top of page: the hero has its own CTA, so the sticky bar stays hidden.
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(sticky).toHaveAttribute("aria-hidden", "true");

      // Mid-page (past the hero, before the lead section): sticky shows.
      const flowY = await page.evaluate(
        () => (document.getElementById("flow")?.getBoundingClientRect().top ?? 0) + window.scrollY,
      );
      await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, flowY - 150));
      await expect(sticky).toHaveAttribute("aria-hidden", "false");
      await expect(sticky).toBeInViewport();

      // Lead section in view: sticky hides so it never overlaps the lead CTA.
      await page.locator("#lead").scrollIntoViewIfNeeded();
      await expect(sticky).toHaveAttribute("aria-hidden", "true");

      // Footer in view: sticky hides so it never overlaps footer/language links.
      await page.locator("footer").scrollIntoViewIfNeeded();
      await expect(sticky).toHaveAttribute("aria-hidden", "true");
    });

    test(`${path} (${lang}) sticky CTA hides while the lead modal is open`, async ({ page }) => {
      await page.goto(path);
      const sticky = page.getByTestId("mobile-sticky");
      const flowY = await page.evaluate(
        () => (document.getElementById("flow")?.getBoundingClientRect().top ?? 0) + window.scrollY,
      );
      await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, flowY - 150));
      await expect(sticky).toHaveAttribute("aria-hidden", "false");

      await sticky.getByRole("button", { name: cta }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(sticky).toHaveAttribute("aria-hidden", "true");
    });

    test(`${path} (${lang}) hidden sticky CTA is inert (not focusable or clickable)`, async ({ page }) => {
      await page.goto(path);
      const sticky = page.getByTestId("mobile-sticky");
      const button = sticky.locator("button");

      // At the top the bar is hidden -> inert; its button cannot take focus.
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(sticky).toHaveJSProperty("inert", true);
      const focusedWhenHidden = await button.evaluate((b) => {
        (b as HTMLElement).focus();
        return document.activeElement === b;
      });
      expect(focusedWhenHidden).toBe(false);

      // Mid-page the bar shows -> not inert; its button is focusable again.
      const flowY = await page.evaluate(
        () => (document.getElementById("flow")?.getBoundingClientRect().top ?? 0) + window.scrollY,
      );
      await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, flowY - 150));
      await expect(sticky).toHaveJSProperty("inert", false);
      const focusedWhenShown = await button.evaluate((b) => {
        (b as HTMLElement).focus();
        return document.activeElement === b;
      });
      expect(focusedWhenShown).toBe(true);
    });

    test(`${path} (${lang}) cashier/owner demo toggle works`, async ({ page }) => {
      await page.goto(path);
      const reveal = page.locator("#reveal");
      await reveal.scrollIntoViewIfNeeded();
      const toggles = reveal.locator("button[aria-pressed]");
      await expect(toggles).toHaveCount(2);
      const cashier = toggles.nth(0);
      const owner = toggles.nth(1);
      await expect(cashier).toHaveAttribute("aria-pressed", "true");
      await owner.click();
      await expect(owner).toHaveAttribute("aria-pressed", "true");
      await expect(cashier).toHaveAttribute("aria-pressed", "false");
    });

    test(`${path} (${lang}) demo horizontal nav is usable with >=44px targets`, async ({ page }) => {
      await page.goto(path);
      await page.locator("#reveal").scrollIntoViewIfNeeded();
      const nav = page.getByTestId("demo-mobile-nav");
      await expect(nav).toBeVisible();
      const buttons = nav.getByRole("button");
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const box = await buttons.nth(i).boundingBox();
        expect(box, `demo nav button ${i} missing box`).not.toBeNull();
        expect(box!.height, `demo nav button ${i} height ${box!.height}px`).toBeGreaterThanOrEqual(44);
      }
      await buttons.nth(Math.min(1, count - 1)).click();
      await expectNoHOverflow(page, "after demo nav tap");
    });
  }

  test("blog header + footer touch targets are >=44px", async ({ page }) => {
    await page.goto(`/blog/${ARTICLE}`);
    const links = page.locator("header a, footer a");
    const n = await links.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const box = await links.nth(i).boundingBox();
      if (!box) continue;
      expect(box.height, `blog chrome link ${i} height ${box.height}px`).toBeGreaterThanOrEqual(44);
    }
  });
});
