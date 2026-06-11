import { test, expect, type Page } from "@playwright/test";

// ──────────────────────────────────────────────────────────────
// BirLiy landing — smoke suite.
// Locale is URL-driven for SEO:
//   /     → Uzbek (primary)
//   /ru   → Russian
// The RU/UZ pill navigates between the two URLs.
// Selectors are anchored to section IDs and unique RU/UZ phrases
// from lib/landing/i18n.ts.
// ──────────────────────────────────────────────────────────────

const RU_TITLE = "Ваш бизнес. В одном месте.";
const UZ_TITLE = "Sizning biznesingiz. Bitta joyda.";

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
  { kind: "text" as const, value: "Сделано для Узбекистана" },
  { kind: "heading" as const, value: /Касса отдельно/i },
  { kind: "heading" as const, value: /Меньше частей\./i },
  { kind: "heading" as const, value: /Почему BirLiy/i },
  { kind: "heading" as const, value: /Мы запускаемся с первой когортой/i },
];

async function dismissCookieIfPresent(page: Page) {
  const banner = page.getByText(/Мы используем cookies|cookie/i, { exact: false }).first();
  if (await banner.isVisible().catch(() => false)) {
    const accept = page.getByRole("button", { name: /Принять|Qabul/i }).first();
    if (await accept.isVisible().catch(() => false)) await accept.click();
  }
}

test("/ loads in Uzbek (primary)", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: UZ_TITLE })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "uz");
});

test("/ru loads in Russian", async ({ page }) => {
  const response = await page.goto("/ru");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: RU_TITLE })).toBeVisible();
});

test("renders all primary sections (RU)", async ({ page }) => {
  await page.goto("/ru");
  await dismissCookieIfPresent(page);

  for (const id of SECTIONS_WITH_ID) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  }

  for (const s of SECTIONS_BY_HEADING_RU) {
    const locator =
      s.kind === "heading"
        ? page.getByRole("heading", { name: s.value })
        : page.getByText(s.value, { exact: false }).first();
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
  }
});

test("language pill navigates /ru → / (RU → UZ)", async ({ page }) => {
  await page.goto("/ru");
  await dismissCookieIfPresent(page);
  await expect(page.getByRole("heading", { name: RU_TITLE })).toBeVisible();

  await page.getByRole("button", { name: "UZ" }).first().click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: UZ_TITLE })).toBeVisible();
});

test("language pill navigates / → /ru (UZ → RU)", async ({ page }) => {
  await page.goto("/");
  await dismissCookieIfPresent(page);
  await expect(page.getByRole("heading", { name: UZ_TITLE })).toBeVisible();

  await page.getByRole("button", { name: "RU" }).first().click();

  await expect(page).toHaveURL(/\/ru$/);
  await expect(page.getByRole("heading", { name: RU_TITLE })).toBeVisible();
});

test("nav links scroll to sections (RU)", async ({ page }) => {
  await page.goto("/ru");
  await dismissCookieIfPresent(page);

  for (const [label, id] of [
    ["Возможности", "capabilities"],
    ["Оборудование", "equipment"],
    ["FAQ", "faq"],
  ] as const) {
    const navBtn = page.getByRole("button", { name: label, exact: true }).first();
    await navBtn.click();
    const section = page.locator(`#${id}`);
    await expect(section).toBeInViewport({ timeout: 5_000 });
  }
});

test("lead form rejects empty submit (RU)", async ({ page }) => {
  await page.goto("/ru");
  await dismissCookieIfPresent(page);

  await page.route("**/api/lead", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }),
  );

  await page.locator("#lead").scrollIntoViewIfNeeded();
  const form = page.locator("#lead form");
  await expect(form).toBeVisible();

  await form.getByRole("button", { name: "Отправить заявку" }).click();

  const firstRequired = form.locator('input[name="owner_name"]');
  const isInvalid = await firstRequired.evaluate(
    (el) => (el as HTMLInputElement).validity.valueMissing,
  );
  expect(isInvalid).toBe(true);
});

test("cookie banner can be dismissed (RU)", async ({ page }) => {
  await page.goto("/ru");
  await page.evaluate(() => window.scrollTo(0, 400));

  const banner = page.getByText("Мы используем cookies", { exact: false });
  await expect(banner).toBeVisible();

  await page.getByRole("button", { name: "Принять" }).click();
  await expect(banner).toBeHidden();
});

test("footer is visible at bottom (RU)", async ({ page }) => {
  await page.goto("/ru");
  await dismissCookieIfPresent(page);

  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeVisible();
  await expect(footer.getByText("© 2026 BirLiy.")).toBeVisible();
});
