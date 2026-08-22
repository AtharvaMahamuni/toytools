import type { EncodingTool, EncodingMode } from './types';
import type { DetectResult, MetaItem, RecoveryOffer, ValidationDetail } from '../transform/types';

// Numbers as English words, both directions.
//
// Short scale (a billion is a thousand million), which is what English uses everywhere it is
// written today. Hyphenated compounds (twenty-one) because that is the rule every style guide
// agrees on, and no "and" before the tens, because the American convention is the one cheque and
// invoice software expects. The guide covers the British "one hundred and five" and the reader can
// add it; the tool does not guess which country it is in.

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

/** Largest magnitude that survives as an exact integer in a double, so no silent rounding. */
export const MAX_WORDS = 999_999_999_999_999;

const WORD_VALUES: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  ONES.forEach((w, i) => { map[w] = i; });
  TENS.forEach((w, i) => { if (w) map[w] = i * 10; });
  map.hundred = 100;
  return map;
})();

const SCALE_VALUES: Record<string, number> = {
  thousand: 1e3, million: 1e6, billion: 1e9, trillion: 1e12, quadrillion: 1e15,
};

/** 1..999 in words, with the hyphen the style guides ask for. */
function underThousand(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) {
    const tens = TENS[Math.floor(n / 10)];
    const rest = n % 10;
    return rest ? `${tens}-${ONES[rest]}` : tens;
  }
  const hundreds = `${ONES[Math.floor(n / 100)]} hundred`;
  const rest = n % 100;
  return rest ? `${hundreds} ${underThousand(rest)}` : hundreds;
}

/** A non-negative integer in words. */
export function integerToWords(n: number): string {
  if (n === 0) return 'zero';
  const groups: string[] = [];
  let rest = n;
  let scale = 0;
  while (rest > 0) {
    const chunk = rest % 1000;
    if (chunk) groups.unshift(scale ? `${underThousand(chunk)} ${SCALES[scale]}` : underThousand(chunk));
    rest = Math.floor(rest / 1000);
    scale++;
  }
  return groups.join(' ');
}

/**
 * A number in words. Decimals are read digit by digit after "point", which is how they are said
 * aloud and the only reading that stays unambiguous past two places.
 */
export function numberToWords(input: string): string {
  const s = input.trim();
  if (!/^[+-]?\d+(\.\d+)?$/.test(s)) throw new Error('Enter a number, digits only.');
  const negative = s.startsWith('-');
  const body = s.replace(/^[+-]/, '');
  const [whole, fraction] = body.split('.');
  const value = Number(whole);
  if (value > MAX_WORDS) throw new Error('That number is too large to spell out exactly.');

  let words = integerToWords(value);
  if (fraction) words += ` point ${fraction.split('').map((d) => ONES[Number(d)]).join(' ')}`;
  return negative && (value !== 0 || fraction) ? `negative ${words}` : words;
}

/** Words back to digits. Accepts "and", hyphens and commas, since that is how people write them. */
export function wordsToNumber(input: string): string {
  const cleaned = input
    .toLowerCase()
    .replace(/[,]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\band\b/g, ' ')
    .trim();
  if (!cleaned) throw new Error('Enter a number in words.');

  const [wholePart, ...fractionParts] = cleaned.split(/\bpoint\b/);
  const tokens = wholePart.split(/\s+/).filter(Boolean);

  let negative = false;
  if (tokens[0] === 'negative' || tokens[0] === 'minus') {
    negative = true;
    tokens.shift();
  }
  if (!tokens.length) throw new Error('Enter a number in words.');

  let total = 0;
  let current = 0;
  let sawValue = false;
  for (const token of tokens) {
    if (token in WORD_VALUES) {
      const v = WORD_VALUES[token];
      current = v === 100 ? (current || 1) * 100 : current + v;
      sawValue = true;
    } else if (token in SCALE_VALUES) {
      total += (current || 1) * SCALE_VALUES[token];
      current = 0;
      sawValue = true;
    } else {
      throw new Error(`"${token}" is not part of a number.`);
    }
  }
  if (!sawValue) throw new Error('Enter a number in words.');

  let out = String(total + current);
  const fraction = fractionParts.join(' ').trim();
  if (fraction) {
    const digits = fraction.split(/\s+/).filter(Boolean).map((w) => {
      const v = WORD_VALUES[w];
      if (v === undefined || v > 9) throw new Error(`"${w}" is not a digit after "point".`);
      return String(v);
    });
    out += `.${digits.join('')}`;
  }
  return negative ? `-${out}` : out;
}

