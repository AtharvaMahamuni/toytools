// Pins the build-time slug lookup the guides link through (C4), and that the guides use it right.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { tools } from '@data/registry';
import { categories } from '@data/categories';
import { toolPath, guidePath } from '@lib/paths';
import { toolPathBySlug, guidePathBySlug, guidePathOf } from './tool-link';

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

// A literal slug in any quoting and any spacing: toolPathBySlug("x"), categoryPath({slug: 'x'}).
const GUIDE_SLUG_ARG = /guidePathBySlug\(\s*([`'"])([^`'"]*)\1\s*\)/g;
const TOOL_SLUG_ARG = /toolPathBySlug\(\s*([`'"])([^`'"]*)\1\s*\)/g;
const CATEGORY_SLUG_ARG = /categoryPath\(\s*\{\s*slug\s*:\s*([`'"])([^`'"]*)\1\s*,?\s*\}\s*\)/g;
const slugsIn = (src: string, re: RegExp): string[] => [...src.matchAll(re)].map((m) => m[2]!);

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

describe('guidePathBySlug', () => {
  it('is guidePath of the tool\'s own guide, for every tool that has one', () => {
    let n = 0;
    for (const t of tools) {
      if (!t.guide) continue;
      n += 1;
      expect(guidePathBySlug(t.slug), t.slug).toBe(guidePath({ categorySlug: t.guide.categorySlug, slug: t.guide.slug }));
    }
    expect(n).toBeGreaterThan(100);
  });

  it('throws on a slug that is not a tool', () => {
    expect(() => guidePathBySlug('remove-tab')).toThrow(/remove-tab/);
  });

  it('throws for a tool whose guide was retired, so links to it fail the build', () => {
    expect(() => guidePathOf({ slug: 'kebab-case-converter' })).toThrow(/kebab-case-converter.*no guide/);
  });
});

describe('guide links', () => {
  it('finds the guides', () => {
    expect(guides.length).toBeGreaterThanOrEqual(145);
  });

  it('name only real tools and categories', () => {
    const toolSlugs = new Set(tools.map((t) => t.slug));
    const categorySlugs = new Set(categories.map((c) => c.slug));
    const guided = new Set(tools.filter((t) => t.guide).map((t) => t.slug));
    const bad: string[] = [];
    let links = 0;
    for (const file of guides) {
      const src = readFileSync(file, 'utf8');
      const rel = relative(ROOT, file);
      for (const slug of slugsIn(src, TOOL_SLUG_ARG)) {
        links += 1;
        if (!toolSlugs.has(slug)) bad.push(`${rel}: tool "${slug}"`);
      }
      for (const slug of slugsIn(src, GUIDE_SLUG_ARG)) {
        links += 1;
        if (!guided.has(slug)) bad.push(`${rel}: guide of "${slug}"`);
      }
      for (const slug of slugsIn(src, CATEGORY_SLUG_ARG)) {
        links += 1;
        if (!categorySlugs.has(slug)) bad.push(`${rel}: category "${slug}"`);
      }
    }
    expect(links).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  it('are read in any quoting and spacing, so no typo hides behind a style change', () => {
    expect(slugsIn(
      "toolPathBySlug('a') toolPathBySlug(\"b\") toolPathBySlug( `c` ) toolPathBySlug(\n  'd'\n)",
      TOOL_SLUG_ARG,
    )).toEqual(['a', 'b', 'c', 'd']);
    expect(slugsIn(
      "categoryPath({ slug: 'a' }) categoryPath({slug: 'money-financ'}) categoryPath({ slug : \"c\", }) categoryPath({\n  slug: `d`\n})",
      CATEGORY_SLUG_ARG,
    )).toEqual(['a', 'money-financ', 'c', 'd']);
    // Not literal slugs: nothing to check statically (the build still resolves them).
    expect(slugsIn("guidePathBySlug('a') guidePathBySlug( \"b\" )", GUIDE_SLUG_ARG)).toEqual(['a', 'b']);
    expect(slugsIn('toolPathBySlug(config.slug) categoryPath(category)', TOOL_SLUG_ARG)).toEqual([]);
    expect(slugsIn('categoryPath(category) categoryPath({ slug: category.slug })', CATEGORY_SLUG_ARG)).toEqual([]);
  });

  it('never call withBase themselves: every guide link goes through the builder', () => {
    const offenders = guides.filter((f) => /\bwithBase\b/.test(readFileSync(f, 'utf8'))).map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
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
