import { test, expect } from "@playwright/test";

// The walking loader (components/intro.tsx): Rafiul on his short path, a wind gust,
// a rotating loading line, then it clears for the homepage.

test("loader shows the walking figure and the loading line, then clears", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto("/");
  const loader = page.locator(".intro");
  await expect(loader).toBeVisible();
  await expect(page.locator(".intro-video")).toBeVisible();
  await expect(page.locator(".intro-status canvas")).toBeVisible();
  await expect(page.locator(".intro-line")).toHaveText(/\.\.\.$/);
  await expect(page.locator(".intro-wind path")).toHaveCount(5);

  // Gone within its 5.6s cap (plus the fade).
  await expect(loader).toHaveCount(0, { timeout: 9000 });
  expect(errors).toEqual([]);
});

test("loader sits centered and inside a quarter of the viewport height", async ({
  page,
}) => {
  await page.goto("/");
  const figure = page.locator(".intro-figure");
  await expect(figure).toBeVisible();
  const box = (await figure.boundingBox())!;
  const viewport = page.viewportSize()!;

  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  expect(Math.abs(centerX - viewport.width / 2)).toBeLessThan(4);
  // The text line sits above the figure, so the figure is a little below center.
  expect(Math.abs(centerY - viewport.height / 2)).toBeLessThan(
    viewport.height * 0.06,
  );
  expect(box.height).toBeLessThanOrEqual(viewport.height * 0.25);
  expect(box.width).toBeLessThanOrEqual(viewport.width * 0.85);
});

test("the loading line rotates through its phrases", async ({ page }) => {
  await page.goto("/");
  const line = page.locator(".intro-line");
  await expect(line).toHaveText("wandering through...");
  await expect(line).not.toHaveText("wandering through...", { timeout: 4000 });
});

test("the wind gust draws its lines during the loader", async ({ page }) => {
  await page.goto("/");
  // The gust starts at 0.7s; by ~1.3s the lines are mid-flight and visible.
  await expect
    .poll(
      () =>
        page
          .locator(".intro-wind path")
          .evaluateAll((paths) =>
            paths.some((p) => Number(getComputedStyle(p).opacity) > 0.5),
          ),
      { timeout: 4000 },
    )
    .toBe(true);
});

test("click skips the loader and the page shell is usable", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await page.locator(".intro").click();
  await expect(page.locator(".intro")).toHaveCount(0, { timeout: 2000 });
  // Clean slate: no sections behind the loader yet, just the empty page shell.
  await expect(page.locator(".page")).toBeVisible();
  expect(errors).toEqual([]);
});

test("loader stays white on black in light and dark schemes", async ({
  browser,
}) => {
  for (const colorScheme of ["light", "dark"] as const) {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    await page.goto("/");
    const loader = page.locator(".intro");
    await expect(loader).toBeVisible();
    await expect(loader).toHaveCSS("background-color", "rgb(0, 0, 0)");
    await expect(page.locator(".intro-video")).toHaveCSS("filter", "invert(1)");
    await expect(page.locator(".intro-status canvas")).toBeVisible();
    await context.close();
  }
});

test("reduced motion skips the loader entirely", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".intro")).toHaveCount(0, { timeout: 2000 });
  await context.close();
});
