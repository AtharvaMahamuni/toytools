// Platform Metadata Contract — the single, engine-agnostic view of a tool that platform
// services (search, sitemaps, related content, SEO) consume. ToolConfig keeps its own
// field names (categorySlug, guide object); getToolMetadata derives the uniform
// contract from it so no config needs rewriting and no second metadata system exists.

import type { ToolConfig } from './types';
import { tools } from './registry';

export interface BaseToolMetadata {
  slug: string;
  name: string;
  description: string;
  category: string;        // resolved category slug
  engine: string;
  pattern: string;
  family: string;
  keywords: string[];
  tags: string[];
  relatedTools: string[];
  guideSlug?: string;
  updatedAt?: string;
}

/** Derive the platform metadata contract from a tool config. */
export function getToolMetadata(tool: ToolConfig): BaseToolMetadata {
  return {
    slug: tool.slug,
    name: tool.name,
    description: tool.description,
    category: tool.categorySlug,
    engine: tool.engine ?? '',
    pattern: tool.pattern ?? '',
    family: tool.family ?? '',
    keywords: tool.keywords ?? [],
    tags: tool.tags ?? [],
    relatedTools: tool.relatedTools ?? [],
    guideSlug: tool.guide?.slug,
    updatedAt: tool.updatedAt,
  };
}

/** Metadata for every registered tool. */
export function getAllMetadata(): BaseToolMetadata[] {
  return tools.map(getToolMetadata);
}
