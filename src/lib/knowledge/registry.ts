// Knowledge registry — the single hub for every tool's knowledge.ts, mirroring
// src/data/registry.ts. Registration is DERIVED from the filesystem: authoring
// src/tools/<segment>/<slug>/knowledge.ts registers it (`registry.generated.ts` is written by
// `npm run registries:generate`, run automatically by scaffold:tool). The generated barrel uses
// explicit static imports (not import.meta.glob) so this module stays consumable by tsx build
// scripts (scripts/validate-knowledge.ts) AND vitest AND Astro alike.

import type { Knowledge } from './types';
import { simulationKnowledge } from '@lib/simulation/derived';
import { authoredKnowledge } from './registry.generated';

export const KNOWLEDGE_ENTRIES: Knowledge[] = [...simulationKnowledge, ...authoredKnowledge];

/** Build a slug → Knowledge map from a list. Pure, so tests can pass fixtures. */
export function buildKnowledgeMap(entries: Knowledge[]): Map<string, Knowledge> {
  const map = new Map<string, Knowledge>();
  for (const entry of entries) {
    map.set(entry.slug, entry);
  }
  return map;
}

/** Prebuilt map over the registered entries — O(1) lookups. */
export const KNOWLEDGE: Map<string, Knowledge> = buildKnowledgeMap(KNOWLEDGE_ENTRIES);

/** Look up one tool's knowledge. Never throws; returns undefined when absent. */
export function getKnowledge(slug: string): Knowledge | undefined {
  return KNOWLEDGE.get(slug);
}

/** True when a tool has an authored knowledge file. */
export function hasKnowledge(slug: string): boolean {
  return KNOWLEDGE.has(slug);
}
