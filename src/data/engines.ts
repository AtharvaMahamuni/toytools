// Platform-level engine manifest — the single source of truth for which engines exist,
// what patterns/families they own, and how they expose themselves at runtime.
//
// Categories own engines; engines own tools. validate-registry derives its KNOWN_ENGINES /
// KNOWN_PATTERNS sets from here, and platform docs / future automation read this list.
// `patterns` is the declared (authoritative) allow-list; `supportedFamilies` and `toolCount`
// are derived from the registry so they never drift.

import type { ToolConfig } from './types';
import { tools } from './registry';

export interface EngineManifest {
  /** Stable engine id, referenced by ToolConfig.engine (e.g. 'encoding'). */
  id: string;
  name: string;
  /** Category slug the engine primarily serves. */
  category: string;
  /** Declared allow-list of patterns this engine's tools may use. */
  patterns: string[];
  /** Name of the window.ToyTools.* function tools call at runtime ('' for self-contained tools). */
  runtimeGlobal: string;
  supportsGuides: boolean;
  supportsFaqs: boolean;
  /** Derived from the registry — the distinct families currently in use. */
  supportedFamilies: string[];
  /** Derived from the registry — how many tools this engine currently powers. */
  toolCount: number;
}

interface EngineDef {
  id: string;
  name: string;
  category: string;
  patterns: string[];
  runtimeGlobal: string;
  supportsGuides?: boolean;
  supportsFaqs?: boolean;
}

// Declared engine definitions. New engines register here exactly once.
const engineDefs: EngineDef[] = [
  { id: 'text-analysis', name: 'Text Analysis Engine', category: 'text-utilities', patterns: ['text-metric'], runtimeGlobal: 'analyze' },
  { id: 'text-processor', name: 'Text Processor Engine', category: 'text-utilities', patterns: ['text-transform', 'text-cleanup'], runtimeGlobal: 'process' },
  { id: 'encoding', name: 'Encoding Engine', category: 'developer-utilities', patterns: ['encode-decode'], runtimeGlobal: 'runEncoding' },
  { id: 'hashing', name: 'Hashing Engine', category: 'developer-utilities', patterns: ['hash'], runtimeGlobal: 'runHash' },
  { id: 'structured-data', name: 'Structured Data Engine', category: 'developer-utilities', patterns: ['structured-transform', 'structured-validate'], runtimeGlobal: 'runStructuredData' },
  { id: 'calculator', name: 'Calculator Engine', category: 'number-utilities', patterns: ['calculate'], runtimeGlobal: '' },
  { id: 'productivity', name: 'Productivity Engine', category: 'productivity', patterns: ['stateful'], runtimeGlobal: '' },
];

function familiesFor(engineId: string): string[] {
  const seen = new Set<string>();
  for (const t of tools as ToolConfig[]) {
    if (t.engine === engineId && t.family) seen.add(t.family);
  }
  return [...seen];
}

function countFor(engineId: string): number {
  return (tools as ToolConfig[]).filter(t => t.engine === engineId).length;
}

export const engineRegistry: EngineManifest[] = engineDefs.map(def => ({
  supportsGuides: true,
  supportsFaqs: true,
  ...def,
  supportedFamilies: familiesFor(def.id),
  toolCount: countFor(def.id),
}));

export const engineIds = new Set(engineRegistry.map(e => e.id));

export function getEngine(id: string): EngineManifest | undefined {
  return engineRegistry.find(e => e.id === id);
}

/** All patterns declared across every engine — the platform's KNOWN_PATTERNS set. */
export const knownPatterns = new Set(engineRegistry.flatMap(e => e.patterns));
