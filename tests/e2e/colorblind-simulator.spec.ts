import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/design/colorblind-simulator/';

function guardConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}

test.describe('colorblind simulator', () => {
  test('shows every type at once and names the collapsed red and green', async ({ page }) => {
    const errors = guardConsole(page);
    await page.goto(URL);
    const rows = page.locator('#colorblind-simulator-rows');
    await expect(rows).toContainText('Deuteranopia');
    await expect(rows).toContainText('Protanopia');
    await expect(rows).toContainText('Tritanopia');
    await expect(rows).toContainText('Achromatopsia');
    await expect(page.locator('#colorblind-simulator-note')).toContainText('Deuteranopia');
    await expect(page.locator('#colorblind-simulator-note')).toContainText('#d32f2f');
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('hides the note when the pair stays apart, and rejects a bad token', async ({ page }) => {
    await page.goto(URL);
    const input = page.locator('#colorblind-simulator-input');
    await input.fill('#1565c0 #f9a825');
    await expect(page.locator('#colorblind-simulator-note')).toBeHidden();
    await input.fill('not-a-color');
    await expect(page.locator('#colorblind-simulator-error')).toBeVisible();
    await expect(page.locator('#colorblind-simulator-note')).toBeHidden();
  });
});
