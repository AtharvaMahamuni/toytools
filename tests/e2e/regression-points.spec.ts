// Linear Regression Playground by keyboard only (audit S2-3): the points list adds, edits and
// removes points, the fit follows, and the canvas points come back into the list.
import { test, expect } from '@playwright/test';

const URL = '/tool/math/linear-regression-playground/';

test('add, edit and remove points with the keyboard, and the fit updates', async ({ page }) => {
  await page.goto(URL);
  const list = page.getByLabel('Points, one x, y per line');
  const n = page.locator('[data-measurement="n"]');
  const slope = page.locator('[data-measurement="slope"]');
  const r2 = page.locator('[data-measurement="r2"]');
  const help = page.locator('[data-sim-points-help]');
  await expect(list).toHaveValue('1, 2.2\n2, 2.8\n3, 4.1\n4, 3.9\n5, 6.2');
  await expect(n).toHaveText('5');

  // Reach the list with Tab alone, from the last preset button.
  await page.locator('[data-sim-preset]').last().focus();
  await page.keyboard.press('Tab');
  await expect(list).toBeFocused();

  // Replace the cloud with a perfect line, typed.
  await page.keyboard.press('ControlOrMeta+a');
  await page.keyboard.press('Delete');
  await page.keyboard.type('1, 1\n2, 2\n3, 3');
  await expect(n).toHaveText('3');
  await expect(slope).toHaveText('1.00');
  await expect(r2).toHaveText('1.000');

  // Add a point off the line: the fit loosens.
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.type('\n4, 1');
  await expect(n).toHaveText('4');
  await expect(r2).not.toHaveText('1.000');

  // Edit it onto the line.
  await page.keyboard.press('Backspace');
  await page.keyboard.type('4');
  await expect(r2).toHaveText('1.000');

  // A bad line says which one, and the last good fit stays.
  await page.keyboard.type('x');
  await expect(help).toHaveText('Line 4 needs two numbers, x and y, like 3, 4.');
  await expect(list).toHaveAttribute('aria-invalid', 'true');
  await expect(n).toHaveText('4');
  await page.keyboard.press('Backspace');
  await expect(list).toHaveAttribute('aria-invalid', 'false');
  await expect(help).toContainText('Up to 8 points');

  // Remove the last line: back to three points.
  await page.keyboard.press('Shift+Home');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await expect(n).toHaveText('3');
  await expect(slope).toHaveText('1.00');
});

test('a preset rewrites the list, and observations never show the Play placeholder', async ({ page }) => {
  await page.goto(URL);
  const list = page.getByLabel('Points, one x, y per line');
  await expect(page.locator('[data-sim-observations] li')).toHaveCount(1);
  await expect(page.locator('[data-sim-observations]')).toContainText('the line refits');
  await page.locator('[data-sim-preset]', { hasText: 'Perfect' }).click();
  await expect(list).toHaveValue('1, 1\n2, 2\n3, 3\n4, 4');
  await expect(page.locator('[data-sim-observations] li')).not.toHaveCount(0);
});

test('unitless sliders are named without "in units"', async ({ page }) => {
  await page.goto('/tool/math/normal-distribution-visualizer/');
  await expect(page.getByRole('slider', { name: 'Mean', exact: true })).toBeVisible();
  await expect(page.locator('input[type="range"][aria-label$=" in units"]')).toHaveCount(0);
  await page.goto(URL);
  await expect(page.getByRole('slider', { name: 'Example', exact: true })).toBeVisible();
});
