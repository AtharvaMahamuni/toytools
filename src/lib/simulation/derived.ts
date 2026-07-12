// DERIVED simulation surfaces — every per-tool artifact expanded from the manifests at build time
// (Problems 1, 2, 11). The site registries spread these in, so a simulator needs no hand-authored
// config.ts / knowledge.ts / faq.ts and no per-tool guide registration. This mirrors how
// categories.ts, engineRegistry, and metadata.ts already derive rather than duplicate: the manifest
// is the single source and there is nothing to fall out of sync, so no generated file or freshness
// check is required. tsx build scripts and Astro both import this module.

import type { FAQItem, ToolConfig } from '@data/types';
import type { Knowledge } from '@lib/knowledge/types';
import { MANIFESTS } from './manifests';
import { SIMULATIONS } from './simulations/registry';
import { faqItemsFrom, knowledgeFrom, toolConfigFrom } from './generate';
import { resolveRelations } from './relations';
import type { SimulationManifest, RelationshipOverlay } from './manifest';

function defFor(m: SimulationManifest) {
  const def = SIMULATIONS[m.metadata.processorId];
  if (!def) throw new Error(`[simulation] manifest "${m.metadata.slug}" has no model "${m.metadata.processorId}"`);
  return def;
}

/**
 * Resolved relationship overlay per sim, derived once from shared concepts/quantities/family across
 * the whole manifest set (an explicit manifest override wins). Every generated surface reads this,
 * so related tools are auto-derived rather than hand-authored per sim.
 */
const relationsFor: Map<string, RelationshipOverlay> = new Map(
  MANIFESTS.map((m) => [m.metadata.slug, resolveRelations(m, MANIFESTS)]),
);

/** ToolConfig for every simulation, spread into src/data/registry.ts. */
export const simulationTools: ToolConfig[] = MANIFESTS.map((m) =>
  toolConfigFrom(m, relationsFor.get(m.metadata.slug)!),
);

/** Knowledge overlay for every simulation, spread into the knowledge registry. */
export const simulationKnowledge: Knowledge[] = MANIFESTS.map((m) =>
  knowledgeFrom(m, defFor(m), relationsFor.get(m.metadata.slug)!),
);

/** FAQ items keyed by tool slug, spread into src/data/faq-registry.ts. */
export const simulationFaqsBySlug: Record<string, FAQItem[]> = Object.fromEntries(
  MANIFESTS.map((m) => [m.metadata.slug, faqItemsFrom(m)]),
);

/** Tool slugs whose guide is a generated simulation guide (for guide registration + routing). */
export const simulationGuideSlugs: string[] = MANIFESTS.map((m) => m.metadata.slug);
