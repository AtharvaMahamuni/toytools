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

// Multiword marketing/filler phrases that pass per-token checks but carry no
// topical signal. These leak into scaffold entity lists ("mention these
// entities: Less Time, Boost Productivity") and a literal-minded agent obeys.
export const GENERIC_PHRASES = new Set([
  'less time', 'more time', 'real time', 'right way', 'good idea', 'long run',
  'first time', 'next level', 'boost productivity', 'save time', 'get started',
  'getting started', 'learn more', 'read more', 'find out', 'check out',
  'sign up', 'free trial', 'pro tip', 'pro tips', 'best practices',
  'common questions', 'frequently asked', 'final thoughts', 'wrapping up',
  'key takeaways', 'table contents', 'related posts', 'related articles',
]);

// Bare verbs/adverbs/abstract nouns that survive document-frequency gating
// because every competitor uses them, yet are never entities on their own.
export const GENERIC_WORDS = new Set([
  'actually', 'really', 'basically', 'simply', 'easily', 'quickly', 'better',
  'work', 'works', 'working', 'worked', 'thing', 'things', 'stuff', 'people',
  'time', 'times', 'day', 'days', 'today', 'start', 'starts', 'started',
  'know', 'knows', 'try', 'tried', 'great', 'good', 'right', 'different',
  'effective', 'productive', 'productivity', 'focus', 'focused',
  // product-UI vocabulary every competitor page has, never a topic entity
  'features', 'feature', 'custom', 'customize', 'manage', 'managing',
  'preferences', 'options', 'settings', 'available', 'update', 'updates',
]);

/**
 * True when a candidate term is specific enough to surface as an entity in
 * research output and scaffold prompts. `allowlist` (lowercased slug tokens,
 * tool tags, knowledge keywords) rescues domain words that the generic lists
 * would otherwise reject — "focus" is junk for a JSON tool but the topic
 * itself for a pomodoro timer.
 */
export function isSpecificEntity(term: string, allowlist: ReadonlySet<string> = new Set()): boolean {
  const key = term.toLowerCase().trim();
  if (!key) return false;
  if (allowlist.has(key)) return true;
  if (GENERIC_PHRASES.has(key)) return false;
  const tokens = key.split(/\s+/);
  if (tokens.some(t => allowlist.has(t))) return true;
  // every token generic → the phrase is generic ("boost productivity", "actually works")
  return !tokens.every(t => STOP_WORDS.has(t) || SEO_JUNK.has(t) || GENERIC_WORDS.has(t));
}
