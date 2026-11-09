// SQL Formatter: hand-written tokenizer and printer. No library.
// Pretty-prints common SQL (Postgres, MySQL, SQLite keyword set) with uppercase keywords,
// 2-space indent, and one major clause per line. Never throws: failures become a result error.

import type { StructuredDataTool } from './types';

const MAX_CHARS = 200_000;

/** Keywords that start a new line at the current indent (major clauses). */
const CLAUSE_START = new Set([
  'select', 'from', 'where', 'group', 'order', 'having', 'limit', 'offset', 'fetch',
  'insert', 'values', 'update', 'set', 'delete', 'with', 'union', 'except', 'intersect',
  'join', 'left', 'right', 'inner', 'outer', 'full', 'cross', 'on', 'using',
  'create', 'alter', 'drop', 'truncate', 'grant', 'revoke', 'begin', 'commit', 'rollback',
  'returning', 'window', 'partition', 'into', 'table', 'view', 'index', 'and', 'or',
]);

/** Multi-word clause heads: first word triggers a look-ahead. */
const MULTI: Record<string, string[]> = {
  group: ['by'],
  order: ['by'],
  partition: ['by'],
  insert: ['into'],
  delete: ['from'],
  left: ['join', 'outer'],
  right: ['join', 'outer'],
  inner: ['join'],
  outer: ['join'],
  full: ['join', 'outer'],
  cross: ['join'],
  union: ['all'],
  create: ['table', 'view', 'index', 'or'],
  drop: ['table', 'view', 'index', 'index'],
  alter: ['table'],
};

/** Every keyword we uppercase. Includes clause words plus common function/type words. */
const KEYWORDS = new Set([
  ...CLAUSE_START,
  'as', 'asc', 'desc', 'distinct', 'all', 'any', 'some', 'exists', 'in', 'is', 'null', 'not',
  'between', 'like', 'ilike', 'case', 'when', 'then', 'else', 'end', 'over', 'rows', 'range',
  'unbounded', 'preceding', 'following', 'current', 'row', 'true', 'false', 'cast', 'by',
  'primary', 'key', 'foreign', 'references', 'constraint', 'unique', 'check', 'default',
  'cascade', 'restrict', 'replace', 'if', 'temporary', 'temp', 'materialized', 'lateral',
  'natural', 'using', 'recursive', 'asc', 'desc', 'nulls', 'first', 'last', 'with',
  'count', 'sum', 'avg', 'min', 'max', 'coalesce', 'nullif', 'greatest', 'least',
]);

type Tok =
  | { kind: 'word'; value: string }
  | { kind: 'string'; value: string }
  | { kind: 'number'; value: string }
  | { kind: 'comment'; value: string }
  | { kind: 'punct'; value: string }
  | { kind: 'space'; value: string };

export function tokenizeSql(input: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  const n = input.length;
  while (i < n) {
    const c = input[i]!;

    // Line comment
    if (c === '-' && input[i + 1] === '-') {
      let j = i + 2;
      while (j < n && input[j] !== '\n') j++;
      out.push({ kind: 'comment', value: input.slice(i, j) });
      i = j;
      continue;
    }
    // Block comment
    if (c === '/' && input[i + 1] === '*') {
      let j = i + 2;
      while (j < n && !(input[j] === '*' && input[j + 1] === '/')) j++;
      j = Math.min(n, j + 2);
      out.push({ kind: 'comment', value: input.slice(i, j) });
      i = j;
      continue;
    }
    // Dollar-quoted string (Postgres): $tag$...$tag$
    if (c === '$') {
      const tagEnd = input.indexOf('$', i + 1);
      if (tagEnd > i) {
        const tag = input.slice(i, tagEnd + 1);
        if (/^\$[A-Za-z_][\w]*\$$/.test(tag) || tag === '$$') {
          const close = input.indexOf(tag, tagEnd + 1);
          if (close >= 0) {
            out.push({ kind: 'string', value: input.slice(i, close + tag.length) });
            i = close + tag.length;
            continue;
          }
        }
      }
    }
    // Quoted strings: ', ", `
    if (c === "'" || c === '"' || c === '`') {
      let j = i + 1;
      while (j < n) {
        if (input[j] === c) {
          // SQL escaped quote by doubling
          if (input[j + 1] === c) { j += 2; continue; }
          j++;
          break;
        }
        j++;
      }
      out.push({ kind: 'string', value: input.slice(i, j) });
      i = j;
      continue;
    }
    // Whitespace
    if (/\s/.test(c)) {
      let j = i + 1;
      while (j < n && /\s/.test(input[j]!)) j++;
      out.push({ kind: 'space', value: input.slice(i, j) });
      i = j;
      continue;
    }
    // Number
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(input[i + 1] ?? ''))) {
      let j = i + 1;
      while (j < n && /[0-9.]/.test(input[j]!)) j++;
      out.push({ kind: 'number', value: input.slice(i, j) });
      i = j;
      continue;
    }
    // Word / identifier
    if (/[A-Za-z_]/.test(c)) {
      let j = i + 1;
      while (j < n && /[\w$]/.test(input[j]!)) j++;
      out.push({ kind: 'word', value: input.slice(i, j) });
      i = j;
      continue;
    }
    // Punctuation (single char; keep operators like <= as separate chars for simplicity)
    out.push({ kind: 'punct', value: c });
    i++;
  }
  return out;
}

