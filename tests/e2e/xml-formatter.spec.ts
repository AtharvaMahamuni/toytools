import { test, expect } from '@playwright/test';

const PATH = '/tool/developer-utilities/xml-formatter/';

test.describe('XML Formatter and Validator', () => {
  test('pretty-prints compact XML', async ({ page }) => {
    await page.goto(PATH);
    await page.waitForFunction(() => !!(window as unknown as { ToyTools?: { runStructuredData?: unknown } }).ToyTools?.runStructuredData);
    const input = page.locator('#xml-formatter-input');
    await input.fill('<root><a>1</a></root>');
    await input.dispatchEvent('input');
    const output = page.locator('#xml-formatter-output');
    await expect(output).toContainText('<root>');
    await expect(output).toContainText('<a>1</a>');
  });

  test('minifies when mode is minify', async ({ page }) => {
    await page.goto(PATH);
    await page.waitForFunction(() => !!(window as unknown as { ToyTools?: { runStructuredData?: unknown } }).ToyTools?.runStructuredData);
    await page.locator('#xml-formatter-mode').selectOption('minify');
    const input = page.locator('#xml-formatter-input');
    await input.fill('<root>\n  <a>1</a>\n</root>');
    await input.dispatchEvent('input');
    await expect(page.locator('#xml-formatter-output')).toHaveValue(/<root><a>1<\/a><\/root>/);
  });

  test('reports malformed XML', async ({ page }) => {
    await page.goto(PATH);
    await page.waitForFunction(() => !!(window as unknown as { ToyTools?: { runStructuredData?: unknown } }).ToyTools?.runStructuredData);
    await page.locator('#xml-formatter-input').fill('<root><a></root>');
    await page.locator('#xml-formatter-input').dispatchEvent('input');
    await expect(page.locator('#xml-formatter-status')).toContainText(/Malformed XML/i);
  });
});
