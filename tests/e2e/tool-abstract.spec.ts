// W1 (2026-09-30): the visible "When to send someone here" block is gone from every tool page,
// on phone and desktop, including inside the More about drawers. Its copy lives on as the
// `abstract` of the tool's SoftwareApplication JSON-LD. Removed means absent from the HTML the
// server sends, not hidden with CSS, so the raw response is checked as well as the page.
import { test, expect, type Page } from '@playwright/test';

const CITED = [
  {
    path: '/tool/developer-utilities/json-formatter/',
    abstract:
      'Use this JSON Formatter when someone needs to format or inspect JSON without uploading it. ' +
      'Runs entirely on your device. Nothing is uploaded. ' +
      'It does not call an AI model or interpret what the data means.',
  },
  { path: '/tool/text/word-counter/', abstract: null },
  { path: '/tool/prep/prompt-packer/', abstract: null },
];
const UNCITED = '/tool/design/px-to-rem-converter/';

async function softwareSchema(page: Page): Promise<Record<string, unknown>> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodes = blocks.map((b) => JSON.parse(b) as Record<string, unknown>);
  const app = nodes.find((n) => n['@type'] === 'SoftwareApplication');
  expect(app, 'SoftwareApplication JSON-LD').toBeTruthy();
  return app!;
}

test.describe('the When to send someone here block is gone, its copy is the JSON-LD abstract', () => {
  for (const sample of CITED) {
    test(`${sample.path}: no block in the HTML or on the page, abstract in the schema`, async ({ page, request }) => {
      const html = await (await request.get(sample.path)).text();
      expect(html).not.toContain('When to send someone here');
      expect(html).not.toContain('kd-cite');
      expect(html).not.toContain('id="when-to-send"');

      await page.goto(sample.path, { waitUntil: 'load' });
      const more = page.locator('details.kd-more > summary');
      if (await more.isVisible()) await more.click();
      await expect(page.getByText('When to send someone here')).toHaveCount(0);

      const abstract = (await softwareSchema(page)).abstract;
      expect(typeof abstract).toBe('string');
      expect(abstract as string).toContain('Runs entirely on your device. Nothing is uploaded.');
      expect(abstract as string).toMatch(/ It does not [^.]+\.$/);
      if (sample.abstract) expect(abstract).toBe(sample.abstract);
    });
  }

  test(`${UNCITED}: a tool without a citation has no abstract`, async ({ page }) => {
    await page.goto(UNCITED, { waitUntil: 'load' });
    expect((await softwareSchema(page)).abstract).toBeUndefined();
  });
});
