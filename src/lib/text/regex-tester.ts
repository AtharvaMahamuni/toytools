/**
 * Regex Tester engine helpers.
 *
 * The browser widget runs matches inside a short-lived Worker so a catastrophic
 * pattern cannot freeze the tab. This module is the shared algorithm: syntax
 * handling, the ~20k test-text cap, a step/time budget for sync callers (Node
 * tests, Worker fallback), a heuristic that refuses known-expensive shapes
 * before they run, and the match explain payload the craft surface renders.
 */

export const MAX_TEST_TEXT = 20_000;
export const MAX_MATCHES = 5_000;
/** Soft wall for a sync run. The widget Worker uses its own hard terminate. */
export const MATCH_TIME_BUDGET_MS = 80;
export const DEFAULT_WORKER_TIMEOUT_MS = 150;

export type RegexErrorKind = 'syntax' | 'expensive' | 'timeout' | 'cap' | 'empty-pattern';

export interface RegexGroup {
  index: number;
  name: string | null;
  value: string | null;
  start: number | null;
  end: number | null;
}

export interface RegexMatchExplain {
  /** 1-based match number in the scan order. */
  ordinal: number;
  /** Full match text (group 0). */
  match: string;
  start: number;
  end: number;
  groups: RegexGroup[];
}

export interface RegexTestOk {
  ok: true;
  matches: RegexMatchExplain[];
  matchCount: number;
  truncated: boolean;
  replaced: string | null;
  textLength: number;
  cappedText: boolean;
}

export interface RegexTestErr {
  ok: false;
  kind: RegexErrorKind;
  error: string;
}

export type RegexTestResult = RegexTestOk | RegexTestErr;

export interface RegexTestOptions {
  pattern: string;
  flags?: string;
  text: string;
  replace?: string | null;
  /** Override the sync time budget (ms). */
  timeBudgetMs?: number;
  /** Override the match cap. */
  maxMatches?: number;
  now?: () => number;
}

const VALID_FLAGS = new Set(['d', 'g', 'i', 'm', 's', 'u', 'v', 'y']);

/**
 * Refuse patterns that are famous for catastrophic backtracking.
 * Not a full safety proof: the Worker timeout is the hard stop. This just
 * fails fast on shapes that are almost never intentional in a tester.
 */
export function looksExpensive(pattern: string): string | null {
  if (!pattern) return null;

  // Nested quantifiers on the same group: (a+)+, (a*)*, (a+){2,}, (?:a+)+
  if (/(?:\([^)]*[+*][^)]*\)|\(\?\:[^)]*[+*][^)]*\))[+*{]/.test(pattern)) {
    return 'This pattern nests quantifiers (for example (a+)+). That shape can hang the matcher, so it is blocked here. Simplify the pattern or drop the outer quantifier.';
  }

  // Overlapping alternation under a quantifier: (a|a)+, (a|ab)+, (foo|f)+
  if (/\((?:[^|()]*\|)+[^)]*\)[+*{]/.test(pattern)) {
    // Only flag when the alternatives share a common prefix character.
    const m = pattern.match(/\(([^)]*\|[^)]*)\)[+*{]/);
    if (m) {
      const alts = m[1].split('|').map((a) => a.replace(/\\./g, 'X'));
      if (alts.length >= 2) {
        const heads = alts.map((a) => a[0] ?? '');
        if (heads[0] && heads.every((h) => h === heads[0])) {
          return 'This pattern uses overlapping alternatives under a quantifier (for example (a|ab)+). That shape can hang the matcher, so it is blocked here.';
        }
      }
    }
  }

  // Classic .+ followed by something that forces massive backoff near end anchors.
  if (/\.\+[+*]|\.\*\.\*/.test(pattern)) {
    return 'This pattern stacks open-ended wildcards in a way that can hang the matcher, so it is blocked here. Prefer a tighter character class.';
  }

  return null;
}

export function normalizeFlags(raw: string | undefined): { flags: string; error?: string } {
  const src = (raw ?? '').replace(/\s+/g, '');
  if (!src) return { flags: 'g' };

  const seen = new Set<string>();
  for (const ch of src) {
    if (!VALID_FLAGS.has(ch)) {
      return { flags: '', error: `Unknown flag "${ch}". Supported flags: d g i m s u v y.` };
    }
    if (seen.has(ch)) {
      return { flags: '', error: `Duplicate flag "${ch}".` };
    }
    seen.add(ch);
  }

  // Global is required so we can walk every match for the explain view.
  if (!seen.has('g') && !seen.has('y')) seen.add('g');

  return { flags: [...seen].join('') };
}

