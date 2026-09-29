// Wire types for dist/search-index.json, plus the one function that reassembles a URL from it.
//
// This module deliberately imports nothing heavy. The browser-side palette needs these, and
// importing them from ./index would drag the whole registry (every tool config, every category)
// into a chunk that is meant to be a few kilobytes. Type-only imports are erased, but entryUrl is
// real code, so it has to live somewhere with no build-time dependencies. Its one runtime import is
// toolRoute from the URL builder (src/lib/paths.ts), which imports only the site constants.

import type { RankableEntry } from './rank';
import { toolRoute } from '@lib/paths';

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

/** Rebuild an entry's URL. The inverse of the interning in buildClientIndex; keep the two in step. */
export function entryUrl(index: ClientIndex, entry: SearchEntry): string {
  // The base is interned once per index (`b`), so this takes the base-less route, not toolPath().
  return `${index.b}${toolRoute({ segment: index.g[entry.g], slug: entry.s })}`;
}

/** An entry's category display name. */
export function entryCategory(index: ClientIndex, entry: SearchEntry): string {
  return index.c[entry.c] ?? '';
}
