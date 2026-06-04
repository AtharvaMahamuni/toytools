export interface Category {
  slug: string;
  name: string;
  description: string;
  toolCount: number;
  accent?: string;
  segment: string; // short URL path segment used in /tools/[segment]/[slug]/
}

export interface FAQItem {
  id: string;       // anchor-safe slug, e.g. "b64-faq-1"
  question: string;
  answer: string;
}

export interface GuideConfig {
  slug: string;
  categorySlug: string; // URL segment, e.g. "productivity"
  title: string;
  description: string;
  readMinutes: number;
  updatedAt: string;    // display string, e.g. "Jun 2026"
}

export interface FaqConfig {
  slug: string;
  categorySlug: string;
}

export interface ToolConfig {
  slug: string;
  name: string;
  seoTitle?: string;
  description: string;
  categorySlug: string;
  tags: string[];
  isNew?: boolean;
  updatedAt?: string;
  guide?: GuideConfig;
  faq?: FaqConfig;
}

// Backward-compat alias — existing consumers (ToolCard, ToolLayout, search, etc.) use Tool with no changes
export type Tool = ToolConfig;

// Backward-compat structural alias for FAQLayout/GuideLayout entry props
export interface EcosystemEntry {
  guide?: GuideConfig;
  faq?: FaqConfig;
}
