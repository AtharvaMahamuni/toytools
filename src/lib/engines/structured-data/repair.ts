// The craft seam for the structured-data engine: a one-tap fix for JSON that a document broke.
//
// Why. `JSON.parse` reports "Unexpected token } in JSON at position 47", and position 47 is a
// number you have to count to by hand on a phone. Worse, the two commonest causes are not the
// user's mistake at all: a trailing comma (legal in JavaScript, illegal in JSON) and smart quotes
// (inserted silently by Word, Google Docs, Notion and Slack). Both are mechanically fixable, and a
// tool that can see the fault and still only names an offset is stopping one step early.
//
// Same doctrine as the encoding recovery offer: the engine holds the knowledge, the shared widget
// renders one button. See docs/analysis/2026-08-11-tool-craft.md.

/** What a repair pass changed, so the offer can say it in the user's words. */
export interface JsonRepair {
  /** The repaired text. */
  text: string;
  /** One line naming what was wrong, phrased as the fix. */
  label: string;
}

/** Typographic quote characters that a word processor substitutes for " and '. */
const SMART_DOUBLE = /[“”„‟″]/g;
const SMART_SINGLE = /[‘’‚‛′]/g;

/**
 * Strip trailing commas before `}` or `]`, without touching commas inside strings.
 *
 * Written as a scanner rather than a regex because a regex cannot tell a comma in data from a comma
 * in syntax: `{"a": "x, }"}` is valid JSON whose string contains the exact sequence a naive
 * `/,\s*}/` would delete, silently corrupting the value.
 */
function stripTrailingCommas(src: string): { text: string; changed: boolean } {
  let out = '';
  let changed = false;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];

    if (inString) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') {
      inString = true;
      out += ch;
      continue;
    }

    if (ch === ',') {
      // Look past whitespace: a comma whose next real character closes the container is trailing.
      let j = i + 1;
      while (j < src.length && /\s/.test(src[j]!)) j++;
      if (src[j] === '}' || src[j] === ']') {
        changed = true;
        continue; // drop the comma, keep the whitespace that follows
      }
    }

    out += ch;
  }

  return { text: out, changed };
}

/**
 * Offer a repair for JSON that failed to parse, or null when there is no honest one.
 *
 * Only ever returns a repair that actually parses. Offering a "fix" that still fails would be worse
 * than staying quiet: it moves the user one tap further from an answer and costs them their trust in
 * the next offer. Pure.
 */
export function repairJson(input: string): JsonRepair | null {
  if (!input.trim()) return null;

  // Already valid: nothing to fix, and saying so unprompted would be noise.
  try {
    JSON.parse(input);
    return null;
  } catch {
    // fall through to the repair attempts
  }

  const hasSmartQuotes = SMART_DOUBLE.test(input) || SMART_SINGLE.test(input);
  const quoted = hasSmartQuotes
    ? input.replace(SMART_DOUBLE, '"').replace(SMART_SINGLE, "'")
    : input;

  const { text: commaFixed, changed: hadTrailingComma } = stripTrailingCommas(quoted);

  if (!hasSmartQuotes && !hadTrailingComma) return null;

  try {
    JSON.parse(commaFixed);
  } catch {
    return null; // the repair did not get there; do not offer a half-fix
  }

  const label =
    hasSmartQuotes && hadTrailingComma
      ? 'Fix the smart quotes and trailing comma'
      : hasSmartQuotes
        ? 'Replace the smart quotes a document inserted'
        : 'Remove the trailing comma';

  return { text: commaFixed, label };
}
