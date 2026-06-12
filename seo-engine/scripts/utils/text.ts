/**
 * Heading hygiene shared by the extractor and the extract pipeline.
 *
 * Competitor pages number their sections ("1. ...", "Q. ..."), surface UI chrome
 * as headings ("FAQ", "25:00", "Download App"), and phrase the same section a
 * dozen different ways. These helpers strip the boilerplate so consensus/gap
 * detection compares like with like instead of treating every variant as unique.
 */

/** Single-word headings that are navigation/UI chrome, never real content. */
const UI_JUNK_HEADINGS = new Set([
  'faq', 'faqs', 'home', 'menu', 'search', 'login', 'log in', 'signin', 'sign in',
  'signup', 'sign up', 'register', 'download', 'settings', 'pricing', 'contact',
  'about', 'share', 'app', 'apps', 'blog', 'news', 'help', 'support', 'account',
  'features', 'overview', 'demo', 'subscribe', 'newsletter', 'cookies',
]);

/**
 * Normalizes a heading for frequency comparison: strips leading enumerators
 * ("1.", "2)", "Q.", "Step 3:"), collapses whitespace, lowercases. Returns the
 * canonical key; callers title-case it for display.
 */
export function normalizeHeading(heading: string): string {
  return heading
    .replace(/^\s*q[\.\):]\s*/i, '')             // "Q.", "Q:", "Q)" — not "Quick"
    .replace(/^\s*step\s+\d+\s*[\.\):]?\s*/i, '') // "Step 3:", "Step 3"
    .replace(/^\s*\d+\s*[\.\)\:]\s*/, '')         // "1.", "2)", "3:"
    .toLowerCase()
    .replace(/\b(the|a|an)\b/g, ' ')             // articles split otherwise-identical headings
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * True when a heading is UI chrome or a non-textual artifact rather than a
 * content section: empty, a bare number, a clock value (25:00), a single junk
 * word, or too short to carry meaning.
 */
export function isJunkHeading(heading: string): boolean {
  const norm = normalizeHeading(heading);
  if (norm.length < 3) return true;
  if (/^\d+([:.]\d+)*$/.test(norm)) return true; // "101", "25:00", "1.5"
  if (UI_JUNK_HEADINGS.has(norm)) return true;
  // single short token with no spaces that isn't clearly topical
  if (!norm.includes(' ') && norm.length < 5) return true;
  return false;
}

/** Title-cases a normalized heading/term for display. */
export function titleCase(text: string): string {
  return text
    .split(' ')
    .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

// Question-dedupe stopwords: function words that differ between phrasings of
// the same question ("What exactly is X?" vs "What is X?") without changing it.
const QUESTION_NOISE = new Set([
  'a', 'an', 'the', 'is', 'are', 'do', 'does', 'did', 'can', 'should', 'will',
  'what', 'why', 'how', 'when', 'where', 'which', 'who', 'i', 'you', 'your',
  'my', 'it', 'its', 'to', 'of', 'in', 'on', 'for', 'and', 'or', 'really',
  'actually', 'exactly',
]);

/**
 * Strips leading enumerators ("Q.", "1.", "Step 3:") from a question while
 * preserving its casing — the FAQ-draft variant of normalizeHeading.
 */
export function cleanQuestion(q: string): string {
  return q
    .replace(/^\s*q[\.\):]\s*/i, '')
    .replace(/^\s*step\s+\d+\s*[\.\):]?\s*/i, '')
    .replace(/^\s*\d+\s*[\.\)\:]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function questionTokens(q: string): Set<string> {
  return new Set(
    q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
      .filter(t => t.length > 1 && !QUESTION_NOISE.has(t)),
  );
}

/** Jaccard similarity of two token sets (0 when either is empty). */
export function tokenJaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

/**
 * Collapses near-duplicate questions: identical content-token sets always merge,
 * and pairs with token Jaccard >= `threshold` merge too ("What is Base64?" /
 * "What exactly is Base64 encoding?"). Keeps the first-seen variant, preserving
 * input order (callers pre-sort by priority/engagement).
 */
export function dedupeQuestions(questions: string[], threshold = 0.8): string[] {
  const kept: { text: string; tokens: Set<string> }[] = [];
  for (const q of questions) {
    const tokens = questionTokens(q);
    if (tokens.size === 0) continue;
    const dup = kept.some(k => tokenJaccard(k.tokens, tokens) >= threshold);
    if (!dup) kept.push({ text: q, tokens });
  }
  return kept.map(k => k.text);
}