function explainOne(match: RegExpExecArray, ordinal: number): RegexMatchExplain {
  const start = match.index;
  const end = start + match[0].length;
  const groups: RegexGroup[] = [];

  // Named groups first when present, then numbered. Indices align with match[].
  const indices = (match as RegExpExecArray & { indices?: Array<[number, number] | undefined> }).indices;
  const groupsObj = match.groups ?? {};

  for (let i = 1; i < match.length; i++) {
    const value = match[i] ?? null;
    let name: string | null = null;
    for (const [n, v] of Object.entries(groupsObj)) {
      if (v === match[i] && !groups.some((g) => g.name === n)) {
        name = n;
        break;
      }
    }
    const span = indices?.[i];
    groups.push({
      index: i,
      name,
      value,
      start: span ? span[0] : value == null ? null : null,
      end: span ? span[1] : value == null ? null : null,
    });
  }

  // If the engine gave us indices for group 0 we already have start/end; fill
  // unnamed group spans when `d` flag produced indices but we could not map names.
  if (indices) {
    for (const g of groups) {
      const span = indices[g.index];
      if (span) {
        g.start = span[0];
        g.end = span[1];
      }
    }
  }

  return { ordinal, match: match[0], start, end, groups };
}

/**
 * Run a regex against text with hard caps. Never throws: syntax and budget
 * failures become `{ ok: false }`.
 */
export function runRegexTest(opts: RegexTestOptions): RegexTestResult {
  const pattern = opts.pattern ?? '';
  if (!pattern) {
    return { ok: false, kind: 'empty-pattern', error: 'Enter a regular expression pattern to test.' };
  }

  const expensive = looksExpensive(pattern);
  if (expensive) {
    return { ok: false, kind: 'expensive', error: expensive };
  }

  const flagResult = normalizeFlags(opts.flags);
  if (flagResult.error) {
    return { ok: false, kind: 'syntax', error: flagResult.error };
  }

  let re: RegExp;
  try {
    re = new RegExp(pattern, flagResult.flags);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, kind: 'syntax', error: `Invalid regular expression: ${message}` };
  }

  const cappedText = opts.text.length > MAX_TEST_TEXT;
  const text = cappedText ? opts.text.slice(0, MAX_TEST_TEXT) : opts.text;
  const budget = opts.timeBudgetMs ?? MATCH_TIME_BUDGET_MS;
  const maxMatches = opts.maxMatches ?? MAX_MATCHES;
  const now = opts.now ?? (() => Date.now());
  const started = now();

  const matches: RegexMatchExplain[] = [];
  let truncated = false;
  re.lastIndex = 0;

  // `y` (sticky) is single-position; still walk once from lastIndex.
  while (true) {
    if (now() - started > budget) {
      return {
        ok: false,
        kind: 'timeout',
        error:
          'This pattern took too long against the test text, so the run was stopped. Simplify the pattern or shorten the text.',
      };
    }

    const m = re.exec(text);
    if (m == null) break;

    matches.push(explainOne(m, matches.length + 1));

    if (matches.length >= maxMatches) {
      truncated = true;
      break;
    }

    // Zero-length match guard (e.g. /a*/g or /(?=x)/g) — advance manually.
    if (m[0].length === 0) {
      if (re.lastIndex >= text.length) break;
      re.lastIndex += 1;
    }

    // Sticky / non-global: one match only.
    if (!re.global) break;
  }

  let replaced: string | null = null;
  if (opts.replace != null && opts.replace !== undefined) {
    try {
      // Fresh regex so lastIndex from the scan does not poison replace.
      const replacer = new RegExp(pattern, flagResult.flags);
      replaced = text.replace(replacer, opts.replace);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { ok: false, kind: 'syntax', error: `Replace failed: ${message}` };
    }
  }

  return {
    ok: true,
    matches,
    matchCount: truncated ? maxMatches : matches.length,
    truncated,
    replaced,
    textLength: text.length,
    cappedText,
  };
}

/** One-line orientation for the craft surface. Silent when there is nothing useful to say. */
export function explainSummary(result: RegexTestResult): string | null {
  if (!result.ok) return null;
  if (result.matchCount === 0) return null;

  const first = result.matches[0];
  const groupCount = first.groups.filter((g) => g.value != null).length;
  const parts: string[] = [];

  parts.push(
    result.matchCount === 1
      ? `1 match at index ${first.start}…${first.end}`
      : `${result.matchCount} matches; first at index ${first.start}…${first.end}`,
  );

  if (groupCount > 0) {
    const preview = first.groups
      .filter((g) => g.value != null)
      .slice(0, 3)
      .map((g) => {
        const label = g.name ? `$${g.name}` : `$${g.index}`;
        const shown = (g.value as string).length > 24 ? `${(g.value as string).slice(0, 24)}…` : (g.value as string);
        return `${label}=${JSON.stringify(shown)}`;
      })
      .join(', ');
    parts.push(`groups: ${preview}`);
  } else if (result.matches.some((m) => m.match.length === 0)) {
    parts.push('includes a zero-length match');
  }

  if (result.truncated) parts.push(`showing the first ${MAX_MATCHES}`);
  if (result.cappedText) parts.push(`test text capped at ${MAX_TEST_TEXT} characters`);

  return parts.join('. ') + '.';
}
