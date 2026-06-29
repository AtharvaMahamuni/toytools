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
 * Parse a human-friendly numeric string into a number, or null when it cannot be understood.
 * Strips currency symbols, thousands separators, a trailing percent sign, and applies magnitude words.
 */
export function parseHumanNumber(input: unknown): number | null {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  if (typeof input !== 'string') return null;

  let s = input.trim().toLowerCase();
  if (s === '') return null;

  // Drop common currency symbols and codes, and grouping separators (Western "," and Indian style).
  s = s.replace(/[₹$€£¥]|usd|eur|gbp|inr|jpy|cad|aud|\srs\.?|^rs\.?/gi, ' ');
  s = s.replace(/,/g, '');
  s = s.replace(/%$/, '').trim();

  // Match: optional sign, number, optional space, optional suffix word.
  const match = s.match(/^(-?\d*\.?\d+)\s*([a-z]+)?$/);
  if (!match) return null;

  const base = Number(match[1]);
  if (!Number.isFinite(base)) return null;

  const suffix = match[2];
  if (!suffix) return base;

  const mult = SUFFIXES[suffix];
  if (mult === undefined) return null; // an unknown trailing word is an error, not a silent base value
  return base * mult;
}
