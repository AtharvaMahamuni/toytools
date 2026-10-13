// Phase C fix PR 2 page checks: finance currency, storage, negative rates, health units.
import { test, expect } from '@playwright/test';

const raw = (page: import('@playwright/test').Page, id: string) =>
  page.locator(`[data-field-id="${id}"]`).getAttribute('data-raw');

test('a currency switch rescales the default but keeps a typed amount (item 1a)', async ({ page }) => {
  await page.goto('/tool/finance/sip-calculator/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const cur = page.locator('#sip-calculator-currency');
  await cur.selectOption('USD');
  const before = Number(await raw(page, 'monthly'));
  await cur.selectOption('INR');
  expect(Number(await raw(page, 'monthly'))).toBe(before * 10);

  await page.locator('[data-field-id="monthly"]').fill('1234');
  await cur.selectOption('JPY');
  expect(await raw(page, 'monthly')).toBe('1234');
  await cur.selectOption('USD');
  expect(await raw(page, 'monthly')).toBe('1234');
});

test('split bill has no currency menu that does nothing (item 1b)', async ({ page }) => {
  await page.goto('/tool/finance/split-bill/');
  await expect(page.locator('[data-field-id="bill"]')).toBeVisible();
  await expect(page.locator('#split-bill-currency')).toHaveCount(0);
});

test('old saved typed values are stripped on the next visit (item 2)', async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('seeded')) return;
    localStorage.setItem('toytools:split-bill', JSON.stringify({ v: 1, data: { currency: 'USD', fields: { bill: { value: '4321', raw: '4321' } }, opts: {} } }));
    localStorage.setItem('toytools:uuid-inspector', JSON.stringify({ v: 1, data: { options: { input: '123e4567-e89b-12d3-a456-426614174000', expect: 'any' } } }));
    sessionStorage.setItem('seeded', '1');
  });
  await page.goto('/tool/finance/split-bill/');
  await expect(page.locator('[data-field-id="bill"]')).not.toHaveValue('4321');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('toytools:split-bill') ?? '')).not.toContain('4321');
  await page.goto('/tool/generate/uuid-inspector/');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('toytools:uuid-inspector') ?? '')).not.toContain('123e4567');
  await expect(page.getByText('Runs entirely on your device. Nothing is uploaded.').first()).toBeAttached();
});

test('a negative rate shows a clear error instead of becoming 0% (item 3)', async ({ page }) => {
  await page.goto('/tool/finance/compound-interest-calculator/');
  const rate = page.locator('[data-field-id="rate"]');
  await rate.fill('-2');
  await rate.blur();
  await expect(rate).toHaveValue('-2');
  await expect(page.getByText('An interest rate cannot be negative. Enter 0 or more.').first()).toBeVisible();
});

test('the health unit switch converts the typed values (item 4)', async ({ page }) => {
  await page.goto('/tool/health/bmi-calculator/');
  await page.locator('[data-field-id="weight"]').fill('70');
  await page.locator('[data-field-id="height"]').fill('175');
  await page.locator('[data-segment-for="unit"][data-segment-value="imperial"]').click();
  await expect(page.locator('[data-field-id="weight"]')).toHaveValue('154.3');
  await expect(page.locator('[data-field-id="height"]')).toHaveValue('68.9');
  await page.locator('[data-segment-for="unit"][data-segment-value="metric"]').click();
  await expect(page.locator('[data-field-id="weight"]')).toHaveValue('70');
  await expect(page.locator('[data-field-id="height"]')).toHaveValue('175');
});

test('a remembered imperial setting does not open BMI in an error (item 4)', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('toytools.private-inputs-cleared', '1');
    localStorage.setItem('toytools:bmi-calculator', JSON.stringify({ v: 1, data: { opts: { unit: 'imperial' } } }));
  });
  await page.goto('/tool/health/bmi-calculator/');
  await expect(page.locator('[data-field-id="unit"]')).toHaveValue('imperial');
  await expect(page.locator('[data-field-id="height"]')).toHaveValue('68.9');
  await expect(page.locator('[data-field-id="weight"]')).toHaveValue('154.3');
  await expect(page.getByText(/cannot be more than/i)).toHaveCount(0);
  await expect(page.locator('#bmi-calculator-hero')).toContainText(/22\.\d/);
});
