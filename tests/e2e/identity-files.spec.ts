import { test, expect } from '@playwright/test';

// The identity files ship in the build, and /identity.json is the Organization and Person graph the
// built pages carry in their JSON-LD (the unit tests pin the source; this pins the output).
test.describe('identity files', () => {
  for (const [path, type] of [
    ['/brand.txt', 'text/plain'],
    ['/ai.txt', 'text/plain'],
    ['/faq-ai.txt', 'text/plain'],
    ['/ai.json', 'application/json'],
    ['/identity.json', 'application/json'],
    ['/llm.txt', 'text/plain'],
    ['/llms.html', 'text/html'],
    ['/robots-ai.txt', 'text/plain'],
  ] as const) {
    test(`${path} is served`, async ({ request }) => {
      const resp = await request.get(path);
      expect(resp.status()).toBe(200);
      expect(resp.headers()['content-type']).toContain(type);
      expect(await resp.text()).toContain('ToyTools');
    });
  }

  test('identity.json matches the home page JSON-LD', async ({ request, page }) => {
    const served = await (await request.get('/identity.json')).json();
    await page.goto('/');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const graphs = blocks.map(b => JSON.parse(b)).filter(j => Array.isArray(j['@graph']));
    expect(graphs).toContainEqual(served);
  });

  test('llms.html is noindex, canonical to home, and not in the sitemap', async ({ request }) => {
    const html = await (await request.get('/llms.html')).text();
    expect(html).toContain('<meta name="robots" content="noindex">');
    expect(html).toMatch(/<link rel="canonical" href="[^"]+\/">/);
    const index = await (await request.get('/sitemap-index.xml')).text();
    const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]!).pathname);
    expect(children.length).toBeGreaterThan(3);
    for (const child of children) {
      const xml = await (await request.get(child)).text();
      expect(xml).toContain('<loc>');
      expect(xml).not.toContain('llms.html');
    }
  });
});