function nextWord(tokens: Tok[], from: number): { value: string; index: number } | null {
  for (let i = from; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (t.kind === 'space' || t.kind === 'comment') continue;
    if (t.kind === 'word') return { value: t.value, index: i };
    return null;
  }
  return null;
}

/** True when a single-quoted string looks like a pasted secret. */
export function secretWarning(input: string): string | undefined {
  // Look inside single-quoted literals for password-like assignments nearby is hard; scan the
  // whole text for common secret column names bound to a quoted value.
  const re =
    /\b(password|passwd|pwd|secret|api[_-]?key|access[_-]?token|private[_-]?key)\b\s*=\s*'[^']+'/i;
  if (re.test(input)) {
    return 'This query looks like it contains a password or secret in a quoted value. Formatting runs only in this browser, but avoid pasting credentials into any site that uploads your text.';
  }
  return undefined;
}

export function formatSql(input: string): string {
  const tokens = tokenizeSql(input);
  let indent = 0;
  const lines: string[] = [];
  let buf = '';
  let atLineStart = true;

  const flush = () => {
    const trimmed = buf.replace(/[ \t]+$/g, '');
    if (trimmed.trim()) lines.push(trimmed);
    else if (trimmed === '' && lines.length && lines[lines.length - 1] !== '') {
      // skip empty
    }
    buf = '';
    atLineStart = true;
  };

  const startLine = () => {
    if (!atLineStart) flush();
    buf = '  '.repeat(Math.max(0, indent));
    atLineStart = true;
  };

  const write = (text: string) => {
    if (atLineStart && text === ' ') return;
    buf += text;
    atLineStart = false;
  };

  const spaceBefore = () => {
    if (!atLineStart && !/[(\[\s]$/.test(buf)) write(' ');
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (t.kind === 'space') continue;
    if (t.kind === 'comment') {
      if (!atLineStart) flush();
      lines.push('  '.repeat(Math.max(0, indent)) + t.value.trim());
      atLineStart = true;
      buf = '';
      continue;
    }
    if (t.kind === 'string' || t.kind === 'number') {
      spaceBefore();
      write(t.value);
      continue;
    }
    if (t.kind === 'punct') {
      if (t.value === '(') {
        write('(');
        indent++;
        startLine();
        continue;
      }
      if (t.value === ')') {
        indent = Math.max(0, indent - 1);
        startLine();
        write(')');
        continue;
      }
      if (t.value === ',') {
        write(',');
        startLine();
        continue;
      }
      if (t.value === ';') {
        write(';');
        flush();
        indent = 0;
        continue;
      }
      if (t.value === '.') {
        write('.');
        continue;
      }
      spaceBefore();
      write(t.value);
      continue;
    }
    // word
    const lower = t.value.toLowerCase();
    const isKw = KEYWORDS.has(lower);
    let text = isKw ? lower.toUpperCase() : t.value;

    // Multi-word heads: GROUP BY, LEFT JOIN, ...
    const rest = MULTI[lower];
    let consumed = 0;
    if (rest) {
      const parts = [text];
      let cursor = i + 1;
      for (const want of rest) {
        const nxt = nextWord(tokens, cursor);
        if (!nxt || nxt.value.toLowerCase() !== want) break;
        parts.push(want.toUpperCase());
        consumed = nxt.index - i;
        cursor = nxt.index + 1;
        // OUTER before JOIN for LEFT OUTER JOIN
        if (want === 'outer') {
          const jn = nextWord(tokens, cursor);
          if (jn && jn.value.toLowerCase() === 'join') {
            parts.push('JOIN');
            consumed = jn.index - i;
            cursor = jn.index + 1;
          }
        }
      }
      if (parts.length > 1) text = parts.join(' ');
    }

    if (CLAUSE_START.has(lower) || (rest && consumed > 0 && CLAUSE_START.has(lower))) {
      startLine();
      write(text);
    } else {
      spaceBefore();
      write(text);
    }
    i += consumed;
  }
  flush();
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export const sqlFormatter: StructuredDataTool = {
  id: 'sql-formatter',
  family: 'json',
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    if (input.length > MAX_CHARS) {
      return {
        ok: false,
        output: '',
        error: `This SQL is larger than ${MAX_CHARS.toLocaleString('en-US')} characters. Trim it before formatting.`,
      };
    }
    // Unclosed quote check (single, double, backtick). Dollar-quotes are validated by the tokenizer path.
    for (const q of ["'", '"', '`'] as const) {
      let count = 0;
      for (let i = 0; i < input.length; i++) {
        if (input[i] === q) {
          if (input[i + 1] === q) { i++; continue; } // doubled escape
          count++;
        }
      }
      if (count % 2 !== 0) {
        const name = q === "'" ? 'single' : q === '"' ? 'double' : 'backtick';
        return { ok: false, output: '', error: `Unclosed ${name}-quoted string. Add the missing ${q} and try again.` };
      }
    }
    const output = formatSql(input);
    const warning = secretWarning(input);
    return warning ? { ok: true, output, warning } : { ok: true, output };
  },
};
