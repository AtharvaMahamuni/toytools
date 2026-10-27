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
 * public lists go further and keep ONLY the same category (see the relevance floor below); the
 * cross-category half stays in the raw ranking for `relatedCandidates` and the fallbacks.
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
 * Related tools: same category only, ranked by the 4-tier hierarchy, above the relevance floor
 * (with its fallbacks), plus a guaranteed door out of the family.
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
  return relatedFrom(currentTool, allTools, max, registryOrder(allTools));
}

/**
 * The relevance floor (2026-10-27). Related tools stay in the current tool's category, and a
 * same-category tool must also be RELEVANT to be linked: it shares the pattern and engine, the
 * engine or the family (tiers 1 to 3), or the author linked the two in `relatedTools` (either
 * direction). Sharing only the category (tier 4) is below the floor: the Roman numeral converter
 * and the tax calculator are both "number utilities", but nobody converting MCMXCIX wants a tax.
 *
 * Fallback, in order:
 *   1. Fewer than MIN_RELATED tools outside the current tool group clear the floor (group members
 *      are shown by GroupSwitcher, so they do not count): top up with the best below-floor tools from
 *      the same category, most shared name, tag and keyword words first, then tier order, so a page in a small or loosely related category keeps
 *      MIN_RELATED internal links instead of becoming a dead end. They rank after every tool that
 *      cleared the floor.
 *      A top-up must share at least one name, tag or keyword word with the tool. When none does
 *      and nothing outside the group cleared the floor either, exactly ONE tool is taken in tier
 *      order, so every tool page still names one sibling; otherwise fewer named links beat an
 *      unrelated one.
 *   2. The category has no other tool outside this tool's group (a one-tool category, or a
 *      category that is one tool group): the config's `relatedTools`, then its group mates',
 *      wherever they live. This is the ONLY way a link leaves the category, and it exists because
 *      an empty list fails platform-health and orphans the page.
 */
export const MIN_RELATED = 3;

/** True when `other` clears the relevance floor for `current` (tier 1 to 3, or curated). */
export function clearsRelevanceFloor(current: ToolConfig, other: ToolConfig): boolean {
  if (other.slug === current.slug || other.categorySlug !== current.categorySlug) return false;
  const tier = relationTier(current, other);
  if (tier >= 1 && tier <= 3) return true;
  return (current.relatedTools ?? []).includes(other.slug) || (other.relatedTools ?? []).includes(current.slug);
}

/** In-category candidates in rank order: those clearing the floor, then the fallback top-up. */
function inCategoryRanked(currentTool: ToolConfig, allTools: ToolConfig[], order: RegistryOrder): ToolConfig[] {
  const ranked = rankCandidates(currentTool, allTools, order).filter(t => t.categorySlug === currentTool.categorySlug);
  const relevant = ranked.filter(t => clearsRelevanceFloor(currentTool, t));
  const need = MIN_RELATED - relevant.filter(t => !sameGroup(currentTool, t)).length;
  if (need <= 0) return relevant;
  const below = ranked.filter(t => !clearsRelevanceFloor(currentTool, t) && !sameGroup(currentTool, t));
  const visible = relevant.some(t => !sameGroup(currentTool, t));
  if (below.length === 0 && !visible) {
    // Every in-category tool is in this tool's group (or there are none): GroupSwitcher already
    // shows them, so the curated list is the only door out (fallback 2).
    return [...relevant, ...outsideGroupCurated(currentTool, allTools, relevant)];
  }
  // Closest below-floor tools first: most shared name, tag and keyword words, then tier order.
  // A top-up must share at least one word: a tax calculator whose arithmetic siblings are all in
  // its group gets no Roman numeral converter.
  const scored = byOverlap(currentTool, below);
  const sharing = scored.filter(x => x.score > 0);
  const picked = sharing.length > 0 ? sharing.slice(0, need) : visible ? [] : scored.slice(0, 1);
  return [...relevant, ...picked.map(x => x.t)];
}

/**
 * Curated links that leave the group, for a tool whose category is nothing but its group: its own
 * `relatedTools`, then its group mates' (a member that curates only mates still reaches out).
 */
function outsideGroupCurated(currentTool: ToolConfig, allTools: ToolConfig[], already: ToolConfig[]): ToolConfig[] {
  const bySlug = new Map(allTools.map(t => [t.slug, t]));
  const seen = new Set([currentTool.slug, ...already.map(t => t.slug)]);
  const sources = [currentTool, ...allTools.filter(t => t !== currentTool && sameGroup(currentTool, t))];
  const out: ToolConfig[] = [];
  for (const src of sources) {
    for (const slug of src.relatedTools ?? []) {
      const t = bySlug.get(slug);
      if (!t || seen.has(slug) || sameGroup(currentTool, t)) continue;
      seen.add(slug);
      out.push(t);
    }
  }
  return out.slice(0, MIN_RELATED);
}

