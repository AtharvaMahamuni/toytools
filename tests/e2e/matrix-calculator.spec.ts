// Matrix Calculator end to end on desktop and Pixel 5. Engine rules (singularity, tidying) are
// unit-tested in src/lib/engines/math/matrix.test.ts.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/math/matrix-calculator/';
const experience = (page: Page) => page.locator('#matrix-calculator-experience');
const op = (page: Page) => page.locator('#matrix-calculator-f-operation');
const a = (page: Page) => page.locator('#matrix-calculator-f-a');

test.describe('matrix calculator', () => {
  test('multiplies the default matrices', async ({ page }) => {
    await page.goto(URL);
    await expect(experience(page)).toContainText(/19\s+22/);
    await expect(experience(page)).toContainText(/43\s+50/);
  });

  test('calls a scaled singular matrix singular in Determinant and Inverse alike', async ({ page }) => {
    await page.goto(URL);
    await op(page).selectOption('determinant');
    await a(page).fill('100000 200000 300000\n400000 500000 600000\n700000 800000 900000');
    await expect(page.locator('#matrix-calculator-hero')).toHaveText('0');
    await op(page).selectOption('inverse');
    await expect(experience(page)).toContainText('The determinant is 0, so this matrix has no inverse.');
  });
});
