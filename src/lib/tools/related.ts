import type { ToolConfig } from '@data/types';

/**
 * How many slots a homogeneous recommendation set gives up to a tool from another family, so a
 * large engine cannot seal its tools into a cluster with no way out.
 *
 * Why one and not two. The four tiers below are a strict cascade with a slice on the end, which
 * means an engine bigger than `max` never gets past tier 1: all eighteen text-processor tools
 * shared a pattern and an engine, so every one of them recommended five more text-processor tools
 * and the link graph became a set of sealed clusters. Measured 2026-08-18, holding back ONE slot
 * takes the single-family bubbles from 42 to 7 and adds 35 cross-family links without adding a
 * single link overall; holding back two fixes nothing further. So one is the whole win, and it
 * leaves four of five slots for the closest siblings, which really are the most useful neighbours.
 *
 * The remaining 7 have no cross-family tool anywhere in their category. That is a fact about the
 * catalog, not a bubble, and `isSingleFamilyBubble` now knows the difference.
 */
const CROSS_FAMILY_SLOTS = 1;

/**
 * The 4-tier cascade, best first: same pattern+engine, same engine, same family, same category.
 *
 * Each tier excludes everything the tiers above it already claimed, tracked in a Set rather than
 * by re-scanning the previous tiers' arrays. The arrays are the obvious way to write this and were
 * how it started, but `tier1.includes(t)` inside a filter over every tool is a linear scan inside a
 * linear scan, and tier 4 paid that three times over. On a catalog where one engine holds a large
 * share of the tools — which is exactly what engine reuse produces — one full pass measured 3.7s at
 * 5,000 tools, and the graph build plus the two per-page callers run that pass four times. Set
 * membership makes the exclusion O(1) and the whole cascade linear in the catalog.
 *
 * Tier order and membership are unchanged; this is a pure performance refactor.
 */
function rankCandidates(currentTool: ToolConfig, allTools: ToolConfig[]): ToolConfig[] {
  const others = allTools.filter(t => t.slug !== currentTool.slug);
  const claimed = new Set<string>();

  const claim = (tier: ToolConfig[]): ToolConfig[] => {
    for (const t of tier) claimed.add(t.slug);
    return tier;
  };

  const tier1 = claim(others.filter(
    t =>
      t.pattern &&
      t.engine &&
      t.pattern === currentTool.pattern &&
      t.engine === currentTool.engine,
  ));

  const tier2 = claim(others.filter(
    t =>
      t.engine &&
      t.engine === currentTool.engine &&
      !claimed.has(t.slug),
  ));

  const tier3 = claim(others.filter(
    t =>
      t.family &&
      t.family === currentTool.family &&
      !claimed.has(t.slug),
  ));

  const tier4 = others.filter(
    t =>
      t.categorySlug === currentTool.categorySlug &&
      !claimed.has(t.slug),
  );

  return [...tier1, ...tier2, ...tier3, ...tier4];
}

/**
 * Related tools, ranked by the 4-tier hierarchy, with a guaranteed door out of the family.
 *
 * The guarantee is skipped when the source has no family, when the set already reaches another
 * family on its own, and when no cross-family candidate exists at all: padding a list with nothing
 * would be worse than a homogeneous one.
 */
export function getRelatedTools(
  currentTool: ToolConfig,
  allTools: ToolConfig[],
  max = 6,
): ToolConfig[] {
  const ranked = rankCandidates(currentTool, allTools);
  if (ranked.length === 0) return curated(currentTool, allTools, max);
  const natural = ranked.slice(0, max);
  if (!currentTool.family || natural.length < 2) return natural;

  // A FLOOR, not a rewrite. A list that already reaches outside the family is left exactly as the
  // tiers ranked it: an earlier version applied the reservation unconditionally and cost 7
  // cross-family links on tools that never had the problem, which is the opposite of the point.
  if (natural.some(t => t.family !== currentTool.family)) return natural;

  const nearestOutsider = ranked.find(t => t.family !== undefined && t.family !== currentTool.family);
  if (!nearestOutsider) return natural;

  // Give up the weakest sibling, not the strongest, so the closest neighbours all survive.
  return [...natural.slice(0, max - CROSS_FAMILY_SLOTS), nearestOutsider];
}

/**
 * The config's own `relatedTools`, used ONLY when all four tiers came back empty.
 *
 * Every tier is scoped to this tool's engine, family or category, so the first tool in a new
 * category has no candidate anywhere and derives an empty list. That page is then a dead end in the
 * internal link graph, which platform-health rightly fails the build over, and nothing the author
 * could write would have fixed it: the derivation had no input to work from.
 *
 * A last resort rather than an override. Where the derivation finds anything at all it still wins,
 * because a hand-written list of neighbours is exactly the thing that goes stale as a catalog
 * grows, and 94 of the configs carrying one predate the derivation entirely.
 */
function curated(currentTool: ToolConfig, allTools: ToolConfig[], max: number): ToolConfig[] {
  const bySlug = new Map(allTools.map((t) => [t.slug, t]));
  return (currentTool.relatedTools ?? [])
    .filter((slug) => slug !== currentTool.slug)
    .map((slug) => bySlug.get(slug))
    .filter((t): t is ToolConfig => t !== undefined)
    .slice(0, max);
}

/** Every tool that could be recommended for `currentTool`, in rank order and unsliced. */
export function relatedCandidates(currentTool: ToolConfig, allTools: ToolConfig[]): ToolConfig[] {
  return rankCandidates(currentTool, allTools);
}

/** Tier rank (1 best) of how `other` relates to `current`, or 0 if unrelated. */
export function relationTier(current: ToolConfig, other: ToolConfig): number {
  if (other.slug === current.slug) return 0;
  if (other.pattern && other.engine && other.pattern === current.pattern && other.engine === current.engine) return 1;
  if (other.engine && other.engine === current.engine) return 2;
  if (other.family && other.family === current.family) return 3;
  if (other.categorySlug === current.categorySlug) return 4;
  return 0;
}

/** Default relationship strength for a derived edge, by tier (pattern→category). */
export function tierStrength(tier: number): number {
  switch (tier) {
    case 1: return 0.9;
    case 2: return 0.6;
    case 3: return 0.4;
    case 4: return 0.2;
    default: return 0;
  }
}

/** Related tools that have a guide, ranked by the same 4-tier hierarchy. */
export function getRelatedGuides(
  currentTool: ToolConfig,
  allTools: ToolConfig[],
  max = 6,
): ToolConfig[] {
  return getRelatedTools(currentTool, allTools.filter(t => t.guide !== undefined), max);
}
