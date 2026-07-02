// Gap analyzer — classifies how each opportunity maps onto the CURRENT catalog, then summarizes the
// classification. "Already exists" / "guide missing" / "faq missing" use the real registries via
// ResearchInputs; "engine missing" means the proposed engine is not registered; "cluster missing"
// means a brand-new tool that extends an existing engine. Pure, deterministic.

import type { GapKind } from '../constants';
import type { Opportunity } from '../models/opportunity';
import type { GapSummary } from '../models/report';
import type { ResearchInputs } from '../types';
import { resolveSlugAlias } from '../config';

export function classifyGap(
  proposedTool: string,
  proposedEngine: string,
  inputs: ResearchInputs,
): GapKind {
  const slug = resolveSlugAlias(proposedTool);
  if (inputs.existingSlugs.has(slug)) {
    if (!inputs.guideSlugs.has(slug)) return 'guide-missing';
    if (!inputs.faqSlugs.has(slug)) return 'faq-missing';
    if (!inputs.knowledgeSlugs.has(slug)) return 'knowledge-gap';
    return 'needs-improvement';
  }
  if (!inputs.engineIds.has(proposedEngine)) return 'engine-missing';
  return 'cluster-missing';
}

export function summarizeGaps(opportunities: Opportunity[]): GapSummary[] {
  const byKind = new Map<GapKind, string[]>();
  for (const o of opportunities) {
    const list = byKind.get(o.gap) ?? [];
    list.push(o.id);
    byKind.set(o.gap, list);
  }
  return [...byKind.entries()]
    .map(([kind, ids]) => ({ kind, count: ids.length, opportunityIds: ids.sort() }))
    .sort((a, b) => b.count - a.count || a.kind.localeCompare(b.kind));
}
