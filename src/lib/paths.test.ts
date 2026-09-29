// The URL builder (C3). Pins the three URL shapes, the withBase layering, the entity seam, and that
// every tool, category and guide in the registry resolves to exactly the URL it had before the
// builder existed, so moving construction sites onto it cannot change a single link.
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  withBase,
  toolRoute,
  categoryRoute,
  guideRoute,
  toolPath,
  categoryPath,
  guidePath,
  urlFor,
  canonicalFor,
} from './paths';
import { tools } from '@data/registry';
import { categories } from '@data/categories';
import { SITE_ORIGIN } from '@config/site';

const segmentOf = (slug: string) => categories.find((c) => c.slug === slug)!.segment;

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('withBase', () => {
  it('is the identity at the apex (BASE_URL "/")', () => {
    expect(withBase('/')).toBe('/');
    expect(withBase('/tool/text/word-counter/')).toBe('/tool/text/word-counter/');
  });

  it('prefixes a base path, and "/" becomes the base with its slash', () => {
    vi.stubEnv('BASE_URL', '/toytools/');
    expect(withBase('/')).toBe('/toytools/');
    expect(withBase('/category/text-utilities/')).toBe('/toytools/category/text-utilities/');
  });
});

describe('route and path shapes', () => {
  it('builds the three URL shapes, trailing-slashed', () => {
    expect(toolRoute({ slug: 'word-counter', segment: 'text' })).toBe('/tool/text/word-counter/');
    expect(categoryRoute({ slug: 'text-utilities' })).toBe('/category/text-utilities/');
    expect(guideRoute({ categorySlug: 'text', slug: 'how-to-count-words' })).toBe(
      '/guide/text/how-to-count-words/',
    );
  });

  it('sends every path through withBase', () => {
    vi.stubEnv('BASE_URL', '/toytools/');
    expect(toolPath({ slug: 'word-counter', segment: 'text' })).toBe('/toytools/tool/text/word-counter/');
    expect(categoryPath({ slug: 'text-utilities' })).toBe('/toytools/category/text-utilities/');
    expect(guidePath({ categorySlug: 'text', slug: 'g' })).toBe('/toytools/guide/text/g/');
    // Routes never carry the base: they are data, compared and stored base-less.
    expect(toolRoute({ slug: 'word-counter', segment: 'text' })).toBe('/tool/text/word-counter/');
  });
});

describe('urlFor / canonicalFor: the same-origin seam', () => {
  const tool = { kind: 'tool', slug: 'word-counter', segment: 'text' } as const;

  it('urlFor is the same-origin path for every entity kind', () => {
    expect(urlFor(tool)).toBe(toolPath(tool));
    expect(urlFor({ kind: 'category', slug: 'finance' })).toBe(categoryPath({ slug: 'finance' }));
    expect(urlFor({ kind: 'guide', categorySlug: 'text', slug: 'g' })).toBe(
      guidePath({ categorySlug: 'text', slug: 'g' }),
    );
  });

  it('canonicalFor is that path on the build site, or the production origin without one', () => {
    expect(canonicalFor(tool, new URL('https://preview.example/'))).toBe(
      'https://preview.example/tool/text/word-counter/',
    );
    expect(canonicalFor(tool, 'https://toytoolsapp.com/')).toBe('https://toytoolsapp.com/tool/text/word-counter/');
    expect(canonicalFor(tool)).toBe(`${SITE_ORIGIN}/tool/text/word-counter/`);
    expect(canonicalFor(tool, null)).toBe(`${SITE_ORIGIN}/tool/text/word-counter/`);
  });

  it('keeps a base path when the site carries one', () => {
    vi.stubEnv('BASE_URL', '/toytools/');
    expect(canonicalFor(tool, 'https://example.github.io/toytools/')).toBe(
      'https://example.github.io/toytools/tool/text/word-counter/',
    );
  });
});

describe('every registry entity resolves to its pre-builder URL', () => {
  it('tools: /tool/<segment>/<slug>/', () => {
    for (const t of tools) {
      const segment = segmentOf(t.categorySlug);
      expect(toolPath({ slug: t.slug, segment })).toBe(`/tool/${segment}/${t.slug}/`);
    }
  });

  it('categories: /category/<slug>/', () => {
    for (const c of categories) expect(categoryPath(c)).toBe(`/category/${c.slug}/`);
  });

  it('guides: /guide/<categorySlug>/<slug>/', () => {
    for (const t of tools) {
      if (!t.guide) continue;
      expect(guidePath(t.guide)).toBe(`/guide/${t.guide.categorySlug}/${t.guide.slug}/`);
    }
  });
});
