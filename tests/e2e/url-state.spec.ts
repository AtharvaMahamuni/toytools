// Shareable URL state.
//
// The safety half of these matters more than the feature half: the address bar is also the browser
// history and the referrer on any outbound click, so the specs that assert NOTHING is written are
// the ones to keep green. The policy behind them is unit-tested in src/lib/url-state.test.ts; this
// pins the behaviour that reaches a real browser.
import { test, expect } from '@playwright/test';

const FINANCE = '/tool/finance/compound-interest-calculator/';

// Finance, date and math calculators are shareable, but they are private pages ("Nothing stored
// unless you choose to save it"), so since beta-v12.4.2 they never write to the address bar on
// their own: a reload would refill what was typed. A link is built only on Copy link, and an
// incoming link still fills the form.
test.describe('shareable calculators on private pages', () => {
  test('typing leaves the address bar alone, and a reload starts from the defaults', async ({ page }) => {
    await page.goto(FINANCE);
    const years = page.locator('[data-field-id="years"]');
    const before = await years.inputValue();
    await years.fill('12');
    await page.locator('[data-field-id="rate"]').fill('9');
    await page.waitForTimeout(600); // longer than the 300ms write debounce
    expect(new URL(page.url()).search).toBe('');

    await page.reload();
    await expect(years).toHaveValue(before);
    expect(new URL(page.url()).search).toBe('');
  });

  test('Copy link builds a link with the values, and that link fills the form', async ({ page }) => {
    // Force the clipboard path (no OS share sheet) and capture what would be copied.
    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, 'share', { value: undefined, configurable: true });
    });
    await page.goto(FINANCE);
    await page.locator('[data-field-id="years"]').fill('17');
    await page.evaluate(() => {
      const TT = (window as any).ToyTools;
      TT.copy = (text: string) => { (window as any).__copied = text; };
    });
    await page.locator('#compound-interest-calculator-share').click();
    const link = await page.evaluate(() => (window as any).__copied as string);
    expect(new URL(link).searchParams.get('years')).toBe('17');
    // Building the link did not write it into this page's address bar.
    expect(new URL(page.url()).search).toBe('');

    await page.goto(new URL(link).pathname + new URL(link).search);
    await expect(page.locator('[data-field-id="years"]')).toHaveValue('17');
  });

  test('a shared link reproduces the calculation', async ({ page }) => {
    await page.goto(`${FINANCE}?principal=25000&rate=7&years=15&frequency=12&contribution=0`);
    await expect(page.locator('[data-field-id="years"]')).toHaveValue('15');
    await expect(page.locator('[data-field-id="rate"]')).toHaveValue('7');
    // The result panel is driven by those values, so it must have rendered something real.
    await expect(page.locator('.experience-hero, [id$="-hero"]').first()).not.toBeEmpty();
  });

  test('typing does not add history entries', async ({ page }) => {
    await page.goto('/category/money-finance/');
    await page.goto(FINANCE);
    const years = page.locator('[data-field-id="years"]');
    for (const value of ['5', '10', '20', '25']) await years.fill(value);
    // One Back must leave the tool entirely.
    await page.goBack();
    await expect(page).toHaveURL(/\/category\/money-finance\/$/);
  });
});

// The bill-splitting and UPI calculators are Local tools (they keep their data in this browser),
// not private ones, so they still keep their inputs in the address as you type. The privacy page's
// "Links you share" says so; this keeps that copy and the behaviour in step.
test.describe('Local calculators that keep inputs in the address', () => {
  test('split-bill writes its inputs into the address as you type', async ({ page }) => {
    await page.goto('/tool/finance/split-bill/');
    await page.locator('[data-field-id="bill"]').fill('1234');
    await page.locator('[data-field-id="people"]').fill('3');
    await expect.poll(() => new URL(page.url()).searchParams.get('bill')).toBe('1234');
    expect(new URL(page.url()).searchParams.get('people')).toBe('3');

    await page.reload();
    await expect(page.locator('[data-field-id="bill"]')).toHaveValue('1234');
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
