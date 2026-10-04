import { test, expect, type Page } from "@playwright/test";

// Screen 0 hero (components/hero-film.tsx): harbor loop behind the UI.
async function dismissLoader(page: Page) {
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await page.locator(".intro").click();
  await expect(page.locator(".intro")).toHaveCount(0, { timeout: 2000 });
}

test("hero plays the harbor loop behind the headline", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await dismissLoader(page);

  const video = page.locator(".film-video");
  await expect(video).toBeVisible();
  await expect(video.locator('source[type="video/webm"]')).toHaveAttribute(
    "src",
    "/hero/main-homepage-loop.web.webm",
  );
  await expect(video.locator('source[type="video/mp4"]')).toHaveAttribute(
    "src",
    "/hero/main-homepage-loop.web.mp4",
  );
  await expect(page.locator(".film-headline")).toHaveText("Messy in. Useful out.");
  await expect(page.locator(".film-card-name")).toHaveText("Rafiul Haider");
  await expect(page.locator(".film-cta a")).toHaveAttribute(
    "href",
    "mailto:rafiul.haider@pace.edu",
  );
  // Fact lines type out in the card once the film blurs, then rotate.
  await expect(page.locator(".film-where")).toContainText("Data Science", {
    timeout: 20000,
  });
  await expect(page.locator(".film-where")).toContainText("Secure Safer", {
    timeout: 25000,
  });
  await expect(
    video.evaluate((v: HTMLVideoElement) => v.playbackRate),
  ).resolves.toBe(1);

  // Actually advancing, not a still frame.
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime), {
      timeout: 5000,
    })
    .toBeGreaterThan(0.5);
  expect(errors).toEqual([]);
});

test("hero keeps its poster fallback and single H1", async ({ page }) => {
  await dismissLoader(page);
  await expect(page.locator(".film-poster")).toHaveAttribute(
    "src",
    /main-homepage-poster/,
  );
  await expect(page.locator("h1")).toHaveCount(1);
});

test("video blurs out and copy rises, then stays blurred", async ({ page }) => {
  await dismissLoader(page);
  const video = page.locator(".film-video");
  await video.evaluate((v: HTMLVideoElement) => {
    v.currentTime = 6;
  });
  await expect(video).toHaveCSS("filter", /blur\(12px\)/, { timeout: 8000 });
  await expect(page.locator(".film-bottom")).toBeVisible();
  // Palindrome file: 16s forward-then-reverse, wraps without a cut.
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.duration), {
      timeout: 8000,
    })
    .toBeGreaterThan(15);
  await video.evaluate((v: HTMLVideoElement) => {
    v.currentTime = 15.5;
  });
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime), {
      timeout: 10000,
    })
    .toBeLessThan(2);
  await expect(video).toHaveCSS("filter", /blur\(12px\)/);
});

test("nav points at real destinations, page never scrolls", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await dismissLoader(page);

  await expect(page.locator('.film-nav a:has-text("Work")')).toHaveAttribute(
    "href",
    "https://www.tinds.com",
  );
  await expect(
    page.locator('.film-nav a:has-text("Background")'),
  ).toHaveAttribute("href", /doi\.org/);
  await expect(page.locator('.film-nav a:has-text("Contact")')).toHaveAttribute(
    "href",
    "mailto:rafiul.haider@pace.edu",
  );
  // Single screen: nothing below the fold on desktop or phone.
  for (const size of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
});

test("reduced motion shows the still poster, not the video", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".film-video")).toBeHidden();
  await expect(page.locator(".film-poster")).toBeVisible();
  await context.close();
});
