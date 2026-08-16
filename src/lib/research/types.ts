// Shared analyzer input contract (mirrors content-intelligence/types.ts AnalyzerInputs). Every
// analyzer and scorer is a pure function over ResearchInputs — it never reads module globals, so the
// whole pipeline is testable with fixtures and deterministic given a fixed `now`.

import type { RawOpportunity } from './models/provider';

/** A lightweight reference to an existing catalog tool, for cross-linking + engine reuse. */
export interface CatalogRef {
  slug: string;
  name: string;
  categorySlug: string;
  engine: string;
  family: string;
  /** Registry pattern (e.g. 'encode-decode'). The latent-demand analyzer reads producer/verifier
   *  intent straight off it, so it must come from the registry rather than be inferred from a slug. */
  pattern: string;
}

export interface ResearchInputs {
  /** Discovered raw opportunities from all providers (CLI runs discovery; tests pass directly). */
  raw: RawOpportunity[];
  /** Slugs of tools already in the catalog. */
  existingSlugs: Set<string>;
  /** Registered engine ids (from src/data/engines.ts) — drives engineReuse + missing-engine. */
  engineIds: Set<string>;
  /** Existing catalog tools for problem-graph cross-links. */
  catalog: CatalogRef[];
  /** Tools that have a knowledge file / guide / FAQ (for gap analysis + content suggestions). */
  knowledgeSlugs: Set<string>;
  guideSlugs: Set<string>;
  faqSlugs: Set<string>;
  /** Fixed ISO timestamp so report output is byte-stable across runs in a given invocation. */
  now: string;
}
