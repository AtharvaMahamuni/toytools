import type { ToolConfig } from '@data/types';
import { faqsByToolSlug } from '@data/faq-registry';
import { getRelatedTools } from './related';

// FAQ content lives on the tool page, registered per-slug in faq-registry.
const defaultFaqSlugs = new Set(
  Object.keys(faqsByToolSlug).filter(s => (faqsByToolSlug[s]?.length ?? 0) > 0),
);

export interface ToolHealth {
  slug: string;
  hasTool: boolean;
  hasGuide: boolean;
  hasFAQ: boolean;
  hasRelatedTools: boolean;
  hasMetadata: boolean;
  hasStructuredData: boolean;
}

// Build-time health snapshot for a tool. Infrastructure only — no UI, no scoring.
// Groundwork for a future Quality Guardian. `hasStructuredData` is true for every
// tool because ToolLayout always emits SoftwareApplication + Breadcrumb JSON-LD.
export function getToolHealth(
  tool: ToolConfig,
  allTools: ToolConfig[],
  faqSlugs: Set<string> = defaultFaqSlugs,
): ToolHealth {
  return {
    slug: tool.slug,
    hasTool: true,
    hasGuide: tool.guide !== undefined,
    hasFAQ: faqSlugs.has(tool.slug),
    hasRelatedTools: getRelatedTools(tool, allTools, 1).length > 0,
    hasMetadata: Boolean(tool.engine && tool.pattern && tool.family),
    hasStructuredData: true,
  };
}

export function getAllToolHealth(allTools: ToolConfig[]): ToolHealth[] {
  return allTools.map(t => getToolHealth(t, allTools));
}
