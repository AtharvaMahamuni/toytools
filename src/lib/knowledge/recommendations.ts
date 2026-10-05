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

/**
 * Drop any target already shown in an earlier block (or earlier in this one) and any
 * self-reference, preserving order, then cap the block at `max`.
 *
 * `seen` is shared by all three blocks, in render order (used-with, next-steps, alternatives), so
 * each target renders once on the page, in the first block that names it (SEO GEO audit
 * 2026-10-05, item 20). It used to be a fresh set per block: 121 of 172 guide pages listed a tool
 * two or three times, e.g. the SHA-512 guide named SHA-256 in all three blocks.
 */
function dedupe(items: ResolvedRelation[], selfSlug: string, seen: Set<string>, max: number): ResolvedRelation[] {
  const kept: ResolvedRelation[] = [];
  for (const r of items) {
    if (kept.length >= max) break;
    if (r.node.slug === selfSlug || seen.has(r.node.slug)) continue;
    seen.add(r.node.slug);
    kept.push(r);
  }
  return kept;
}

/**
 * Build the recommendation blocks for a tool. Empty blocks are omitted, so a tool with no
 * authored overlay relationships yields an empty array (component renders nothing).
 *
 * Each block reads its whole authored list and is capped after the cross-block dedupe, so a block
 * that loses a repeat still shows its next authored target instead of coming up short.
 */
export function getRecommendations(
  slug: string,
  max = 4,
  graph: KnowledgeGraph = defaultGraph,
): RecommendationBlock[] {
  const seen = new Set<string>();
  const all = Number.MAX_SAFE_INTEGER;
  const blocks: RecommendationBlock[] = [
    { key: 'used-with', heading: 'You may also need', items: dedupe(getUsedWith(slug, all, graph), slug, seen, max) },
    { key: 'next-steps', heading: 'Next steps', items: dedupe(getNextSteps(slug, all, graph), slug, seen, max) },
    { key: 'alternatives', heading: 'Alternatives', items: dedupe(getAlternatives(slug, all, graph), slug, seen, max) },
  ];
  return blocks.filter(b => b.items.length > 0);
}
