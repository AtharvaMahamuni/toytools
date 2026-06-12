import type { ToolConfig } from '@data/types';

export function getRelatedTools(
  currentTool: ToolConfig,
  allTools: ToolConfig[],
  max = 6,
): ToolConfig[] {
  const others = allTools.filter(t => t.slug !== currentTool.slug);

  const tier1 = others.filter(
    t =>
      t.pattern &&
      t.engine &&
      t.pattern === currentTool.pattern &&
      t.engine === currentTool.engine,
  );

  const tier2 = others.filter(
    t =>
      t.engine &&
      t.engine === currentTool.engine &&
      !tier1.includes(t),
  );

  const tier3 = others.filter(
    t =>
      t.family &&
      t.family === currentTool.family &&
      !tier1.includes(t) &&
      !tier2.includes(t),
  );

  const tier4 = others.filter(
    t =>
      t.categorySlug === currentTool.categorySlug &&
      !tier1.includes(t) &&
      !tier2.includes(t) &&
      !tier3.includes(t),
  );

  return [...tier1, ...tier2, ...tier3, ...tier4].slice(0, max);
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
