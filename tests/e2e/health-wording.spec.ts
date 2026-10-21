// Health tool wording (audit PR D): capitalised errors, the BSA signed spread, VO2 messages and
// placeholders, the sleep log's 0 refusal and name, and the shared number input reading "1e9".
import { test, expect } from '@playwright/test';

test('body surface area: a 1e9 weight is read as a billion and refused, with a capital letter', async ({ page }) => {
  await page.goto('/tool/health/body-surface-area-calculator/');
  const hero = page.locator('#body-surface-area-calculator-hero');
  await expect(hero).toContainText('1.84');
  const weight = page.locator('#body-surface-area-calculator-f-weight');
  await weight.fill('1e9');
  await expect(page.getByText('Your weight cannot be more than 500.').first()).toBeVisible();
  await weight.fill('0');
  await expect(page.getByText('Your weight must be greater than zero.').first()).toBeVisible();
  await weight.fill('70');
  await expect(hero).toContainText('1.84');
});

test('body surface area: text that is not a number never keeps the last result', async ({ page }) => {
  await page.goto('/tool/health/body-surface-area-calculator/');
  const weight = page.locator('#body-surface-area-calculator-f-weight');
  await weight.fill('abc');
  await expect(page.getByText('Your weight must be a number.').first()).toBeVisible();
  await weight.blur();
  await expect(weight).toHaveValue('abc');
  await weight.fill('1e');
  await expect(page.getByText('Your weight must be a number.').first()).toBeVisible();
});

test('body surface area: the sentence carries the same signed spread as the card', async ({ page }) => {
  await page.goto('/tool/health/body-surface-area-calculator/');
  await page.locator('#body-surface-area-calculator-f-height').fill('160');
  await page.locator('#body-surface-area-calculator-f-weight').fill('90');
  await expect(page.getByText(/Mosteller minus Du Bois is [+-]0\.\d{3} m²\./).first()).toBeVisible();
});

test('vo2 max: example placeholders, and 10 km is a pace problem', async ({ page }) => {
  await page.goto('/tool/health/vo2-max-calculator/');
  await expect(page.locator('#vo2-max-calculator-f-age')).toHaveAttribute('placeholder', '30');
  await expect(page.locator('#vo2-max-calculator-f-resting')).toHaveAttribute('placeholder', '60');
  await page.locator('#vo2-max-calculator-f-distance').fill('10');
  await expect(page.getByText('That distance is more than a world-record pace for twelve minutes.', { exact: false }).first()).toBeVisible();
});

test('sleep hours: the input is named, and 0 or a negative is refused out loud', async ({ page }) => {
  await page.goto('/tool/health/sleep-hours-tracker/');
  const input = page.getByLabel('Hours slept today');
  await expect(input).toBeVisible();
  const today = page.locator('#sleep-hours-tracker-today');
  const before = await today.textContent();
  await input.fill('0');
  await page.locator('#sleep-hours-tracker-log').click();
  await expect(page.locator('#tt-toast')).toContainText('Enter hours above 0.');
  await input.fill('-2');
  await page.locator('#sleep-hours-tracker-log').click();
  await expect(page.locator('#tt-toast')).toContainText('Enter hours above 0.');
  await expect(today).toHaveText(before ?? '');
});
