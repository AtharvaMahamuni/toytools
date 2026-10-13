// Download Report works for whitespace-only input; only truly empty input has nothing to download.
import { test, expect } from '@playwright/test';

const TOOLS = [
  { url: '/tool/text/character-counter/', input: '#character-counter-input', btn: '#cc-download-btn' },
  { url: '/tool/text/word-counter/', input: '#word-counter-input', btn: '#wc-download-btn' },
];

for (const t of TOOLS) {
  test(`${t.url}: three spaces download a report; empty input does not`, async ({ page }) => {
    await page.goto(t.url);
    await page.locator(t.input).fill('   ');
    const download = page.waitForEvent('download');
    await page.locator(t.btn).click();
    expect((await download).suggestedFilename()).toBeTruthy();
    await page.locator(t.input).fill('');
    await page.locator(t.btn).click();
    await expect(page.getByText('Nothing to download!')).toBeVisible();
  });
}
