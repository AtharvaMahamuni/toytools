import { test, expect } from '@playwright/test';

test('default 5000 lists 1999 + 1999 + 1002 under the caution', async ({ page }) => {
  await page.goto('/tool/finance/upi-1999-split/');
  const caution = page.locator('[data-craft="upi-split-meme"]');
  await expect(caution).toBeVisible();
  await expect(caution).toContainText('For fun only');
  await expect(caution).toContainText('Do not use this for that');
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('3', { timeout: 15000 });
  const result = page.locator('#upi-1999-split-experience');
  await expect(result).toContainText('1999 + 1999 + 1002 = 5000');
  await expect(result).toContainText('₹1,999');
  await expect(result).toContainText('₹1,002');
});

test('2000 is one payment and nothing to split', async ({ page }) => {
  await page.goto('/tool/finance/upi-1999-split/');
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('3', { timeout: 15000 });
  await page.locator('#upi-1999-split-f-amount').evaluate((el) => {
    const input = el as HTMLInputElement;
    input.value = '2000';
    input.setAttribute('data-raw', '2000');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('1');
  await expect(page.locator('#upi-1999-split-experience')).toContainText('One payment. Nothing to split.');
});
