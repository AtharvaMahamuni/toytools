// Never-throw input guards for the Date & Time engine. A tool runs each field through these; the first
// failure short-circuits to a validation-error InteractiveResult so the experience layer phrases it as
// "check your inputs" rather than crashing.

import type { DateTimeInput } from './types';
import { validationError } from '@lib/results/index';
import type { InteractiveResult } from '@lib/results/types';
import { parseISODate, type CivilDate } from './models';

export interface Ok<T> { ok: true; value: T; }
export interface Err { ok: false; result: InteractiveResult; }
export type Coerced<T> = Ok<T> | Err;

function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}
function fail(message: string): Err {
  return { ok: false, result: validationError(message) };
}

/** A calendar date parsed from a 'YYYY-MM-DD' (or datetime-local) string, or a validation error. */
export function dateField(input: DateTimeInput, key: string, label: string): Coerced<CivilDate> {
  const raw = input[key];
  if (raw === undefined || raw === '' || raw === null) {
    return fail(`Enter ${label} to calculate.`);
  }
  const parsed = parseISODate(String(raw));
  if (!parsed) return fail(`${label} is not a valid date.`);
  return ok(parsed);
}

/** An optional calendar date: blank yields `null` (the caller supplies a default like "today"). */
export function optionalDateField(input: DateTimeInput, key: string, label: string): Coerced<CivilDate | null> {
  const raw = input[key];
  if (raw === undefined || raw === '' || raw === null) return ok(null);
  const parsed = parseISODate(String(raw));
  if (!parsed) return fail(`${label} is not a valid date.`);
  return ok(parsed);
}
