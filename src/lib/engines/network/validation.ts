import type { NetworkInput } from './types';
import { validationError } from '@lib/results/index';
import type { InteractiveResult } from '@lib/results/types';
import { parseIPv4Network, type Parsed } from './models';
import type { ParsedIPv4 } from './types';

export interface Ok<T> { ok: true; value: T }
export interface Err { ok: false; result: InteractiveResult }
export type Coerced<T> = Ok<T> | Err;

function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}
function fail(message: string): Err {
  return { ok: false, result: validationError(message) };
}

export function cidrField(input: NetworkInput, key: string): Coerced<ParsedIPv4> {
  const raw = input[key];
  if (raw === undefined || raw === '' || raw === null) {
    return fail('Enter an IPv4 address or a CIDR like 192.168.1.0/24.');
  }
  const parsed: Parsed<ParsedIPv4> = parseIPv4Network(String(raw));
  if (!parsed.ok) return fail(parsed.error);
  return ok(parsed.value);
}
