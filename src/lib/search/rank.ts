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
  /**
   * The whole query IS one of the entry's curated terms. An alias exists precisely to say "this
   * phrase means this tool", so it outranks any composite assembled from separate word matches and
   * yields only to matching the name outright. Without this, "yml to json" lost its own alias on
   * yaml-to-json-converter to a three-word composite on json-to-yaml-converter, sending the query
   * to the tool that does the exact opposite.
   */
  aliasPhrase: 950,
  /** The name starts with the term AND the term ends on a word boundary: "word" in "Word Counter". */
  namePrefix: 900,
  /** A whole word of the name IS the term: "rem" in "Px to Rem Converter". */
  nameWordExact: 850,
  /**
   * The name starts with the term mid-word: "rem" in "Remove Emoji". Weaker than an exact word
   * match anywhere in the name, which is why it sits below nameWordExact rather than at namePrefix.
   */
  namePartialPrefix: 820,
  /** A later word of the name starts with it. */
  nameWordStart: 800,
  termExact: 700,
  termWordExact: 650,
  nameSubstring: 600,
  termWordStart: 550,
  termSubstring: 500,
  nameFuzzy: 300,
  termFuzzy: 200,
};

/** Anything at or above this tier is a real match rather than typo-forgiveness. */
const FUZZY_CEILING = TIER.termSubstring;

/**
 * Below this length a raw substring match inside a term is noise, not a signal: "v" appears inside
 * "conversion", "ir" inside "circuit". Short terms must instead start a word ("v" in "i = v / r"),
 * which is what a one-letter query actually means.
 */
const MIN_SUBSTRING_LENGTH = 3;

/** Multi-term queries score just under an equivalent whole-phrase hit. */
const MULTI_TERM_PENALTY = 50;

/**
 * Matching the entire query as one phrase beats assembling it from parts, even when the parts
 * happen to average into the same tier. Without this, "yml to json" tied its own alias on
 * yaml-to-json-converter against a per-word composite on json-to-yaml-converter and lost the
 * tiebreak alphabetically, sending the query to the tool that does the exact opposite.
 */
const PHRASE_BONUS = 25;

const WORD_SPLIT = /[^a-z0-9]+/;

/**
 * Head nouns and modifiers people append out of habit rather than to narrow anything: "quadratic
 * formula calculator", "keyword density tool", "json formatter online". They carry no
 * discriminating signal, and requiring them (see scoreEntry's AND rule) silently zeroed good
 * matches whenever the tool happened to be named something else. "quadratic formula calculator"
 * returned nothing at all, because Quadratic Equation Solver is a *Solver* and no term of its
 * carried the word "calculator", even though it does carry the tag "quadratic formula".
 *
 * A soft term still scores when it hits, so "word counter" is unaffected. It just no longer vetoes
 * the entry when it misses.
 *
 * Deliberately NOT in this set: "simulator" and "simulation". Those genuinely discriminate between
 * a simulation and a plain calculator, which is the distinction the physics and applied-math
 * clusters live on, so they stay mandatory.
 */
const TOOL_NOUNS = [
  'calculator', 'tool', 'online', 'free', 'app', 'generator', 'maker',
  'converter', 'solver', 'checker', 'website', 'site',
];

/**
 * Grammar, not content. "friction on a ramp calculator" was returning nothing because "a" had to
 * match something, and no tool has a word starting with "a" in the right place.
 *
 * "to" and "from" are deliberately absent: they carry direction, and dropping them would make
 * "json to csv" and "csv to json" the same query when they are opposite tools.
 */
const STOPWORDS = [
  'a', 'an', 'the', 'of', 'on', 'in', 'at', 'by', 'for', 'and', 'or',
  'my', 'me', 'i', 'is', 'are', 'with', 'how', 'do', 'does',
];

export const SOFT_TERMS = new Set([...TOOL_NOUNS, ...STOPWORDS]);

/**
 * Split a query into words on the same boundary the targets are split on. Splitting the query on
 * spaces alone left punctuation glued to the token, so formula-shaped queries ("V=IR calculator",
 * "pv=nrt calculator", "T=1/f") arrived as one opaque word and matched nothing, even though those
 * are exactly the queries the physics content is written around.
 */
