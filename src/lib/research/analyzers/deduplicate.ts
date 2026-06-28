// Deduplicate analyzer — collapses raw opportunities that describe the same need. Two raws merge when
// they share a derived id (same proposed tool) OR their problems are near-identical (Jaccard ≥ the
// configured threshold). The representative keeps the strongest evidence; all contributing provider
// sources are preserved. Deterministic (stable ordering + tiebreaks). Pure.

import type { RawOpportunity } from '../models/provider';
import type { ProviderId } from '../constants';
import { opportunityId } from '../models/opportunity';
import { THRESHOLDS } from '../config';
import { jaccard } from './similarity';

export interface MergedRaw {
  id: string;
  raw: RawOpportunity; // representative (strongest)
  sources: ProviderId[];
  mergedCount: number;
}

export interface DeduplicateResult {
  merged: MergedRaw[];
  /** ids that absorbed ≥1 duplicate — surfaced for reporting, not an error. */
  duplicateIds: string[];
}

function stronger(a: RawOpportunity, b: RawOpportunity): RawOpportunity {
  if (a.demand !== b.demand) return a.demand > b.demand ? a : b;
  return a.proposedTool <= b.proposedTool ? a : b;
}

export function deduplicate(raw: RawOpportunity[]): DeduplicateResult {
  const groups: MergedRaw[] = [];

  for (const r of raw) {
    const id = opportunityId(r.proposedTool);
    const match = groups.find(
      g =>
        g.id === id ||
        (g.raw.proposedEngine === r.proposedEngine &&
          jaccard(g.raw.problem, r.problem) >= THRESHOLDS.duplicateSimilarity),
    );
    if (match) {
      match.raw = stronger(match.raw, r);
      if (!match.sources.includes(r.source)) match.sources.push(r.source);
      match.mergedCount++;
    } else {
      groups.push({ id, raw: r, sources: [r.source], mergedCount: 1 });
    }
  }

  for (const g of groups) g.sources.sort();
  groups.sort((a, b) => a.id.localeCompare(b.id));
  const duplicateIds = groups.filter(g => g.mergedCount > 1).map(g => g.id);
  return { merged: groups, duplicateIds };
}
