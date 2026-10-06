// Lossless JSON pretty-printer.
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

/** Re-indent valid JSON (`indent` per level, as JSON.stringify(v, null, indent) lays it out). */
export function formatJsonLossless(text: string, indent = '  '): LosslessFormat {
  const out: string[] = [];
  const duplicates: string[] = [];
  // One entry per open container: the keys seen so far for an object, null for an array.
  const keys: (Set<string> | null)[] = [];
  let depth = 0;
  let expectKey = false;
  let i = 0;
  const n = text.length;
  const line = () => '\n' + indent.repeat(depth);

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
        else if (!duplicates.includes(key)) duplicates.push(key);
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
    if (c === ':') { out.push(': '); i++; continue; }
    // A number or true / false / null, verbatim.
    let j = i;
    while (j < n && !STOP.includes(text[j])) j++;
    out.push(text.slice(i, j));
    i = j;
  }
  return { output: out.join(''), duplicates };
}
