// Research Intelligence Engine (RIE) — shared enums and stable string unions.
// Closed sets live here so typos in seed data / providers are caught at compile time, mirroring
// the engine/pattern unions in src/data/engines.ts. Never edit a validator to add a value — add it
// here and the type system + validators follow.

/** Bump when any report shape changes; stamped on every report bundle so schemas evolve cleanly. */
export const RESEARCH_SCHEMA_VERSION = 2;

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

/**
 * Structural silences the latent-demand analyzer derives from the catalog ALONE - no queries, no
 * seed evidence, nobody having thought of the tool first. Each names a shape of hole rather than a
 * hole: the analyzer finds the instances.
 *
 * - `asymmetry`     - an engine that PRODUCES artifacts and cannot CHECK any of them. The purest
 *                     latent need there is: you cannot search for a checker while you still believe
 *                     your output is correct.
 * - `dead-end`      - a format the catalog can emit but nothing anywhere can consume. Whatever the
 *                     user does with it next, they do off-site and by hand.
 * - `handoff`       - two engines whose output/input types meet, with no tool spanning the join.
 *                     Users bridge it with the clipboard, which is a workflow nobody names.
 * - `unserved-failure` - a task-level failure recorded in the datasets whose remedy is a different
 *                     transformation than the tool it was recorded against performs.
 */
export const LATENT_SIGNAL_KINDS = ['asymmetry', 'dead-end', 'handoff', 'unserved-failure'] as const;
export type LatentSignalKind = (typeof LATENT_SIGNAL_KINDS)[number];

/** Lifecycle of a latent candidate. `unanchored` is the guardrail verdict, not a failure state. */
export const LATENT_STATUSES = ['candidate', 'unanchored', 'already-exists'] as const;
export type LatentStatus = (typeof LATENT_STATUSES)[number];
