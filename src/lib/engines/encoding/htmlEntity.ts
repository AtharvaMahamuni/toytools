import type { EncodingTool } from './types';

// HTML entity encoding — pure JS (no DOMParser, so it runs in the bundled module
// context, not just the browser). Encodes the five characters that are significant
// in HTML markup; decodes named + numeric (decimal & hex) references.

const NAMED_DECODE: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  '#39': "'",
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

export const htmlEntity: EncodingTool = {
  id: 'html-entity',
  family: 'web',
  sample: '<div class="note">Tom & Jerry</div>',
  encode: encodeHtml,
  decode: decodeHtml,
};
