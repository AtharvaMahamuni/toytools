// Sleep Cycle Calculator end to end on desktop and Pixel 5. The cycle arithmetic is unit-tested in
// the datetime engine; this proves the DateTimeWidget shows it and the instant-sleep caution.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/datetime/sleep-cycle-calculator/';
const experience = (page: Page) => page.locator('#sleep-cycle-calculator-experience');

test.describe('sleep cycle calculator', () => {
  test('a 7:00 am alarm gives an 11:15 pm five-cycle bedtime, and back again', async ({ page }) => {
    await page.goto(URL);
    await expect(experience(page)).toContainText('11:15 pm');
    await page.getByRole('radio', { name: 'When I go to bed' }).click();
    await page.locator('#sleep-cycle-calculator-f-time').fill('11:15 pm');
    await expect(experience(page)).toContainText('7:00 am');
  });

  test('zero minutes to fall asleep raises the instant-sleep caution', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#sleep-cycle-calculator-f-latency').fill('0');
    await expect(experience(page)).toContainText('These times assume instant sleep.');
  });
});
