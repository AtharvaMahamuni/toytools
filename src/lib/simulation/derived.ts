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
import type { SimulationManifest } from './manifest';

function defFor(m: SimulationManifest) {
  const def = SIMULATIONS[m.metadata.processorId];
  if (!def) throw new Error(`[simulation] manifest "${m.metadata.slug}" has no model "${m.metadata.processorId}"`);
  return def;
}

/** ToolConfig for every simulation, spread into src/data/registry.ts. */
export const simulationTools: ToolConfig[] = MANIFESTS.map(toolConfigFrom);

/** Knowledge overlay for every simulation, spread into the knowledge registry. */
export const simulationKnowledge: Knowledge[] = MANIFESTS.map((m) => knowledgeFrom(m, defFor(m)));

/** FAQ items keyed by tool slug, spread into src/data/faq-registry.ts. */
export const simulationFaqsBySlug: Record<string, FAQItem[]> = Object.fromEntries(
  MANIFESTS.map((m) => [m.metadata.slug, faqItemsFrom(m)]),
);

/** Tool slugs whose guide is a generated simulation guide (for guide registration + routing). */
export const simulationGuideSlugs: string[] = MANIFESTS.map((m) => m.metadata.slug);