export function queryWords(normalized: string): string[] {
  return normalized.split(WORD_SPLIT).filter(Boolean);
}

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

/** True when `target` continues with a word break (or ends) right after a `term`-length prefix. */
function endsOnWordBoundary(target: string, term: string): boolean {
  if (target.length === term.length) return true;
  return WORD_SPLIT.test(target[term.length]!);
}

/** True when any word in `target` is exactly `term`. */
function wordExactHits(term: string, target: string): boolean {
  for (const word of target.split(WORD_SPLIT)) {
    if (word === term) return true;
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
  // A single letter is only meaningful as a whole word. Allowing it to prefix- or substring-match
  // put every "Remove ..." tool above the Ohm's law calculator for "v = i r", because "r" starts
  // "remove" and "v" sits inside it.
  if (term.length === 1) {
    if (name === term) return TIER.exactName;
    if (wordExactHits(term, name)) return TIER.nameWordExact;
    for (const t of terms) if (t === term) return TIER.termExact;
    for (const t of terms) if (wordExactHits(term, t)) return TIER.termWordExact;
    return 0;
  }

  if (name === term) return TIER.exactName;
  if (name.startsWith(term) && endsOnWordBoundary(name, term)) return TIER.namePrefix;
  if (wordExactHits(term, name)) return TIER.nameWordExact;
  if (name.startsWith(term)) return TIER.namePartialPrefix;
  if (wordStartHits(term, name)) return TIER.nameWordStart;

  for (const t of terms) if (t === term) return TIER.termExact;
  for (const t of terms) if (wordExactHits(term, t)) return TIER.termWordExact;
  if (name.includes(term)) return TIER.nameSubstring;
  for (const t of terms) if (wordStartHits(term, t)) return TIER.termWordStart;
  if (term.length >= MIN_SUBSTRING_LENGTH) {
    for (const t of terms) if (t.includes(term)) return TIER.termSubstring;
  }

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
 * A multi-word query must match every *discriminating* word somewhere (AND, not OR), otherwise
 * "json csv" would surface every JSON tool. Words in SOFT_TERMS are exempt from the AND: they add
 * to the score when they hit and are ignored when they miss, so habitually appended nouns stop
 * vetoing otherwise perfect matches. A query made entirely of soft terms keeps the strict rule,
 * since dropping every word would match the whole catalog.
 *
 * The whole phrase is also scored as one term, so an exact name match still wins outright.
 */
export function scoreEntry(entry: RankableEntry, query: string): number {
  const q = normalizeQuery(query);
  if (!q) return 0;

  const name = entry.n.toLowerCase();
  const wholeTier = name === q ? TIER.exactName
    : entry.k.includes(q) ? TIER.aliasPhrase
    : scoreTerm(q, name, entry.k);
  const whole = wholeTier > 0 ? wholeTier + PHRASE_BONUS : 0;

  let perTerm = 0;
  const words = queryWords(q);
  if (words.length > 1) {
    const hard = words.filter((w) => !SOFT_TERMS.has(w));
    // All-soft queries ("free online tool") keep the strict rule: with every word dropped there
    // would be nothing left to match on and the entire catalog would come back.
    const required = hard.length > 0 ? hard : words;
    const optional = hard.length > 0 ? words.filter((w) => SOFT_TERMS.has(w)) : [];

    let sum = 0;
    let matched = 0;
    let best = 0;
    let all = true;
    for (const word of required) {
      const s = scoreTerm(word, name, entry.k);
      if (!s) {
        all = false;
        break;
      }
      sum += s;
      matched++;
      if (s > best) best = s;
    }
    if (all) {
      for (const word of optional) {
        const s = scoreTerm(word, name, entry.k);
        if (s) {
          sum += s;
          matched++;
          if (s > best) best = s;
        }
      }
      // An entry carried ONLY by typo-forgiveness is noise: dropping soft terms can reduce a query
      // to one short word, and at four characters "fall" is one edit from "all", which was enough
      // to put the lowercase converter under "free fall". Something must match for real.
      if (best >= FUZZY_CEILING) {
        // Average over what actually matched, so a missed soft term neither helps nor hurts.
        perTerm = Math.round(sum / matched) - MULTI_TERM_PENALTY;
      }
    }
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
