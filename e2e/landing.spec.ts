import { test, expect, type Page } from "@playwright/test";

// ──────────────────────────────────────────────────────────────
// BirLiy landing — smoke suite.
// Selectors are anchored to:
//   - section IDs verified in components/landing/*.tsx
//   - unique RU/UZ phrases from lib/landing/i18n.ts
// Some sections (Hero, TrustStrip, Pain, VoiceInsert, WhyBirliy,
// Roadmap, EarlyAccess, Footer, Cookie) have no DOM id, so we
// fall back to heading text / unique copy.
// ──────────────────────────────────────────────────────────────

const RU_TITLE = "Ваш бизнес. В одном месте.";
const UZ_TITLE = "Sizning biznesingiz. Bitta joyda.";
const RU_HERO_SUBTITLE_FRAGMENT = "BirLiy собирает кассу";
const UZ_HERO_SUBTITLE_FRAGMENT = "BirLiy kassa, ombor";

const SECTIONS_WITH_ID = [
  "how-it-works",
  "capabilities",
  "owner",
  "segments",
  "equipment",
  "freemium",
  "lead",
  "faq",
];

const SECTIONS_BY_HEADING_RU = [
  // TrustStrip uses dict.trustStrip.bank — no h-tag, locator by text
  { kind: "text" as const, value: "Продукт Ipak Yuli Bank" },
  // Pain
  { kind: "heading" as const, value: /Касса отдельно/i },
  // VoiceInsert
  { kind: "heading" as const, value: /Меньше частей\./i },
  // WhyBirliy
  { kind: "heading" as const, value: /Почему BirLiy/i },
  // Roadmap
  { kind: "heading" as const, value: /Что дальше/i },
  // EarlyAccess
  { kind: "heading" as const, value: /Мы запускаемся с первой когортой/i },
];

async function dismissCookieIfPresent(page: Page) {
  const banner = page.getByText("Мы используем cookies", { exact: false });
  if (await banner.isVisible().catch(() => false)) {
    await page.getByRole("button", { name: "Принять" }).click();
    await expect(banner).toBeHidden();
  }
}

test.beforeEach(async ({ page }) => {
  // Clean state for deterministic locale + cookie tests.
  await page.addInitScript(() => {
    try {
      window.localStorage.clear();
    } catch {
      /* ignore */
    }
  });
});

test("loads landing page successfully", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: RU_TITLE })).toBeVisible();
  await expect(page.getByText(RU_HERO_SUBTITLE_FRAGMENT)).toBeVisible();
});

test("renders all primary sections", async ({ page }) => {
  await page.goto("/");
  await dismissCookieIfPresent(page);

  // Sections with stable IDs.
  for (const id of SECTIONS_WITH_ID) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  }

  // Sections without IDs — anchor by unique heading / copy.
  for (const s of SECTIONS_BY_HEADING_RU) {
    const locator =
      s.kind === "heading"
        ? page.getByRole("heading", { name: s.value })
        : page.getByText(s.value, { exact: false }).first();
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
  }
});

test("language toggle switches RU → UZ", async ({ page }) => {
  await page.goto("/");
  await dismissCookieIfPresent(page);

  await expect(page.getByRole("heading", { name: RU_TITLE })).toBeVisible();

  // LangPill is rendered twice (header + footer). The header one is the first.
  const uzButton = page.getByRole("button", { name: "UZ" }).first();
  await uzButton.click();

  await expect(page.getByRole("heading", { name: UZ_TITLE })).toBeVisible();
  await expect(page.getByText(UZ_HERO_SUBTITLE_FRAGMENT)).toBeVisible();

  const stored = await page.evaluate(() => localStorage.getItem("birliy-locale"));
  expect(stored).toBe("uz");
});

test("language toggle switches UZ → RU", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("birliy-locale", "uz");
  });
  await page.goto("/");
  await dismissCookieIfPresent(page);

  await expect(page.getByRole("heading", { name: UZ_TITLE })).toBeVisible();

  const ruButton = page.getByRole("button", { name: "RU" }).first();
  await ruButton.click();

  await expect(page.getByRole("heading", { name: RU_TITLE })).toBeVisible();
  const stored = await page.evaluate(() => localStorage.getItem("birliy-locale"));
  expect(stored).toBe("ru");
});

test("nav links scroll to sections", async ({ page }) => {
  await page.goto("/");
  await dismissCookieIfPresent(page);

  for (const [label, id] of [
    ["Возможности", "capabilities"],
    ["Оборудование", "equipment"],
    ["FAQ", "faq"],
  ] as const) {
    // Header nav button has the localized label as its accessible name.
    const navBtn = page.getByRole("button", { name: label, exact: true }).first();
    await navBtn.click();

    const section = page.locator(`#${id}`);
    await expect(section).toBeInViewport({ timeout: 5_000 });
  }
});

test("lead form rejects empty submit", async ({ page }) => {
  await page.goto("/");
  await dismissCookieIfPresent(page);

  // Make sure we don't accidentally POST a real lead in case validation
  // is bypassed by a regression.
  await page.route("**/api/lead", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }),
  );

  await page.locator("#lead").scrollIntoViewIfNeeded();

  const form = page.locator("#lead form");
  await expect(form).toBeVisible();

  const submit = form.getByRole("button", { name: "Отправить заявку" });
  await submit.click();

  // First required input (business_name) should report invalid via the
  // native constraint API — the browser blocks submission so no fetch fires.
  const firstRequired = form.locator('input[name="business_name"]');
  const isInvalid = await firstRequired.evaluate(
    (el) => (el as HTMLInputElement).validity.valueMissing,
  );
  expect(isInvalid).toBe(true);
});

test("lead form rejects invalid phone (HTML5 type=tel + required)", async ({ page }) => {
  await page.goto("/");
  await dismissCookieIfPresent(page);

  await page.route("**/api/lead", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }),
  );

  await page.locator("#lead").scrollIntoViewIfNeeded();
  const form = page.locator("#lead form");

  await form.locator('input[name="business_name"]').fill("Test Shop");
  await form.locator('input[name="owner_name"]').fill("Jack Tester");
  // Leave phone empty → required validation must block submit
  await form.locator('input[name="owner_contact"]').fill("");

  await form.getByRole("button", { name: "Отправить заявку" }).click();

  const phoneInvalid = await form
    .locator('input[name="owner_contact"]')
    .evaluate((el) => (el as HTMLInputElement).validity.valueMissing);
  expect(phoneInvalid).toBe(true);
});

test("cookie banner can be dismissed", async ({ page }) => {
  await page.goto("/");

  const banner = page.getByText("Мы используем cookies", { exact: false });
  await expect(banner).toBeVisible();

  await page.getByRole("button", { name: "Принять" }).click();

  await expect(banner).toBeHidden();
  const flag = await page.evaluate(() => localStorage.getItem("birliy-cookie-ok"));
  expect(flag).toBe("true");
});

test("footer is visible at bottom", async ({ page }) => {
  await page.goto("/");
  await dismissCookieIfPresent(page);

  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeVisible();
  await expect(footer.getByText("© 2026 BirLiy. Продукт Ipak Yuli Bank.")).toBeVisible();
});
