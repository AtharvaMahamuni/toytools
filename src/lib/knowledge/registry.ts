// Knowledge registry — the single import hub for every tool's knowledge.ts, mirroring
// src/data/registry.ts. Explicit imports (not import.meta.glob) so this module is consumable
// by tsx build scripts (scripts/validate-knowledge.ts) AND vitest AND Astro alike.
//
// Adding a tool's knowledge: one import line + one KNOWLEDGE_ENTRIES entry below.

import type { Knowledge } from './types';

// --- Developer tools (Phase D pilot) ---
import { knowledge as base64 }        from '@tools/developer-utilities/base64-encoder-decoder/knowledge';
import { knowledge as urlCodec }      from '@tools/developer-utilities/url-encoder-decoder/knowledge';
import { knowledge as htmlEntity }    from '@tools/developer-utilities/html-entity-encoder-decoder/knowledge';
import { knowledge as md5 }           from '@tools/developer-utilities/md5-hash-generator/knowledge';
import { knowledge as sha1 }          from '@tools/developer-utilities/sha1-hash-generator/knowledge';
import { knowledge as sha256 }        from '@tools/developer-utilities/sha256-hash-generator/knowledge';
import { knowledge as jsonFormatter } from '@tools/developer-utilities/json-formatter/knowledge';
import { knowledge as jsonMinifier }  from '@tools/developer-utilities/json-minifier/knowledge';
import { knowledge as jsonValidator } from '@tools/developer-utilities/json-validator/knowledge';

// --- Number utilities ---
import { knowledge as tipCalculator } from '@tools/number/tip-calculator/knowledge';

// --- Productivity ---
import { knowledge as pomodoroTimer } from '@tools/productivity/pomodoro-timer/knowledge';

/** Every authored knowledge entry. */
export const KNOWLEDGE_ENTRIES: Knowledge[] = [
  pomodoroTimer,
  base64,
  urlCodec,
  htmlEntity,
  md5,
  sha1,
  sha256,
  jsonFormatter,
  jsonMinifier,
  jsonValidator,
  tipCalculator,
];

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
