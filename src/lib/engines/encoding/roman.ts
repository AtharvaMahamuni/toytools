import type { EncodingTool, EncodingMode } from './types';
import type { DetectResult, MetaItem, RecoveryOffer, ValidationDetail } from '../transform/types';

// Roman numerals, both directions. Standard (subtractive) notation covers 1 to 3999: there is no
// agreed ASCII spelling for 4000 and above, since it needs the vinculum overbar, so the range is a
// property of the notation rather than a limit we chose.
//
// decode() is deliberately LENIENT and encode() is deliberately STRICT. Numerals in the wild are
// not written the way a converter expects: clock faces print IIII, Roman inscriptions print VIIII,
// and pre-modern printing is full of MDCCCCX. All of those are readable and none of them is what a
// modern reader writes back, so the tool reads them and then says so through `recover`.

const VALUES: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

const LETTER: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

export const MIN_ROMAN = 1;
export const MAX_ROMAN = 3999;

/** The canonical, subtractive spelling of n. Throws outside 1..3999. */
export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < MIN_ROMAN || n > MAX_ROMAN) {
    throw new Error(`Roman numerals cover ${MIN_ROMAN} to ${MAX_ROMAN}.`);
  }
  let rest = n;
  let out = '';
  for (const [value, sym] of VALUES) {
    while (rest >= value) {
      out += sym;
      rest -= value;
    }
  }
  return out;
}

/**
 * Read a numeral, accepting non-standard but unambiguous spellings (IIII, VIIII, MDCCCCX).
 * Throws on any character that is not a Roman letter, and on an empty string.
 */
export function fromRoman(input: string): number {
  const s = input.trim().toUpperCase().replace(/\s+/g, '');
  if (!s) throw new Error('Enter a Roman numeral.');
  if (!/^[IVXLCDM]+$/.test(s)) throw new Error('Roman numerals use only I, V, X, L, C, D and M.');
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = LETTER[s[i]];
    const next = i + 1 < s.length ? LETTER[s[i + 1]] : 0;
    total += cur < next ? -cur : cur;
  }
  if (total < MIN_ROMAN || total > MAX_ROMAN) throw new Error('That numeral is outside 1 to 3999.');
  return total;
}

/** The spelling this input would have if it were written the modern way, or null when it already is. */
export function canonicalise(input: string): { value: number; canonical: string } | null {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, '');
  if (!/^[IVXLCDM]+$/.test(cleaned)) return null;
  let value: number;
  try {
    value = fromRoman(cleaned);
  } catch {
    return null;
  }
  const canonical = toRoman(value);
  return canonical === cleaned ? null : { value, canonical };
}

function parseArabic(input: string): number | null {
  const s = input.trim();
  if (!/^-?\d+$/.test(s)) return null;
  return Number(s);
}

export const roman: EncodingTool = {
  id: 'roman',
  family: 'numeral',
  displayName: 'Roman numeral',
  forwardLabel: 'To Roman →',
  inverseLabel: 'To number ←',
  outputLabel: 'Result',
  sample: '1987',
  placeholder: 'Type a number (1 to 3999) or a Roman numeral.',
  insight: [
    'Roman numerals add their letters up, largest first, with one exception: a smaller letter placed before a larger one is subtracted instead. That is why IV is four and VI is six from the same two letters.',
    'Only six subtractive pairs are standard: IV, IX, XL, XC, CD and CM. Anything else that looks subtractive, like IC for 99, is a modern invention and no Roman ever wrote it.',
    'The system stops at 3999 in plain text. Larger values need a bar over the letter to multiply it by a thousand, and there is no way to type that bar in ASCII.',
  ],
  technical: [
    { term: 'Range', detail: '1 to 3999 (MMMCMXCIX). Zero and negatives have no numeral' },
    { term: 'Letters', detail: 'I=1, V=5, X=10, L=50, C=100, D=500, M=1000' },
    { term: 'Subtractive pairs', detail: 'IV, IX, XL, XC, CD, CM, and no others' },
    { term: 'Reading', detail: 'Lenient: IIII, VIIII and MDCCCCX are read, then reported as non-standard' },
    { term: 'Writing', detail: 'Strict: output is always the canonical subtractive spelling' },
  ],

  encode(input: string): string {
    const n = parseArabic(input);
    if (n === null) throw new Error('Enter a whole number.');
    return toRoman(n);
  },

  decode(input: string): string {
    return String(fromRoman(input));
  },

  detect(input: string): DetectResult {
    const s = input.trim();
    if (!s) return { mode: 'encode', confidence: 'low' };
    if (/^-?\d+$/.test(s)) return { mode: 'encode', confidence: 'high', label: 'Number' };
    if (/^[IVXLCDMivxlcdm\s]+$/.test(s)) return { mode: 'decode', confidence: 'high', label: 'Roman numeral' };
    return { mode: 'encode', confidence: 'low' };
  },

  validate(input: string, mode: EncodingMode): ValidationDetail {
    const s = input.trim();
    if (!s) return { ok: true };
    if (mode === 'encode') {
      const n = parseArabic(s);
      if (n === null) return { ok: false, severity: 'error', message: 'Enter a whole number, digits only.' };
      if (n < MIN_ROMAN) {
        return {
          ok: false,
          severity: 'error',
          message: n === 0 ? 'Rome had no numeral for zero. The smallest is I.' : 'Roman numerals have no sign, so negatives cannot be written.',
        };
      }
      if (n > MAX_ROMAN) {
        return { ok: false, severity: 'error', message: `${n} needs an overbar to write, so plain text stops at ${MAX_ROMAN} (MMMCMXCIX).` };
      }
      return { ok: true };
    }
    const cleaned = s.toUpperCase().replace(/\s+/g, '');
    const bad = cleaned.split('').findIndex((ch) => !(ch in LETTER));
    if (bad !== -1) {
      return {
        ok: false,
        severity: 'error',
        message: `"${cleaned[bad]}" is not a Roman letter. Only I, V, X, L, C, D and M are.`,
        position: bad,
      };
    }
    if (canonicalise(cleaned)) {
      return { ok: true, severity: 'warning', message: 'Readable, but not the standard spelling.' };
    }
    return { ok: true };
  },

  meta(input: string, output: string, mode: EncodingMode): MetaItem[] {
    const numeral = mode === 'encode' ? output : input.trim().toUpperCase().replace(/\s+/g, '');
    const value = mode === 'encode' ? parseArabic(input) : Number(output);
    const rows: MetaItem[] = [];
    if (value !== null && Number.isFinite(value)) rows.push({ label: 'Value', value: value.toLocaleString('en-US') });
    if (numeral) rows.push({ label: 'Letters', value: String(numeral.length) });
    if (numeral && /^[IVXLCDM]+$/.test(numeral)) {
      const subtractive = (numeral.match(/IV|IX|XL|XC|CD|CM/g) ?? []).length;
      rows.push({ label: 'Subtractive pairs', value: String(subtractive) });
    }
    return rows;
  },

  /**
   * The craft seam. A numeral copied off a clock face, a monument or a title page is often
   * additive (IIII, VIIII, MDCCCCX). It reads correctly, so nothing is broken and nothing is
   * reported, and the user carries the old spelling into whatever they were writing. This offers
   * the modern one, which is the only spelling that survives a round trip.
   */
  recover(input: string, mode: EncodingMode): RecoveryOffer | null {
    if (mode !== 'decode') return null;
    const found = canonicalise(input);
    if (!found) return null;
    return {
      label: `Rewrite as ${found.canonical}, the standard spelling of ${found.value}`,
      text: found.canonical,
      mode: 'decode',
    };
  },
};
