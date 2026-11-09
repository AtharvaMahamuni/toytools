// CSS Minifier and Beautifier: hand-rolled tokenizer. No libraries.
// Minify removes comments and insignificant whitespace. Beautify indents
// blocks with two spaces. Strings and url() contents stay intact.

import type { StructuredDataTool, StructuredDataResult } from './types';

const MODE_PREFIX = /^@@(minify|beautify)@@\n/;

export type CssMode = 'minify' | 'beautify';

export function stripCssModePrefix(input: string): { mode: CssMode; css: string } {
  const m = MODE_PREFIX.exec(input);
  if (!m) return { mode: 'beautify', css: input };
  return { mode: m[1] as CssMode, css: input.slice(m[0].length) };
}

type Kind = 'code' | 'str' | 'comment';

/** Tokenize CSS into significant pieces, preserving strings and comments. */
export function tokenizeCss(input: string): { kind: Kind; text: string }[] {
  const out: { kind: Kind; text: string }[] = [];
  let i = 0;
  let buf = '';
  let kind: Kind = 'code';
  let quote = '';

  const flush = (next: Kind) => {
    if (buf) out.push({ kind, text: buf });
    buf = '';
    kind = next;
  };

  while (i < input.length) {
    const c = input[i];
    const n = input[i + 1];

    if (kind === 'code') {
      if (c === '/' && n === '*') {
        flush('comment');
        buf = '/*';
        i += 2;
        continue;
      }
      if (c === '"' || c === "'") {
        flush('str');
        quote = c;
        buf = c;
        i++;
        continue;
      }
      // url( ... ) with unquoted value: treat until ) as string-like
      if ((c === 'u' || c === 'U') && input.slice(i, i + 4).toLowerCase() === 'url(') {
        flush('str');
        let j = i + 4;
        buf = input.slice(i, j);
        // skip whitespace
        while (j < input.length && /\s/.test(input[j])) {
          buf += input[j++];
        }
        if (input[j] === '"' || input[j] === "'") {
          const q = input[j];
          buf += q;
          j++;
          while (j < input.length) {
            buf += input[j];
            if (input[j] === '\\' && j + 1 < input.length) {
              buf += input[++j];
              j++;
              continue;
            }
            if (input[j] === q) {
              j++;
              break;
            }
            j++;
          }
          while (j < input.length && input[j] !== ')') buf += input[j++];
          if (j < input.length) buf += input[j++];
          out.push({ kind: 'str', text: buf });
          buf = '';
          kind = 'code';
          i = j;
          continue;
        }
        while (j < input.length && input[j] !== ')') {
          buf += input[j++];
        }
        if (j < input.length) buf += input[j++];
        out.push({ kind: 'str', text: buf });
        buf = '';
        kind = 'code';
        i = j;
        continue;
      }
      buf += c;
      i++;
      continue;
    }

    if (kind === 'str') {
      buf += c;
      if (c === '\\' && i + 1 < input.length) {
        buf += input[i + 1];
        i += 2;
        continue;
      }
      if (c === quote) {
        flush('code');
        quote = '';
      }
      i++;
      continue;
    }

    // comment
    buf += c;
    if (c === '*' && n === '/') {
      buf += '/';
      i += 2;
      flush('code');
      continue;
    }
    i++;
  }
  if (buf) out.push({ kind, text: buf });
  return out;
}

/**
 * Lift calc()/min()/max()/clamp() bodies so minify can keep spaces around + and -
 * inside them (including nested parentheses).
 */
