import { test, expect } from '@playwright/test';

const PATH = '/tool/design/css-minifier/';

test.describe('CSS Minifier and Beautifier', () => {
  test('beautifies minified CSS', async ({ page }) => {
    await page.goto(PATH);
    await page.waitForFunction(() => !!(window as unknown as { ToyTools?: { runStructuredData?: unknown } }).ToyTools?.runStructuredData);
    await page.locator('#css-minifier-mode').selectOption('beautify');
    const input = page.locator('#css-minifier-input');
    await input.fill('body{color:red}');
    await input.dispatchEvent('input');
    await expect(page.locator('#css-minifier-output')).toContainText('body {');
    await expect(page.locator('#css-minifier-output')).toContainText('color: red');
  });

  test('minifies and reports bytes saved', async ({ page }) => {
    await page.goto(PATH);
    await page.waitForFunction(() => !!(window as unknown as { ToyTools?: { runStructuredData?: unknown } }).ToyTools?.runStructuredData);
    await page.locator('#css-minifier-mode').selectOption('minify');
    const input = page.locator('#css-minifier-input');
    await input.fill('body {\n  color: red;\n}\n');
    await input.dispatchEvent('input');
    await expect(page.locator('#css-minifier-output')).toHaveValue('body{color:red}');
    await expect(page.locator('#css-minifier-status')).toContainText(/Saved \d+ byte/i);
  });
});
