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

/** Each tool's position in the registry list the caller passed, by slug. */
type RegistryOrder = ReadonlyMap<string, number>;

function registryOrder(allTools: ToolConfig[]): RegistryOrder {
  return new Map(allTools.map((t, i) => [t.slug, i]));
}

/**
 * The order of one tier: same-category candidates first, and each of the two halves rotated so it
 * starts at the first candidate AFTER the current tool in registry order, wrapping round to the
 * start (SEO GEO audit 2026-10-05, item 19).
 *
 * Why. Every tier used to keep plain registry order and the callers slice the front of it, so the
 * first few tools of a large tier (alphabetically early slugs, plus the simulations, which come
 * first in the registry) filled every sibling's related rows, and the rest of the tier was never
 * linked from anywhere (the audit, measured on 8431902: 13 guides with no peer inbound link, 28
 * ungrouped tools in no related row). Starting each tool's list just after itself spreads the
 * slots across the whole tier, and each tool links its nearest registry neighbours, so every tier
 * member is reached by the tools just before it.
 *
 * Same category first because a tier is defined by engine, pattern or family, and those cross
 * categories (the `encoding` engine holds developer encoders and number converters alike). The
 * public lists go further and keep ONLY the same category (see the relevance floor below).
 *
 * Deterministic by construction: the only inputs are the registry order (a generated, slug-sorted
 * list after the static simulation manifest list) and the current tool, so the same commit always
 * renders the same rows. No randomness, no dates, no build-machine state.
 *
 * Membership of every tier is unchanged; only the order inside it moves. Tier order is unchanged.
 */
function orderTier(currentTool: ToolConfig, tier: ToolConfig[], order: RegistryOrder): ToolConfig[] {
  const pivot = order.get(currentTool.slug) ?? -1;
  const indexOf = (t: ToolConfig) => order.get(t.slug) ?? Number.MAX_SAFE_INTEGER;
  const rotate = (list: ToolConfig[]): ToolConfig[] => {
    const sorted = [...list].sort((a, b) => indexOf(a) - indexOf(b));
    const start = sorted.findIndex(t => indexOf(t) > pivot);
    return start <= 0 ? sorted : [...sorted.slice(start), ...sorted.slice(0, start)];
  };
  const sameCategory = tier.filter(t => t.categorySlug === currentTool.categorySlug);
  const otherCategory = tier.filter(t => t.categorySlug !== currentTool.categorySlug);
  return [...rotate(sameCategory), ...rotate(otherCategory)];
}

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
 * Tier order and membership are unchanged by the Set refactor. What changes inside a tier is the
 * ORDER, through `orderTier` below (2026-10-05, SEO GEO audit item 19).
 */
