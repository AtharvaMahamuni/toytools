// Content Manifest — the canonical, registry-derived list of every indexable surface
// (home, tools, guides, categories, language stubs). Sitemaps, and future search /
// related-content systems, all derive from this single source rather than maintaining
// their own lists. Pure and build-time; no I/O.

import { tools } from '@data/registry';
import { categories } from '@data/categories';
import { faqsByToolSlug } from '@data/faq-registry';
import { withBase } from '@lib/paths';

export type ContentType = 'home' | 'tool' | 'guide' | 'category' | 'language';

export interface ContentEntry {
  type: ContentType;
  slug: string;
  /** Site-relative URL (base-prefixed, trailing slash). Wrap with Astro.site for absolute. */
  url: string;
  categorySlug?: string;
  engine?: string;
  relatedTools?: string[];
  guideExists?: boolean;
  faqExists?: boolean;
  updatedAt?: string;
  priority: number;
  changefreq: string;
}

// Language stub routes (src/pages/{lang}/index.astro).
const LANGUAGES = ['en', 'de', 'fr', 'ja'];

function segmentOf(categorySlug: string): string {
  return categories.find(c => c.slug === categorySlug)?.segment ?? categorySlug;
}

export function buildContentManifest(): ContentEntry[] {
  const entries: ContentEntry[] = [];

  // Home
  entries.push({ type: 'home', slug: '', url: withBase('/'), priority: 1.0, changefreq: 'daily' });

  // Categories
  for (const c of categories) {
    entries.push({
      type: 'category',
      slug: c.slug,
      url: withBase(`/category/${c.slug}/`),
      categorySlug: c.slug,
      priority: 0.8,
      changefreq: 'weekly',
    });
  }

  // Tools (+ their guides). FAQ content lives ON the tool page (no standalone faq pages;
  // old /faq/ URLs serve redirect stubs via src/data/faq-redirects.ts — never in sitemaps).
  for (const t of tools) {
    entries.push({
      type: 'tool',
      slug: t.slug,
      url: withBase(`/tool/${segmentOf(t.categorySlug)}/${t.slug}/`),
      categorySlug: t.categorySlug,
      engine: t.engine,
      relatedTools: t.relatedTools ?? [],
      guideExists: t.guide !== undefined,
      faqExists: (faqsByToolSlug[t.slug]?.length ?? 0) > 0,
      updatedAt: t.updatedAt,
      priority: 0.9,
      changefreq: 'monthly',
    });

    if (t.guide) {
      entries.push({
        type: 'guide',
        slug: t.guide.slug,
        url: withBase(`/guide/${t.guide.categorySlug}/${t.guide.slug}/`),
        categorySlug: t.categorySlug,
        updatedAt: t.guide.updatedAt,
        priority: 0.7,
        changefreq: 'monthly',
      });
    }
  }

  // Language stubs
  for (const lang of LANGUAGES) {
    entries.push({
      type: 'language',
      slug: lang,
      url: withBase(`/${lang}/`),
      priority: 0.5,
      changefreq: 'monthly',
    });
  }

  return entries;
}

/** Convenience: all entries of a single type (used by per-bucket sitemaps). */
export function contentByType(type: ContentType): ContentEntry[] {
  return buildContentManifest().filter(e => e.type === type);
}
