// Finance display formatting — thin wrappers over the platform formatter (src/lib/inputs/format.ts)
// pinned to finance needs. Deterministic (fixed locale + Indian grouping for INR), so cards render
// the same in Node, SSR, and the browser, and tests can assert exact strings.

import { formatGrouped } from '@lib/inputs/format';
import { groupingFor } from '@lib/inputs/currency';

/** Round to cents to avoid floating-point noise leaking into displayed/raw money values. */
export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Currency string for the given code, e.g. money(1234.5, 'USD') === '$1,234.50'. */
export function money(value: number, currency: string): string {
  return formatGrouped(value, {
    style: 'currency',
    currency,
    grouping: groupingFor(currency),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** A whole-money string (no cents) for large headline figures when cents add noise. */
export function moneyWhole(value: number, currency: string): string {
  return formatGrouped(Math.round(value), {
    style: 'currency',
    currency,
    grouping: groupingFor(currency),
    maximumFractionDigits: 0,
  });
}

/** Percent string from a percent number: percent(7.5) === '7.5%'. */
export function percent(value: number, fractionDigits = 1): string {
  return formatGrouped(value, {
    style: 'percent',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  });
}

/** Year string: years(1) === '1 year', years(11.3) === '11.3 years'. */
export function years(value: number): string {
  if (!Number.isFinite(value)) return 'never';
  const rounded = Number(value.toFixed(1));
  return `${rounded} ${rounded === 1 ? 'year' : 'years'}`;
}