function rankCandidates(
  currentTool: ToolConfig,
  allTools: ToolConfig[],
  order: RegistryOrder = registryOrder(allTools),
): ToolConfig[] {
  const others = allTools.filter(t => t.slug !== currentTool.slug);
  const claimed = new Set<string>();

  const claim = (tier: ToolConfig[]): ToolConfig[] => {
    for (const t of tier) claimed.add(t.slug);
    return orderTier(currentTool, tier, order);
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

  const tier4 = orderTier(currentTool, others.filter(
    t =>
      t.categorySlug === currentTool.categorySlug &&
      !claimed.has(t.slug),
  ), order);

  return [...tier1, ...tier2, ...tier3, ...tier4];
}

/**
 * Related tools: same-category tools above the relevance floor, ranked by the 4-tier hierarchy,
 * plus a door out of the family when an eligible one exists.
 *
 * The door is skipped when the source has no family, when the set already reaches another family on
 * its own, and when no eligible cross-family candidate exists: the door never lowers the floor.
 */
export function getRelatedTools(
  currentTool: ToolConfig,
  allTools: ToolConfig[],
  max = 6,
): ToolConfig[] {
  return relatedFrom(currentTool, allTools, max, registryOrder(allTools));
}

/**
 * The relevance floor (2026-10-27). Automatic related tools stay in the current tool's category, and
 * a same-category tool must also be RELEVANT to be linked: it shares the pattern and engine, the
 * engine or the family (tiers 1 to 3), or the author linked the two in `relatedTools` (either
 * direction). Sharing only the category (tier 4) is below the floor: the Roman numeral converter and
 * the tax calculator are both "number utilities", but nobody converting MCMXCIX wants a tax.
 *
 * No automatic fallback: a weak or automatic out-of-category link is worse than a short row. A tool
 * whose category is thin gets its links from its own `relatedTools` override, hand-picked and
 * explicit, which may name a tool in another category. Every tool has at least MIN_RELATED links
 * outside its group, pinned by a test; a thin tool fixes that with an override, never in code.
 */
export const MIN_RELATED = 2;

export function clearsRelevanceFloor(current: ToolConfig, other: ToolConfig): boolean {
  if (other.slug === current.slug || other.categorySlug !== current.categorySlug) return false;
  const tier = relationTier(current, other);
  if (tier >= 1 && tier <= 3) return true;
  return (current.relatedTools ?? []).includes(other.slug) || (other.relatedTools ?? []).includes(current.slug);
}

/**
 * Eligible candidates in rank order: same-category tools above the relevance floor, then the tool's
 * own hand-picked `relatedTools` that are not already in (the explicit override, the ONLY way a
 * link leaves the category). Nothing is ever filled in automatically from another category.
 */
function eligible(currentTool: ToolConfig, allTools: ToolConfig[], order: RegistryOrder): ToolConfig[] {
  const floor = rankCandidates(currentTool, allTools, order).filter(t => clearsRelevanceFloor(currentTool, t));
  const seen = new Set(floor.map(t => t.slug));
  const bySlug = new Map(allTools.map(t => [t.slug, t]));
  const overrides: ToolConfig[] = [];
  for (const slug of currentTool.relatedTools ?? []) {
    const t = bySlug.get(slug);
    if (!t || t.slug === currentTool.slug || seen.has(slug)) continue;
    seen.add(slug);
    overrides.push(t);
  }
  return [...floor, ...overrides];
}

/** True when `other` is in `current`'s own hand-picked `relatedTools` override. */
export function isOverride(current: ToolConfig, other: ToolConfig): boolean {
  return other.slug !== current.slug && (current.relatedTools ?? []).includes(other.slug);
}

function relatedFrom(
  currentTool: ToolConfig,
  allTools: ToolConfig[],
  max: number,
  order: RegistryOrder,
): ToolConfig[] {
  const ranked = eligible(currentTool, allTools, order);
  const natural = ranked.slice(0, max);
  if (!currentTool.family || natural.length < 2) return natural;

  // A FLOOR, not a rewrite. A list that already reaches outside the family is left exactly as the
  // tiers ranked it: an earlier version applied the reservation unconditionally and cost 7
  // cross-family links on tools that never had the problem, which is the opposite of the point.
  if (natural.some(t => t.family !== currentTool.family)) return natural;

  // The door out of the family: the nearest eligible outsider (same category, above the floor).
  // None means none: the door never lowers the floor.
  const nearestOutsider = ranked.find(t => t.family !== undefined && t.family !== currentTool.family);
  if (!nearestOutsider) return natural;

  // Give up the weakest sibling, not the strongest, so the closest neighbours all survive.
  return [...natural.slice(0, max - CROSS_FAMILY_SLOTS), nearestOutsider];
}

/**
 * Every tool that could be recommended for `currentTool`, in rank order and unsliced: the
 * same-category tools above the relevance floor. validate-knowledge reads this to decide whether a
 * one-family row had an outsider available, so a bubble is only an error when an ELIGIBLE tool from
 * another family existed and the door missed it, never because a below-floor tool was skipped.
 */
export function eligibleCandidates(currentTool: ToolConfig, allTools: ToolConfig[]): ToolConfig[] {
  return eligible(currentTool, allTools, registryOrder(allTools));
}

/** The raw 4-tier ranking, every other tool in rank order, unsliced and unfiltered. */
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
  // Rotate by the position in the FULL list, so a tool without a guide still pivots at its own
  // place in the registry instead of falling back to the start of the guide-only list.
  return relatedFrom(currentTool, allTools.filter(t => t.guide !== undefined), max, registryOrder(allTools));
}
