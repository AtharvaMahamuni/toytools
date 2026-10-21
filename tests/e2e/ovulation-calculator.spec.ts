// Ovulation Calculator on desktop and Pixel 5. The day count is unit-tested in the
// datetime engine; this proves the widget shows 15 January 2026 and the luteal-phase note.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/health/ovulation-calculator/';
const experience = (page: Page) => page.locator('#ovulation-calculator-experience');

test.describe('ovulation calculator', () => {
  test('a 14 day luteal phase from 1 January 2026 ovulates on 15 January, and a 12 day phase says two days later', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#ovulation-calculator-f-lmp').fill('2026-01-01');
    await page.locator('#ovulation-calculator-f-asOf').fill('2026-01-10');
    await expect(experience(page)).toContainText('15 January 2026');
    await expect(experience(page)).toContainText('10 January 2026 to 15 January 2026');
    await expect(experience(page)).toContainText('Inside the fertile window');
    await expect(page.locator('[data-craft="luteal-phase-length"]')).toBeHidden();

    await page.locator('#ovulation-calculator-f-luteal').fill('12');
    await expect(experience(page)).toContainText('17 January 2026');
    await expect(page.locator('[data-craft="luteal-phase-length"]')).toContainText('2 days later');
    await expect(experience(page)).toContainText('29 January 2026');
  });
});
