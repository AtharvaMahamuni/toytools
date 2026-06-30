// Supported display currencies — engine-agnostic. The currency only affects display (the engine
// computes in plain numbers and formats at the boundary), so adding a currency is a data-only change.

export interface CurrencyOption {
  code: string;
  label: string;
  symbol: string;
  /** Indian grouping (lakh/crore) reads more naturally for INR. */
  grouping?: 'western' | 'indian';
  /**
   * Tentative, rounded magnitude relative to USD (NOT a live exchange rate). Used to make default
   * amounts and quick-add presets feel native when the display currency changes — e.g. a $3,000
   * default reads as ₹30,000 (INR scale 10) instead of staying in dollar magnitudes. Deliberately
   * clean (powers of 10) so the existing round presets stay round. Defaults to 1.
   */
  scale?: number;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', label: 'USD ($)', symbol: '$' },
  { code: 'EUR', label: 'EUR (€)', symbol: '€' },
  { code: 'GBP', label: 'GBP (£)', symbol: '£' },
  { code: 'INR', label: 'INR (₹)', symbol: '₹', grouping: 'indian', scale: 10 },
  { code: 'JPY', label: 'JPY (¥)', symbol: '¥', scale: 100 },
  { code: 'CAD', label: 'CAD ($)', symbol: '$' },
  { code: 'AUD', label: 'AUD ($)', symbol: '$' },
];

export const DEFAULT_CURRENCY = 'USD';

export function currencyOption(code: string): CurrencyOption {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code) ?? SUPPORTED_CURRENCIES[0];
}

/** Indian grouping for INR, Western otherwise. */
export function groupingFor(code: string): 'western' | 'indian' {
  return currencyOption(code).grouping ?? 'western';
}

/**
 * Tentative, rounded magnitude factor for a currency relative to USD (NOT a live FX rate). Drives
 * currency-native default amounts and presets. Returns 1 for unknown/baseline currencies.
 */
export function scaleFor(code: string): number {
  return currencyOption(code).scale ?? 1;
}

/** Serializable map of currency code -> scale factor (for inlining into client widgets). */
export function currencyScales(): Record<string, number> {
  return Object.fromEntries(SUPPORTED_CURRENCIES.map((c) => [c.code, c.scale ?? 1]));
}
