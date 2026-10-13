import type { EncodingTool } from './types';
import { byteLength, count } from './util';

// HTML entity encoding — pure JS (no DOMParser, so it runs in the bundled module
// context, not just the browser). Encodes the five characters that are significant
// in HTML markup; decodes numeric (decimal and hex) references and named references.
// In the browser every HTML5 named reference (&eacute;, &euro;, &NotNestedGreaterGreater; ...)
// is decoded by the page's own HTML parser, one validated name at a time inside a <textarea>
// (raw text, so nothing is ever rendered or run). That costs no bytes for the 2,000+ entry
// table. Outside a browser, the common references below are used. Unknown named entities
// pass through unchanged.

const NAMED_DECODE: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  copy: '©',
  reg: '®',
  trade: '™',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  laquo: '«',
  raquo: '»',
  times: '×',
  divide: '÷',
  deg: '°',
  middot: '·',
  bull: '•',
  sect: '§',
  para: '¶',
  euro: '€', pound: '£', yen: '¥', cent: '¢', eacute: 'é', Eacute: 'É', egrave: 'è', agrave: 'à',
  aacute: 'á', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', ccedil: 'ç', uuml: 'ü',
  ouml: 'ö', auml: 'ä', szlig: 'ß', frac12: '½', sup2: '²', hearts: '♥', rarr: '→', larr: '←',
};

const domCache = new Map<string, string | null>();
let scratch: HTMLTextAreaElement | null | undefined;

/** The character(s) for a named reference via the browser's HTML parser, or null. */
function decodeNamedWithDom(name: string): string | null {
  if (scratch === undefined) {
    scratch = typeof document !== 'undefined' && document.createElement ? document.createElement('textarea') : null;
  }
  if (!scratch) return null;
  const cached = domCache.get(name);
  if (cached !== undefined) return cached;
  // `name` is letters and digits only (the decode regex), so this can only ever be one reference.
  scratch.innerHTML = `&${name};`;
  const value = scratch.value;
  // An unknown name comes back unchanged. A name that merely starts with a legacy reference
  // ("&notit;" is "¬" + "it;") comes back still ending in ";", which only &semi; legitimately does.
  const result = value.endsWith(';') && name !== 'semi' ? null : value;
  domCache.set(name, result);
  return result;
}

// Order matters: ampersand first so the entities we emit aren't double-encoded.
export function encodeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function decodeHtml(input: string): string {
  return input.replace(/&(#[xX]?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body: string) => {
    if (body[0] === '#') {
      const codePoint =
        body[1] === 'x' || body[1] === 'X'
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      if (Number.isNaN(codePoint)) return match;
      try {
        return String.fromCodePoint(codePoint);
      } catch (_) {
        return match;
      }
    }
    const named = Object.prototype.hasOwnProperty.call(NAMED_DECODE, body) ? NAMED_DECODE[body] : decodeNamedWithDom(body);
    return named ?? match;
  });
}

const ENTITY = /&(#[xX]?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

export const htmlEntity: EncodingTool = {
  id: 'html-entity',
  family: 'web',
  displayName: 'HTML Entities',
  sample: '<div class="note">Tom & Jerry said "hi"</div>',
  placeholder: 'Type markup to encode, or paste text with &entities; to decode.',
  insight:
    'HTML entities escape characters that are significant in markup (& < > " \') so text displays literally instead of being parsed as HTML. This is the core defense against HTML injection when showing user content.',
  technical: [
    { term: 'Encodes', detail: 'The five markup-significant characters: & < > " \'' },
    { term: 'Decodes', detail: 'All HTML5 named references (&eacute;, &euro;) plus numeric (&#65; decimal, &#x41; hex)' },
    { term: 'Unknown', detail: 'Unrecognized entities are left unchanged' },
    { term: 'Note', detail: 'Escaping for display is not a substitute for context-aware sanitization' },
  ],
  encode: encodeHtml,
  decode: decodeHtml,

  detect(input) {
    if (ENTITY.test(input)) {
      return { mode: 'decode', confidence: 'high', label: 'HTML entities' };
    }
    if (/[<>&"']/.test(input)) {
      return { mode: 'encode', confidence: 'medium', label: 'Markup' };
    }
    return { mode: 'encode', confidence: 'low', label: 'Text' };
  },

  // HTML entity decoding is permissive (unknown entities pass through), so it never
  // hard-fails. Report an informational note when nothing looks like an entity.
  validate(input, mode) {
    if (mode === 'encode' || !input) return { ok: true, severity: 'info' };
    if (!ENTITY.test(input)) {
      return { ok: true, severity: 'info', message: 'No HTML entities found, so the input is unchanged.' };
    }
    return { ok: true, severity: 'info' };
  },

  meta(input, output, mode) {
    const source = mode === 'decode' ? input : output;
    const entities = (source.match(/&(#[xX]?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g) || []).length;
    return [
      { label: 'Entities', value: count(entities, 'reference') },
      { label: 'Input length', value: String(input.length) },
      { label: 'Output bytes', value: String(byteLength(output)) },
    ];
  },
};
