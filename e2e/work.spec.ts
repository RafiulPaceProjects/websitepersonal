import { test, expect, type Page } from "@playwright/test";

// Work menu (components/hero-film.tsx) and the three case pages.
async function dismissLoader(page: Page) {
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await page.locator(".intro").click();
  await expect(page.locator(".intro")).toHaveCount(0, { timeout: 2000 });
  // The nav arrives with the film blur, at most ~6.5s after load.
  await expect(page.locator(".film-nav")).toBeVisible({ timeout: 20000 });
}

test("Work menu drops three buttons linking to the case pages", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await dismissLoader(page);

  const button = page.locator(".film-menu-button");
  await expect(button).toHaveText("Work");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".film-menu-list")).toHaveCount(0);

  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  const links = page.locator(".film-menu-list a");
  await expect(links).toHaveText([
    "TINDS",
    "EZ Living Home Care",
    "Secure Safer Insurance & Advocacy",
  ]);
  await expect(links.nth(0)).toHaveAttribute("href", "/work/tinds");
  await expect(links.nth(1)).toHaveAttribute("href", "/work/ez-living");
  await expect(links.nth(2)).toHaveAttribute("href", "/work/secure-safer");

  // Clicking elsewhere closes it again.
  await page.locator(".film-headline").click();
  await expect(page.locator(".film-menu-list")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("menu stays open while moving from Work to a link, on desktop and 320px", async ({
  page,
}) => {
  await dismissLoader(page);

  // Open by click (tap path on touch, pin path on desktop).
  await page.locator(".film-menu-button").click();
  const list = page.locator(".film-menu-list");
  await expect(list).toBeVisible();

  // Travel down to the first link the way a visitor does; it must survive.
  await list.locator("a").nth(0).hover();
  await expect(list).toBeVisible();
  await list.locator("a").nth(0).click();
  await expect(page).toHaveURL("/work/tinds");
  await expect(page.locator("h1")).toHaveText(
    "Where I learned to make stories sell.",
  );

  // At the smallest phone width the open menu fits on screen and the
  // destination is reachable by touch-sized targets.
  await dismissLoader(page);
  await page.setViewportSize({ width: 320, height: 568 });
  await page.locator(".film-menu-button").click();
  await expect(page.locator(".film-menu-list")).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  const linkBox = await page.locator(".film-menu-list a").nth(2).boundingBox();
  expect(linkBox!.height).toBeGreaterThanOrEqual(44);
  await page.locator(".film-menu-list a").nth(2).click();
  await expect(page).toHaveURL("/work/secure-safer");
});

test("Work menu opens by keyboard and closes on Escape", async ({ page }) => {
  await dismissLoader(page);

  const button = page.locator(".film-menu-button");
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".film-menu-list")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".film-menu-list")).toHaveCount(0);
  await expect(button).toBeFocused();
});

test("each case page renders its story and links back home", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  // TINDS has its own page shape; covered in tinds.spec.ts.
  const cases = [
    {
      slug: "ez-living",
      title: "EZ Living Home Care",
      meta: "WordPress Website Maintenance · 2022 – 2023 · Remote",
    },
    {
      slug: "secure-safer",
      title: "Secure Safer Insurance & Advocacy",
      meta: "CSR and IT Support · July 2024 – now · Remote → Queens, NY",
    },
  ];
  for (const item of cases) {
    await page.goto(`/work/${item.slug}`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(item.title);
    await expect(page.locator(".case-meta")).toHaveText(item.meta);
  }
  // The back link returns to the homepage film.
  await page.locator(".case-back a").click();
  await expect(page).toHaveURL("/");
  await expect(page.locator(".film-headline")).toHaveText(
    "I make the messy bits make sense.",
  );
  expect(errors).toEqual([]);
});
