// Regex Tester: match explain, honest syntax errors, and ReDoS fail-safe.
import { test, expect } from '@playwright/test';

const PATH = '/tool/developer-utilities/regex-tester/';

async function open(page: import('@playwright/test').Page) {
  await page.goto(PATH);
  await expect(page.locator('#rt-pattern')).toBeVisible();
}

test.describe('regex tester', () => {
  test('lists matches with indices and named groups', async ({ page }) => {
    await open(page);
    await page.locator('#rt-pattern').fill('(?<word>\\b\\w{4,}\\b)');
    await page.locator('#rt-flags').fill('g');
    await page.locator('#rt-text').fill('The quick brown fox');

    await expect(page.locator('#rt-summary')).toContainText(/match/i);
    await expect(page.locator('#rt-matches > li')).toHaveCount(2);
    await expect(page.locator('#rt-matches')).toContainText('$word');
    await expect(page.locator('#rt-note')).toBeVisible();
    await expect(page.locator('#rt-note')).toHaveAttribute('data-craft', 'regex-match-explain');
  });

  test('surfaces invalid regex errors honestly', async ({ page }) => {
    await open(page);
    await page.locator('#rt-pattern').fill('(');
    await page.locator('#rt-text').fill('abc');
    await expect(page.locator('#rt-error')).toBeVisible();
    await expect(page.locator('#rt-error')).toContainText(/Invalid regular expression/i);
  });

  test('blocks an expensive nested-quantifier pattern', async ({ page }) => {
    await open(page);
    await page.locator('#rt-pattern').fill('(a+)+');
    await page.locator('#rt-text').fill('aaaaaaaaaa!');
    await expect(page.locator('#rt-error')).toBeVisible();
    await expect(page.locator('#rt-error')).toContainText(/expensive|nests quantifiers|blocked/i);
  });

  test('previews replace and stays silent with no matches', async ({ page }) => {
    await open(page);
    await page.locator('#rt-pattern').fill('cats');
    await page.locator('#rt-text').fill('dogs and birds');
    await expect(page.locator('#rt-summary')).toContainText(/No matches/i);
    await expect(page.locator('#rt-note')).toBeHidden();

    await page.locator('#rt-pattern').fill('(dogs) and (birds)');
    await page.locator('#rt-flags').fill('g');
    await page.locator('#rt-text').fill('dogs and birds');
    await page.locator('#rt-replace').fill('$2+$1');
    await expect(page.locator('#rt-summary')).toContainText(/1 match/i);
    await expect(page.locator('#rt-replaced-wrap')).toBeVisible();
    await expect(page.locator('#rt-replaced')).toHaveValue('birds+dogs');
  });

  test('sample loads a working pattern', async ({ page }) => {
    await open(page);
    await page.locator('#rt-sample').click();
    await expect(page.locator('#rt-matches li').first()).toBeVisible();
    await expect(page.locator('#rt-replaced')).not.toHaveValue('');
  });
});
