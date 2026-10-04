import { test, expect, type CDPSession, type Page } from "@playwright/test";

test.use({
  viewport: { width: 375, height: 667 },
  hasTouch: true,
  isMobile: true,
  reducedMotion: "no-preference",
});

async function ready(page: Page) {
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await page.locator(".intro").click();
  await expect(page.locator(".intro")).toHaveCount(0);
  await expect(page.locator(".film-card")).toHaveCSS("opacity", "1", {
    timeout: 20000,
  });
  await expect(page.locator(".film-portrait")).toHaveCSS(
    "clip-path",
    /^inset\(0%(?: 0%){0,3}\)$/,
    { timeout: 20000 },
  );
}

async function press(page: Page, session: CDPSession) {
  const box = (await page.locator(".film-portrait").boundingBox())!;
  const point = { x: box.x + box.width * 0.75, y: box.y + box.height * 0.6 };
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [point],
  });
  return point;
}

test("touch press tilts, lights and zooms the card, then resets on release", async ({
  page,
  context,
}) => {
  await ready(page);
  const card = page.locator(".film-card");
  const session = await context.newCDPSession(page);
  await press(page, session);
  await expect(card).toHaveClass(/is-hover/);
  await expect(card).toHaveCSS("animation-play-state", "paused");
  await expect
    .poll(() =>
      card.evaluate((e) => Number(getComputedStyle(e, "::before").opacity)),
    )
    .toBeGreaterThan(0.5);
  await expect
    .poll(() =>
      card.evaluate((e) =>
        Math.abs(new DOMMatrix(getComputedStyle(e).transform).m13),
      ),
    )
    .toBeGreaterThan(0.001);
  await expect
    .poll(() =>
      page
        .locator(".film-portrait img")
        .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a),
    )
    .toBeGreaterThan(1.01);
  await page.screenshot({
    path: "test-results/touch-press.png",
    fullPage: true,
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(card).not.toHaveClass(/is-hover/);
  await expect(card).toHaveCSS("animation-play-state", "running");
  await expect
    .poll(() =>
      card.evaluate((e) =>
        Math.abs(new DOMMatrix(getComputedStyle(e).transform).m13),
      ),
    )
    .toBeLessThan(0.001);
  await expect
    .poll(() =>
      page
        .locator(".film-portrait img")
        .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a),
    )
    .toBeLessThan(1.001);
  await session.detach();
});

test("touch feedback works on Fold cover, unfolded Fold, iPad and Surface sizes", async ({
  page,
  context,
}) => {
  await ready(page);
  const session = await context.newCDPSession(page);
  for (const viewport of [
    { width: 344, height: 882 },
    { width: 720, height: 882 },
    { width: 1032, height: 1376 },
    { width: 912, height: 1368 },
  ]) {
    await page.setViewportSize(viewport);
    await press(page, session);
    await expect(page.locator(".film-card")).toHaveClass(/is-hover/);
    await expect(page.locator(".film-card")).toHaveCSS(
      "animation-play-state",
      "paused",
    );
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(page.locator(".film-card")).not.toHaveClass(/is-hover/);
    await expect(page.locator(".film-card")).toHaveCSS(
      "animation-play-state",
      "running",
    );
  }
  await session.detach();
});

test("a native swipe scrolls the phone page and clears the press effect", async ({
  page,
  context,
}) => {
  await ready(page);
  const session = await context.newCDPSession(page);
  const point = await press(page, session);
  await expect(page.locator(".film-card")).toHaveClass(/is-hover/);
  for (const distance of [40, 90, 150]) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: point.x, y: point.y - distance }],
    });
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await expect(page.locator(".film-card")).not.toHaveClass(/is-hover/);
  await session.detach();
});

test("touch cancellation does not leave the card highlighted", async ({
  page,
  context,
}) => {
  await ready(page);
  const session = await context.newCDPSession(page);
  await press(page, session);
  await expect(page.locator(".film-card")).toHaveClass(/is-hover/);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchCancel",
    touchPoints: [],
  });
  await expect(page.locator(".film-card")).not.toHaveClass(/is-hover/);
  await session.detach();
});

test("a social link still opens normally when tapped", async ({
  page,
  context,
}) => {
  // Keep this test independent of GitHub network availability.
  await context.route("https://github.com/RafiulPaceProjects", (route) =>
    route.fulfill({ body: "Profile destination" }),
  );
  await ready(page);
  const link = page.getByRole("link", {
    name: "Rafiul on GitHub (opens in new tab)",
  });
  await expect(link).toBeInViewport();
  const box = (await link.boundingBox())!;
  const opened = page.waitForEvent("popup");
  // Tap the moving target as a person would; locator.tap waits for stillness.
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  const popup = await opened;
  await expect(popup).toHaveURL("https://github.com/RafiulPaceProjects");
  await expect(page.locator(".film-card")).not.toHaveClass(/is-hover/);
  await popup.close();
});

test("the idle float gently moves within its four-pixel range", async ({
  page,
}) => {
  await ready(page);
  const card = page.locator(".film-card");
  await expect(card).toHaveCSS("animation-name", "film-float");
  const before = await card.evaluate((e) =>
    parseFloat(getComputedStyle(e).translate.split(" ")[1]),
  );
  await expect
    .poll(() =>
      card.evaluate((e) =>
        parseFloat(getComputedStyle(e).translate.split(" ")[1]),
      ),
    )
    .not.toBeCloseTo(before, 1);
  const offset = await card.evaluate((e) =>
    parseFloat(getComputedStyle(e).translate.split(" ")[1]),
  );
  expect(offset).toBeGreaterThanOrEqual(-4);
  expect(offset).toBeLessThanOrEqual(0);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("touch and idle float remain still when reduced motion is requested", async ({
    page,
    context,
  }) => {
    await page.goto("/");
    await expect(page.locator(".intro")).toHaveCount(0);
    const card = page.locator(".film-card");
    const before = await card.evaluate((e) => getComputedStyle(e).transform);
    await expect(card).toHaveCSS("animation-name", "none");
    const session = await context.newCDPSession(page);
    await press(page, session);
    await expect(card).not.toHaveClass(/is-hover/);
    await expect(card).toHaveCSS("transform", before);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await session.detach();
  });
});

test.describe("mouse interaction", () => {
  test.use({
    viewport: { width: 1440, height: 900 },
    hasTouch: false,
    isMobile: false,
  });

  test("desktop hover pauses the float and resets on leave", async ({
    page,
  }) => {
    await ready(page);
    const card = page.locator(".film-card");
    const box = (await card.boundingBox())!;
    await card.hover({
      position: { x: box.width * 0.75, y: box.height * 0.4 },
    });
    await expect(card).toHaveClass(/is-hover/);
    await expect(card).toHaveCSS("animation-play-state", "paused");
    await page.mouse.move(10, 10);
    await expect(card).not.toHaveClass(/is-hover/);
    await expect(card).toHaveCSS("animation-play-state", "running");
    await expect
      .poll(() =>
        card.evaluate((e) =>
          Math.abs(new DOMMatrix(getComputedStyle(e).transform).m13),
        ),
      )
      .toBeLessThan(0.001);
  });
});
