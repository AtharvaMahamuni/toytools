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
