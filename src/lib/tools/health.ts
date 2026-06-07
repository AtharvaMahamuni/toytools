import type { ToolConfig } from '@data/types';
import { getRelatedTools } from './related';

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
export function getToolHealth(tool: ToolConfig, allTools: ToolConfig[]): ToolHealth {
  return {
    slug: tool.slug,
    hasTool: true,
    hasGuide: tool.guide !== undefined,
    hasFAQ: tool.faq !== undefined,
    hasRelatedTools: getRelatedTools(tool, allTools, 1).length > 0,
    hasMetadata: Boolean(tool.engine && tool.pattern && tool.family),
    hasStructuredData: true,
  };
}

export function getAllToolHealth(allTools: ToolConfig[]): ToolHealth[] {
  return allTools.map(t => getToolHealth(t, allTools));
}
