// Recommendation-diversity check. A healthy "Related Tools" set mixes a sibling, a complementary
// tool, and an adjacent-workflow tool — not five near-identical tools. This surfaces content
// bubbles as a non-fatal WARN in validate-knowledge. Pure; operates on ToolConfig.

import type { ToolConfig } from '@data/types';

/**
 * True when every related tool shares the SAME family as the source (a single-family bubble).
 * Returns false when the set is empty or has only one item (nothing to diversify).
 */
export function isSingleFamilyBubble(source: ToolConfig, related: ToolConfig[]): boolean {
  if (related.length < 2) return false;
  if (!source.family) return false;
  return related.every(r => r.family !== undefined && r.family === source.family);
}
