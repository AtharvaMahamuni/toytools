// Pins the build-time slug lookup the guides link through (C4), and that the guides use it right.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { tools } from '@data/registry';
import { categories } from '@data/categories';
import { toolPath } from '@lib/paths';
import { toolPathBySlug } from './tool-link';

const ROOT = resolve(__dirname, '../../..');
const segmentOf = (categorySlug: string) => categories.find((c) => c.slug === categorySlug)!.segment;

function files(dir: string, re: RegExp): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...files(full, re));
    else if (re.test(name)) out.push(full);
  }
  return out;
}
const guides = files(join(ROOT, 'src/tools'), /^Guide\.astro$/);

describe('toolPathBySlug', () => {
  it('is toolPath at the registry segment, for every tool', () => {
    for (const t of tools) {
      expect(toolPathBySlug(t.slug), t.slug).toBe(toolPath({ slug: t.slug, segment: segmentOf(t.categorySlug) }));
    }
  });

  it('throws on a slug that is not a tool, so a typo fails the build', () => {
    expect(() => toolPathBySlug('word-countr')).toThrow(/word-countr/);
  });
});

describe('guide links', () => {
  it('finds the guides', () => {
    expect(guides.length).toBeGreaterThanOrEqual(145);
  });

  it('name only real tools and categories', () => {
    const toolSlugs = new Set(tools.map((t) => t.slug));
    const categorySlugs = new Set(categories.map((c) => c.slug));
    const bad: string[] = [];
    let links = 0;
    for (const file of guides) {
      const src = readFileSync(file, 'utf8');
      const rel = relative(ROOT, file);
      for (const m of src.matchAll(/toolPathBySlug\('([^']*)'\)/g)) {
        links += 1;
        if (!toolSlugs.has(m[1]!)) bad.push(`${rel}: tool "${m[1]}"`);
      }
      for (const m of src.matchAll(/categoryPath\(\{ slug: '([^']*)' \}\)/g)) {
        links += 1;
        if (!categorySlugs.has(m[1]!)) bad.push(`${rel}: category "${m[1]}"`);
      }
    }
    expect(links).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  it('never call withBase themselves: every guide link goes through the builder', () => {
    const offenders = guides.filter((f) => /\bwithBase\b/.test(readFileSync(f, 'utf8'))).map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
  });

  it('link to their own tool with toolPath at the category segment', () => {
    const missing = guides
      .filter((f) => !readFileSync(f, 'utf8').includes('toolPath({ slug: config.slug, segment: category.segment })'))
      .map((f) => relative(ROOT, f));
    expect(missing).toEqual([]);
  });
});

describe('tool-link stays server-side', () => {
  it('is never imported from a client <script> in an .astro file', () => {
    const offenders: string[] = [];
    for (const file of files(join(ROOT, 'src'), /\.astro$/)) {
      const src = readFileSync(file, 'utf8');
      for (const m of src.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
        if (/tool-link/.test(m[1]!)) offenders.push(relative(ROOT, file));
      }
    }
    expect(offenders).toEqual([]);
  });
});