export function protectMathFunctions(code: string): { code: string; blocks: string[] } {
  const blocks: string[] = [];
  const names = /(?:calc|min|max|clamp)\(/gi;
  let out = '';
  let i = 0;
  while (i < code.length) {
    names.lastIndex = i;
    const m = names.exec(code);
    if (!m) {
      out += code.slice(i);
      break;
    }
    out += code.slice(i, m.index);
    const name = m[0]; // e.g. calc(
    let depth = 1;
    let j = m.index + name.length;
    while (j < code.length && depth > 0) {
      const c = code[j];
      if (c === '(') depth++;
      else if (c === ')') depth--;
      j++;
    }
    const body = code.slice(m.index + name.length, j - 1);
    // Normalize interior whitespace. Keep a single space around binary + and -.
    // Do not split custom properties (--x) or unary minus after ( or ,.
    let normalized = body.replace(/\s+/g, ' ').trim();
    normalized = normalized.replace(/\s*\+\s*/g, ' + ');
    normalized = normalized.replace(/([0-9%)\]])\s*-\s*(?=[0-9.\w(])/g, '$1 - ');
    normalized = normalized.replace(/\s+/g, ' ').trim();
    const idx = blocks.length;
    blocks.push(name + normalized + ')');
    out += `__TTMATH${idx}__`;
    i = j;
  }
  return { code: out, blocks };
}

export function minifyCss(css: string): string {
  const tokens = tokenizeCss(css);
  let out = '';
  for (const t of tokens) {
    if (t.kind === 'comment') continue;
    if (t.kind === 'str') {
      out += t.text;
      continue;
    }
    const { code: protectedCode, blocks } = protectMathFunctions(t.text);
    // collapse whitespace in code; keep a single space only when needed between idents
    let s = protectedCode.replace(/\s+/g, ' ');
    // remove space around punctuation (not + or -; those live inside protected math)
    s = s.replace(/\s*([{}:;,>~])\s*/g, '$1');
    // keep space after ) when followed by ident? rare
    s = s.replace(/\)\s+/g, ')');
    for (let i = 0; i < blocks.length; i++) {
      s = s.replace(`__TTMATH${i}__`, blocks[i]);
    }
    out += s;
  }
  // Drop optional semicolons before a closing brace.
  return out.replace(/;}/g, '}').trim();
}

export function beautifyCss(css: string): string {
  // Start from minified form so beautify is deterministic
  const min = minifyCss(css);
  const tokens = tokenizeCss(min);
  let out = '';
  let depth = 0;
  const nl = '\n';
  const pad = () => '  '.repeat(Math.max(0, depth));

  for (const t of tokens) {
    if (t.kind === 'str') {
      out += t.text;
      continue;
    }
    if (t.kind === 'comment') {
      out += (out.endsWith('\n') || out === '' ? pad() : ' ') + t.text + nl;
      continue;
    }
    for (let i = 0; i < t.text.length; i++) {
      const c = t.text[i];
      if (c === '{') {
        out = out.replace(/\s+$/, '');
        out += ' {' + nl;
        depth++;
        out += pad();
        continue;
      }
      if (c === '}') {
        depth = Math.max(0, depth - 1);
        out = out.replace(/\s+$/, '');
        out += nl + pad() + '}' + nl + pad();
        continue;
      }
      if (c === ';') {
        out += ';' + nl + pad();
        continue;
      }
      if (c === ':' && i + 1 < t.text.length && t.text[i + 1] !== ':') {
        out += ': ';
        continue;
      }
      out += c;
    }
  }
  return out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim() + (out.trim() ? '\n' : '');
}

export function processCss(css: string, mode: CssMode): StructuredDataResult {
  if (!css.trim()) return { ok: true, output: '' };
  try {
    const output = mode === 'minify' ? minifyCss(css) : beautifyCss(css);
    if (mode === 'minify') {
      const before = css.length;
      const after = output.length;
      const saved = Math.max(0, before - after);
      const warning = saved > 0 ? `Saved ${saved} byte${saved === 1 ? '' : 's'} (${before} → ${after}).` : undefined;
      return warning ? { ok: true, output, warning } : { ok: true, output };
    }
    return { ok: true, output };
  } catch (e) {
    return { ok: false, output: '', error: (e as Error).message || 'CSS processing failed' };
  }
}

export const cssMinifier: StructuredDataTool = {
  id: 'css-minifier',
  family: 'json',
  execute: (input) => {
    const { mode, css } = stripCssModePrefix(input);
    return processCss(css, mode);
  },
};
