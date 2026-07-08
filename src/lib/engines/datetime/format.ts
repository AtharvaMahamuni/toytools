// Presentation formatters for the Date & Time engine. Kept pure and dependency-light: static month /
// weekday tables (no locale surprises in tests) plus grouped integers for large day/hour counts.

import type { AgeParts, CivilDate } from './models';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** '1 day' / '3 days' — a count with its singular/plural unit. */
export function plural(n: number, unit: string): string {
  return `${integer(n)} ${unit}${Math.abs(n) === 1 ? '' : 's'}`;
}

/** Grouped integer, e.g. 12345 -> '12,345'. */
export function integer(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}

/** Weekday name for a 0-6 (Sun-Sat) index. */
export function weekdayName(index: number): string {
  return WEEKDAYS[((index % 7) + 7) % 7];
}

/** Long-form civil date, e.g. { y: 2026, m: 7, d: 8 } -> '8 July 2026'. */
export function formatCivil(c: CivilDate): string {
  return `${c.d} ${MONTHS[c.m - 1]} ${c.y}`;
}

/** Age as a human phrase, dropping zero leading components: '34 years, 5 months, 12 days'. */
export function agePhrase(a: AgeParts): string {
  const parts: string[] = [];
  if (a.years) parts.push(plural(a.years, 'year'));
  if (a.months) parts.push(plural(a.months, 'month'));
  if (a.days || parts.length === 0) parts.push(plural(a.days, 'day'));
  return parts.join(', ');
}
