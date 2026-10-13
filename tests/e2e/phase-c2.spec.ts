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
