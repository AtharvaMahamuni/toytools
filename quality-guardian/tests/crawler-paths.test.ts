// /llms.html is a generated AI file (llms.txt as HTML: noindex, canonical to home, links to .txt
// and .json files, kept out of the sitemap). The crawler must skip it, or the page validators fail
// every PR on rules it breaks by design. This fails if the NON_PAGE_HTML skip is removed.
import { afterAll, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { NON_PAGE_HTML } from '../config/index';
import { filePathToUrlPath, pageHtmlFiles } from '../crawler/paths';

const dist = mkdtempSync(join(tmpdir(), 'qg-dist-'));
for (const rel of ['index.html', 'llms.html', '404.html', 'about/index.html']) {
  mkdirSync(join(dist, rel, '..'), { recursive: true });
  writeFileSync(join(dist, rel), '<!doctype html>');
}
writeFileSync(join(dist, 'llms.txt'), '# ToyTools');
afterAll(() => rmSync(dist, { recursive: true, force: true }));

describe('crawler page files', () => {
  it('names /llms.html as a non-page file', () => {
    expect([...NON_PAGE_HTML]).toEqual(['/llms.html']);
  });

  it('skips /llms.html and keeps every real page', () => {
    const paths = pageHtmlFiles(dist).map(f => filePathToUrlPath(f, dist)).sort();
    expect(paths).toEqual(['/', '/404.html', '/about/']);
  });
});
