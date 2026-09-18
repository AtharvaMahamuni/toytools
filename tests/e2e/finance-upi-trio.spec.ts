import { test, expect } from '@playwright/test';

test('5000 ordinary shows 20 rupees and says it is not a customer fee', async ({ page }) => {
  await page.goto('/tool/finance/upi-mdr-estimator/');
  const note = page.locator('[data-craft="upi-mdr-estimate"]');
  await expect(note).toBeVisible();
  await expect(note).toContainText('not a fee the customer owes');
  await expect(note).toContainText('not a government tax');
  await expect(page.locator('#upi-mdr-estimator-hero')).toHaveText('₹20.00', { timeout: 15000 });
  await expect(page.locator('#upi-mdr-estimator-experience')).toContainText('not a fee the customer owes');
});

test('1000 with a 10 percent tip across 3 people sums to 1100', async ({ page }) => {
  await page.goto('/tool/finance/split-bill/');
  const note = page.locator('[data-craft="bill-split-fair"]');
  await expect(note).toBeVisible();
  await expect(note).toContainText('leftover paise');
  await expect(page.locator('#split-bill-hero')).toHaveText('₹1,100.00', { timeout: 15000 });
  const result = page.locator('#split-bill-experience');
  await expect(result).toContainText('₹366.66');
  await expect(result).toContainText('₹366.68');
});

test('a new shop receipt counts in this month and stays under 1,00,000', async ({ page }) => {
  await page.goto('/tool/finance/shop-upi-tally/');
  await page.evaluate(() => localStorage.removeItem('toytools.shop-upi-tally.v1'));
  await page.reload();
  const note = page.locator('[data-craft="shop-upi-tally"]');
  await expect(note).toBeVisible();
  await expect(note).toContainText('does not change your merchant status');
  await expect(note).toContainText('Nothing is uploaded');
  await page.locator('#shop-amount').fill('500');
  await page.locator('#shop-form').locator('button[type="submit"]').click();
  await expect(page.locator('#shop-total')).toHaveText('₹500.00', { timeout: 15000 });
  await expect(page.locator('#shop-gap')).toContainText('Under 1,00,000');
  await expect(page.locator('#shop-gap')).toContainText('₹99,500.00');
});
