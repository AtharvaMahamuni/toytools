// Knowledge registry — the single import hub for every tool's knowledge.ts, mirroring
// src/data/registry.ts. Explicit imports (not import.meta.glob) so this module is consumable
// by tsx build scripts (scripts/validate-knowledge.ts) AND vitest AND Astro alike.
//
// Adding a tool's knowledge: one import line + one KNOWLEDGE_ENTRIES entry below.

import type { Knowledge } from './types';

// Knowledge imports are added here as tools gain a knowledge.ts (Phase D pilot: developer tools).
// (none yet — appended in the pilot-content commit)

/** Every authored knowledge entry. */
export const KNOWLEDGE_ENTRIES: Knowledge[] = [];

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
