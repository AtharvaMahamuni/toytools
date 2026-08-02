// Shareable URL state.
//
// The safety half of these matters more than the feature half: the address bar is also the browser
// history and the referrer on any outbound click, so the specs that assert NOTHING is written are
// the ones to keep green. The policy behind them is unit-tested in src/lib/url-state.test.ts; this
// pins the behaviour that reaches a real browser.
import { test, expect } from '@playwright/test';

const FINANCE = '/tool/finance/compound-interest-calculator/';

test.describe('auto-sync calculators', () => {
  test('typing puts the inputs in the address bar', async ({ page }) => {
    await page.goto(FINANCE);
    await page.locator('[data-field-id="years"]').fill('12');
    await expect(page).toHaveURL(/[?&]years=12/);
    await expect(page).toHaveURL(/[?&]principal=/);
  });

  test('a shared link reproduces the calculation', async ({ page }) => {
    await page.goto(`${FINANCE}?principal=25000&rate=7&years=15&frequency=12&contribution=0`);
    await expect(page.locator('[data-field-id="years"]')).toHaveValue('15');
    await expect(page.locator('[data-field-id="rate"]')).toHaveValue('7');
    // The result panel is driven by those values, so it must have rendered something real.
    await expect(page.locator('.experience-hero, [id$="-hero"]').first()).not.toBeEmpty();
  });

  test('a link beats saved state', async ({ page }) => {
    await page.goto(FINANCE);
    await page.locator('[data-field-id="years"]').fill('30');
    await expect(page).toHaveURL(/years=30/);

    // Same tool, explicit link with different values: the link wins.
    await page.goto(`${FINANCE}?years=8`);
    await expect(page.locator('[data-field-id="years"]')).toHaveValue('8');
  });

  test('typing does not fill the back button with history entries', async ({ page }) => {
    await page.goto('/category/money-finance/');
    await page.goto(FINANCE);

    const years = page.locator('[data-field-id="years"]');
    for (const value of ['5', '10', '20', '25']) {
      await years.fill(value);
      await expect(page).toHaveURL(new RegExp(`years=${value}`));
    }

    // replaceState, not pushState: one Back must leave the tool entirely.
    await page.goBack();
    await expect(page).toHaveURL(/\/category\/money-finance\/$/);
  });
});

test.describe('personal-data tools', () => {
  test('never write to the address bar on their own', async ({ page }) => {
    await page.goto('/tool/health/bmi-calculator/');
    // Visible non-select fields only: the imperial inputs are hidden while the metric unit
    // system is selected.
    const fields = page.locator('[data-field-id]:visible:not([data-field-type="select"])');
    const count = await fields.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await fields.nth(i).fill('70');
    }
    await page.waitForTimeout(600); // longer than the 300ms write debounce
    expect(new URL(page.url()).search).toBe('');
  });

  test('still offer an explicit copy-link action', async ({ page }) => {
    await page.goto('/tool/health/bmi-calculator/');
    await expect(page.locator('#bmi-calculator-share')).toBeVisible();
  });
});

test.describe('tools whose input may be a secret', () => {
  // A "copy link" containing a bearer token or a password IS the leak, so these get no action at
  // all: not disabled, absent.
  for (const path of [
    '/tool/developer-utilities/jwt-decoder/',
    '/tool/developer-utilities/sha256-hash-generator/',
    '/tool/developer-utilities/base64-encoder-decoder/',
    '/tool/generate/password-generator/',
  ]) {
    test(`${path} offers no share action and writes no query`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('[data-action="share"]')).toHaveCount(0);
      await expect(page.locator('[id$="-share"]')).toHaveCount(0);

      const field = page.locator('textarea, input[type="text"]').first();
      if (await field.count()) {
        await field.fill('super-secret-value-12345');
        await page.waitForTimeout(600);
      }
      expect(new URL(page.url()).search).toBe('');
    });
  }
});
