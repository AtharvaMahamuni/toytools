import { test, expect } from '@playwright/test';

const URL = '/tool/developer-utilities/json-diff/';

test.describe('json diff', () => {
  test('stays quiet when both panes are empty', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('#jd-summary')).toHaveText('Paste JSON on both sides.');
    await expect(page.locator('#jd-summary')).not.toContainText('not valid');
    await expect(page.locator('#jd-lines')).toBeHidden();
  });

  test('names the side when JSON does not parse', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#jd-left').fill('{bad}');
    await page.locator('#jd-right').fill('{"ok":true}');
    await expect(page.locator('#jd-summary')).toContainText('Left is not valid JSON');
    await expect(page.locator('#jd-lines')).toBeHidden();
  });

  test('treats 1 and 1.0 as equal and says the text differs', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#jd-left').fill('1');
    await page.locator('#jd-right').fill('1.0');
    await expect(page.locator('#jd-summary')).toContainText('The values match.');
    await expect(page.locator('#jd-summary')).toContainText('1 versus 1.0');
    await expect(page.locator('#jd-lines')).toBeHidden();
  });

  test('counts array order and ignores object key order inside the sample', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#jd-sample').click();
    await expect(page.locator('#jd-summary')).toContainText('added');
    await expect(page.locator('#jd-summary')).toContainText('changed');
    await expect(page.locator('#jd-lines')).toContainText('changed tags[0]');
    await expect(page.locator('#jd-lines')).toContainText('added role');
    await expect(page.locator('#jd-lines')).not.toContainText('changed name');
    await expect(page.locator('#jd-lines')).not.toContainText('changed id');
  });

  test('does not call a key reorder a change', async ({ page }) => {
    await page.goto(URL);
    await page.locator('#jd-left').fill('{"b":1,"a":2}');
    await page.locator('#jd-right').fill('{"a":2,"b":1}');
    await expect(page.locator('#jd-summary')).toContainText('The values match.');
    await expect(page.locator('#jd-lines')).toBeHidden();
  });
});
