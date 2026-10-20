// CSV Column Picker and Lean Body Mass in the browser (#251 fix round).
import { test, expect } from '@playwright/test';

test.describe('csv column picker', () => {
  const URL = '/tool/developer-utilities/csv-column-picker/';

  test('picks by name from a BOM file with a spaced header, by position, and by quoted name', async ({ page }) => {
    await page.goto(URL);
    const input = page.locator('#csv-column-picker-input');
    const pick = page.locator('#csv-column-picker-input-b');
    const out = page.locator('#csv-column-picker-output');
    const status = page.locator('#csv-column-picker-status');

    await input.fill('\uFEFFid, name\n1, Ada\n2, Bob');
    await pick.fill('id');
    await expect(out).toHaveText('id\n1\n2');
    await pick.fill('name');
    await expect(out).toHaveText(' name\n Ada\n Bob');

    await pick.fill('2');
    await expect(status).toContainText('Kept');
    await expect(page.locator('#csv-column-picker-notice')).toContainText('by position');

    await input.fill('"a,b",c\n1,2');
    await pick.fill('"a,b"');
    await expect(out).toHaveText('"a,b"\n1');

    await pick.fill('missing');
    await expect(status).toContainText('No column named "missing".');
  });

  test('a numeric header wins over a position, with short-row and case notices', async ({ page }) => {
    await page.goto(URL);
    const input = page.locator('#csv-column-picker-input');
    const pick = page.locator('#csv-column-picker-input-b');
    const out = page.locator('#csv-column-picker-output');
    const notice = page.locator('#csv-column-picker-notice');
    await input.fill('b,1\nx,y');
    await pick.fill('1');
    await expect(out).toHaveText('1\ny');
    await expect(notice).toContainText('matched a header name');
    await input.fill('a,b,c\n1,2\n4,5,6');
    await pick.fill('c');
    await expect(notice).toContainText('1 row had fewer fields than the header.');
    await input.fill('Name,Age\nAda,36');
    await pick.fill('name');
    await expect(page.locator('#csv-column-picker-status')).toContainText('Did you mean Name?');
  });

  test('a tab file gets the tab notice, not a comma one', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#csv-column-picker-input').fill('a,b\tc\td\n1\t2\t3');
    await page.locator('#csv-column-picker-input-b').fill('2');
    await expect(page.locator('#csv-column-picker-output')).toHaveText('c\n2');
    const notice = page.locator('#csv-column-picker-notice');
    await expect(notice).toContainText('more tabs than commas');
    await expect(notice).not.toContainText('one column');
  });
});

test.describe('lean body mass', () => {
  const URL = '/tool/health/lean-body-mass-calculator/';

  test('computes Boer for 80 kg at 180 cm and refuses a height in metres', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-field-id="weight"]').fill('80');
    await page.locator('[data-field-id="height"]').fill('180');
    await expect(page.locator('#lean-body-mass-calculator-hero')).toContainText('61.4');
    await page.locator('[data-field-id="height"]').fill('1.8');
    await expect(page.getByText('Not metres?').first()).toBeVisible();
    await expect(page.locator('#lean-body-mass-calculator-hero')).not.toContainText('13.8');
  });

  test('shows the formula spread in pounds in imperial mode', async ({ page }) => {
    await page.goto(URL);
    await page.locator('.smart-segmented').first().locator('[data-segment-value="imperial"]').click();
    await page.locator('[data-field-id="weight"]').fill('176.37');
    await page.locator('[data-field-id="height"]').fill('70.866');
    await expect(page.getByText('10.9 lb').first()).toBeVisible();
  });
});
