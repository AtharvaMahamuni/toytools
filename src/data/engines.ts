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
  /** Shared widget in src/tools/_shared/ a tool of this engine wraps ('' for bespoke widgets). */
  sharedWidget: string;
  supportsGuides: boolean;
  supportsFaqs: boolean;
  /** Derived from the registry — the distinct families currently in use. */
  supportedFamilies: string[];
  /** Derived from the registry — how many tools this engine currently powers. */
  toolCount: number;
}

// Literal id tuples — the single source for the type-level unions. ToolConfig.engine /
// ToolConfig.pattern reference these so a typo (e.g. 'encodng') is a compile-time error in the
// editor, not a deferred validate-registry failure. Keep these in sync with engineDefs below;
// EngineDef.id/patterns are typed against them, so an id used in engineDefs but absent here
// (or vice-versa) is a TS error.
const ENGINE_IDS = [
  'text-analysis', 'text-processor', 'encoding', 'hashing', 'structured-data',
  'jwt', 'text-interactive', 'calculator', 'productivity', 'finance', 'csv', 'generation',
  'physics', 'datetime',
] as const;
export type EngineId = (typeof ENGINE_IDS)[number];

const PATTERN_IDS = [
  'text-metric', 'text-transform', 'text-cleanup', 'encode-decode', 'hash',
  'structured-transform', 'structured-validate', 'token-decode', 'text-interactive',
  'calculate', 'stateful', 'finance-growth', 'finance-planning', 'csv-transform',
  'generate-credential', 'generate-identifier', 'generate-placeholder', 'generate-code',
  'simulate', 'datetime-calculate', 'datetime-convert', 'datetime-schedule',
] as const;
export type PatternId = (typeof PATTERN_IDS)[number];

interface EngineDef {
  id: EngineId;
  name: string;
  category: string;
  patterns: PatternId[];
  runtimeGlobal: string;
  sharedWidget?: string;
  supportsGuides?: boolean;
  supportsFaqs?: boolean;
}

// Declared engine definitions. New engines register here exactly once.
const engineDefs: EngineDef[] = [
  { id: 'text-analysis', name: 'Text Analysis Engine', category: 'text-utilities', patterns: ['text-metric'], runtimeGlobal: 'analyze', sharedWidget: 'TextMetricWidget.astro' },
  { id: 'text-processor', name: 'Text Processor Engine', category: 'text-utilities', patterns: ['text-transform', 'text-cleanup'], runtimeGlobal: 'process', sharedWidget: 'TextProcessorWidget.astro' },
  { id: 'encoding', name: 'Encoding Engine', category: 'developer-utilities', patterns: ['encode-decode'], runtimeGlobal: 'runEncoding', sharedWidget: 'ConverterWidget.astro' },
  { id: 'hashing', name: 'Hashing Engine', category: 'developer-utilities', patterns: ['hash'], runtimeGlobal: 'runHash', sharedWidget: 'ConverterWidget.astro' },
  { id: 'structured-data', name: 'Structured Data Engine', category: 'developer-utilities', patterns: ['structured-transform', 'structured-validate'], runtimeGlobal: 'runStructuredData', sharedWidget: 'StructuredDataWidget.astro' },
  { id: 'jwt', name: 'JWT Engine', category: 'developer-utilities', patterns: ['token-decode'], runtimeGlobal: 'runJwt', sharedWidget: 'JwtWidget.astro' },
  { id: 'text-interactive', name: 'Text Interactive Engine', category: 'text-utilities', patterns: ['text-interactive'], runtimeGlobal: '' },
  { id: 'calculator', name: 'Calculator Engine', category: 'number-utilities', patterns: ['calculate'], runtimeGlobal: '' },
  { id: 'productivity', name: 'Productivity Engine', category: 'productivity', patterns: ['stateful'], runtimeGlobal: '' },
  { id: 'finance', name: 'Finance Engine', category: 'money-finance', patterns: ['finance-growth', 'finance-planning'], runtimeGlobal: 'runFinance', sharedWidget: 'FinanceWidget.astro' },
  { id: 'csv', name: 'CSV Engine', category: 'developer-utilities', patterns: ['csv-transform'], runtimeGlobal: 'runCsv', sharedWidget: 'CsvWidget.astro' },
  { id: 'generation', name: 'Generation Engine', category: 'generate', patterns: ['generate-credential', 'generate-identifier', 'generate-placeholder', 'generate-code'], runtimeGlobal: 'runGeneration', sharedWidget: 'GeneratorWidget.astro' },
  // Physics Playground: interactive canvas simulations. runtimeGlobal is '' — unlike the
  // string-transform engines, physics does NOT attach to window.ToyTools in ToyToolsRuntime
  // (that loads site-wide). Instead SimulationWidget ships a bundled per-page script that
  // lazy-loads one simulation module, so physics code never touches non-physics pages.
  { id: 'physics', name: 'Physics Playground Engine', category: 'physics', patterns: ['simulate'], runtimeGlobal: '', sharedWidget: 'SimulationWidget.astro' },
  // Date & Time: date/duration/timezone/timestamp/schedule tools. Reuses the platform experience
  // renderer (ToyTools.experience) for output; runtimeGlobal runDateTime resolves the calculator.
  { id: 'datetime', name: 'Date & Time Engine', category: 'date-time', patterns: ['datetime-calculate', 'datetime-convert', 'datetime-schedule'], runtimeGlobal: 'runDateTime', sharedWidget: 'DateTimeWidget.astro' },
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
  sharedWidget: '',
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
