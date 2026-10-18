// Home-nav option D: the tool icon in the tool bar is a link home with a ToyTools badge.
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const src = readFileSync('src/components/tool/ToolBar.astro', 'utf8');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(astro|ts)$/.test(name)) out.push(p);
  }
  return out;
}

describe('ToolBar home link', () => {
  it('wraps the tool icon in a link to / labelled ToyTools home', () => {
    expect(src).toMatch(/<a class="tb-home" href=\{withBase\('\/'\)\} aria-label="ToyTools home" data-tb-home>\s*<img class="tb-mark"/);
  });

  it('puts the favicon mark inside the link as a decorative badge', () => {
    expect(src).toContain(`<img class="tb-badge" src={withBase('/favicon.svg')} width="14" height="14" alt="" data-tb-badge />`);
  });

  it('has a visible focus ring, a hover and a pressed state', () => {
    // The ring is the global :focus-visible outline, which the link gets like any other.
    expect(readFileSync('src/styles/global.css', 'utf8')).toMatch(/:focus-visible \{\s*outline: var\(--focus-ring\);/);
    expect(src).toMatch(/\.tb-home:hover \{ opacity: 0\.8; \}/);
    expect(src).toMatch(/\.tb-home:active \{ opacity: 0\.6; \}/);
  });

  it('adds no width: the link has no padding or margin', () => {
    const block = /\.tb-home \{([^}]*)\}/.exec(src)?.[1] ?? '';
    expect(block).not.toMatch(/padding|margin|width/);
  });

  it('keeps the never-truncate rule on the title', () => {
    expect(src).toContain('Truncating a tool\'s own name in its own title bar is the one thing this bar must not do');
    expect(src).toContain('-webkit-line-clamp: 4;');
    expect(src).not.toMatch(/text-overflow:\s*ellipsis/);
  });

  it('only ToolLayout renders the bar, so a shell-less widget never gets the link or badge', () => {
    const users = [...walk('src/layouts'), ...walk('src/tools'), ...walk('src/pages'), ...walk('src/components')]
      .filter((p) => !p.endsWith('ToolBar.astro') && !p.endsWith('.test.ts'))
      .filter((p) => /import ToolBar from/.test(readFileSync(p, 'utf8')));
    expect(users).toEqual(['src/layouts/ToolLayout.astro']);
    for (const p of walk('src/tools')) {
      const text = readFileSync(p, 'utf8');
      expect(text, p).not.toContain('data-tb-home');
      expect(text, p).not.toContain('tb-badge');
    }
  });
});
