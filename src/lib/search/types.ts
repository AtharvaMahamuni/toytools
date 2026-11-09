// Wire types for dist/search-index.json, plus the helpers that reassemble a URL and a display
// name from it.
//
// This module deliberately imports NOTHING. The browser-side palette needs these, and importing
// them from ./index would drag the whole registry (every tool config, every category) into a chunk
// that is meant to be a few kilobytes. Type-only imports are erased, but entryUrl / nameFromSlug
// are real code, so they have to live somewhere with no build-time dependencies.
//
// That includes the URL builder: importing src/lib/paths.ts here would make it a chunk shared
// between the palette and the engine bundles, an extra request on every engine page. So entryUrl
// spells the tool route itself, and src/lib/search/entry-url.test.ts pins it to toolPath() for
// every tool in the registry. It is the one allowlisted raw `/tool/` template outside paths.ts
// (src/lib/url-literals.test.ts).

import type { RankableEntry } from './rank';

export interface SearchEntry extends RankableEntry {
  /** slug */
  s: string;
  /** display name */
  n: string;
  /** index into ClientIndex.g (URL segment) */
  g: number;
  /** index into ClientIndex.c (category display name) */
  c: number;
  /** lowercased extra search terms: tags, keywords, family, aliases. Category is not stored here. */
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

/**
 * One catalog row on the wire (dist/search-index.json). `n` is omitted when it equals
 * nameFromSlug(s); the client rebuilds it with entryName() so the always-fetched payload
 * does not repeat a name the slug already determines.
 */
export interface CatalogWireEntry {
  s: string;
  n?: string;
  g: number;
  c: number;
}

export interface CatalogWire {
  b: string;
  g: string[];
  c: string[];
  t: CatalogWireEntry[];
}

/**
 * The default display name for a slug: each hyphenated piece, first letter uppercased.
 * "word-counter" → "Word Counter". Tools whose real name differs (JSON, SQL, IP, …) keep an
 * explicit `n` on the wire.
 */
export function nameFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(' ');
}

/** Display name for a wire or hydrated entry. */
export function entryName(entry: { s: string; n?: string }): string {
  return entry.n ?? nameFromSlug(entry.s);
}

/**
 * Turn the fetched search-index.json into a ClientIndex: every entry gets a concrete `n` and an
 * empty `k` (terms arrive later from search-terms.json).
 */
export function hydrateCatalogWire(wire: CatalogWire): ClientIndex {
  return {
    b: wire.b,
    g: wire.g,
    c: wire.c,
    t: wire.t.map((entry) => ({
      s: entry.s,
      n: entryName(entry),
      g: entry.g,
      c: entry.c,
      k: [],
    })),
  };
}

/** Rebuild an entry's URL. The inverse of the interning in buildClientIndex; keep the two in step. */
export function entryUrl(index: ClientIndex, entry: Pick<SearchEntry, 's' | 'g'>): string {
  return `${index.b}/tool/${index.g[entry.g]}/${entry.s}/`;
}

/** An entry's category display name. */
export function entryCategory(index: ClientIndex, entry: Pick<SearchEntry, 'c'>): string {
  return index.c[entry.c] ?? '';
}
