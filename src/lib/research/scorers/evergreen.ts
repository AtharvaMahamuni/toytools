// Evergreen scorer — how durable the need is (stable utility vs fad). Pure.
import type { RawOpportunity } from '../models/provider';
import { clamp01 } from './demand';

export function scoreEvergreen(raw: RawOpportunity): number {
  return clamp01(raw.evergreen / 100);
}
