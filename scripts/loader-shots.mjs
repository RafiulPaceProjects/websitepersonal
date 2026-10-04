// Screenshots of the walking loader at fixed moments of the wind gust, for review.
// Usage (dev server running): OUT=/some/dir node scripts/loader-shots.mjs
import { chromium, devices } from "@playwright/test";

const out = process.env.OUT ?? "test-results/loader-shots";
const base = process.env.BASE_URL ?? "http://localhost:3000/";
const setups = {
  "desktop-day": { viewport: { width: 1440, height: 900 } },
  "desktop-night": { viewport: { width: 1440, height: 900 }, colorScheme: "dark" },
  "phone-day": { ...devices["Pixel 7"] },
  "phone-night": { ...devices["Pixel 7"], colorScheme: "dark" },
};
const moments = [500, 1150, 1500, 2100]; // before, start->middle, middle->end, settling

const browser = await chromium.launch();
for (const [name, opts] of Object.entries(setups)) {
  for (const t of moments) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    await page.goto(base);
    await page.waitForTimeout(t);
    await page.screenshot({ path: `${out}/site-${name}-${t}.png` });
    await ctx.close();
  }
}
await browser.close();
console.log(`saved to ${out}`);
