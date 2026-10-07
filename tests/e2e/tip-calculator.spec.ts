// Tip calculator split and custom-% validation (Phase B PR 3, bug log batch 1).
import { test, expect, type Page } from '@playwright/test';

const URL = '/tool/number/tip-calculator/';

const els = (page: Page) => ({
  bill: page.locator('#tip-bill'),
  pct: page.locator('#tip-pct'),
  split: page.locator('#tip-split'),
  splitErr: page.locator('#tip-split-error'),
  pctErr: page.locator('#tip-pct-error'),
  amount: page.locator('#tip-amount'),
  total: page.locator('#tip-total'),
  ppTipRow: page.locator('#tip-row-pp-tip'),
  ppTotRow: page.locator('#tip-row-pp-total'),
  ppTip: page.locator('#tip-pp-tip'),
  ppTot: page.locator('#tip-pp-total'),
});

test.describe('tip calculator: split between', () => {
  test('split defaults to 1, so a fresh bill shows the tip and total and no $0.00 per-person rows', async ({ page }) => {
    await page.goto(URL);
    const e = els(page);
    await expect(e.split).toHaveValue('1');
    await e.bill.fill('84.5');
    await page.getByRole('button', { name: '18%' }).click();
    await expect(e.amount).toHaveText('$15.21');
    await expect(e.total).toHaveText('$99.71');
    await expect(e.ppTipRow).toBeHidden();
    await expect(e.ppTotRow).toBeHidden();
    await expect(e.splitErr).toBeHidden();
  });

  test('a valid split shows per-person figures; 0, negative and fractional splits clear them with a message', async ({ page }) => {
    await page.goto(URL);
    const e = els(page);
    await e.bill.fill('84.5');
    await e.pct.fill('18');
    await e.split.fill('3');
    await expect(e.ppTip).toHaveText('$5.07');
    await expect(e.ppTot).toHaveText('$33.24');
    await expect(e.ppTipRow).toBeVisible();

    for (const bad of ['0', '-2', '2.5']) {
      await e.split.fill(bad);
      await expect(e.splitErr, bad).toBeVisible();
      await expect(e.splitErr).toHaveText('Split between a whole number of people, 1 or more.');
      await expect(e.split).toHaveAttribute('aria-invalid', 'true');
      // No stale figures from the last valid split.
      await expect(e.ppTipRow, bad).toBeHidden();
      await expect(e.ppTotRow).toBeHidden();
      await expect(page.locator('main')).not.toContainText('$28.17');
      await expect(page.locator('main')).not.toContainText('$33.24');
      // The tip and total do not depend on the split, so they stay.
      await expect(e.amount).toHaveText('$15.21');
    }

    await e.split.fill('4');
    await expect(e.splitErr).toBeHidden();
    await expect(e.split).not.toHaveAttribute('aria-invalid', 'true');
    await expect(e.ppTot).toHaveText('$24.93');
  });

  test('Clear resets the split to 1', async ({ page }) => {
    await page.goto(URL);
    const e = els(page);
    await e.bill.fill('50');
    await e.split.fill('4');
    await page.locator('#tip-clear').click();
    await page.locator('#tip-clear').click();
    await expect(e.split).toHaveValue('1');
    await expect(e.bill).toHaveValue('');
  });

  test('a negative custom tip is an inline error, not a silent 0%', async ({ page }) => {
    await page.goto(URL);
    const e = els(page);
    await e.bill.fill('80');
    await e.pct.fill('-5');
    await expect(e.pctErr).toHaveText('Enter a tip of 0% or more.');
    await expect(e.pct).toHaveAttribute('aria-invalid', 'true');
    await expect(e.amount).toHaveText('$0.00');
    await expect(page.locator('#tip-hint')).toHaveText('Enter a tip of 0% or more.');
    await e.pct.fill('10');
    await expect(e.pctErr).toBeHidden();
    await expect(e.amount).toHaveText('$8.00');
  });

  test('private tool: nothing typed is stored or written to the address bar', async ({ page }) => {
    await page.goto(URL);
    const e = els(page);
    await e.bill.fill('123.45');
    await e.pct.fill('17');
    await e.split.fill('3');
    await expect(e.ppTipRow).toBeVisible();
    expect(new globalThis.URL(page.url()).search).toBe('');
    const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
    expect(stored).not.toContain('123.45');
    await page.reload();
    await expect(e.bill).toHaveValue('');
    await expect(e.split).toHaveValue('1');
  });
});
