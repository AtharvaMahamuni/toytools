import { test, expect } from '@playwright/test';

const PATH = '/tool/developer-utilities/sql-formatter/';

test.describe('SQL Formatter', () => {
  test('formats a one-line select into keyword lines', async ({ page }) => {
    await page.goto(PATH);
    await page.waitForFunction(() => !!(window as unknown as { ToyTools?: { runStructuredData?: unknown } }).ToyTools?.runStructuredData);
    const input = page.locator('#sql-formatter-input');
    await input.fill('select id, name from users where active = 1');
    await input.dispatchEvent('input');
    const output = page.locator('#sql-formatter-output');
    await expect(output).toContainText('SELECT');
    await expect(output).toContainText('FROM');
    await expect(output).toContainText('WHERE');
  });

  test('warns when a password literal is present', async ({ page }) => {
    await page.goto(PATH);
    await page.waitForFunction(() => !!(window as unknown as { ToyTools?: { runStructuredData?: unknown } }).ToyTools?.runStructuredData);
    const input = page.locator('#sql-formatter-input');
    await input.fill("update users set password = 'hunter2' where id = 1");
    await input.dispatchEvent('input');
    await expect(page.locator('#sql-formatter-status')).toContainText(/password|secret/i);
  });

  test('reports an unclosed quote', async ({ page }) => {
    await page.goto(PATH);
    await page.waitForFunction(() => !!(window as unknown as { ToyTools?: { runStructuredData?: unknown } }).ToyTools?.runStructuredData);
    await page.locator('#sql-formatter-input').fill("select 'oops from t");
    await page.locator('#sql-formatter-input').dispatchEvent('input');
    await expect(page.locator('#sql-formatter-status')).toContainText(/Unclosed/i);
  });
});
