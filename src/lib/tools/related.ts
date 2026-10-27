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
 * Related tools: same-category tools above the relevance floor, ranked by the 4-tier hierarchy,
 * filled to MIN_RELATED from strong matches only, plus a guaranteed door out of the family.
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
 * The relevance floor (2026-10-27). A same-category tool is linked only when it is RELEVANT: it
 * shares the pattern and engine, the engine or the family (tiers 1 to 3), or the author linked the
 * two in `relatedTools` (either direction). Sharing only the category (tier 4), or only a word, is
 * below the floor: the Roman numeral converter and the tax calculator are both "number utilities",
 * but nobody converting MCMXCIX wants a tax.
 *
 * Every tool shows at least MIN_RELATED links outside its own tool group (GroupSwitcher shows the
 * group). When the floor gives fewer, the list is filled from STRONG matches only, closest first:
 *   1. the tool's own `relatedTools`, wherever they live;
 *   2. a shared pattern, engine or family in another category (`isStrongMatch`);
 *   3. the strong matches of its group mates, then their `relatedTools` (one group, one job);
 *   4. second degree: tools hand- or family-linked to two of its neighbours, or to one when the
 *      tool is in another category (`secondDegree`).
 * Last resort, never reached on the live catalog: a tool with no strong match anywhere names its
 * nearest same-category sibling so a new page is not an orphan. `linkReason` explains any link.
 */
export const MIN_RELATED = 3;

/** True when `other` clears the relevance floor for `current` (tier 1 to 3, or curated). */
export function clearsRelevanceFloor(current: ToolConfig, other: ToolConfig): boolean {
  if (other.slug === current.slug || other.categorySlug !== current.categorySlug) return false;
  const tier = relationTier(current, other);
  if (tier >= 1 && tier <= 3) return true;
  return (current.relatedTools ?? []).includes(other.slug) || (other.relatedTools ?? []).includes(current.slug);
}

/** True when `other` is a STRONG match for `current` in any category: tier 1 to 3, or curated. */
export function isStrongMatch(current: ToolConfig, other: ToolConfig): boolean {
  if (other.slug === current.slug) return false;
  const tier = relationTier(current, other);
  if (tier >= 1 && tier <= 3) return true;
  return (current.relatedTools ?? []).includes(other.slug) || (other.relatedTools ?? []).includes(current.slug);
}

/**
 * Candidates in rank order: same-category tools above the floor, then (only while fewer than
 * MIN_RELATED are visible) strong matches from other categories, closest first, then curated
 * links of the tool group. Category-only and word-only matches are never used.
 */
function inCategoryRanked(currentTool: ToolConfig, allTools: ToolConfig[], order: RegistryOrder): ToolConfig[] {
  const rank = rankCandidates(currentTool, allTools, order);
  const relevant = rank.filter(t => clearsRelevanceFloor(currentTool, t));
  const out = [...relevant];
  const visibleCount = () => out.filter(t => !sameGroup(currentTool, t)).length;
  if (visibleCount() >= MIN_RELATED) return out;
  const seen = new Set(out.map(t => t.slug));
  const add = (t: ToolConfig) => {
    if (visibleCount() >= MIN_RELATED || seen.has(t.slug) || t.slug === currentTool.slug || sameGroup(currentTool, t)) return;
    seen.add(t.slug);
    out.push(t);
  };
  // Curated neighbours first (the author's own choice), then shared pattern, engine, family.
  for (const t of curated(currentTool, allTools, Number.MAX_SAFE_INTEGER)) add(t);
  for (const t of rank) if (isStrongMatch(currentTool, t)) add(t);
  for (const t of outsideGroupCurated(currentTool, allTools, out)) add(t);
  // A group mate's strong matches: the group is one job, so its members' neighbours are ours.
  const mates = allTools.filter(t => t !== currentTool && sameGroup(currentTool, t));
  for (const m of mates) for (const t of rankCandidates(m, allTools, order)) if (isStrongMatch(m, t)) add(t);
  if (visibleCount() < MIN_RELATED) for (const t of secondDegree(currentTool, allTools, order)) add(t);
  // Last resort, never reached on the live catalog (pinned by a test): a tool with no strong match
  // at all names its nearest same-category sibling, so a new page is never an orphan.
  if (out.length === 0) {
    const sibling = rank.find(t => t.categorySlug === currentTool.categorySlug && !sameGroup(currentTool, t));
    if (sibling) out.push(sibling);
  }
  return out;
}

/**
 * Neighbours of neighbours: tools strongly linked to at least TWO of this tool's strong matches
 * (group mates and their curated links included), most paths first, then shared words, then rank order. Two paths, not
 * one, so a single loose bridge (a calculator to a number converter) cannot carry a link alone.
 */