/** Below-floor candidates scored by shared words, best first, ties kept in tier order. */
function byOverlap(currentTool: ToolConfig, below: ToolConfig[]): { t: ToolConfig; score: number }[] {
  const mine = vocabulary(currentTool);
  const scored = below.map((t, i) => ({ t, i, score: [...vocabulary(t)].filter(w => mine.has(w)).length }));
  scored.sort((a, b) => b.score - a.score || a.i - b.i);
  return scored;
}

/** Words too generic to signal a shared job. */
const GENERIC_WORDS = new Set([
  'a', 'an', 'and', 'the', 'to', 'of', 'for', 'in', 'on', 'by', 'or', 'vs', 'with', 'from', 'how',
  'what', 'is', 'my', 'your', 'online', 'free', 'tool', 'tools', 'calculator', 'converter',
  'generator', 'counter', 'checker', 'tracker', 'maker', 'text', 'numbers', 'number', 'math',
  'calculate', 'convert', 'best',
]);

/** Lowercase name, tag and keyword words of a tool, minus generic ones. */
function vocabulary(t: ToolConfig): Set<string> {
  const words = [t.name, ...(t.tags ?? []), ...(t.keywords ?? [])].join(' ').toLowerCase().split(/[^a-z0-9]+/);
  return new Set(words.filter(w => w.length > 1 && !GENERIC_WORDS.has(w)));
}

/** Group members are shown by GroupSwitcher, so they never count towards MIN_RELATED. */
function sameGroup(a: ToolConfig, b: ToolConfig): boolean {
  return a.toolGroup !== undefined && a.toolGroup === b.toolGroup;
}

function relatedFrom(
  currentTool: ToolConfig,
  allTools: ToolConfig[],
  max: number,
  order: RegistryOrder,
): ToolConfig[] {
  const ranked = inCategoryRanked(currentTool, allTools, order);
  if (ranked.length === 0) return curated(currentTool, allTools, max);
  const natural = ranked.slice(0, max);
  if (!currentTool.family || natural.length < 2) return natural;

  // A FLOOR, not a rewrite. A list that already reaches outside the family is left exactly as the
  // tiers ranked it: an earlier version applied the reservation unconditionally and cost 7
  // cross-family links on tools that never had the problem, which is the opposite of the point.
  if (natural.some(t => t.family !== currentTool.family)) return natural;

  // The door out of the family stays inside the category: the nearest outsider in the ranked list,
  // else the below-floor same-category outsider sharing the most words (never one sharing none).
  const outsider = (t: ToolConfig) => t.family !== undefined && t.family !== currentTool.family;
  const nearestOutsider = ranked.find(outsider) ?? byOverlap(currentTool, rankCandidates(currentTool, allTools, order)
    .filter(t => t.categorySlug === currentTool.categorySlug && outsider(t) && !ranked.includes(t)))
    .find(x => x.score > 0)?.t;
  if (!nearestOutsider) return natural;

  // Give up the weakest sibling, not the strongest, so the closest neighbours all survive.
  return [...natural.slice(0, max - CROSS_FAMILY_SLOTS), nearestOutsider];
}

/** Which rule produced a tool's list: the floor alone, the in-category top-up, or curated. */
export function relatedSource(currentTool: ToolConfig, allTools: ToolConfig[]): 'floor' | 'top-up' | 'curated' {
  const ranked = rankCandidates(currentTool, allTools).filter(t => t.categorySlug === currentTool.categorySlug);
  if (ranked.length === 0) return 'curated';
  const relevant = ranked.filter(t => clearsRelevanceFloor(currentTool, t) && !sameGroup(currentTool, t)).length;
  const belowFloor = ranked.some(t => !clearsRelevanceFloor(currentTool, t) && !sameGroup(currentTool, t));
  return relevant < MIN_RELATED && belowFloor ? 'top-up' : 'floor';
}

/**
 * The config's own `relatedTools`, used ONLY when the category has no other tool at all.
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
  // Rotate by the position in the FULL list, so a tool without a guide still pivots at its own
  // place in the registry instead of falling back to the start of the guide-only list.
  return relatedFrom(currentTool, allTools.filter(t => t.guide !== undefined), max, registryOrder(allTools));
}
