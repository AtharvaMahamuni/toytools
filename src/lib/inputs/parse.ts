// Natural number parsing — turn human-friendly input into a number. Users should never be forced to
// type long digit strings: "10k", "250k", "5m", "2b", "12 lakh", "2 crore", "₹25,000", "7.5%" all
// normalise to a plain number. Engine-agnostic platform utility (the smart inputs use it on commit).
//
// Never throws: an unparseable string returns null so callers decide how to handle it.

/** Magnitude suffixes. Indian units (lakh = 1e5, crore = 1e7) sit alongside k/m/b/t. */
const SUFFIXES: Record<string, number> = {
  k: 1e3,
  thousand: 1e3,
  m: 1e6,
  mn: 1e6,
  million: 1e6,
  b: 1e9,
  bn: 1e9,
  billion: 1e9,
  t: 1e12,
  trillion: 1e12,
  lac: 1e5,
  lakh: 1e5,
  lakhs: 1e5,
  cr: 1e7,
  crore: 1e7,
  crores: 1e7,
};

/**
 * The comma rule, written out because a comma means two different things around the world:
 *
 *   1. Thousands separators. Commas that form a complete digit grouping are dropped:
 *      Western groups of three ("1,500", "12,345,678", "1,500.25") or Indian lakh/crore
 *      grouping ("1,50,000", "12,50,00,000"). The integer part must be grouped all the way.
 *      A leading zero group is not grouping: "0,500" is 0.5 under rule 2, "0,500,000" is null.
 *   2. Decimal comma. Exactly one comma, no dot, and NOT exactly three digits after it, is a
 *      decimal point: "1,5" is 1.5, "12,75" is 12.75, "0,0025" is 0.0025.
 *   3. Anything else with a comma ("1,2,3", "1,5.2", "1.500,25", "12,34,5") is ambiguous and
 *      parses as null, so the field says "must be a number" rather than guessing.
 *
 * The one unavoidable ambiguity, "1,500", is read as fifteen hundred (rule 1 wins): grouped
 * thousands are far more common in typed amounts than a three-decimal comma.
 */
function normaliseCommas(s: string): string | null {
  if (!s.includes(',')) return s;
  // Separate a trailing magnitude word ("1,5 lakh") so only the numeric head is checked.
  const m = s.match(/^(-?)([\d.,]+)(\s*[a-z]*)$/);
  if (!m) return null;
  const [, sign, num, tail] = m;
  const western = /^\d{1,3}(?:,\d{3})+(?:\.\d+)?$/;
  const indian = /^\d{1,2}(?:,\d{2})*,\d{3}(?:\.\d+)?$/;
  // A leading zero group is never thousands: "0,500" is 0.5 (decimal comma), and a longer
  // "0,500,000" has no sensible reading, so it is refused.
  if (/^0,/.test(num)) return /^0,\d+$/.test(num) ? sign + num.replace(',', '.') + tail : null;
  if (western.test(num) || indian.test(num)) return sign + num.replace(/,/g, '') + tail;
  if (/^\d*,\d+$/.test(num) && !/^\d+,\d{3}$/.test(num)) return sign + num.replace(',', '.') + tail;
  return null;
}

/**
 * Parse a human-friendly numeric string into a number, or null when it cannot be understood.
 * Strips currency symbols, thousands separators (see normaliseCommas for the comma rule), a trailing percent sign, and applies magnitude words.
 */
export function parseHumanNumber(input: unknown): number | null {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  if (typeof input !== 'string') return null;

  let s = input.trim().toLowerCase();
  if (s === '') return null;

  // Drop common currency symbols and codes, and grouping separators (Western "," and Indian style).
  s = s.replace(/[₹$€£¥]|usd|eur|gbp|inr|jpy|cad|aud|\srs\.?|^rs\.?/gi, ' ');
  s = s.replace(/%$/, '').trim();
  const commas = normaliseCommas(s);
  if (commas === null) return null;
  s = commas;

  // Match: optional sign, number, optional exponent ("1e9", "2.5e-3"), optional space, optional
  // suffix word. Without the exponent, "1e9" read as 1 while it was being typed.
  const match = s.match(/^(-?\d*\.?\d+(?:e[+-]?\d+)?)\s*([a-z]+)?$/);
  if (!match) return null;

  const base = Number(match[1]);
  if (!Number.isFinite(base)) return null;

  const suffix = match[2];
  if (!suffix) return base;

  const mult = SUFFIXES[suffix];
  if (mult === undefined) return null; // an unknown trailing word is an error, not a silent base value
  return base * mult;
}
