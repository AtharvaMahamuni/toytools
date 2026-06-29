// Finance input validation — never-throw coercion guards. A calculator runs each input field through
// these; the first failure short-circuits to a validation-error InteractiveResult so the experience
// layer can phrase it as "check your inputs" rather than crashing.

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
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n)) return fail(`${label} must be a number.`);
  if (opts.min !== undefined && n < opts.min) return fail(`${label} cannot be less than ${opts.min}.`);
  if (opts.max !== undefined && n > opts.max) return fail(`${label} cannot be more than ${opts.max}.`);
  return ok(n);
}

/** A strictly positive number. */
export function positive(input: FinanceInput, key: string, label: string): Coerced {
  const c = number(input, key, label, { min: 0 });
  if (!c.ok) return c;
  if (c.value <= 0) return fail(`${label} must be greater than zero.`);
  return c;
}

/** Read a select value as a string with a fallback. */
export function choice(input: FinanceInput, key: string, fallback: string): string {
  const raw = input[key];
  return raw === undefined || raw === '' ? fallback : String(raw);
}
