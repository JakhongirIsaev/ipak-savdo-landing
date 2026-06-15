import { test, expect } from "@playwright/test";

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

test("/ loads in Uzbek (primary)", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "uz");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();
  // Hero: "BirLiy ... bitta ekranda ko'rsatadi."
  await expect(h1).toContainText("bitta ekranda");
});

test("/ru loads in Russian", async ({ page }) => {
  const response = await page.goto("/ru");
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();
  // Hero: "BirLiy показывает ... в одном экране."
  await expect(h1).toContainText("BirLiy показывает");
});

test("renders all live sections (RU)", async ({ page }) => {
  await page.goto("/ru");
  for (const id of LIVE_SECTION_IDS) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  }
});

test("header nav links scroll to their sections (RU)", async ({ page }) => {
  await page.goto("/ru");
  const header = page.locator("header");
  for (const [label, id] of [
    ["Сценарий", "flow"],
    ["Владелец", "owner"],
    ["Модули", "modules"],
  ] as const) {
    await header.getByRole("link", { name: label, exact: true }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 5_000 });
  }
});

test("footer language pill navigates /ru → / (RU → UZ)", async ({ page }) => {
  await page.goto("/ru");
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await footer.getByRole("link", { name: "UZ", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "uz");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("bitta ekranda");
});

test("footer language pill navigates / → /ru (UZ → RU)", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await footer.getByRole("link", { name: "RU", exact: true }).click();
  await expect(page).toHaveURL(/\/ru$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("BirLiy показывает");
});

test("lead modal opens from the header CTA and blocks an empty submit (RU)", async ({ page }) => {
  await page.goto("/ru");

  // Header CTA (desktop-visible) opens the lead modal.
  await page.locator("header").getByRole("button", { name: "Оставить заявку" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // Submitting with the required contact fields empty must not pass native validation.
  await dialog.locator('button[type="submit"]').click();
  const ownerName = dialog.locator('input[name="owner_name"]');
  const valueMissing = await ownerName.evaluate((el) => (el as HTMLInputElement).validity.valueMissing);
  expect(valueMissing).toBe(true);

  // Modal closes via its visible close button.
  await dialog.getByRole("button", { name: "Закрыть" }).click();
  await expect(dialog).toBeHidden();
});

test("footer is visible at the bottom with the copyright line (RU)", async ({ page }) => {
  await page.goto("/ru");
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeVisible();
  await expect(footer.getByText("© 2026 BirLiy.")).toBeVisible();
});
