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
    return fmt.format(opts.style === 'percent' ? value / 100 : value);
  } catch (_) {
    return String(value);
  }
}
