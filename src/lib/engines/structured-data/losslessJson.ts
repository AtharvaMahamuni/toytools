// Lossless JSON pretty-printer and minifier.
//
// JSON.stringify(JSON.parse(text)) is not a formatter: it re-serialises the data, so integers past
// 2^53 are rounded (12345678901234567890 becomes 12345678901234567000), 1.0 becomes 1, 1e5 becomes
// 100000, escapes are rewritten and a duplicate key silently keeps only its last value. This walks
// the tokens of text that JSON.parse has already accepted and re-indents them: every string,
// number and literal is copied exactly as written, so only whitespace changes.

export interface LosslessFormat {
  output: string;
  /** Keys that appear more than once in the same object, in first-repeat order (decoded). */
  duplicates: string[];
}

const SPACE = ' \t\n\r';
const STOP = ' \t\n\r,:[]{}"';

/**
 * Re-indent valid JSON (`indent` per level, as JSON.stringify(v, null, indent) lays it out). With
 * `indent` = '' the output is minified exactly as JSON.stringify(v) lays it out: no newlines and no
 * space after a colon. Either way every token is copied verbatim.
 */
/** Inputs past these limits are refused with a clear error instead of freezing the page. */
export const MAX_JSON_DEPTH = 2000;
export const MAX_JSON_CHARS = 20 * 1024 * 1024;

/**
 * A clear error when `text` is too large or nests too deeply to format safely, else null. A single
 * linear scan that skips string contents, so it is cheap even on large input.
 */
export function jsonLimitError(text: string): string | null {
  if (text.length > MAX_JSON_CHARS) {
    return 'This JSON is larger than 20 MB, which is too big to format in the browser. Try a smaller piece.';
  }
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c === 34) { // "
      i++;
      while (i < text.length && text.charCodeAt(i) !== 34) i += text.charCodeAt(i) === 92 ? 2 : 1;
    } else if (c === 123 || c === 91) { // { [
      if (++depth > MAX_JSON_DEPTH) {
        return `This JSON nests more than ${MAX_JSON_DEPTH} levels deep, which is too deep to format in the browser.`;
      }
    } else if (c === 125 || c === 93) depth--;
  }
  return null;
}

export function formatJsonLossless(text: string, indent = '  '): LosslessFormat {
  const out: string[] = [];
  const duplicates = new Set<string>();
  // One entry per open container: the keys seen so far for an object, null for an array.
  const keys: (Set<string> | null)[] = [];
  let depth = 0;
  let expectKey = false;
  let i = 0;
  const n = text.length;
  const compact = indent === '';
  const line = () => (compact ? '' : '\n' + indent.repeat(depth));

  while (i < n) {
    const c = text[i];
    if (SPACE.includes(c)) { i++; continue; }
    if (c === '"') {
      let j = i + 1;
      while (text[j] !== '"') j += text[j] === '\\' ? 2 : 1;
      const token = text.slice(i, j + 1);
      i = j + 1;
      const seen = keys[keys.length - 1];
      if (expectKey && seen) {
        const key = JSON.parse(token) as string;
        if (!seen.has(key)) seen.add(key);
        else duplicates.add(key);
        expectKey = false;
      }
      out.push(token);
      continue;
    }
    if (c === '{' || c === '[') {
      const close = c === '{' ? '}' : ']';
      let j = i + 1;
      while (j < n && SPACE.includes(text[j])) j++;
      if (text[j] === close) { out.push(c + close); i = j + 1; continue; }
      depth++;
      keys.push(c === '{' ? new Set() : null);
      expectKey = c === '{';
      out.push(c + line());
      i++;
      continue;
    }
    if (c === '}' || c === ']') {
      depth--;
      keys.pop();
      out.push(line() + c);
      i++;
      continue;
    }
    if (c === ',') {
      expectKey = !!keys[keys.length - 1];
      out.push(',' + line());
      i++;
      continue;
    }
    if (c === ':') { out.push(compact ? ':' : ': '); i++; continue; }
    // A number or true / false / null, verbatim.
    let j = i;
    while (j < n && !STOP.includes(text[j])) j++;
    out.push(text.slice(i, j));
    i = j;
  }
  return { output: out.join(''), duplicates: [...duplicates] };
}

/** How many duplicate key names the warning lists before "and N more". */
export const DUPLICATES_SHOWN = 5;

/** The status-line warning for duplicate keys, shared by the formatter and the minifier. */
export function duplicateKeyWarning(duplicates: string[]): string | undefined {
  if (!duplicates.length) return undefined;
  const shown = duplicates.slice(0, DUPLICATES_SHOWN).map((k) => JSON.stringify(k)).join(', ');
  const more = duplicates.length > DUPLICATES_SHOWN ? ` and ${duplicates.length - DUPLICATES_SHOWN} more` : '';
  return `Duplicate key${duplicates.length > 1 ? 's' : ''} ${shown}${more}: kept as written here, but most JSON parsers keep only the last value.`;
}
