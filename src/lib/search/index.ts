// Search index builder — architecture only (no UI, no search page). A future search
// system (instant search, command palette) consumes this index directly, so tool
// definitions never need refactoring to add search. Derived from the metadata contract
// + content manifest — the same single source as sitemaps.

import { getAllMetadata } from '@data/metadata';

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
