// Split text into user-perceived characters (grapheme clusters). Uses Intl.Segmenter where the
// runtime has it, and otherwise a small fallback that keeps the common clusters whole: a letter
// with its combining marks, emoji with skin tones, variation selectors and ZWJ joins, flag pairs,
// and CRLF.

const EXTEND = /[\p{M}\u200D\uFE0E\uFE0F\u{1F3FB}-\u{1F3FF}\u{E0020}-\u{E007F}]/u;
const REGIONAL = /[\u{1F1E6}-\u{1F1FF}]/u;

export function graphemesFallback(text: string): string[] {
  const out: string[] = [];
  let prevZwj = false;
  let openFlag = false;
  for (const cp of text) {
    const last = out.length - 1;
    if (last >= 0 && (EXTEND.test(cp) || prevZwj || (cp === '\n' && out[last] === '\r'))) {
      out[last] += cp;
    } else if (last >= 0 && openFlag && REGIONAL.test(cp)) {
      out[last] += cp;
      openFlag = false;
      prevZwj = false;
      continue;
    } else {
      out.push(cp);
      openFlag = REGIONAL.test(cp);
      prevZwj = false;
      continue;
    }
    prevZwj = cp === '\u200D';
  }
  return out;
}

type SegmenterCtor = new (locale?: string, opts?: { granularity: 'grapheme' }) => {
  segment(text: string): Iterable<{ segment: string }>;
};

export function graphemes(text: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: SegmenterCtor }).Segmenter;
  if (typeof Seg === 'function') {
    return Array.from(new Seg(undefined, { granularity: 'grapheme' }).segment(text), (s) => s.segment);
  }
  return graphemesFallback(text);
}
