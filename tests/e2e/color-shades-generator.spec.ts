// Color Shades Generator end to end on desktop and Pixel 5. The OKLCH scale and contrast note are
// unit-tested in src/lib/engines/color/shades.test.ts.
import { test, expect } from '@playwright/test';

const URL = '/tool/design/color-shades-generator/';

test.describe('color shades generator', () => {
  test('builds an eleven-stop scale that keeps the typed color at its brand stop', async ({ page }) => {
    await page.goto(URL);
    const input = page.locator('#color-shades-generator-input');
    await input.fill('#3b82f6');
    await expect(page.locator('#color-shades-generator-note')).toContainText('#3b82f6 (stop 500) on white is 3.68:1');
    await expect(page.locator('#color-shades-generator-css')).toContainText('#3b82f6');
    await expect(page.locator('#color-shades-generator-css')).toContainText('950');
  });

  test('clears the scale and says why when the text is not a color', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#color-shades-generator-input').fill('not a color');
    await expect(page.locator('#color-shades-generator-error')).toBeVisible();
    await expect(page.locator('#color-shades-generator-css')).toHaveText('');
  });
});
