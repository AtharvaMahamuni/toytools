// Never-throw input guards for the math engine. A calculator runs each field through these; the
// first failure short-circuits to a validation-error InteractiveResult so the experience layer
// phrases it as "check your inputs" rather than crashing.

import type { MathInput } from './types';
import { validationError } from '@lib/results/index';
import type { InteractiveResult } from '@lib/results/types';
import { parseFraction, type Fraction } from './models';

export interface Ok<T> { ok: true; value: T; }
export interface Err { ok: false; result: InteractiveResult; }
export type Coerced<T> = Ok<T> | Err;

function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}
function fail(message: string): Err {
  return { ok: false, result: validationError(message) };
}

/** A fraction parsed from "7", "3/4", or "1 2/3", or a validation error. */
export function fractionField(input: MathInput, key: string, label: string): Coerced<Fraction> {
  const raw = input[key];
  if (raw === undefined || raw === '' || raw === null) {
    return fail(`Enter ${label} to calculate.`);
  }
  const parsed = parseFraction(String(raw));
  if (!parsed) return fail(`${label} should be a whole number, a fraction like 3/4, or a mixed number like 1 2/3.`);
  return ok(parsed);
}

/** An integer within [min, max], or a validation error. */
export function integerField(
  input: MathInput,
  key: string,
  label: string,
  opts: { min: number; max: number },
): Coerced<number> {
  const raw = input[key];
  if (raw === undefined || raw === '' || raw === null) {
    return fail(`Enter ${label} to calculate.`);
  }
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return fail(`${label} should be a whole number.`);
  if (n < opts.min || n > opts.max) {
    return fail(`${label} should be between ${opts.min} and ${opts.max.toLocaleString('en-US')}.`);
  }
  return ok(n);
}

/** An optional integer: blank yields null; anything present must satisfy the bounds. */
export function optionalIntegerField(
  input: MathInput,
  key: string,
  label: string,
  opts: { min: number; max: number },
): Coerced<number | null> {
  const raw = input[key];
  if (raw === undefined || raw === '' || raw === null) return ok(null);
  return integerField(input, key, label, opts);
}

/** A select field constrained to its declared option values. */
export function selectField<T extends string>(
  input: MathInput,
  key: string,
  label: string,
  allowed: readonly T[],
): Coerced<T> {
  const raw = String(input[key] ?? '');
  if ((allowed as readonly string[]).includes(raw)) return ok(raw as T);
  return fail(`Choose ${label}.`);
}
