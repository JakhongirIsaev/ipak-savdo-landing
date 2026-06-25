import { test, expect, type Page } from "@playwright/test";

// ──────────────────────────────────────────────────────────────
// BirLiy landing — desktop smoke suite for the LIVE landing
// (components/concept/ConceptLanding.tsx). Locale is URL-driven:
//   /    → Uzbek (primary)
//   /ru  → Russian
// Selectors are anchored to live section IDs, the header nav links,
// the footer RU/UZ pills and the current hero copy.
// ──────────────────────────────────────────────────────────────

// Live section IDs rendered by ConceptLanding (a representative set).
const LIVE_SECTION_IDS = ["reveal", "flow", "owner", "modules", "faq", "lead"];

async function waitForLandingReady(page: Page, lang: "ru" | "uz") {
  await page.waitForFunction(
    (expected) => document.documentElement.dataset.birliyLandingReady === expected,
    lang,
  );
}

test("/ loads in Uzbek (primary)", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await waitForLandingReady(page, "uz");
  await expect(page.locator("html")).toHaveAttribute("lang", "uz");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();
  // Hero: direct mobile-first offer.
  await expect(h1).toContainText("bitta telefonda");
});

test("/ru loads in Russian", async ({ page }) => {
  const response = await page.goto("/ru");
  expect(response?.status()).toBe(200);
  await waitForLandingReady(page, "ru");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();
  // Hero: direct mobile-first offer.
  await expect(h1).toContainText("телефоне");
});

test("renders all live sections (RU)", async ({ page }) => {
  await page.goto("/ru");
  await waitForLandingReady(page, "ru");
  for (const id of LIVE_SECTION_IDS) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  }
});

test("header nav links scroll to their sections (RU)", async ({ page }) => {
  await page.goto("/ru");
  await waitForLandingReady(page, "ru");
  const header = page.locator("header");
  for (const [label, id] of [
    ["Как работает", "flow"],
    ["Владелец", "owner"],
    ["Возможности", "modules"],
    ["Блог", "blog"],
    ["Цена", "price"],
    ["Контакты", "lead"],
  ] as const) {
    await header.getByRole("link", { name: label, exact: true }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 5_000 });
  }
});

test("header nav links scroll to their sections (UZ)", async ({ page }) => {
  await page.goto("/");
  await waitForLandingReady(page, "uz");
  const header = page.locator("header");
  for (const [label, id] of [
    ["Qanday ishlaydi", "flow"],
    ["Egasi uchun", "owner"],
    ["Imkoniyatlar", "modules"],
    ["Blog", "blog"],
    ["Narx", "price"],
    ["Aloqa", "lead"],
  ] as const) {
    await header.getByRole("link", { name: label, exact: true }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 5_000 });
  }
});

test("lead modal asks for equipment bundle, not documents (UZ + RU)", async ({ page }) => {
  for (const { path, cta, title, equipment } of [
    { path: "/", cta: "Ariza qoldirish", title: "Ariza", equipment: "Menga jihoz kerak: planshet, skaner va chek printeri" },
    { path: "/ru", cta: "Оставить заявку", title: "Заявка", equipment: "Нужен комплект: планшет, сканер и чековый принтер" },
  ] as const) {
    await page.goto(path);
    await waitForLandingReady(page, path === "/ru" ? "ru" : "uz");
    await page.locator("header").getByRole("button", { name: cta }).click();
    const dialog = page.getByRole("dialog", { name: title });
    await expect(dialog).toBeVisible();
    await expect(dialog).not.toContainText(/Pilotga ariza|Заявка в пилот|Hujjat|Документ/i);
    await expect(dialog.locator('input[type="file"]')).toHaveCount(0);

    const equipmentToggle = dialog.getByRole("button", { name: equipment });
    await expect(equipmentToggle).toHaveAttribute("aria-pressed", "false");
    await equipmentToggle.click();
    await expect(equipmentToggle).toHaveAttribute("aria-pressed", "true");

    await dialog.getByRole("button", { name: path === "/" ? "Yopish" : "Закрыть" }).click();
    await expect(dialog).toBeHidden();
  }
});

