// Related-tools analyzer — derives internal links from a raw opportunity into the EXISTING catalog,
// reusing the same engine/family tiering idea as src/lib/tools/related.ts. It returns real tool slugs
// (catalog) plus any explicit hints from the seed that already exist. Pure, deterministic.

import type { RawOpportunity } from '../models/provider';
import type { CatalogRef, ResearchInputs } from '../types';
import { transformationId } from './transformation';

const MAX_RELATED = 6;

export function deriveRelatedTools(raw: RawOpportunity, inputs: ResearchInputs): string[] {
  const out = new Set<string>();

  // 1. Explicit hints from evidence that resolve to a real tool.
  for (const slug of raw.relatedTools) if (inputs.existingSlugs.has(slug)) out.add(slug);

  // 2. Same-engine catalog tools (tier: shares engine).
  const sameEngine = inputs.catalog.filter(c => c.engine === raw.proposedEngine);
  for (const c of rank(sameEngine, raw)) {
    if (out.size >= MAX_RELATED) break;
    out.add(c.slug);
  }

  return [...out].slice(0, MAX_RELATED);
}

/** Stable rank: same transformation-ish family first, then alphabetical. */
function rank(refs: CatalogRef[], raw: RawOpportunity): CatalogRef[] {
  const tid = transformationId(raw.transformation);
  return [...refs].sort((a, b) => {
    const af = tid.includes(a.family) || a.family.includes(raw.proposedEngine) ? 0 : 1;
    const bf = tid.includes(b.family) || b.family.includes(raw.proposedEngine) ? 0 : 1;
    return af - bf || a.slug.localeCompare(b.slug);
  });
}
