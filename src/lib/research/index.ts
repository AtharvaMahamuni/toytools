// Research Intelligence Engine — public entry point. `catalogInputs()` derives the catalog-side of
// ResearchInputs from the real registries (pure, no filesystem). `defaultInputs()` runs every
// registered provider over the supplied seed datasets and merges in the catalog side. The CLI
// (scripts/research.ts) reads research/datasets/*.json and calls these; tests pass fixtures.
// `runResearchIntelligence()` is the orchestrator (delegates to the pure pipeline).

import { tools as allTools } from '@data/registry';
import { engineRegistry } from '@data/engines';
import { faqsByToolSlug } from '@data/faq-registry';
import { registeredGuideSlugs } from '@data/guide-registry';
import { KNOWLEDGE } from '@lib/knowledge/registry';
import type { SeedDataset, ProviderContext } from './models/provider';
import type { ResearchInputs, CatalogRef } from './types';
import type { ResearchReports } from './models/report';
import { PROVIDERS } from './registry';
import { runPipeline } from './pipeline';

export { runPipeline } from './pipeline';
export * from './models/report';
export type { ResearchInputs, CatalogRef } from './types';

/** Catalog-derived inputs (everything except the discovered `raw` + `now`). Pure — reads registries. */
export function catalogInputs(): Omit<ResearchInputs, 'raw' | 'now'> {
  const catalog: CatalogRef[] = allTools.map(t => ({
    slug: t.slug,
    name: t.name,
    categorySlug: t.categorySlug,
    engine: t.engine ?? '',
    family: t.family ?? '',
    pattern: t.pattern ?? '',
  }));
  return {
    existingSlugs: new Set(allTools.map(t => t.slug)),
    engineIds: new Set(engineRegistry.map(e => e.id)),
    catalog,
    knowledgeSlugs: new Set(KNOWLEDGE.keys()),
    guideSlugs: new Set(registeredGuideSlugs),
    faqSlugs: new Set(Object.keys(faqsByToolSlug).filter(s => (faqsByToolSlug[s]?.length ?? 0) > 0)),
  };
}

/** Run all providers over the given datasets and assemble the full ResearchInputs. */
export function defaultInputs(datasets: SeedDataset[], now = new Date().toISOString()): ResearchInputs {
  const base = catalogInputs();
  const ctx: ProviderContext = { datasets, existingSlugs: base.existingSlugs };
  const raw = PROVIDERS.flatMap(p => p.discover(ctx));
  return { ...base, raw, now };
}

/** Orchestrator. */
export function runResearchIntelligence(inputs: ResearchInputs): ResearchReports {
  return runPipeline(inputs);
}
