// Task-oriented recommendation blocks ("You May Also Need", "Next Steps", "Alternatives"),
// built from a tool's curated overlay relationships. Each block carries a heading and resolved
// items (node + reason). Components render these directly; no logic lives in the .astro files.

import { getUsedWith, getAlternatives, getNextSteps, type ResolvedRelation } from './queries';
import { graph as defaultGraph } from './graph';
import type { KnowledgeGraph } from './types';

export interface RecommendationBlock {
  /** Stable key for the block (used for testing / future analytics). */
  key: 'used-with' | 'next-steps' | 'alternatives';
  heading: string;
  items: ResolvedRelation[];
}

/** Drop duplicate target slugs and any self-reference, preserving order. */
function dedupe(items: ResolvedRelation[], selfSlug: string): ResolvedRelation[] {
  const seen = new Set<string>();
  return items.filter(r => {
    if (r.node.slug === selfSlug || seen.has(r.node.slug)) return false;
    seen.add(r.node.slug);
    return true;
  });
}

/**
 * Build the recommendation blocks for a tool. Empty blocks are omitted, so a tool with no
 * authored overlay relationships yields an empty array (component renders nothing).
 */
export function getRecommendations(
  slug: string,
  max = 4,
  graph: KnowledgeGraph = defaultGraph,
): RecommendationBlock[] {
  const blocks: RecommendationBlock[] = [
    { key: 'used-with', heading: 'You may also need', items: dedupe(getUsedWith(slug, max, graph), slug) },
    { key: 'next-steps', heading: 'Next steps', items: dedupe(getNextSteps(slug, max, graph), slug) },
    { key: 'alternatives', heading: 'Alternatives', items: dedupe(getAlternatives(slug, max, graph), slug) },
  ];
  return blocks.filter(b => b.items.length > 0);
}
