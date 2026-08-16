// Shared test fixtures for the RIE. Builds a small, deterministic ResearchInputs from inline raw
// opportunities + a tiny catalog, so analyzer/scorer/report suites run without the real registries
// or the filesystem. Mirrors content-intelligence/fixtures.ts.

import type { RawOpportunity, SeedRecord } from './models/provider';
import { seedDatasetProvider } from './providers/seed-dataset/index';
import type { ResearchInputs, CatalogRef } from './types';

export const FIXED_NOW = '2026-01-01T00:00:00.000Z';

/** A complete RawOpportunity from partial fields. */
export function raw(o: Partial<RawOpportunity> & Pick<RawOpportunity, 'proposedTool'>): RawOpportunity {
  return {
    source: 'seed-dataset',
    query: o.proposedTool,
    problem: `problem about ${o.proposedTool}`,
    intent: 'transactional',
    transformation: o.proposedTool,
    proposedEngine: 'text-processor',
    searchQueries: [o.proposedTool],
    existingSolutions: [],
    solutionWeaknesses: [],
    userFailures: [],
    relatedProblems: [],
    relatedTools: [],
    demand: 70,
    competition: 40,
    evergreen: 80,
    difficulty: 'low',
    localization: 70,
    algorithmicFit: 85,
    ...o,
  };
}

/** A SeedRecord from partial fields (for provider tests). */
export function seedRecord(o: Partial<SeedRecord> & Pick<SeedRecord, 'proposedTool'>): SeedRecord {
  return {
    query: o.proposedTool,
    problem: `problem about ${o.proposedTool}`,
    intent: 'transactional',
    transformation: o.proposedTool,
    proposedEngine: 'text-processor',
    searchQueries: [o.proposedTool],
    demand: 70,
    competition: 40,
    difficulty: 'low',
    ...o,
  };
}

export function catalogRef(o: Partial<CatalogRef> & Pick<CatalogRef, 'slug'>): CatalogRef {
  return {
    name: o.slug,
    categorySlug: 'developer-utilities',
    engine: 'text-processor',
    family: 'transform',
    pattern: 'text-transform',
    ...o,
  };
}

export interface FixtureOptions {
  raw: RawOpportunity[];
  catalog?: CatalogRef[];
  existingSlugs?: string[];
  engineIds?: string[];
  knowledgeSlugs?: string[];
  guideSlugs?: string[];
  faqSlugs?: string[];
  now?: string;
}

const DEFAULT_ENGINES = ['text-processor', 'text-analysis', 'encoding', 'hashing', 'structured-data'];

export function makeInputs(opts: FixtureOptions): ResearchInputs {
  return {
    raw: opts.raw,
    catalog: opts.catalog ?? [],
    existingSlugs: new Set(opts.existingSlugs ?? []),
    engineIds: new Set(opts.engineIds ?? DEFAULT_ENGINES),
    knowledgeSlugs: new Set(opts.knowledgeSlugs ?? []),
    guideSlugs: new Set(opts.guideSlugs ?? []),
    faqSlugs: new Set(opts.faqSlugs ?? []),
    now: opts.now ?? FIXED_NOW,
  };
}

export { seedDatasetProvider };
