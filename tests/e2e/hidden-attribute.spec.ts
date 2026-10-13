// A [hidden] element never renders, even when a component rule sets display (followups #247).
import { test, expect } from '@playwright/test';

const PAGES = [
  '/tool/generate/uuid-generator/',
  '/tool/generate/lorem-ipsum-generator/',
  '/tool/generate/qr-code-generator/',
  '/tool/datetime/age-calculator/',
];

for (const url of PAGES) {
  test(`${url}: no element with the hidden attribute is displayed`, async ({ page }) => {
    await page.goto(url);
    const shown = await page.evaluate(() =>
      [...document.querySelectorAll('[hidden]')]
        .filter(el => getComputedStyle(el).display !== 'none')
        .map(el => el.id || el.className),
    );
    expect(shown).toEqual([]);
  });
}

test('generator QR box, strength bar and meta stay hidden when unused', async ({ page }) => {
  await page.goto('/tool/generate/uuid-generator/');
  await expect(page.locator('#uuid-generator-qr')).toBeHidden();
  await expect(page.locator('#uuid-generator-strength')).toBeHidden();
  await page.goto('/tool/generate/uuid-inspector/');
  await expect(page.locator('#uuid-inspector-meta')).toBeHidden();
  await expect(page.locator('#uuid-inspector-qr')).toBeHidden();
});
