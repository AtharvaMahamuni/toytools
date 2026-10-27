import { test, expect, type Page } from '@playwright/test';

// Related tools stay strictly in the category, above a relevance floor, with no padding
// (src/lib/tools/related.ts). Runs on chromium and pixel5 against the built pages: the tool drawer
// row, the guide's Related Tools list and the guide footer siblings (CategoryDiscovery).

const hrefs = async (page: Page, selector: string) =>
  page.locator(selector).evaluateAll(els => els.map(e => new URL((e as HTMLAnchorElement).href).pathname));

const DRAWER = '.kd-related-links a';
const GUIDE_RELATED = '.kg-link';
const FOOTER_SIBLINGS = '.cd-sibling';
const TAX_OR_TIP = /tax-calculator|tip-calculator/;

test.describe('related tools: strictly in-category, above the relevance floor', () => {
  test('Roman numeral converter: numeral siblings, never tax or tip', async ({ page }) => {
    await page.goto('/tool/number/roman-numeral-converter/');
    expect(await hrefs(page, DRAWER)).toEqual([
      '/tool/number/binary-converter/',
      '/tool/number/number-to-words/',
      '/tool/number/scientific-calculator/',
    ]);
  });

  for (const slug of ['binary-converter', 'number-to-words']) {
    test(`${slug}: in number utilities, never tax or tip`, async ({ page }) => {
      await page.goto(`/tool/number/${slug}/`);
      const links = await hrefs(page, DRAWER);
      expect(links.length).toBeGreaterThan(0);
      for (const p of links) {
        expect(p).toMatch(/^\/tool\/number\//);
        expect(p).not.toMatch(TAX_OR_TIP);
      }
    });
  }

  test('Roman numeral guide: Related Tools and the footer siblings stay in number utilities', async ({ page }) => {
    await page.goto('/guide/number/roman-numeral-converter/');
    const related = await hrefs(page, GUIDE_RELATED);
    const footer = await hrefs(page, FOOTER_SIBLINGS);
    expect(related.length).toBeGreaterThan(0);
    expect(footer.length).toBeGreaterThan(0);
    for (const p of [...related, ...footer]) {
      expect(p).toMatch(/^\/(tool|guide)\/number\//);
      expect(p).not.toMatch(TAX_OR_TIP);
    }
  });

  test('a tool with no eligible sibling shows no related row rather than a weak one', async ({ page }) => {
    await page.goto('/tool/text/paragraph-counter/');
    await expect(page.locator('.kd-related-nav')).toHaveCount(0);
  });

  test('the related row is reachable on this viewport', async ({ page }) => {
    await page.goto('/tool/number/roman-numeral-converter/');
    const more = page.locator('#kd-more > summary');
    if (await more.isVisible()) await more.click();
    await expect(page.locator(DRAWER).first()).toBeVisible();
  });
});
