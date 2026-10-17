// PR #256: a restored backup is checked entry by entry, so a hand-edited file cannot put
// 99 h, -5 or "abc" in a tracker or show NaN. The check is shared by every tracker.
import { test, expect } from '@playwright/test';

const URL = '/tool/health/sleep-hours-tracker/';
const S = 'sleep-hours-tracker';

test('a backup with 99 h, -5 and "abc" restores only the valid entries', async ({ page }) => {
  await page.goto(URL);
  await page.locator(`#${S}-input`).fill('7');
  await page.locator(`#${S}-log`).click();
  await expect(page.locator(`#${S}-today`)).toHaveText('7.0');

  const backup = await page.evaluate(() => {
    const TT = (window as unknown as { ToyTools: { data: { FORMAT: string; collect: () => Record<string, string> } } }).ToyTools;
    const keys = TT.data.collect();
    const key = Object.keys(keys).find((k) => k.includes('sleep-hours'))!;
    const saved = JSON.parse(keys[key]);
    const today = saved.data.entries[0].date as string;
    saved.data.entries = [
      { date: today, value: 99 },
      { date: '2026-01-02', value: -5 },
      { date: '2026-01-03', value: 'abc' },
      { date: '2026-01-04', value: 6.5 },
    ];
    return JSON.stringify({ format: TT.data.FORMAT, keys: { [key]: JSON.stringify(saved) } });
  });

  await page.locator(`#${S}-file`).setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(backup) });
  await expect(page.locator('body')).toContainText('Skipped 3 entries that were not a valid number or out of range');
  await expect(page.locator(`#${S}-today`)).toHaveText('0.0');
  await expect(page.locator('.tracker')).not.toContainText('NaN');
  await expect(page.locator('.tracker')).not.toContainText('99');
});
