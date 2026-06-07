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
  description?: string;
}

export type MetricFormatter = 'integer' | 'duration' | 'percentage' | 'decimal';

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
  // Platform metadata — drives related tools, patterns, and future discovery
  engine?: string;           // e.g. 'text-analysis'
  pattern?: string;          // e.g. 'text-metric' | 'text-transform'
  family?: string;           // e.g. 'text-counting' | 'text-case'
  keywords?: string[];       // extra search/command-palette terms (architecture metadata, not SEO copy)
  inputs?: string[];         // descriptor of input types, e.g. ['text'] | ['number','number']
  outputs?: string[];        // descriptor of output types, e.g. ['metric'] | ['text']
  primaryMetric?: {
    metric: string;
    label: string;
    formatter: MetricFormatter;
  };
  status?: 'stable' | 'beta';
  relatedPriority?: number;  // manual sort override for related tools
}

// Backward-compat alias — existing consumers (ToolCard, ToolLayout, search, etc.) use Tool with no changes
export type Tool = ToolConfig;

// Backward-compat structural alias for FAQLayout/GuideLayout entry props
export interface EcosystemEntry {
  guide?: GuideConfig;
  faq?: FaqConfig;
}
