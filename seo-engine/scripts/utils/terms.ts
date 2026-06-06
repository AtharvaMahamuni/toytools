/**
 * Shared lexical helpers for term/entity extraction.
 *
 * Factored out of extract.ts so the Reddit module reuses the exact same
 * stopword lists and meaningful-word test when mining terminology from post
 * titles — keeping competitor-page entities and Reddit terminology on one
 * vocabulary.
 */

export const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'through', 'during', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'this', 'that', 'these',
  'those', 'it', 'its', 'as', 'if', 'then', 'than', 'so', 'yet', 'both', 'either',
  'each', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not',
  'only', 'same', 'also', 'just', 'how', 'what', 'when', 'where', 'which', 'who', 'why',
  'you', 'your', 'we', 'our', 'they', 'their', 'i', 'my', 'he', 'she', 'his', 'her',
]);

// Generic SEO/marketing filler that pollutes entity extraction without adding
// topical signal. Layered on top of STOP_WORDS.
export const SEO_JUNK = new Set([
  'online', 'free', 'best', 'top', 'easy', 'simple', 'fast', 'quick', 'instant',
  'tool', 'tools', 'app', 'apps', 'website', 'site', 'web', 'click', 'use', 'using',
  'get', 'guide', 'review', 'reviews', 'home', 'page', 'welcome', 'new', 'now',
  '2023', '2024', '2025', '2026',
  // generic verbs/nouns that survive document-frequency gating but aren't entities
  'set', 'list', 'helps', 'help', 'select', 'tips', 'tip', 'want', 'need', 'make',
  'way', 'ways', 'step', 'steps', 'thing', 'things', 'part', 'like', 'via',
]);

/** True for a token worth keeping as a candidate term/entity. */
export function isMeaningful(w: string): boolean {
  return w.length > 2 && !/^\d+$/.test(w) && !STOP_WORDS.has(w) && !SEO_JUNK.has(w);
}
