import { test, expect, type Page } from '@playwright/test';
import { config as binaryConverter } from '../../src/tools/number/binary-converter/config';
import { config as numberToWords } from '../../src/tools/number/number-to-words/config';

// Related tools stay in the category above a relevance floor, or come from the tool's own
// hand-picked relatedTools override; nothing leaves the category automatically
// (src/lib/tools/related.ts). Runs on chromium and pixel5 against the built pages: the tool drawer
// row, the guide's Related Tools list and the guide footer siblings (CategoryDiscovery).

const hrefs = async (page: Page, selector: string) =>
  page.locator(selector).evaluateAll(els => els.map(e => new URL((e as HTMLAnchorElement).href).pathname));

const DRAWER = '.kd-related-links a';
const GUIDE_RELATED = '.kg-link';
const FOOTER_SIBLINGS = '.cd-sibling';
const TAX_OR_TIP = /tax-calculator|tip-calculator/;

test.describe('related tools: in-category floor plus hand-picked overrides', () => {
  test('Roman numeral converter: numeral siblings, never tax or tip', async ({ page }) => {
    await page.goto('/tool/number/roman-numeral-converter/');
    expect(await hrefs(page, DRAWER)).toEqual([
      '/tool/number/binary-converter/',
      '/tool/number/number-to-words/',
      '/tool/number/scientific-calculator/',
    ]);
  });

  // A link may leave number utilities only when the tool's own relatedTools hand-picks it;
  // any other out-of-category link is an automatic leak and fails.
  for (const tool of [binaryConverter, numberToWords]) {
    test(`${tool.slug}: in number utilities or hand-picked, never tax or tip`, async ({ page }) => {
      await page.goto(`/tool/number/${tool.slug}/`);
      const links = await hrefs(page, DRAWER);
      expect(links.length).toBeGreaterThanOrEqual(2);
      const picked = tool.relatedTools ?? [];
      for (const p of links) {
        expect(p).not.toMatch(TAX_OR_TIP);
        if (p.startsWith('/tool/number/')) continue;
        const slug = p.split('/').filter(Boolean).pop()!;
        expect(picked, `automatic out-of-category link ${p}`).toContain(slug);
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

  test('a thin tool shows its hand-picked links, at least two', async ({ page }) => {
    await page.goto('/tool/text/paragraph-counter/');
    const links = await hrefs(page, DRAWER);
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links).toEqual(expect.arrayContaining(['/tool/text/remove-blank-lines/', '/tool/text/normalize-whitespace/']));
  });

  test('the related row is reachable on this viewport', async ({ page }) => {
    await page.goto('/tool/number/roman-numeral-converter/');
    const more = page.locator('#kd-more > summary');
    if (await more.isVisible()) await more.click();
    await expect(page.locator(DRAWER).first()).toBeVisible();
  });
});
