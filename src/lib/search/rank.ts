/**
 * Ranking for the tool search index.
 *
 * Pure and DOM-free on purpose: the nav palette, /search/ and /404/ all score through this one
 * module, so a query ranks identically wherever it is typed, and the whole thing is unit testable
 * without a browser.
 *
 * Deliberately dependency-free. This ships inside the interaction-loaded palette chunk, where every
 * kilobyte competes with the critical-path budget (see CLAUDE.md, "Performance budget").
 */

export interface RankableEntry {
  /** Display name. */
  n: string;
  /** Lowercased extra search terms: tags, keywords, family, category, aliases. */
  k: string[];
}

export interface RankedEntry<T> {
  entry: T;
  score: number;
}

/**
 * Match tiers. The gaps are wide so a weaker match on a better field can never leapfrog a
 * stronger match, and so the multi-term average below still lands inside a sensible tier.
 */
const TIER = {
  exactName: 1000,
  namePrefix: 900,
  nameWordStart: 800,
  termExact: 700,
  nameSubstring: 600,
  termSubstring: 500,
  nameFuzzy: 300,
  termFuzzy: 200,
};

/** Multi-term queries score just under an equivalent whole-phrase hit. */
const MULTI_TERM_PENALTY = 50;

const WORD_SPLIT = /[^a-z0-9]+/;

export function normalizeQuery(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Levenshtein distance, abandoned as soon as it cannot come in at or under `max`.
 * Returns `max + 1` for "further away than we care about", which is all a typo check needs.
 */
export function boundedDistance(a: string, b: string, max: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev: number[] = [];
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    const row: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      const value = Math.min(row[j - 1]! + 1, prev[j]! + 1, prev[j - 1]! + cost);
      row[j] = value;
      if (value < rowMin) rowMin = value;
    }
    // Every remaining path can only grow, so once the whole row is over budget we are done.
    if (rowMin > max) return max + 1;
    prev = row;
  }
  return prev[b.length]!;
}

/**
 * How many typos to forgive. Short terms get none: at three characters almost everything is
 * within one edit of everything else, which produces nonsense results rather than helpful ones.
 */
function typoBudget(term: string): number {
  if (term.length >= 7) return 2;
  if (term.length >= 4) return 1;
  return 0;
}

/** True when `term` is within its typo budget of any whole word in `target`. */
function fuzzyHits(term: string, target: string): boolean {
  const budget = typoBudget(term);
  if (budget === 0) return false;
  for (const word of target.split(WORD_SPLIT)) {
    if (!word) continue;
    if (boundedDistance(term, word, budget) <= budget) return true;
  }
  return false;
}

/** True when any word in `target` starts with `term`. */
function wordStartHits(term: string, target: string): boolean {
  for (const word of target.split(WORD_SPLIT)) {
    if (word && word.startsWith(term)) return true;
  }
  return false;
}

/** Score one already-normalized term against one entry. 0 means no match at all. */
function scoreTerm(term: string, name: string, terms: string[]): number {
  if (name === term) return TIER.exactName;
  if (name.startsWith(term)) return TIER.namePrefix;
  if (wordStartHits(term, name)) return TIER.nameWordStart;

  for (const t of terms) if (t === term) return TIER.termExact;
  if (name.includes(term)) return TIER.nameSubstring;
  for (const t of terms) if (t.includes(term)) return TIER.termSubstring;

  if (fuzzyHits(term, name)) return TIER.nameFuzzy;
  for (const t of terms) if (fuzzyHits(term, t)) return TIER.termFuzzy;

  return 0;
}

/**
 * Nudge shorter names ahead of longer ones inside a tier, so "Word Counter" beats
 * "Word Frequency Counter" for the query "word counter". Never large enough to cross a tier.
 */
function lengthPenalty(name: string): number {
  return Math.min(name.length, 40) / 10;
}

/**
 * Score one entry against a raw query. 0 means "do not show this at all".
 *
 * A multi-word query must match every word somewhere (AND, not OR), otherwise "json csv" would
 * surface every JSON tool. The whole phrase is also scored as one term, so an exact name match
 * still wins outright.
 */
export function scoreEntry(entry: RankableEntry, query: string): number {
  const q = normalizeQuery(query);
  if (!q) return 0;

  const name = entry.n.toLowerCase();
  const whole = scoreTerm(q, name, entry.k);

  let perTerm = 0;
  const words = q.split(' ');
  if (words.length > 1) {
    let sum = 0;
    let all = true;
    for (const word of words) {
      const s = scoreTerm(word, name, entry.k);
      if (!s) {
        all = false;
        break;
      }
      sum += s;
    }
    if (all) perTerm = Math.round(sum / words.length) - MULTI_TERM_PENALTY;
  }

  const best = Math.max(whole, perTerm);
  if (best <= 0) return 0;
  return best - lengthPenalty(entry.n);
}

/** Rank entries best-first, dropping non-matches. Stable and alphabetical within equal scores. */
export function rankEntries<T extends RankableEntry>(entries: T[], query: string, limit?: number): T[] {
  const scored: RankedEntry<T>[] = [];
  for (const entry of entries) {
    const score = scoreEntry(entry, query);
    if (score > 0) scored.push({ entry, score });
  }
  scored.sort((a, b) => b.score - a.score || a.entry.n.localeCompare(b.entry.n));
  const out = scored.map((s) => s.entry);
  return typeof limit === 'number' ? out.slice(0, limit) : out;
}