test("public landing copy avoids old pilot application wording", async ({ page }) => {
  for (const path of ["/", "/ru"] as const) {
    await page.goto(path);
    await waitForLandingReady(page, path === "/ru" ? "ru" : "uz");
    await expect(page.locator("main")).not.toContainText(/Pilotga ariza|Заявка в пилот/i);
  }
});

test("landing blog stays shop-focused and does not promote football or AI categories", async ({ page }) => {
  await page.goto("/");
  await waitForLandingReady(page, "uz");
  const blog = page.locator("#blog");
  await blog.scrollIntoViewIfNeeded();

  await expect(blog).toContainText("Kassa");
  await expect(blog).toContainText("Ombor");
  await expect(blog).toContainText("Nasiya");
  await expect(blog.locator('a[href="/blog/category/football"]')).toHaveCount(0);
  await expect(blog.locator('a[href="/blog/category/ai-tech"]')).toHaveCount(0);
  await expect(blog.locator('a[href^="/blog/futbol-saboq-"]')).toHaveCount(0);
  await expect(blog.locator('a[href^="/blog/ai-"]')).toHaveCount(0);

  await blog.locator('a[href="/blog"]').first().click();
  await expect(page).toHaveURL(/\/blog$/);
});

test("RU landing blog stays shop-focused and does not promote football or AI categories", async ({ page }) => {
  await page.goto("/ru");
  await waitForLandingReady(page, "ru");
  const blog = page.locator("#blog");
  await blog.scrollIntoViewIfNeeded();

  await expect(blog).toContainText("Касса");
  await expect(blog).toContainText("Склад");
  await expect(blog).toContainText("Долги");
  await expect(blog.locator('a[href="/ru/blog/category/football"]')).toHaveCount(0);
  await expect(blog.locator('a[href="/ru/blog/category/ai-tech"]')).toHaveCount(0);
  await expect(blog.locator('a[href^="/ru/blog/futbol-saboq-"]')).toHaveCount(0);
  await expect(blog.locator('a[href^="/ru/blog/ai-"]')).toHaveCount(0);

  await blog.locator('a[href="/ru/blog"]').first().click();
  await expect(page).toHaveURL(/\/ru\/blog$/);
});

test("footer language pill navigates /ru → / (RU → UZ)", async ({ page }) => {
  await page.goto("/ru");
  await waitForLandingReady(page, "ru");
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await footer.getByRole("link", { name: "UZ", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await waitForLandingReady(page, "uz");
  await expect(page.locator("html")).toHaveAttribute("lang", "uz");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("bitta telefonda");
});

test("footer language pill navigates / → /ru (UZ → RU)", async ({ page }) => {
  await page.goto("/");
  await waitForLandingReady(page, "uz");
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await footer.getByRole("link", { name: "RU", exact: true }).click();
  await expect(page).toHaveURL(/\/ru$/);
  await waitForLandingReady(page, "ru");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("телефоне");
});

test("lead modal opens from the header CTA and blocks an empty submit (RU)", async ({ page }) => {
  await page.goto("/ru");
  await waitForLandingReady(page, "ru");

  // Header CTA (desktop-visible) opens the lead modal.
  await page.locator("header").getByRole("button", { name: "Оставить заявку" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // Submitting with the required contact fields empty must not pass native validation.
  await dialog.locator('button[type="submit"]').filter({ visible: true }).click();
  const ownerName = dialog.locator('input[name="owner_name"]');
  const valueMissing = await ownerName.evaluate((el) => (el as HTMLInputElement).validity.valueMissing);
  expect(valueMissing).toBe(true);

  // Modal closes via its visible close button.
  await dialog.getByRole("button", { name: "Закрыть" }).click();
  await expect(dialog).toBeHidden();
});

test("footer is visible at the bottom with the copyright line (RU)", async ({ page }) => {
  await page.goto("/ru");
  await waitForLandingReady(page, "ru");
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeVisible();
  await expect(footer.getByText("© 2026 BirLiy.")).toBeVisible();
});
