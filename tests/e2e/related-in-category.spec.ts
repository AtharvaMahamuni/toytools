import { test, expect, type Page } from '@playwright/test';

// Related tools stay in the category, above a relevance floor (src/lib/tools/related.ts). Runs on
// chromium and pixel5. Reads the built pages: the tool drawer row, the guide's Related Tools list
// and the guide footer siblings (CategoryDiscovery), all derived from the same ranking.

const hrefs = async (page: Page, selector: string) =>
  page.locator(selector).evaluateAll(els => els.map(e => new URL((e as HTMLAnchorElement).href).pathname));

const DRAWER = '.kd-related-links a';
const GUIDE_RELATED = '.kg-link';
const FOOTER_SIBLINGS = '.cd-sibling';

test.describe('related tools stay in the category', () => {
  test('Roman numeral converter: numeral siblings, never tax or tip', async ({ page }) => {
    await page.goto('/tool/number/roman-numeral-converter/');
    expect(await hrefs(page, DRAWER)).toEqual([
      '/tool/number/binary-converter/',
      '/tool/number/number-to-words/',
      '/tool/number/scientific-calculator/',
    ]);
  });

  test('Roman numeral guide: Related Tools and the footer siblings stay in number utilities', async ({ page }) => {
    await page.goto('/guide/number/roman-numeral-converter/');
    const related = await hrefs(page, GUIDE_RELATED);
    const footer = await hrefs(page, FOOTER_SIBLINGS);
    expect(related.length).toBeGreaterThan(0);
    expect(footer.length).toBeGreaterThan(0);
    for (const p of [...related, ...footer]) {
      expect(p).toMatch(/^\/tool\/number\//);
      expect(p).not.toMatch(/tax-calculator|tip-calculator/);
    }
  });

  test('tax calculator: at most one numeral tool, as the last-slot family door', async ({ page }) => {
    await page.goto('/tool/number/tax-calculator/');
    const links = await hrefs(page, DRAWER);
    expect(links.length).toBeGreaterThan(0);
    for (const p of links) expect(p).toMatch(/^\/tool\/number\//);
    const numeral = links.filter(p => /roman-numeral|binary-converter|number-to-words/.test(p));
    expect(numeral.length).toBeLessThanOrEqual(1);
    if (numeral.length) expect(links.at(-1)).toBe(numeral[0]);
  });

  test('a top-up tool still names an in-category sibling, and every link resolves', async ({ page, request }) => {
    await page.goto('/tool/health/vo2-max-calculator/');
    const links = await hrefs(page, DRAWER);
    expect(links.length).toBeGreaterThan(0);
    for (const p of links) {
      expect(p).toMatch(/^\/tool\/health\//);
      expect((await request.get(p)).status()).toBe(200);
    }
  });

  test('the related row is reachable on this viewport', async ({ page }) => {
    await page.goto('/tool/number/roman-numeral-converter/');
    const more = page.locator('#kd-more > summary');
    if (await more.isVisible()) await more.click();
    await expect(page.locator(DRAWER).first()).toBeVisible();
  });
});
