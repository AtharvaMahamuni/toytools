// Perceptual gradient, three body calculators, and the sleep log.
import { test, expect } from '@playwright/test';

test.describe('perceptual gradient', () => {
  const URL = '/tool/design/css-gradient-generator/';

  test('copies the OKLCH declaration and names a muddy middle', async ({ page }) => {
    await page.goto(URL);
    const note = page.locator('[data-craft="oklch-srgb-mid"]');
    const css = page.locator('#css-gradient-generator-css');

    await expect(css).toContainText('linear-gradient(to right in oklch, #0000ff, #ffff00)');
    await expect(note).toContainText('grayer');
    await page.locator('#css-gradient-generator-copy').click();
    await expect(page.locator('#tt-toast')).toContainText('Copied');

    await page.locator('#css-gradient-generator-from').fill('#777777');
    await page.locator('#css-gradient-generator-to').fill('#bbbbbb');
    await expect(note).toBeHidden();
    await expect(css).toContainText('#777777');
  });
});

test.describe('waist to hip ratio', () => {
  const URL = '/tool/health/waist-to-hip-ratio-calculator/';

  test('shows 0.80 for 80 over 100 and names a mixed unit', async ({ page }) => {
    await page.goto(URL);
    const hero = page.locator('#waist-to-hip-ratio-calculator-hero');
    const note = page.locator('[data-craft="whr-mixed-unit"]');

    await expect(hero).toContainText('0.80');
    await expect(note).toBeHidden();

    await page.locator('#waist-to-hip-ratio-calculator-f-waist').fill('32');
    await page.locator('#waist-to-hip-ratio-calculator-f-hip').fill('102');
    await expect(hero).toContainText('0.31');
    await expect(note).toContainText('inches');
  });
});

test.describe('body surface area', () => {
  const URL = '/tool/health/body-surface-area-calculator/';

  test('shows Mosteller at 175 cm and the spread at 160 cm', async ({ page }) => {
    await page.goto(URL);
    const hero = page.locator('#body-surface-area-calculator-hero');
    const note = page.locator('[data-craft="bsa-formula-spread"]');

    await expect(hero).toContainText('1.84');
    await expect(page.getByText('Du Bois formula').first()).toBeVisible();
    await expect(note).toBeHidden();

    await page.locator('#body-surface-area-calculator-f-height').fill('160');
    await page.locator('#body-surface-area-calculator-f-weight').fill('90');
    await expect(note).toContainText('0.07');
  });
});

test.describe('vo2 max', () => {
  const URL = '/tool/health/vo2-max-calculator/';

  test('shows the Cooper hero, then the pulse gap, then rejects metres', async ({ page }) => {
    await page.goto(URL);
    const hero = page.locator('#vo2-max-calculator-hero');
    const note = page.locator('[data-craft="vo2-method-gap"]');

    await expect(hero).toContainText('42.4');
    await expect(note).toBeHidden();

    await page.locator('#vo2-max-calculator-f-age').fill('30');
    await page.locator('#vo2-max-calculator-f-resting').fill('60');
    await expect(note).toContainText('47.7');

    await page.locator('#vo2-max-calculator-f-distance').fill('2400');
    await expect(page.getByText('kilometres').first()).toBeVisible();
    await expect(note).toBeHidden();
  });
});

test.describe('sleep hours tracker', () => {
  const URL = '/tool/health/sleep-hours-tracker/';

  test('logs, reloads, warns above 9 hours, refuses 17, and clears', async ({ page }) => {
    await page.goto(URL);
    const input = page.locator('#sleep-hours-tracker-input');
    const today = page.locator('#sleep-hours-tracker-today');
    const note = page.locator('[data-craft="sleep-awake-in-bed"]');

    await input.fill('7.5');
    await page.locator('#sleep-hours-tracker-log').click();
    await expect(today).toContainText('7.5');
    await expect(note).toBeHidden();

    await page.reload();
    await expect(today).toContainText('7.5');

    await input.fill('9.5');
    await page.locator('#sleep-hours-tracker-log').click();
    await expect(today).toContainText('9.5');
    await expect(note).toContainText('time awake in bed');

    await input.fill('17');
    await page.locator('#sleep-hours-tracker-log').click();
    await expect(page.locator('#tt-toast')).toContainText('16 h is the most this log accepts.');
    await expect(today).toContainText('9.5');

    const reset = page.locator('#sleep-hours-tracker-reset');
    await reset.click();
    await reset.click();
    await expect(today).toContainText('0.0');
    await expect(note).toBeHidden();
  });
});
