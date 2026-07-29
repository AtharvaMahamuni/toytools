// Never-throw input guards for the wellness engine. A calculator runs each field through these; the
// first failure short-circuits to a validation-error InteractiveResult so the experience layer
// phrases it as "check your inputs" rather than crashing.

import type { WellnessInput } from './types';
import { validationError } from '@lib/results/index';
import type { InteractiveResult } from '@lib/results/types';

export interface Ok<T> { ok: true; value: T; }
export interface Err { ok: false; result: InteractiveResult; }
export type Coerced<T> = Ok<T> | Err;

function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}
function fail(message: string): Err {
  return { ok: false, result: validationError(message) };
}

/** A finite number within [min, max], or a validation error. Blank is treated as missing. */
export function numberField(
  input: WellnessInput,
  key: string,
  label: string,
  opts: { min?: number; max?: number } = {},
): Coerced<number> {
  const raw = input[key];
  if (raw === undefined || raw === '' || raw === null) {
    return fail(`Enter ${label} to calculate.`);
  }
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n)) return fail(`${label} must be a number.`);
  if (opts.min !== undefined && n < opts.min) return fail(`${label} cannot be less than ${opts.min}.`);
  if (opts.max !== undefined && n > opts.max) return fail(`${label} cannot be more than ${opts.max}.`);
  return ok(n);
}

/**
 * A number for a field declared `optional: true`, where blank means "not supplied" rather than
 * "invalid". Needed because SmartInput deliberately renders a numeric field whose default is 0 as
 * BLANK (so a meaningless zero is not pre-filled), which numberField would then reject as missing:
 * an optional input would hard-fail the whole calculation. Blank yields `fallback`; a supplied value
 * is still range-checked.
 */
export function optionalNumberField(
  input: WellnessInput,
  key: string,
  label: string,
  opts: { min?: number; max?: number; fallback?: number } = {},
): Coerced<number> {
  const raw = input[key];
  if (raw === undefined || raw === '' || raw === null) return ok(opts.fallback ?? 0);
  return numberField(input, key, label, opts);
}

/** A strictly-positive number within an optional [min, max]. */
export function positiveField(
  input: WellnessInput,
  key: string,
  label: string,
  opts: { min?: number; max?: number } = {},
): Coerced<number> {
  const c = numberField(input, key, label, opts);
  if (!c.ok) return c;
  if (c.value <= 0) return fail(`${label} must be greater than zero.`);
  return c;
}

/** A select field constrained to its declared option values. */
export function selectField<T extends string>(
  input: WellnessInput,
  key: string,
  label: string,
  allowed: readonly T[],
): Coerced<T> {
  const raw = String(input[key] ?? '');
  if ((allowed as readonly string[]).includes(raw)) return ok(raw as T);
  return fail(`Choose ${label}.`);
}
