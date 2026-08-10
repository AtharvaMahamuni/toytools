import type { EncodingTool } from './types';
import { byteLength, count } from './util';

// HTML entity encoding — pure JS (no DOMParser, so it runs in the bundled module
// context, not just the browser). Encodes the five characters that are significant
// in HTML markup; decodes the common named references plus numeric (decimal & hex)
// references. Unknown named entities pass through unchanged.

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
};

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
  return input.replace(/&(#[xX]?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, body: string) => {
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
    const named = NAMED_DECODE[body];
    return named !== undefined ? named : match;
  });
}

const ENTITY = /&(#[xX]?[0-9a-fA-F]+|[a-zA-Z]+);/;

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
    { term: 'Decodes', detail: 'Named references plus numeric (&#65; decimal, &#x41; hex)' },
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
    const entities = (source.match(/&(#[xX]?[0-9a-fA-F]+|[a-zA-Z]+);/g) || []).length;
    return [
      { label: 'Entities', value: count(entities, 'reference') },
      { label: 'Input length', value: String(input.length) },
      { label: 'Output bytes', value: String(byteLength(output)) },
    ];
  },
};
