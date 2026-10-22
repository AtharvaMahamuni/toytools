import { test, expect } from '@playwright/test';

test('a fixed-rate loan shows the payment, the rate note, and the extra-payment saving', async ({ page }) => {
  await page.goto('/tool/finance/loan-calculator/');
  await page.locator('#loan-calculator-currency').selectOption('USD');

  const field = (id: string) => page.locator(`[data-field-id="${id}"]`);
  await field('price').fill('100000');
  await field('down').fill('0');
  await field('rate').fill('12');
  await field('years').fill('5');
  await field('extra').fill('0');

  await expect(page.locator('[data-hero-value]')).toContainText('2,224.44');
  await expect(page.locator('[data-craft="loan-rate-unit"]')).toBeHidden();

  await field('rate').fill('1');
  await expect(page.locator('[data-craft="loan-rate-unit"]')).toBeHidden();
  await field('rate').blur();
  await expect(page.locator('[data-craft="loan-rate-unit"]')).toBeVisible();
  await expect(page.locator('[data-craft="loan-rate-unit"]')).toContainText('12%');

  await field('rate').fill('2');
  const note = page.locator('[data-craft="loan-rate-unit"]');
  await expect(note).toBeVisible();
  await expect(note).toContainText('yearly rate');
  await expect(note).toContainText('24%');

  await field('rate').fill('12');
  await field('extra').fill('500');
  await expect(page.locator('.insight-list')).toContainText('8,239.19');
  await expect(page.locator('.insight-list')).toContainText('3 years 10 months');

  await page.getByRole('button', { name: 'Home loan, 20 years' }).click();
  await expect(page.locator('[data-hero-value]')).toContainText('34,712.93');

  await field('down').fill('5000000');
  await expect(page.locator('[data-experience-empty]')).toContainText('nothing to borrow');
});
