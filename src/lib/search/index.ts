// Search index builders. Two shapes over one catalog:
//
//   buildSearchIndex()  — the full architectural document set (every field, human sized names).
//                         Consumed by scripts/platform-health.ts for coverage reporting.
//   buildClientIndex()  — the compact wire format served as dist/search-index.json and consumed
//                         by the nav palette, /search/ and /404/.
//
// Both are derived from the registry, so neither can drift from the catalog.

import { getAllMetadata } from '@data/metadata';
import { tools } from '@data/registry';
import { categories } from '@data/categories';
import { searchAliases } from '@data/search-aliases';
import { withBase } from '@lib/paths';
import type { RankableEntry } from './rank';

export interface SearchDocument {
  slug: string;
  title: string;
  description: string;
  category: string;
  engine: string;
  keywords: string[];
}

/**
 * Build the flat, serializable search index over every registered tool. Keywords merge
 * the tool's explicit keywords with its tags so a future index has everything it needs.
 */
export function buildSearchIndex(): SearchDocument[] {
  return getAllMetadata().map(m => ({
    slug: m.slug,
    title: m.name,
    description: m.description,
    category: m.category,
    engine: m.engine,
    keywords: [...new Set([...m.keywords, ...m.tags])],
  }));
}

/**
 * The compact client index. Single-letter fields because this is a wire format, not an authored
 * one: at 114 tools the difference between this and the document shape above is several kilobytes
 * over the network, and it is fetched on a user interaction where latency is visible.
 *
 * Two things are deliberately NOT stored per entry:
 *   - the URL, because it is exactly `${base}/tool/${segment}/${slug}/` and storing it would
 *     repeat the slug in every record;
 *   - the category and segment strings, which are interned into the shared tables below because
 *     114 entries share 11 categories.
 * `entryUrl()` is the one place that reassembles a URL, shared by every consumer.
 */
export interface SearchEntry extends RankableEntry {
  /** slug */
  s: string;
  /** display name */
  n: string;
  /** index into ClientIndex.g (URL segment) */
  g: number;
  /** index into ClientIndex.c (category display name) */
  c: number;
  /** lowercased extra search terms: tags, keywords, family, category, aliases */
  k: string[];
}

export interface ClientIndex {
  /** base path, so the client never has to know about BASE_URL */
  b: string;
  /** interned URL segments */
  g: string[];
  /** interned category display names */
  c: string[];
  /** entries, sorted by display name */
  t: SearchEntry[];
}

/** Rebuild an entry's URL. The inverse of the interning above; keep the two in step. */
export function entryUrl(index: ClientIndex, entry: SearchEntry): string {
  return `${index.b}/tool/${index.g[entry.g]}/${entry.s}/`;
}

export function buildClientIndex(): ClientIndex {
  const segmentOf = new Map(categories.map(c => [c.slug, c.segment]));
  const categoryNameOf = new Map(categories.map(c => [c.slug, c.name]));

  const segments: string[] = [];
  const categoryNames: string[] = [];
  const intern = (table: string[], value: string): number => {
    const at = table.indexOf(value);
    if (at !== -1) return at;
    table.push(value);
    return table.length - 1;
  };

  const entries = tools
    .map((tool): SearchEntry => {
      const segment = segmentOf.get(tool.categorySlug) ?? tool.categorySlug;
      const categoryName = categoryNameOf.get(tool.categorySlug) ?? tool.categorySlug;
      const lowerName = tool.name.toLowerCase();

      const terms = new Set<string>();
      const add = (value?: string) => {
        const v = (value ?? '').trim().toLowerCase();
        // A term the name already contains can never outscore matching the name itself,
        // so carrying it would be pure payload.
        if (v && !lowerName.includes(v)) terms.add(v);
      };

      tool.tags.forEach(add);
      (tool.keywords ?? []).forEach(add);
      (searchAliases[tool.slug] ?? []).forEach(add);
      add(tool.family);
      add(categoryName);

      return {
        s: tool.slug,
        n: tool.name,
        g: intern(segments, segment),
        c: intern(categoryNames, categoryName),
        k: [...terms].sort(),
      };
    })
    .sort((a, b) => a.n.localeCompare(b.n));

  // withBase('/') is '/' locally and '/toytools/' under a base path; the client wants the prefix
  // with no trailing slash so it can concatenate directly.
  return { b: withBase('/').replace(/\/$/, ''), g: segments, c: categoryNames, t: entries };
}
