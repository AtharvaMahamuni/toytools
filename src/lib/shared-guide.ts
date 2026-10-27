// sharedGuide: a guideless tool links to a hub guide hosted by a sibling in its tool group.
// Pure helpers so ToolPage, validate-registry and the unit tests share one rule.

export interface GuideToolLike {
  slug: string;
  guide?: { title?: string } | undefined;
  sharedGuide?: string;
  toolGroup?: string;
}

/** The tool whose guide this tool links to: itself, its sharedGuide host, or none. */
export function resolveGuideHost<T extends GuideToolLike>(tool: T, lookup: (slug: string) => T | undefined): T | undefined {
  if (tool.guide) return tool;
  if (!tool.sharedGuide) return undefined;
  const host = lookup(tool.sharedGuide);
  return host?.guide ? host : undefined;
}

/** Problems with a tool's sharedGuide declaration; empty when valid or unset. */
export function sharedGuideErrors(tool: GuideToolLike, tools: readonly GuideToolLike[]): string[] {
  if (tool.sharedGuide === undefined) return [];
  const errors: string[] = [];
  const host = tools.find(t => t.slug === tool.sharedGuide);
  if (tool.guide) errors.push(`Tool "${tool.slug}" sets both guide and sharedGuide: keep one`);
  if (tool.sharedGuide === tool.slug) errors.push(`Tool "${tool.slug}" sharedGuide points at itself`);
  else if (!host) errors.push(`Tool "${tool.slug}" sharedGuide "${tool.sharedGuide}" is not a tool`);
  else if (!host.guide) errors.push(`Tool "${tool.slug}" sharedGuide "${tool.sharedGuide}" has no guide of its own`);
  else if (!tool.toolGroup || host.toolGroup !== tool.toolGroup) {
    errors.push(`Tool "${tool.slug}" sharedGuide "${tool.sharedGuide}" must be in the same tool group`);
  }
  return errors;
}
