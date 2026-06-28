// External signal seam — the single integration point for any off-site discovery/visibility
// signal (search-engine indexation today; Bing, IndexNow status, analytics later). Downstream
// code (the indexing runner, and eventually `npm run intel` roadmap scoring) depends only on this
// interface, so adding a provider never touches the consumers.
//
// Providers MUST be side-effect free at import time and MUST NOT throw from inspect() — they
// return an 'error' record instead, so one bad URL never aborts a whole run.

/** How a URL stands with a search engine, normalized across providers. */
export type CoverageBucket =
  | 'indexed'                  // crawled and in the index
  | 'crawled-not-indexed'      // crawled but Google chose not to index
  | 'discovered-not-indexed'   // known but not yet crawled
  | 'excluded-noindex'         // blocked by a noindex tag / robots
  | 'unknown'                  // URL unknown to the engine, or unmappable state
  | 'error';                   // the lookup itself failed

export interface IndexationRecord {
  url: string;
  /** Provider name, e.g. 'google-search-console'. */
  source: string;
  bucket: CoverageBucket;
  indexed: boolean;
  /** Raw provider fields, kept for auditing/debugging. */
  verdict?: string;
  coverageState?: string;
  robotsTxtState?: string;
  lastCrawlTime?: string;
  checkedAt: string;           // ISO timestamp
  error?: string;
}

export interface ExternalSignalProvider {
  readonly name: string;
  /** True when the environment/credentials needed to run are present. */
  isConfigured(): boolean;
  /** Human-readable hint shown when isConfigured() is false (what to set up). */
  configHint(): string;
  /** Inspect one absolute URL. Never throws — returns an 'error' record on failure. */
  inspect(url: string): Promise<IndexationRecord>;
}

/** Map a Google Search Console coverageState/verdict pair to our normalized bucket. */
export function bucketFromGoogleState(coverageState = '', verdict = ''): CoverageBucket {
  const s = coverageState.toLowerCase();
  if (s.includes('noindex') || s.includes("'noindex'")) return 'excluded-noindex';
  if (s.includes('indexed')) return 'indexed'; // "Submitted and indexed" / "Indexed, not submitted…"
  if (s.includes('crawled')) return 'crawled-not-indexed';
  if (s.includes('discovered')) return 'discovered-not-indexed';
  if (s.includes('unknown')) return 'unknown';
  // Fall back on the verdict when the state string is unrecognised.
  if (verdict.toUpperCase() === 'PASS') return 'indexed';
  return 'unknown';
}
