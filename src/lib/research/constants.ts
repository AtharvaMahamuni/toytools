// Research Intelligence Engine (RIE) — shared enums and stable string unions.
// Closed sets live here so typos in seed data / providers are caught at compile time, mirroring
// the engine/pattern unions in src/data/engines.ts. Never edit a validator to add a value — add it
// here and the type system + validators follow.

/** Bump when any report shape changes; stamped on every report bundle so schemas evolve cleanly. */
export const RESEARCH_SCHEMA_VERSION = 1;

/** Every research source. The seed-dataset provider is the only one implemented; the rest are
 *  documented live-API seams that conform to the same interface and return [] until wired. */
export const PROVIDER_IDS = [
  'seed-dataset',
  'autocomplete',
  'people-also-ask',
  'related-searches',
  'search-console',
  'reddit',
  'github',
  'stackoverflow',
  'hackernews',
  'producthunt',
  'competitor',
  'documentation',
  'mdn',
  'npm',
  'w3c',
  'browser-apis',
] as const;
export type ProviderId = (typeof PROVIDER_IDS)[number];

/** Search intent behind a discovered problem. */
export const INTENT_KINDS = [
  'informational',
  'howTo',
  'comparison',
  'troubleshooting',
  'transactional',
] as const;
export type IntentKind = (typeof INTENT_KINDS)[number];

/** Lifecycle status of an opportunity as it flows through the pipeline. */
export const OPPORTUNITY_STATUSES = [
  'discovered',
  'duplicate',
  'already-exists',
  'recommended',
  'roadmap',
  'rejected',
] as const;
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];

/** Estimated implementation difficulty (drives the implementation-cost scorer). */
export const DIFFICULTIES = ['low', 'medium', 'high'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** How a discovered opportunity maps onto the current ToyTools catalog (gap analysis). */
export const GAP_KINDS = [
  'already-exists',
  'needs-improvement',
  'guide-missing',
  'faq-missing',
  'engine-missing',
  'category-missing',
  'cluster-missing',
  'internal-linking-missing',
  'seo-gap',
  'knowledge-gap',
  'ux-gap',
] as const;
export type GapKind = (typeof GAP_KINDS)[number];

/** Roadmap tiers the roadmap analyzer buckets opportunities into. */
export const ROADMAP_TIERS = ['immediate', 'quick-win', 'roadmap', 'long-term'] as const;
export type RoadmapTier = (typeof ROADMAP_TIERS)[number];