/** Strip the formatting a copied amount carries. Returns null when nothing was stripped. */
export function stripFormatting(input: string): string | null {
  const s = input.trim();
  if (!s || /^[+-]?\d+(\.\d+)?$/.test(s)) return null;
  const cleaned = s
    .replace(/[\p{Sc}]/gu, '')          // currency symbols, any script
    .replace(/[,\s_']/g, '')            // thousands separators, including the space and apostrophe
    .replace(/^(usd|eur|gbp|inr|rs\.?)/i, '')
    .trim();
  if (!/^[+-]?\d+(\.\d+)?$/.test(cleaned)) return null;
  return cleaned === s ? null : cleaned;
}

export const numberWords: EncodingTool = {
  id: 'number-words',
  family: 'numeral',
  displayName: 'Number in words',
  forwardLabel: 'To words →',
  inverseLabel: 'To digits ←',
  outputLabel: 'Result',
  sample: '4213.75',
  placeholder: 'Type a number, or type a number in words.',
  insight: [
    'Words follow the short scale: a billion is a thousand million, which is what English writing uses now. The long scale, where a billion was a million million, survives in a few languages but not in English.',
    'Compound tens take a hyphen. Twenty-one, thirty-four, ninety-nine. Hundreds and thousands do not: four thousand two hundred thirteen has no hyphen anywhere.',
    'Decimals are read digit by digit after "point". Four point seven five, not four point seventy-five, because the second reading stops making sense at three decimal places.',
  ],
  technical: [
    { term: 'Scale', detail: 'Short scale, up to quadrillions (999,999,999,999,999)' },
    { term: 'Hyphens', detail: 'Compound tens only: twenty-one, not four-thousand' },
    { term: '"and"', detail: 'Omitted on output (American convention); accepted on input' },
    { term: 'Decimals', detail: 'Read digit by digit after "point"' },
    { term: 'Negatives', detail: 'Prefixed "negative"; "minus" is accepted on input' },
  ],

  encode: (input: string) => numberToWords(input),
  decode: (input: string) => wordsToNumber(input),

  detect(input: string): DetectResult {
    const s = input.trim();
    if (!s) return { mode: 'encode', confidence: 'low' };
    if (/^[+-]?[\d,\s.]+$/.test(s)) return { mode: 'encode', confidence: 'high', label: 'Number' };
    if (/[a-z]/i.test(s)) return { mode: 'decode', confidence: 'high', label: 'Words' };
    return { mode: 'encode', confidence: 'low' };
  },

  validate(input: string, mode: EncodingMode): ValidationDetail {
    const s = input.trim();
    if (!s) return { ok: true };
    if (mode === 'encode') {
      if (stripFormatting(s)) {
        return { ok: false, severity: 'error', message: 'That has formatting in it. Digits and one decimal point only.' };
      }
      if (!/^[+-]?\d+(\.\d+)?$/.test(s)) {
        return { ok: false, severity: 'error', message: 'Enter a number, digits only.' };
      }
      if (Number(s.replace(/^[+-]/, '').split('.')[0]) > MAX_WORDS) {
        return { ok: false, severity: 'error', message: 'Too large to spell out exactly. The ceiling is 999,999,999,999,999.' };
      }
      return { ok: true };
    }
    try {
      wordsToNumber(s);
      return { ok: true };
    } catch (e) {
      return { ok: false, severity: 'error', message: e instanceof Error ? e.message : 'Could not read that as a number.' };
    }
  },

  meta(input: string, output: string, mode: EncodingMode): MetaItem[] {
    const digits = (mode === 'encode' ? input : output).trim();
    const words = mode === 'encode' ? output : input.trim();
    const rows: MetaItem[] = [];
    const n = Number(digits.replace(/[^\d.-]/g, ''));
    if (Number.isFinite(n)) rows.push({ label: 'Grouped', value: n.toLocaleString('en-US') });
    if (words) rows.push({ label: 'Words', value: String(words.split(/[\s-]+/).filter(Boolean).length) });
    if (words) rows.push({ label: 'Characters', value: String(words.length) });
    return rows;
  },

  /**
   * The craft seam. Amounts are copied out of a spreadsheet cell, an invoice line or a bank
   * statement, and they arrive wearing a currency symbol and thousands separators: $4,213.75.
   * Every one of those characters is a parse failure, so the tool that exists to spell out an
   * amount rejects the exact form an amount is normally in.
   */
  recover(input: string, mode: EncodingMode): RecoveryOffer | null {
    if (mode !== 'encode') return null;
    const cleaned = stripFormatting(input);
    if (!cleaned) return null;
    return { label: `Use ${cleaned}`, text: cleaned, mode: 'encode' };
  },
};
