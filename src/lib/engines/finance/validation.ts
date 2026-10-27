// Finance input validation — never-throw coercion guards. A calculator runs each input field through
// these; the first failure short-circuits to a validation-error InteractiveResult so the experience
// layer can phrase it as "check your inputs" rather than crashing.

import { parseHumanNumber } from '@lib/inputs/parse';

import type { FinanceInput } from './types';
import { validationError } from '@lib/results/index';
import type { InteractiveResult } from '@lib/results/types';

export interface Ok { ok: true; value: number; }
export interface Err { ok: false; result: InteractiveResult; }
export type Coerced = Ok | Err;

function ok(value: number): Ok {
  return { ok: true, value };
}
function fail(message: string): Err {
  return { ok: false, result: validationError(message) };
}

/**
 * A typed amount as a number through the shared parser (src/lib/inputs/parse.ts), so "1,5" is 1.5,
 * "1,500" and "1,50,000" are grouped thousands, and "₹25,000" works. NaN when it cannot be read.
 * Every finance calculator reads its numbers through this, never through Number() on raw text.
 */
export function parseAmount(raw: unknown): number {
  if (typeof raw === 'number') return raw;
  const n = parseHumanNumber(String(raw ?? ''));
  return n === null ? NaN : n;
}

/** A finite number, or a validation error. Blank optional fields should be handled by the caller
 *  (pass `optional: true`) so they coerce to 0 instead of erroring. */
export function number(
  input: FinanceInput,
  key: string,
  label: string,
  opts: { optional?: boolean; min?: number; max?: number } = {},
): Coerced {
  const raw = input[key];
  if (raw === undefined || raw === '' || raw === null) {
    if (opts.optional) return ok(0);
    return fail(`Enter ${label} to calculate.`);
  }
  const n = parseAmount(raw);
  if (!Number.isFinite(n)) return fail(`${label} must be a number.`);
  const Label = label.charAt(0).toUpperCase() + label.slice(1);
  if (opts.min === 0 && n < 0) return fail(`${Label} cannot be negative. Enter 0 or more.`);
  if (opts.min !== undefined && n < opts.min) return fail(`${Label} cannot be less than ${opts.min}.`);
  if (opts.max !== undefined && n > opts.max) return fail(`${Label} cannot be more than ${opts.max}.`);
  return ok(n);
}

/** A strictly positive number. */
export function positive(input: FinanceInput, key: string, label: string, opts: { max?: number } = {}): Coerced {
  const c = number(input, key, label, { min: 0, max: opts.max });
  if (!c.ok) return c;
  if (c.value <= 0) return fail(`${label} must be greater than zero.`);
  return c;
}

/** Read a select value as a string with a fallback. */
export function choice(input: FinanceInput, key: string, fallback: string): string {
  const raw = input[key];
  return raw === undefined || raw === '' ? fallback : String(raw);
}
