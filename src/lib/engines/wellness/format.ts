// Wellness display formatting — deterministic (fixed 'en-US' locale) so cards render identically in
// Node, SSR, and the browser, and tests can assert exact strings.

import { kgToLb } from './models';

/** Round to one decimal place, trimming a trailing ".0" (e.g. 22.0 -> "22", 22.45 -> "22.5"). */
export function num1(value: number): string {
  if (!Number.isFinite(value)) return '0';
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded)
    ? rounded.toLocaleString('en-US')
    : rounded.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** A weight (given in kg) rendered in the chosen unit system, e.g. weight(70, 'metric') -> "70 kg". */
export function weight(kg: number, unit: 'metric' | 'imperial'): string {
  if (!Number.isFinite(kg)) return unit === 'metric' ? '0 kg' : '0 lb';
  return unit === 'metric' ? `${num1(kg)} kg` : `${num1(kgToLb(kg))} lb`;
}

/** A weight range (kg lo/hi) rendered in the chosen unit, e.g. "56.5–76.1 kg". */
export function weightRange(loKg: number, hiKg: number, unit: 'metric' | 'imperial'): string {
  if (!Number.isFinite(loKg) || !Number.isFinite(hiKg)) return weight(0, unit);
  const suffix = unit === 'metric' ? 'kg' : 'lb';
  const lo = unit === 'metric' ? loKg : kgToLb(loKg);
  const hi = unit === 'metric' ? hiKg : kgToLb(hiKg);
  return `${num1(lo)}–${num1(hi)} ${suffix}`;
}
