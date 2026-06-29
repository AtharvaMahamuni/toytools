// Localization-potential scorer — how well the tool travels across languages (language-independent
// transforms like binary/hash score high; language-specific text tools lower). Pure.
import type { RawOpportunity } from '../models/provider';
import { clamp01 } from './demand';

export function scoreLocalization(raw: RawOpportunity): number {
  return clamp01(raw.localization / 100);
}
