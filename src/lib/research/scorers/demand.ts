// Demand scorer — normalizes the raw search-demand signal to 0–1. Pure.
import type { RawOpportunity } from '../models/provider';

export function scoreDemand(raw: RawOpportunity): number {
  return clamp01(raw.demand / 100);
}

export function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
