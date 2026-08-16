// Cron to systemd Timer Converter, in a real browser.
//
// The translation is checkable by eye. The craft is not: it claims two schedules fire on the same
// days, which is a statement about a year of calendar arithmetic. So the cases below pin both the
// visible translation and the divergence verdict, including the schedules where the verdict must be
// nothing at all.

import { test, expect } from '@playwright/test';

const PATH = '/tool/datetime/systemd-timer-converter/';
const EXPR = '#systemd-timer-converter-f-expression';

async function translate(page: import('@playwright/test').Page, expression: string) {
  await page.goto(PATH);
  await page.locator(EXPR).fill(expression);
  // Every OnCalendar expression carries a time part, though the hour may be a wildcard or a step
  // (`*:00/15:00`), so the wait matches a colon-minute rather than a full HH:MM:SS.
  await expect(page.locator('#systemd-timer-converter-hero')).toContainText(/:\d\d/, { timeout: 10_000 });
}

test.describe('cron to systemd timer converter', () => {
  test('translates weekday mornings into an OnCalendar expression', async ({ page }) => {
    await translate(page, '0 9 * * 1-5');
    await expect(page.locator('#systemd-timer-converter-hero')).toContainText('Mon..Fri *-*-* 09:00:00');
  });

  test('translates a step expression', async ({ page }) => {
    await translate(page, '*/15 * * * *');
    await expect(page.locator('#systemd-timer-converter-hero')).toContainText('*-*-* *:00/15:00');
  });

  test('rejects @reboot by naming the directive that replaces it', async ({ page }) => {
    await page.goto(PATH);
    await page.locator(EXPR).fill('@reboot');
    await expect(page.locator('#systemd-timer-converter-experience')).toContainText('OnBootSec');
  });

  test('warns when the two grammars disagree about which days fire', async ({ page }) => {
    await translate(page, '0 0 13 * 5');
    const check = page.locator('[data-craft="systemd-divergence"]');
    await expect(check).toBeVisible();
    await expect(check).toContainText('Not an exact translation');
    await expect(check).toHaveAttribute('data-state', 'diverges');
  });

  test('stays silent when only the weekday is restricted', async ({ page }) => {
    await translate(page, '0 9 * * 1-5');
    await expect(page.locator('[data-craft="systemd-divergence"]')).toBeHidden();
  });

  test('stays silent for a plain daily schedule', async ({ page }) => {
    await translate(page, '0 3 * * *');
    await expect(page.locator('[data-craft="systemd-divergence"]')).toBeHidden();
  });

  test('emits a unit file carrying the translated expression', async ({ page }) => {
    await translate(page, '0 9 * * 1-5');
    await expect(page.locator('#systemd-timer-converter-experience')).toContainText(
      'OnCalendar=Mon..Fri *-*-* 09:00:00',
    );
  });
});
