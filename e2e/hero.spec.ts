import { test, expect, type Page } from "@playwright/test";
import media from "../content/media.json";

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
    media.hero.webm,
  );
  await expect(video.locator('source[type="video/mp4"]')).toHaveAttribute(
    "src",
    media.hero.mp4,
  );
  await expect(page.locator(".film-headline")).toHaveText(
    "I make the messy bits make sense.",
  );
  await expect(page.locator(".film-card-name")).toHaveText("Rafiul Haider");
  await expect(page.locator(".film-cta a")).toHaveAttribute(
    "href",
    "https://mail.google.com/mail/?view=cm&fs=1&to=rafiul.haider%40pace.edu",
  );
  // Personality lines type out in the card once the film blurs, then rotate.
  await expect(page.locator(".film-where")).toContainText(
    "Curiosity, with a spreadsheet.",
    {
      timeout: 20000,
    },
  );
  await expect(page.locator(".film-where")).toContainText(
    "Less busywork. More brainwork.",
    {
      timeout: 25000,
    },
  );
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
  await page.setViewportSize({ width: 375, height: 667 });
  await expect
    .poll(() =>
      page
        .locator(".film-portrait img")
        .evaluate((img: HTMLImageElement) => img.currentSrc),
    )
    .toMatch(/\/media\/portrait-mobile-\d+\.[a-f0-9]+\.webp$/);
  const dimensions = await page.locator(".film-portrait").boundingBox();
  expect(dimensions!.width / dimensions!.height).toBeCloseTo(4 / 3, 1);
});

test("the profile and typing appear even when the background video fails", async ({
  page,
}) => {
  await page.route("**/media/harbor-loop.*", (route) => route.abort());
  await dismissLoader(page);
  await expect(page.locator(".film-card")).toBeVisible({ timeout: 20000 });
  await expect(page.locator(".film-where")).toContainText(
    "Curiosity, with a spreadsheet.",
    { timeout: 20000 },
  );
  await expect(page.locator(".film-cta a")).toBeVisible();
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

test("nav points at real destinations and the phone layout stays readable", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await dismissLoader(page);

  // Work is a menu button now; its three destinations live in work.spec.ts.
  await expect(page.locator(".film-nav .film-menu-button")).toHaveText("Work");
  await page.locator(".film-nav .film-menu-button").click();
  await expect(page.locator(".film-menu-list")).toBeVisible();
  await expect(
    page.locator('.film-nav a:has-text("Background")'),
  ).toHaveAttribute("href", /doi\.org/);
  await expect(page.locator('.film-nav a:has-text("Contact")')).toHaveAttribute(
    "href",
    "https://mail.google.com/mail/?view=cm&fs=1&to=rafiul.haider%40pace.edu",
  );
  await expect(page.locator(".film-bottom")).toBeVisible({ timeout: 20000 });
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollHeight - innerHeight,
    ),
  ).toBeLessThanOrEqual(1);
  // Desktop stays a single screen. Phones can scroll, with no sideways overflow.
  for (const size of [
    { width: 390, height: 844 },
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 414, height: 896 },
    { width: 344, height: 882 },
    { width: 720, height: 882 },
    { width: 844, height: 390 },
    { width: 768, height: 1024 },
    { width: 1032, height: 1376 },
    { width: 912, height: 1368 },
  ]) {
    await page.setViewportSize(size);
    const layout = await page.evaluate(() => ({
      horizontalOverflow:
        document.documentElement.scrollWidth - window.innerWidth,
      bodySize: parseFloat(
        getComputedStyle(document.querySelector(".film-sub")!).fontSize,
      ),
    }));
    expect(layout.horizontalOverflow).toBeLessThanOrEqual(1);
    expect(layout.bodySize).toBeGreaterThanOrEqual(16);
    await expect(page.locator(".film-card-where")).toBeVisible();
    await page.locator(".film-cta a").scrollIntoViewIfNeeded();
    await expect(page.locator(".film-cta a")).toBeInViewport();
  }
  expect(errors).toEqual([]);
});

test("wide touch tablets keep the profile above the introduction", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/");
  for (const size of [
    { width: 1376, height: 1032 },
    { width: 1368, height: 912 },
  ]) {
    await page.setViewportSize(size);
    const card = (await page.locator(".film-card").boundingBox())!;
    const copy = (await page.locator(".film-bottom").boundingBox())!;
    expect(card.y + card.height).toBeLessThan(copy.y);
    expect(Math.abs(card.x + card.width / 2 - size.width / 2)).toBeLessThan(2);
    await expect(page.locator(".film-card-where")).toBeVisible();
    await page.locator(".film-cta a").scrollIntoViewIfNeeded();
    await expect(page.locator(".film-cta a")).toBeInViewport();
  }
  await context.close();
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
