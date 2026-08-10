export interface Category {
  slug: string;
  name: string;
  /**
   * Heading and browser title, when the short `name` is what nav chrome needs but not what the page
   * is about. "Physics" is the right breadcrumb; "Physics Simulations" is what the page holds and
   * what people search for. Falls back to `name` when absent, so most categories set nothing.
   */
  headline?: string;
  description: string;
  /** Short homepage label (aim for under 50 chars). Falls back to the first sentence
   *  of `description`, which is written for the category page's meta and runs long. */
  tagline?: string;
  /** Up to three tool slugs shown as examples on the homepage index, in this order.
   *  They must belong to this category (enforced by validate-registry). Absent means
   *  the homepage falls back to the category's first three tools. */
  highlights?: string[];
  toolCount: number;
  accent?: string;
  segment: string; // short URL path segment used in /tools/[segment]/[slug]/
  engines: string[]; // engine ids this category owns (enables future auto-generated category pages)
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

export type MetricFormatter = 'integer' | 'duration' | 'percentage' | 'decimal';

// Engine/pattern ids are a closed set declared in src/data/engines.ts. Importing the unions here
// (type-only — fully erased at runtime, so no import cycle) turns a typo in a tool's config into a
// compile-time error in the editor instead of a deferred validate-registry failure.
import type { EngineId, PatternId } from './engines';

export interface ToolConfig {
  slug: string;
  name: string;
  seoTitle?: string;
  description: string;
  /**
   * Short on-page line under the tool's title. 40 to 80 characters, so it wraps to one line on a
   * 393px phone.
   *
   * Deliberately separate from `description` rather than a shortening of it. `description` is also
   * the page's <meta name="description">, one of the four slots scripts/check-query-coverage.ts
   * scores query targeting against, so it has to stay long enough to carry the tool's vocabulary.
   * Cutting it for visual reasons would shrink that haystack across all 119 pages and push
   * targeting toward its floor: the visual win would be paid for in rankings.
   *
   * Optional, falling back to `description`, so it can be authored per tool at whatever pace suits.
   * See docs/analysis/2026-08-08-tool-identity-architecture.md (F7, D6).
   */
  tagline?: string;
  categorySlug: string;
  tags: string[];
  isNew?: boolean;
  updatedAt?: string;
  guide?: GuideConfig;
  trustVariant?: 'private' | 'offline' | 'local';
  // Platform metadata — drives related tools, patterns, and future discovery
  engine?: EngineId;         // closed set — see EngineId in src/data/engines.ts
  pattern?: PatternId;       // closed set — see PatternId in src/data/engines.ts
  family?: string;           // e.g. 'text-counting' | 'text-case' | 'transform' | 'cleanup'
  toolGroup?: string;        // unified-workspace group id (src/data/tool-groups.ts) — members share a GroupSwitcher + input state
  processorId?: string;      // engine lookup key — resolved via the engine's registry (process/encode/hash/structured)
  relatedTools?: string[];   // explicit curated related-tool slugs (computed getRelatedTools is the fallback)
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
}
