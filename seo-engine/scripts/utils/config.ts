/**
 * Central tunables for the research pipeline.
 *
 * Every threshold, weight, and cap the engine relies on lives here so the
 * extraction/scoring behaviour can be adjusted in one place instead of being
 * scattered as magic numbers across the scripts.
 */

/** Cache time-to-live, in milliseconds (SERP results + fetched pages). */
export const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/** Maximum number of search queries generated per tool slug. */
export const MAX_QUERIES = 8;

/** Number of top SERP URLs whose pages are fetched and analyzed. */
export const TOP_PAGES = 10;

/** Heading-frequency thresholds (share of competitor pages a heading appears on). */
export const GAP_THRESHOLDS = {
  /** ≥ this share → must-have section (competitor consensus). */
  mustHave: 0.7,
  /** < this share (but > 0) → content gap (opportunity). */
  gap: 0.3,
};

/** Frequency weights applied to terms by the element they came from. */
export const ENTITY_WEIGHTS = {
  h1: 3,
  h2: 2,
  h3: 1.5,
  title: 2.5,
  description: 1,
  /** Extra multiplier applied to bigrams over single terms. */
  bigram: 1.5,
};

/** Number of ranked entities kept in research.json. */
export const ENTITY_COUNT = 20;

/** Caps applied when assembling research.json. */
export const LIMITS = {
  questions: 40,
  contentGaps: 20,
  competitorHeadings: 30,
  relatedTopics: 20,
};
