// Home-nav option D. The link, badge, focus ring and layout are checked on the rendered page in
// tests/e2e/tool-bar-home.spec.ts. This file keeps the one structural rule that a browser test
// cannot see: the bar exists only on full tool pages.
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(astro|ts)$/.test(name)) out.push(p);
  }
  return out;
}

describe('ToolBar home link scope', () => {
  it('only ToolLayout renders the bar, so a shell-less widget never gets the link or badge', () => {
    const users = [...walk('src/layouts'), ...walk('src/tools'), ...walk('src/pages'), ...walk('src/components')]
      .filter((p) => !p.endsWith('ToolBar.astro') && !p.endsWith('.test.ts'))
      .filter((p) => /import ToolBar from/.test(readFileSync(p, 'utf8')));
    expect(users).toEqual(['src/layouts/ToolLayout.astro']);
    for (const p of walk('src/tools')) {
      const text = readFileSync(p, 'utf8');
      expect(text, p).not.toContain('data-tb-home');
      expect(text, p).not.toContain('data-tb-badge');
    }
  });
});
