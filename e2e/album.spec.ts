import { test, expect } from "@playwright/test";

// The live profile replaces the retired three-photo fan. Check image loading
// through responsive source changes, including a return to desktop.
test("profile photo loads at each breakpoint and after resizing back", async ({
  page,
}) => {
  await page.goto("/");
  const photo = page.locator(".film-portrait img");
  await expect(photo).toHaveCount(1);
  await expect(photo).toHaveAttribute(
    "alt",
    "Rafiul at a rainy window, lit by a desk lamp",
  );
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 375, height: 667 },
    { width: 320, height: 568 },
    { width: 768, height: 1024 },
    { width: 1032, height: 1376 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await expect
      .poll(() =>
        photo.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
});
