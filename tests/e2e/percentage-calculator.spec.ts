// Percentage change from a negative starting value (Phase B PR 2, bug log batch 1).
// The widget divides by |A|, so the sign means up or down for every baseline.
import { test, expect } from '@playwright/test';

test.describe('percentage calculator: change from a negative A', () => {
  test('-20 to 50 is a 350% increase, and positive baselines are unchanged', async ({ page }) => {
    await page.goto('/tool/number/percentage-calculator/');
    await page.locator('#percentage-mode').selectOption('change');
    const a = page.locator('#percentage-a');
    const b = page.locator('#percentage-b');
    const value = page.locator('#pct-value');

    await a.fill('-20');
    await b.fill('50');
    await expect(value).toHaveText('350%');

    await a.fill('-50');
    await b.fill('-20');
    await expect(value).toHaveText('60%');

    await a.fill('-20');
    await b.fill('-40');
    await expect(value).toHaveText('-100%');

    await a.fill('80');
    await b.fill('100');
    await expect(value).toHaveText('25%');
  });
});
