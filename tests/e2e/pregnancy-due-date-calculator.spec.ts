// Pregnancy Due Date Calculator on desktop and Pixel 5. The day count is unit-tested in the
// datetime engine; this proves the widget shows 8 October 2026 and the cycle-length note.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/health/pregnancy-due-date-calculator/';
const experience = (page: Page) => page.locator('#pregnancy-due-date-calculator-experience');

test.describe('pregnancy due date calculator', () => {
  test('a 28 day cycle from 1 January 2026 is due 8 October, and a 32 day cycle says four days later', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#pregnancy-due-date-calculator-f-lmp').fill('2026-01-01');
    await page.locator('#pregnancy-due-date-calculator-f-asOf').fill('2026-03-01');
    await expect(experience(page)).toContainText('8 October 2026');
    await expect(experience(page)).toContainText('8 weeks, 3 days');
    await expect(experience(page)).toContainText('Second starts 9 April 2026');
    await expect(experience(page)).toContainText('Third starts 16 July 2026');
    await expect(page.locator('[data-craft="due-cycle-length"]')).toBeHidden();

    await page.locator('#pregnancy-due-date-calculator-f-cycle').fill('32');
    await expect(experience(page)).toContainText('12 October 2026');
    await expect(page.locator('[data-craft="due-cycle-length"]')).toContainText('4 days later');
    await expect(page.locator('[data-craft="due-cycle-length"]')).toHaveCount(1);
    await expect(experience(page)).toContainText('8 weeks, 3 days');

    await page.locator('#pregnancy-due-date-calculator-f-cycle').fill('');
    await expect(page.locator('[data-experience-empty]')).toContainText('Enter Cycle length (days).');
  });
});
