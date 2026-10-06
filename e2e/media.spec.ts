import { test, expect } from "@playwright/test";
import media from "../content/media.json";

test("fingerprinted video supports partial downloads and long-lived caching", async ({
  request,
}) => {
  const response = await request.get(media.hero.mp4, {
    headers: { Range: "bytes=0-1023" },
  });
  expect(response.status()).toBe(206);
  expect(response.headers()["content-type"]).toContain("video/mp4");
  expect(response.headers()["cache-control"]).toContain("immutable");
  expect(await response.body()).toHaveLength(1024);
});

test.describe("static media presentation", () => {
  test.use({ reducedMotion: "reduce" });

  test("TINDS reduced motion downloads the still instead of the animation", async ({
    page,
  }) => {
    const animated: string[] = [];
    page.on("request", (request) => {
      if (
        /tinds-logo-(?:motion|video)|tinds-logo(?:-full|-loop)?\.(?:gif|mp4)/.test(
          request.url(),
        )
      )
        animated.push(request.url());
    });
    await page.goto("/work/tinds");
    const still = page.locator(".tinds-logo-still");
    await expect(still).toBeVisible();
    await expect
      .poll(() =>
        still.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    expect(animated).toEqual([]);
  });

  test("reduced motion does not download decorative videos or restart them", async ({
    page,
  }) => {
    const videos: string[] = [];
    page.on("request", (request) => {
      if (/\.(mp4|webm)(?:\?|$)/.test(request.url()))
        videos.push(request.url());
    });
    await page.goto("/");
    await expect(page.locator(".intro")).toHaveCount(0);
    await expect(page.locator(".film-card")).toBeVisible();
    await expect(page.locator(".film-video source[src]")).toHaveCount(0);
    await page.evaluate(() =>
      document.dispatchEvent(new Event("visibilitychange")),
    );
    await expect(page.locator(".film-video")).toHaveJSProperty("paused", true);
    expect(videos).toEqual([]);
  });

  test("phones select a small landscape delivery image and desktop keeps its crop", async ({
    page,
  }) => {
    const portraits: string[] = [];
    page.on("request", (request) => {
      if (/portrait-(mobile|desktop)-/.test(request.url()))
        portraits.push(request.url());
    });
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    const photo = page.locator(".film-portrait img");
    await expect
      .poll(() =>
        photo.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect
      .poll(() => photo.evaluate((img: HTMLImageElement) => img.currentSrc))
      .toMatch(/portrait-mobile-/);
    expect(portraits.every((url) => url.includes("portrait-mobile-"))).toBe(
      true,
    );
    const phone = (await page.locator(".film-portrait").boundingBox())!;
    expect(phone.width / phone.height).toBeCloseTo(4 / 3, 1);

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect
      .poll(() =>
        photo.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect
      .poll(() => photo.evaluate((img: HTMLImageElement) => img.currentSrc))
      .toMatch(/portrait-desktop-/);
  });
});

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps the portrait and headline without fetching either video", async ({
    page,
  }) => {
    const videos: string[] = [];
    page.on("request", (request) => {
      if (/\.(mp4|webm)(?:\?|$)/.test(request.url()))
        videos.push(request.url());
    });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator(".film-portrait img")
          .evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
      )
      .toBe(true);
    expect(videos).toEqual([]);
  });
});
