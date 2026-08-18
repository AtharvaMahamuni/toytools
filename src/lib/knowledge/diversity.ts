// Recommendation-diversity check. A healthy "Related Tools" set mixes a sibling, a complementary
// tool, and an adjacent-workflow tool, not five near-identical tools. Pure; operates on ToolConfig.
//
// This began as a non-fatal WARN and stayed one for months while 42 tools tripped it, because it
// was reported as a content problem ("consider a complementary tool") when it was structural: the
// derivation in src/lib/tools/related.ts is a tier cascade with a slice, so any engine larger than
// the slot count filled every list with its own siblings and no amount of authoring could change
// it. With one slot now reserved for another family, the only tools left are the ones with no
// cross-family neighbour to offer, which is a fact about the catalog rather than a bubble.
//
// So the check takes the CANDIDATE POOL as well as the chosen set. That is the structural
// exemption CLAUDE.md asks for: "a tool in a category of one family" is a derived condition, not a
// list of slugs that goes stale the first time a category grows.

import type { ToolConfig } from '@data/types';

/**
 * True when every related tool shares the source's family AND at least one tool from another
 * family was available to pick instead.
 *
 * Returns false when the set is empty or has one item (nothing to diversify), when the source has
 * no family, and when the candidate pool offers no other family at all.
 *
 * @param candidates every tool that could have been recommended, not just the chosen ones. Omit it
 *   to fall back to the old shape, which cannot tell a bubble from a small category.
 */
export function isSingleFamilyBubble(
  source: ToolConfig,
  related: ToolConfig[],
  candidates?: ToolConfig[],
): boolean {
  if (related.length < 2) return false;
  if (!source.family) return false;
  if (!related.every(r => r.family !== undefined && r.family === source.family)) return false;
  if (!candidates) return true;
  return candidates.some(c => c.slug !== source.slug && c.family !== undefined && c.family !== source.family);
}