function secondDegree(currentTool: ToolConfig, allTools: ToolConfig[], order: RegistryOrder): ToolConfig[] {
  const hubs = [
    ...allTools.filter(t => isStrongMatch(currentTool, t) || (t !== currentTool && sameGroup(currentTool, t))),
    ...outsideGroupCurated(currentTool, allTools, []),
  ];
  const mine = vocabulary(currentTool);
  const rank = rankCandidates(currentTool, allTools, order);
  const pos = new Map(rank.map((t, i) => [t.slug, i]));
  return allTools
    .filter(t => t !== currentTool && !sameGroup(currentTool, t) && !isStrongMatch(currentTool, t))
    .map(t => ({ t, paths: hubs.filter(h => h !== t && bridges(h, t)).length, words: [...vocabulary(t)].filter(w => mine.has(w)).length }))
    .filter(x => x.paths >= 2 || (x.paths === 1 && x.t.categorySlug !== currentTool.categorySlug))
    .sort((a, b) => b.paths - a.paths || b.words - a.words || (pos.get(a.t.slug) ?? 1e9) - (pos.get(b.t.slug) ?? 1e9))
    .map(x => x.t);
}

/**
 * A path for `secondDegree`: an author link either way, or one family. A shared engine is not
 * enough on its own here: the `generation` engine joins dice rollers and QR codes.
 */
function bridges(a: ToolConfig, b: ToolConfig): boolean {
  if ((a.relatedTools ?? []).includes(b.slug) || (b.relatedTools ?? []).includes(a.slug)) return true;
  return a.family !== undefined && a.family === b.family;
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
  const natural = ranked.slice(0, max);
  if (!currentTool.family || natural.length < 2) return natural;

  // A FLOOR, not a rewrite. A list that already reaches outside the family is left exactly as the
  // tiers ranked it: an earlier version applied the reservation unconditionally and cost 7
  // cross-family links on tools that never had the problem, which is the opposite of the point.
  if (natural.some(t => t.family !== currentTool.family)) return natural;

  // The door out of the family is a strong match too: the nearest outsider in the ranked list, else
  // a strong outsider anywhere (shared engine or pattern, or hand-linked), else a second-degree one.
  // validate-knowledge fails the build on a single-family bubble, so the last slot is spent on it.
  const outsider = (t: ToolConfig) => t.family !== undefined && t.family !== currentTool.family;
  const strongPool = [...rankCandidates(currentTool, allTools, order), ...allTools.filter(t => isStrongMatch(currentTool, t))];
  const nearestOutsider = ranked.find(outsider) ?? strongPool
    .find(t => outsider(t) && !ranked.includes(t) && isStrongMatch(currentTool, t))
    ?? secondDegree(currentTool, allTools, order).find(t => outsider(t) && !ranked.includes(t));
  if (!nearestOutsider) return natural;

  // Give up the weakest sibling, not the strongest, so the closest neighbours all survive.
  return [...natural.slice(0, max - CROSS_FAMILY_SLOTS), nearestOutsider];
}

export type LinkReason = 'floor' | 'strong' | 'group' | 'second-degree' | 'last-resort';

/**
 * Why `other` may appear in `current`'s list, or null when nothing justifies it. Tests run this on
 * every link of every tool; the report counts tools by their weakest reason.
 */
export function linkReason(current: ToolConfig, other: ToolConfig, allTools: ToolConfig[]): LinkReason | null {
  if (other.slug === current.slug) return null;
  if (clearsRelevanceFloor(current, other)) return 'floor';
  if (isStrongMatch(current, other)) return 'strong';
  const mates = allTools.filter(t => t !== current && sameGroup(current, t));
  if (sameGroup(current, other)) return 'group';
  if (mates.some(m => isStrongMatch(m, other)) || outsideGroupCurated(current, allTools, []).some(t => t.slug === other.slug)) return 'group';
  if (secondDegree(current, allTools, registryOrder(allTools)).some(t => t.slug === other.slug)) return 'second-degree';
  return 'last-resort';
}

/**
 * The config's own `relatedTools`: the first fill when the floor gives fewer than MIN_RELATED.
 *
 * Every tier is scoped to this tool's engine, family or category, so the first tool in a new
 * category has no candidate anywhere and derives an empty list. That page is then a dead end in the
 * internal link graph, which platform-health rightly fails the build over, and nothing the author
 * could write would have fixed it: the derivation had no input to work from.
 *
 * A fill rather than an override. Whatever clears the floor still ranks first, because a hand-written list of neighbours is exactly the thing that goes stale as a catalog
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
