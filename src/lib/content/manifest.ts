// Content Manifest — the canonical, registry-derived list of every indexable surface
// (home, tools, guides, categories, language stubs). Sitemaps, and future search /
// related-content systems, all derive from this single source rather than maintaining
// their own lists. Pure and build-time; no I/O.

import { tools } from '@data/registry';
import { categories } from '@data/categories';
import { faqsByToolSlug } from '@data/faq-registry';
import { withBase } from '@lib/paths';

// 'language' remains in the union for generatePageTitle('language', …), but the /{lang}/ stubs
// are intentionally NOT emitted into the manifest: they are thin, near-duplicate landing pages,
// so they carry robots="noindex,follow" and are excluded from both the sitemap and IndexNow.
// 'page' covers standalone indexable pages that are not derived from the registry — currently
// just /feedback/. They are listed here rather than in each consumer so the sitemap, IndexNow,
// and platform health all pick them up from the same place, exactly like a tool.
export type ContentType = 'home' | 'tool' | 'guide' | 'category' | 'language' | 'page';

/** Standalone indexable pages. /search/ and /architecture/ are deliberately absent: both are
 *  noindex or excluded, and adding one here is what makes it public. */
// Indexable standalone pages. /settings/ and /offline/ are deliberately absent: they are personal
// control surfaces rather than content, carry robots="noindex", and belong in no sitemap.
const STANDALONE_PAGES: { slug: string; path: string; priority: number; changefreq: string }[] = [
  { slug: 'feedback', path: '/feedback/', priority: 0.6, changefreq: 'monthly' },
  { slug: 'about', path: '/about/', priority: 0.5, changefreq: 'monthly' },
  { slug: 'privacy', path: '/privacy/', priority: 0.4, changefreq: 'yearly' },
  { slug: 'changelog', path: '/changelog/', priority: 0.4, changefreq: 'monthly' },
];

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

function segmentOf(categorySlug: string): string {
  return categories.find(c => c.slug === categorySlug)?.segment ?? categorySlug;
}

/**
 * Latest valid W3C (YYYY-MM-DD) date among a set of tools. ISO dates sort lexicographically =
 * chronologically, so the max is the freshest. Lets home/category/guide entries derive a real
 * <lastmod> that advances whenever any underlying tool changes — a recrawl signal with zero manual
 * upkeep (adding or updating a tool bumps its category's and the home page's lastmod automatically).
 */
function latestUpdatedAt(list: { updatedAt?: string }[]): string | undefined {
  const dates = list
    .map(t => t.updatedAt)
    .filter((d): d is string => !!d && /^\d{4}-\d{2}-\d{2}$/.test(d));
  return dates.length ? dates.sort().at(-1) : undefined;
}

export function buildContentManifest(): ContentEntry[] {
  const entries: ContentEntry[] = [];

  // Home — lastmod tracks the freshest tool so the root recrawls when anything ships or changes.
  entries.push({
    type: 'home',
    slug: '',
    url: withBase('/'),
    updatedAt: latestUpdatedAt(tools),
    priority: 1.0,
    changefreq: 'daily',
  });

  // Categories — lastmod is the freshest tool in the category (advances as its tools evolve).
  for (const c of categories) {
    entries.push({
      type: 'category',
      slug: c.slug,
      url: withBase(`/category/${c.slug}/`),
      categorySlug: c.slug,
      updatedAt: latestUpdatedAt(tools.filter(t => t.categorySlug === c.slug)),
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
        // Use the tool's machine date (YYYY-MM-DD), not the guide's human display string
        // ("Jul 2026"), so the guide emits a valid <lastmod>. A guide changes with its tool.
        updatedAt: t.updatedAt,
        priority: 0.7,
        changefreq: 'monthly',
      });
    }
  }

  // Standalone pages. lastmod tracks the freshest tool: /feedback/ describes what the site
  // builds and links every category, so it genuinely is stale whenever the catalogue moves.
  for (const page of STANDALONE_PAGES) {
    entries.push({
      type: 'page',
      slug: page.slug,
      url: withBase(page.path),
      updatedAt: latestUpdatedAt(tools),
      priority: page.priority,
      changefreq: page.changefreq,
    });
  }

  // Language stubs (/{lang}/) are deliberately omitted — thin, near-duplicate pages carrying
  // robots="noindex,follow". Keeping them out of the manifest excludes them from the sitemap
  // and IndexNow in one place. See ContentType note above.

  return entries;
}

/** Convenience: all entries of a single type (used by per-bucket sitemaps). */
export function contentByType(type: ContentType): ContentEntry[] {
  return buildContentManifest().filter(e => e.type === type);
}
