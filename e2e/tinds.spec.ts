import { test, expect } from "@playwright/test";
import { tinds } from "../content/tinds";
import media from "../content/media.json";

test("case study credits the work, loads real graphics and keeps every source", async ({
  page,
}) => {
  const errors: string[] = [];
  const instagram: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("request", (request) => {
    if (request.url().includes("instagram.com")) instagram.push(request.url());
  });
  await page.goto("/work/tinds");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(tinds.headline);
  await expect(page.getByText(tinds.articleCredit)).toBeVisible();
  await expect(page.locator(".tinds-article")).toHaveCount(4);
  for (const article of tinds.articles) {
    await expect(
      page.getByRole("heading", { name: article.title }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: article.title, exact: true }),
    ).toHaveAttribute("href", article.url);
  }
  for (const image of await page.locator(".tinds-story-image img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  await page.getByText("More reels", { exact: false }).click();
  for (const reel of tinds.reels) {
    await expect(page.locator(`a[href="${reel.url}"]`)).toHaveCount(1);
  }
  for (const slide of tinds.slides) {
    await expect(page.locator(`a[href="${slide.url}"]`)).toHaveCount(1);
  }
  await expect(page.locator(`a[href="${tinds.feature!.url}"]`)).toHaveCount(1);
  await expect(
    page.getByRole("link", {
      name: "Contact Rafiul in Gmail (opens in new tab)",
    }),
  ).toHaveAttribute("href", /mail.google.com/);
  expect(instagram).toEqual([]);
  expect(errors).toEqual([]);
});

test("preview is optional, survives blocked Instagram and returns keyboard focus", async ({
  page,
}) => {
  const requested: string[] = [];
  await page.route("**/www.instagram.com/embed.js", (route) => {
    requested.push(route.request().url());
    return route.abort();
  });
  await page.goto("/work/tinds");
  const trigger = page.getByRole("button", {
    name: "Preview Rafiul, on TINDS",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const viewer = page.getByRole("dialog");
  await expect(viewer).toBeVisible();
  await expect(viewer.locator("blockquote")).toHaveCount(1);
  await expect(viewer.locator("blockquote")).toHaveAttribute(
    "data-instgrm-permalink",
    tinds.reels[0].url,
  );
  await expect(
    viewer.getByRole("link", { name: /Open original on Instagram/ }),
  ).toHaveAttribute("href", tinds.reels[0].url);
  await expect(viewer.getByRole("status")).toContainText(
    "Preview taking a while",
  );
  expect(requested).toHaveLength(1);
  await page.keyboard.press("Escape");
  await expect(viewer).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator("iframe, blockquote")).toHaveCount(0);
});

test("smooth video uses a consistent background, plays and can be paused", async ({
  page,
}) => {
  await page.goto("/work/tinds");
  const video = page.locator(".tinds-logo-motion");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0);
  await expect(video).toHaveJSProperty(
    "currentSrc",
    new URL(media.tindsLogo.motion, page.url()).href,
  );
  const backgrounds = await page
    .locator(".tinds-hero,.tinds-brand")
    .evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).backgroundColor),
    );
  expect(backgrounds[0]).toBe("rgb(0, 0, 0)");
  // Phones use a transparent wrapper over the same black hero.
  expect(["rgb(0, 0, 0)", "rgba(0, 0, 0, 0)"]).toContain(backgrounds[1]);
  await page.getByRole("button", { name: "Pause logo animation" }).click();
  await expect(video).toHaveJSProperty("paused", true);
  await page.getByRole("button", { name: "Play logo animation" }).click();
  await expect(video).toHaveJSProperty("paused", false);
});

test("phone sizes have no page overflow and controls remain usable", async ({
  page,
}) => {
  await page.goto("/work/tinds");
  for (const width of [320, 375, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
    const trigger = page.getByRole("button", {
      name: "Preview Rafiul, on TINDS",
      exact: true,
    });
    const box = await trigger.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps stories, contact and original social links usable", async ({
    page,
  }) => {
    await page.goto("/work/tinds");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".tinds-article")).toHaveCount(4);
    await expect(page.locator(`a[href="${tinds.reels[0].url}"]`)).toBeVisible();
    await expect(
      page.locator('a[href="mailto:rafiul.haider@pace.edu"]'),
    ).toBeVisible();
    await expect(page.locator(".tinds-logo-motion source[src]")).toHaveCount(0);
  });
});
