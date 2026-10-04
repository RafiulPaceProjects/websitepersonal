import { test, expect } from "@playwright/test";

test("homepage loads with a visible heading and no page errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto("/");
  await expect(page).toHaveTitle(/.+/);

  const heading = page.locator("h1").first();
  await expect(heading).toBeVisible();

  expect(errors).toEqual([]);
});

test("masthead carries the RAF.DEV wordmark, hero keeps the single name H1", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".mast-name")).toHaveText("RAF.DEV");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("Rafiul");
});

test("hero offers a visible email call to action", async ({ page }) => {
  await page.goto("/");
  // Dismiss the intro loader if it is still on stage.
  await page.mouse.click(8, 8).catch(() => {});
  const cta = page.locator(".hero-cta-link");
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "mailto:rafiul.haider@pace.edu");
});

test("work stages link out and toolbox has no empty cells", async ({
  page,
}) => {
  await page.goto("/");
  await page.mouse.click(8, 8).catch(() => {});
  const tinds = page.locator(".arena-tinds");
  await expect(
    tinds.locator('.stage-visit a[href="https://www.tinds.com"]'),
  ).toBeVisible();
  await expect(tinds.locator(".level-numeral")).toHaveText("01");
  for (const row of await page.locator(".spec-sheet tr").all()) {
    await expect(row.locator("th, td")).toHaveCount(2);
  }
});
