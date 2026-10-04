import { test, expect } from "@playwright/test";

// Corner fan (hero-film.tsx): three wardrobe looks drop into the top-right
// once the hero blur lands, then sit settled.
test("fan drops three looks into the hero corner", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto("/");
  await expect(page.locator(".intro")).toBeVisible();
  await page.locator(".intro").click();
  await expect(page.locator(".intro")).toHaveCount(0, { timeout: 2000 });

  const photos = page.locator(".film-fan .album-photo img");
  await expect(photos).toHaveCount(3);
  await expect
    .poll(
      async () =>
        page
          .locator(".film-fan .album-photo")
          .evaluateAll((els) =>
            els.every((el) => Number(getComputedStyle(el).opacity) === 1),
          ),
      { timeout: 20000 },
    )
    .toBe(true);
  for (let i = 0; i < 3; i += 1) {
    await expect(photos.nth(i)).not.toHaveAttribute("alt", "");
    await expect
      .poll(() =>
        photos.nth(i).evaluate((img: HTMLImageElement) => img.naturalWidth),
      )
      .toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});
