import { test, expect } from '@playwright/test';

// The shared parser and formatter (src/lib/inputs) behind every smart input: "1,5" is 1.5, not 15,
// "1,500" stays fifteen hundred, and a tiny result never reads as 0 (Atharva, 26 Oct 2026).

test.describe('shared number parsing and display', () => {
  test('BMI: a decimal comma weight and a tiny BMI are shown, not 0', async ({ page }) => {
    await page.goto('/tool/health/bmi-calculator/');
    await page.locator('[data-field-id="height"]:visible').fill('100');
    const weight = page.locator('[data-field-id="weight"]:visible');
    await weight.fill('0,0025');
    await weight.blur();
    await expect(weight).toHaveValue('0.0025');
    await expect(page.locator('#bmi-calculator-hero')).toContainText('0.0025');
  });

  test('BMI: "70,5" kg is 70.5, not 705', async ({ page }) => {
    await page.goto('/tool/health/bmi-calculator/');
    await page.locator('[data-field-id="height"]:visible').fill('175');
    const weight = page.locator('[data-field-id="weight"]:visible');
    await weight.fill('70,5');
    await weight.blur();
    await expect(weight).toHaveValue('70.5');
    await expect(page.locator('#bmi-calculator-hero')).toContainText(/(^|[^\d.])23([^\d.]|$)/);
  });

  test('a finance amount keeps "1,500" as fifteen hundred', async ({ page }) => {
    await page.goto('/tool/finance/loan-calculator/');
    const field = page.locator('[data-field-type="currency"]:visible').first();
    await field.fill('1,500');
    await field.blur();
    await expect(field).toHaveAttribute('data-raw', '1500');
    await field.fill('1,5');
    await field.blur();
    await expect(field).toHaveAttribute('data-raw', '1.5');
  });
});
