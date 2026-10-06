// Deep suite for the Age Calculator — drives the real DateTimeWidget end to end on both viewports
// (chromium + pixel5). The date math is unit-tested; this proves the new date inputs, the runDateTime
// wiring, and the shared experience renderer produce the right output in a real browser.
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/datetime/age-calculator/';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

const birth = (page: Page) => page.locator('#age-calculator-f-birthDate');
const asOf = (page: Page) => page.locator('#age-calculator-f-asOf');
const hero = (page: Page) => page.locator('#age-calculator-hero');

test.describe('age calculator', () => {
  test('computes an exact age from two dates', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);

    await birth(page).fill('1990-05-15');
    await asOf(page).fill('2026-07-08');

    await expect(hero(page)).toContainText('36 years');
    // Secondary totals and the weekday insight render from the same result.
    const main = page.locator('main');
    await expect(main).toContainText('13,203'); // total days
    await expect(main).toContainText('Tuesday'); // born on a Tuesday

    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('measures age as of today when the second date is blank', async ({ page }) => {
    await page.goto(URL);
    await birth(page).fill('2000-01-01');
    // No "as of" date -> uses today; the hero should show a plausible age in years.
    await expect(hero(page)).toContainText(/\d+ years/);
  });

  test('shows a validation prompt for a future birth date', async ({ page }) => {
    await page.goto(URL);
    await birth(page).fill('2100-01-01');
    await asOf(page).fill('2026-07-08');
    // The experience layer renders the validation message rather than an age.
    await expect(page.locator('main')).toContainText(/check your dates/i);
  });

  test('loads a worked example', async ({ page }) => {
    await page.goto(URL);
    await page.getByRole('button', { name: 'Load Example' }).click();
    await expect(birth(page)).not.toHaveValue('');
    await expect(hero(page)).toContainText(/years/);
  });

  // Phase B PR 2: month ends never show negative days (anchor-month clamping).
  test('a month-end span reads 1 month, 1 day, never a negative day', async ({ page }) => {
    await page.goto(URL);
    await birth(page).fill('2000-01-31');
    await asOf(page).fill('2000-03-01');
    const section = page.locator('[data-section="hero"]');
    await expect(hero(page)).toHaveText('0 years');
    await expect(section).toContainText('1 month, 1 day');
    await expect(section).not.toContainText('-1');
  });

  // Phase B PR 2: a 29 Feb birthday falls on 28 Feb, for the age and the banner alike.
  test('a 29 Feb birthday on 28 Feb 2027 is 27 years, 0 months, 0 days, with the birthday banner', async ({ page }) => {
    await page.goto(URL);
    await birth(page).fill('2000-02-29');
    await asOf(page).fill('2027-02-28');
    await expect(hero(page)).toHaveText('27 years');
    await expect(page.locator('[data-section="hero"]')).toContainText('0 months, 0 days');
    await expect(page.locator('main')).toContainText('Happy birthday!');
  });
});

test.describe('date difference calculator: month ends', () => {
  test('2026-01-31 to 2026-03-01 is 1 month, 1 day', async ({ page }) => {
    await page.goto('/tool/datetime/date-difference-calculator/');
    await page.locator('#date-difference-calculator-f-startDate').fill('2026-01-31');
    await page.locator('#date-difference-calculator-f-endDate').fill('2026-03-01');
    await expect(page.locator('#date-difference-calculator-hero')).toHaveText('1 month, 1 day');
    await expect(page.locator('[data-section="hero"]')).toContainText('29 days in total');
  });
});
