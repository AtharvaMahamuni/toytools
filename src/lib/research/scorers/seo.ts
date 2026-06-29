// SEO-potential scorer — blends query-surface breadth (more distinct queries = more entry points)
// with raw demand. Pure.
import type { RawOpportunity } from '../models/provider';
import { clamp01 } from './demand';

export function scoreSeo(raw: RawOpportunity): number {
  const breadth = Math.min(raw.searchQueries.length / 5, 1);
  return clamp01(breadth * 0.6 + (raw.demand / 100) * 0.4);
}
