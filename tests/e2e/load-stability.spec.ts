// Load-time weight and layout stability on the pages the October 2026 Lighthouse audit flagged.
// Health calculators fetched up to 16 sibling pages during load (one <link rel="prefetch"> per
// group pill), and result panes filled in after first paint pushed the input or the actions down.
import { test, expect } from '@playwright/test';

const GROUPED = ['/tool/health/ideal-weight-calculator/', '/tool/finance/loan-calculator/'];

test.describe('no sibling prefetch during load', () => {
  for (const path of GROUPED) {
    test(`${path} fetches no other tool page while loading`, async ({ page }) => {
      const others: string[] = [];
      page.on('request', (req) => {
        const url = new URL(req.url());
        if (url.pathname.startsWith('/tool/') && url.pathname !== path) others.push(url.pathname);
      });
      await page.goto(path, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      expect(await page.locator('link[rel="prefetch"]').count()).toBe(0);
      expect(others).toEqual([]);
    });
  }

  test('hovering a sibling pill prefetches that page once', async ({ page, isMobile }) => {
    test.skip(isMobile, 'hover is a pointer gesture; touchstart is covered by the unit test');
    await page.goto('/tool/health/ideal-weight-calculator/');
    const pill = page.locator('.group-pill:not([aria-current])').first();
    const href = await pill.getAttribute('href');
    await pill.hover();
    await expect(page.locator('link[rel="prefetch"]')).toHaveCount(1);
    expect(new URL(await page.locator('link[rel="prefetch"]').getAttribute('href') ?? '', page.url()).pathname).toBe(href);
  });
});

// The reserved space must hold the result's place before scripts run, and must never be taller
// than the result that settles in it, or the reservation itself would move the page.
const RESERVED = [
  '/tool/design/px-to-dp-converter/',
  '/tool/design/px-to-rem-converter/',
  '/tool/finance/loan-calculator/',
  '/tool/health/ideal-weight-calculator/',
  '/tool/math/fraction-calculator/',
  '/tool/developer-utilities/cidr-calculator/',
];

test.describe('result space is reserved on phones', () => {
  for (const path of RESERVED) {
    test(`${path} keeps its result pane height from first paint to settled`, async ({ browser, isMobile }) => {
      test.skip(!isMobile, 'the reservation applies below 640px');
      const height = async (js: boolean) => {
        const ctx = await browser.newContext({ viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true, javaScriptEnabled: js });
        const page = await ctx.newPage();
        await page.goto(path, { waitUntil: 'load' });
        if (js) await page.waitForTimeout(500);
        const h = await page.locator('.ts-output').first().evaluate((el) => el.getBoundingClientRect().height);
        await ctx.close();
        return h;
      };
      const reserved = await height(false);
      const settled = await height(true);
      expect(reserved).toBeGreaterThan(150);
      expect(settled).toBeGreaterThanOrEqual(reserved - 1);
    });
  }
});
