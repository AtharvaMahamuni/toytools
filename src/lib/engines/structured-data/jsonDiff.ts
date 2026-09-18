// Structural JSON diff.
//
// Two documents in, a list of added, removed, and changed paths out. Object key order
// is not a change. Array order is. Numbers compare with === so 1 and 1.0 match.
// Strings, booleans, and null compare with ===. JSON.parse is the parser, so a trailing
// comma stays invalid. This is not a line diff and it does not pretty-print.

export const VALUE_MATCH_NOTE =
  'The text differs. The values match. Key order, spacing, and 1 versus 1.0 do not count.';

export interface JsonDiffError {
  side: 'left' | 'right';
  message: string;
}

export interface JsonDiffResult {
  status: 'empty' | 'invalid' | 'match' | 'diff';
  /** Status line. Empty when both sides are blank. */
  summary: string;
  /**
   * The verification line. Set only when the pasted text differs and the parsed
   * values do not. Empty for a real diff, identical text, blank input, and invalid JSON.
   */
  craftNote: string;
  lines: string[];
  errors: JsonDiffError[];
}

const MAX_LINES = 40;
const MAX_VALUE = 72;
const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function blank(raw: string): boolean {
  return raw.trim() === '';
}

function parseOne(raw: string): { ok: true; value: unknown } | { ok: false; message: string } {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch (err) {
    const message = err instanceof Error && err.message ? err.message : 'Could not parse JSON';
    return { ok: false, message };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function joinKey(parent: string, key: string): string {
  if (IDENT.test(key)) return parent ? `${parent}.${key}` : key;
  const escaped = key.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const bracket = `["${escaped}"]`;
  return parent ? parent + bracket : bracket;
}

function joinIndex(parent: string, index: number): string {
  const bracket = `[${index}]`;
  return parent ? parent + bracket : bracket;
}

function formatValue(value: unknown): string {
  const s = JSON.stringify(value) ?? 'null';
  if (s.length <= MAX_VALUE) return s;
  return `${s.slice(0, MAX_VALUE - 3)}...`;
}

interface Change {
  kind: 'added' | 'removed' | 'changed';
  line: string;
}

function sameLeaf(a: unknown, b: unknown): boolean {
  if (typeof a === 'number' && typeof b === 'number') return a === b;
  if (typeof a === 'string' && typeof b === 'string') return a === b;
  if (typeof a === 'boolean' && typeof b === 'boolean') return a === b;
  return a === null && b === null;
}

function walk(left: unknown, right: unknown, path: string, out: Change[]): void {
  if (sameLeaf(left, right)) return;

  if (Array.isArray(left) && Array.isArray(right)) {
    const n = Math.max(left.length, right.length);
    for (let i = 0; i < n; i++) {
      const next = joinIndex(path, i);
      if (i >= left.length) {
        out.push({ kind: 'added', line: `added ${next}: ${formatValue(right[i])}` });
      } else if (i >= right.length) {
        out.push({ kind: 'removed', line: `removed ${next}: ${formatValue(left[i])}` });
      } else {
        walk(left[i], right[i], next, out);
      }
    }
    return;
  }

  if (isRecord(left) && isRecord(right)) {
    const extra = Object.keys(right).filter((key) => !Object.prototype.hasOwnProperty.call(left, key));
    for (const key of [...Object.keys(left), ...extra]) {
      const next = joinKey(path, key);
      const inLeft = Object.prototype.hasOwnProperty.call(left, key);
      const inRight = Object.prototype.hasOwnProperty.call(right, key);
      if (inLeft && !inRight) {
        out.push({ kind: 'removed', line: `removed ${next}: ${formatValue(left[key])}` });
      } else if (!inLeft && inRight) {
        out.push({ kind: 'added', line: `added ${next}: ${formatValue(right[key])}` });
      } else {
        walk(left[key], right[key], next, out);
      }
    }
    return;
  }

  const where = path || '$';
  out.push({
    kind: 'changed',
    line: `changed ${where}: ${formatValue(left)} → ${formatValue(right)}`,
  });
}

function sideName(side: 'left' | 'right'): string {
  return side === 'left' ? 'Left' : 'Right';
}

const quiet = (status: JsonDiffResult['status'], summary: string, extra: Partial<JsonDiffResult> = {}): JsonDiffResult => ({
  status,
  summary,
  craftNote: '',
  lines: [],
  errors: [],
  ...extra,
});

export function diffJson(left: string, right: string): JsonDiffResult {
  if (blank(left) && blank(right)) return quiet('empty', '');

  const errors: JsonDiffError[] = [];
  const parsedLeft = parseOne(left);
  const parsedRight = parseOne(right);
  if (!parsedLeft.ok) errors.push({ side: 'left', message: parsedLeft.message });
  if (!parsedRight.ok) errors.push({ side: 'right', message: parsedRight.message });
  if (errors.length > 0) {
    const summary = errors
      .map((err) => `${sideName(err.side)} is not valid JSON: ${err.message}`)
      .join(' ');
    return quiet('invalid', summary, { errors });
  }

  const changes: Change[] = [];
  walk(parsedLeft.value, parsedRight.value, '', changes);

  if (changes.length === 0) {
    const textDiffers = left !== right;
    return quiet('match', textDiffers ? VALUE_MATCH_NOTE : 'No differences.', {
      craftNote: textDiffers ? VALUE_MATCH_NOTE : '',
    });
  }

  const added = changes.filter((c) => c.kind === 'added').length;
  const removed = changes.filter((c) => c.kind === 'removed').length;
  const changed = changes.filter((c) => c.kind === 'changed').length;
  const counts = [
    added ? `${added} added` : '',
    removed ? `${removed} removed` : '',
    changed ? `${changed} changed` : '',
  ].filter(Boolean);
  const shown = changes.slice(0, MAX_LINES);
  const omitted = changes.length - shown.length;
  const summary = omitted > 0
    ? `${counts.join(', ')}. Showing ${shown.length} of ${changes.length} paths`
    : counts.join(', ');

  return {
    status: 'diff',
    summary,
    craftNote: '',
    lines: shown.map((c) => c.line),
    errors: [],
  };
}
