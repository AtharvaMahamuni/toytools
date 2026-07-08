// Result formatting — isolated so display precision can change without touching evaluation.
// Trims floating-point noise (0.1 + 0.2 → 0.3), caps significant digits, and switches to
// scientific notation for very large or very small magnitudes.

export interface FormatOptions {
  /** Significant digits to keep before trimming trailing zeros (default 12). */
  maxSignificant?: number;
}

/** Human-readable e-notation: "1e+9" → "1e9", keeps a negative exponent's sign. */
function tidyExponent(s: string): string {
  return s.replace('e+', 'e');
}

export function formatResult(value: number, opts: FormatOptions = {}): string {
  const maxSignificant = opts.maxSignificant ?? 12;

  if (Number.isNaN(value)) return 'undefined';
  if (value === Infinity) return '∞';
  if (value === -Infinity) return '-∞';
  if (value === 0) return '0';

  const abs = Math.abs(value);
  // Very large or very small → scientific notation, rounded to the significant-digit budget.
  if (abs >= 1e15 || abs < 1e-9) {
    return tidyExponent(Number(value.toPrecision(maxSignificant)).toExponential());
  }

  // Round to the significant-digit budget, then let String() drop trailing zeros / float noise.
  return String(Number(value.toPrecision(maxSignificant)));
}
