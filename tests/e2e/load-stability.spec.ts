// Load-time weight and layout stability on the pages the October 2026 Lighthouse audit flagged.
// Health calculators fetched up to 16 sibling pages during load (one <link rel="prefetch"> per
// group pill), and result panes filled in after first paint pushed the input or the actions down.
import fs from 'node:fs';
import path from 'node:path';
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

// Every page whose result pane is reserved, read from the build so a new reservation is covered
// without editing this list. ToolSplit writes the reserve as an inline --ts-output-reserve.
function reservedPages(): string[] {
  const root = path.resolve('dist/tool');
  const out: string[] = [];
  for (const seg of fs.readdirSync(root)) {
    for (const slug of fs.readdirSync(path.join(root, seg))) {
      const file = path.join(root, seg, slug, 'index.html');
      if (fs.existsSync(file) && fs.readFileSync(file, 'utf8').includes('style="--ts-output-reserve:')) out.push(`/tool/${seg}/${slug}/`);
    }
  }
  return out.sort();
}
const RESERVED = reservedPages();

test.describe('result space is reserved on phones only while scripts fill it', () => {
  test('the build has reserved pages', () => {
    expect(RESERVED.length).toBeGreaterThanOrEqual(30);
  });

  for (const p of RESERVED) {
    test(`${p} holds no blank space with JS off, and never more than the result with JS on`, async ({ browser, isMobile }) => {
      test.skip(!isMobile, 'the reservation applies below 640px');
      const opts = { viewport: { width: 393, height: 851 }, isMobile: true, hasTouch: true };

      const off = await browser.newContext({ ...opts, javaScriptEnabled: false });
      const offPage = await off.newPage();
      await offPage.goto(p, { waitUntil: 'load' });
      expect(await offPage.locator('.ts-output').first().evaluate((el) => getComputedStyle(el).minHeight)).toBe('0px');
      await off.close();

      const on = await browser.newContext(opts);
      const page = await on.newPage();
      await page.goto(p, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      const r = await page.locator('.tool-split').first().evaluate((split) => {
        const out = split.querySelector('.ts-output')!;
        const reserving = split.classList.contains('ts-reserving');
        const reserved = parseFloat(getComputedStyle(out).minHeight);
        split.classList.remove('ts-reserving');
        return { reserving, reserved, settled: out.getBoundingClientRect().height };
      });
      expect(r.reserving).toBe(true);
      expect(r.reserved).toBeGreaterThan(150);
      expect(r.settled).toBeGreaterThanOrEqual(r.reserved - 1);
      await on.close();
    });
  }

  test('the first interaction releases the reservation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'the reservation applies below 640px');
    await page.goto('/tool/design/type-scale-generator/');
    const split = page.locator('.tool-split').first();
    await expect(split).toHaveClass(/ts-reserving/);
    await split.dispatchEvent('pointerdown');
    await expect(split).not.toHaveClass(/ts-reserving/);
    expect(await page.locator('.ts-output').first().evaluate((el) => getComputedStyle(el).minHeight)).toBe('0px');
  });
});
