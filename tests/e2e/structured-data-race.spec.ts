// A slow structured-data result must not repaint over a cleared input (followups #246 S1, #247).
import { test, expect } from '@playwright/test';

for (const slug of ['json-formatter', 'json-minifier']) {
  test(`${slug}: clearing while a slow result is in flight leaves the empty state`, async ({ page }) => {
    await page.goto(`/tool/developer-utilities/${slug}/`);
    const input = page.locator(`#${slug}-input`);
    await input.fill('');
    await page.evaluate(() => {
      const TT = (window as unknown as { ToyTools: Record<string, unknown> }).ToyTools;
      TT.runStructuredData = () =>
        new Promise(resolve => setTimeout(() => resolve({ ok: true, output: 'STALE OUTPUT' }), 400));
    });
    await input.fill('{"a":1}');
    await input.fill('');
    await page.waitForTimeout(800);
    await expect(page.locator(`#${slug}-status`)).toHaveText('');
    await expect(page.locator(`#${slug}-output`)).not.toContainText('STALE OUTPUT');
  });
}
