// Display formatting — grouped and compact number formatting. Display-only: it NEVER mutates the raw
// value an engine computes with. Supports Western and Indian (lakh/crore) digit grouping plus a
// compact mode (1.25M). Deterministic: a fixed default locale so tests and SSR agree.
//
// Engine-agnostic platform utility used by the smart inputs and (indirectly) the finance formatter.

const DEFAULT_LOCALE = 'en-US';
const INDIAN_LOCALE = 'en-IN';

export type GroupingStyle = 'western' | 'indian';
export type NumberStyle = 'decimal' | 'currency' | 'percent';

export interface FormatOptions {
  style?: NumberStyle;
  currency?: string;
  grouping?: GroupingStyle;
  /** Compact form (1.25M / 12.5L) for tight UI like input chips. */
  compact?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

function localeFor(grouping: GroupingStyle | undefined): string {
  return grouping === 'indian' ? INDIAN_LOCALE : DEFAULT_LOCALE;
}

/**
 * Format a number for display. Western or Indian grouping; optional currency/percent; optional
 * compact notation. Returns the plain number as a string if Intl is somehow unavailable (never throws).
 */
export function formatGrouped(value: number, opts: FormatOptions = {}): string {
  if (!Number.isFinite(value)) return '0';
  const locale = localeFor(opts.grouping);
  try {
    const fmt = new Intl.NumberFormat(locale, {
      style: opts.style === 'currency' ? 'currency' : opts.style === 'percent' ? 'percent' : 'decimal',
      currency: opts.style === 'currency' ? opts.currency ?? 'USD' : undefined,
      notation: opts.compact ? 'compact' : 'standard',
      minimumFractionDigits: opts.minimumFractionDigits,
      maximumFractionDigits: opts.maximumFractionDigits,
    });
    // percent style expects a ratio; callers pass a percent number (5 -> "5%"), so scale here.
    const out = fmt.format(opts.style === 'percent' ? value / 100 : value);
    if (opts.style !== 'currency' && !opts.compact) {
      // Intl's defaults: 3 fraction digits for decimal, 0 for percent.
      const maxFrac = opts.maximumFractionDigits ?? (opts.style === 'percent' ? 0 : 3);
      const tiny = tinyNonZero(value, maxFrac);
      if (tiny !== null) return opts.style === 'percent' ? `${tiny}%` : tiny;
    }
    return out;
  } catch (_) {
    return String(value);
  }
}

/**
 * Below this magnitude a value is floating-point noise (0.1 + 0.2 - 0.3 is 5.6e-17), not a result,
 * so it still displays as 0.
 */
export const NOISE_FLOOR = 1e-12;

/**
 * The display for a value that is not zero but would round to zero at `maxFractionDigits`, or null
 * when the normal rounding is fine. A tiny result must never read as 0 (a BMI of 0.0025 once showed
 * "0, Underweight"). Rule:
 *   - |value| >= 1e-6: two significant digits in plain decimals (0.0025, -0.000012);
 *   - 1e-12 <= |value| < 1e-6: scientific notation with two significant digits (2.5e-7);
 *   - |value| < 1e-12 or exactly 0: null, so the caller shows its usual 0.
 * Money is not routed through this: currency keeps its cents (see formatGrouped).
 */
export function tinyNonZero(value: number, maxFractionDigits: number): string | null {
  if (!Number.isFinite(value) || value === 0) return null;
  const abs = Math.abs(value);
  if (abs < NOISE_FLOOR) return null;
  const digits = Math.max(0, Math.min(20, Math.floor(maxFractionDigits)));
  if (abs >= 0.5 * Math.pow(10, -digits)) return null; // rounds to a visible non-zero value
  if (abs >= 1e-6) {
    return new Intl.NumberFormat(DEFAULT_LOCALE, { maximumSignificantDigits: 2 }).format(value);
  }
  return value.toExponential(1).replace('.0e', 'e');
}

/**
 * A plain decimal for display with at most `maxFractionDigits` digits after the point, trailing
 * zeros dropped, en-US grouping, and tiny non-zero values kept visible (see tinyNonZero).
 */
export function formatDecimal(value: number, maxFractionDigits: number): string {
  if (!Number.isFinite(value)) return '0';
  return tinyNonZero(value, maxFractionDigits)
    ?? formatGrouped(value, { maximumFractionDigits: maxFractionDigits, minimumFractionDigits: 0 });
}
