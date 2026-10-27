import { test, expect, type Page } from '@playwright/test';

// Related tools: in-category above a relevance floor, at least three, filled from strong matches
// only (src/lib/tools/related.ts). Runs on
// chromium and pixel5. Reads the built pages: the tool drawer row, the guide's Related Tools list
// and the guide footer siblings (CategoryDiscovery), all derived from the same ranking.

const hrefs = async (page: Page, selector: string) =>
  page.locator(selector).evaluateAll(els => els.map(e => new URL((e as HTMLAnchorElement).href).pathname));

const DRAWER = '.kd-related-links a';
const GUIDE_RELATED = '.kg-link';
const FOOTER_SIBLINGS = '.cd-sibling';

test.describe('related tools: relevance floor, minimum three', () => {
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
      expect(p).toMatch(/^\/(tool|guide)\/number\//);
      expect(p).not.toMatch(/tax-calculator|tip-calculator/);
    }
  });

  test('Binary Converter: numeral and encoding tools, never tax or tip', async ({ page }) => {
    await page.goto('/tool/number/binary-converter/');
    const links = await hrefs(page, DRAWER);
    expect(links.slice(0, 3)).toEqual([
      '/tool/number/number-to-words/',
      '/tool/number/roman-numeral-converter/',
      expect.stringMatching(/\/binary-text-converter\/$/),
    ]);
    for (const p of links) expect(p).not.toMatch(/tax|tip|discount|margin|markup|percentage/);
  });

  for (const path of [
    '/tool/number/tax-calculator/',
    '/tool/text/paragraph-counter/',
    '/tool/developer-utilities/regex-tester/',
    '/tool/health/vo2-max-calculator/',
  ]) {
    test(`${path}: at least three related tools, each resolving`, async ({ page, request }) => {
      await page.goto(path);
      const links = await hrefs(page, DRAWER);
      expect(links.length).toBeGreaterThanOrEqual(3);
      expect(new Set(links).size).toBe(links.length);
      for (const p of links) {
        expect(p).not.toBe(path);
        expect((await request.get(p)).status()).toBe(200);
      }
    });
  }

  test('the related row is reachable on this viewport', async ({ page }) => {
    await page.goto('/tool/number/roman-numeral-converter/');
    const more = page.locator('#kd-more > summary');
    if (await more.isVisible()) await more.click();
    await expect(page.locator(DRAWER).first()).toBeVisible();
  });
});
