import { test, expect } from '@playwright/test';

test('default 5000 groups 2 times 1999 then 1002 under the caution', async ({ page }) => {
  await page.goto('/tool/finance/upi-1999-split/');
  const caution = page.locator('[data-craft="upi-split-meme"]');
  await expect(caution).toBeVisible();
  await expect(caution).toContainText('For fun only');
  await expect(caution).toContainText('Do not use this for that');
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('2 × ₹1,999, then ₹1,002', { timeout: 15000 });
  const result = page.locator('#upi-1999-split-experience');
  await expect(result).toContainText('3 payments');
  await expect(result).toContainText('The parts sum to ₹5,000.');
  await expect(result).toContainText('does not owe a 2000 rupee UPI tax');
  await expect(result).not.toContainText('Payment 1');
});

test('2000 is one payment and nothing to split', async ({ page }) => {
  await page.goto('/tool/finance/upi-1999-split/');
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('2 × ₹1,999, then ₹1,002', { timeout: 15000 });
  await page.locator('#upi-1999-split-f-amount').evaluate((el) => {
    const input = el as HTMLInputElement;
    input.value = '2000';
    input.setAttribute('data-raw', '2000');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('#upi-1999-split-hero')).toHaveText('One payment of ₹2,000. Nothing to split.');
  await expect(page.locator('#upi-1999-split-experience')).not.toContainText('Payment 1');
});
