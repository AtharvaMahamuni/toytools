// Supported display currencies — engine-agnostic. The currency only affects display (the engine
// computes in plain numbers and formats at the boundary), so adding a currency is a data-only change.

export interface CurrencyOption {
  code: string;
  label: string;
  symbol: string;
  /** Indian grouping (lakh/crore) reads more naturally for INR. */
  grouping?: 'western' | 'indian';
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', label: 'USD ($)', symbol: '$' },
  { code: 'EUR', label: 'EUR (€)', symbol: '€' },
  { code: 'GBP', label: 'GBP (£)', symbol: '£' },
  { code: 'INR', label: 'INR (₹)', symbol: '₹', grouping: 'indian' },
  { code: 'JPY', label: 'JPY (¥)', symbol: '¥' },
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
