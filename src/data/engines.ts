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
  'physics', 'datetime', 'math-lab', 'math', 'chemistry-lab', 'wellness', 'tracker', 'color', 'units',
  'audio',
] as const;
export type EngineId = (typeof ENGINE_IDS)[number];

const PATTERN_IDS = [
  'text-metric', 'text-transform', 'text-cleanup', 'text-inspect', 'encode-decode', 'encode-detect', 'hash',
  'structured-transform', 'structured-validate', 'token-decode', 'text-interactive',
  'calculate', 'stateful', 'finance-growth', 'finance-planning', 'csv-transform',
  'generate-credential', 'generate-identifier', 'generate-placeholder', 'generate-code',
  'generate-chance',
  'simulate', 'datetime-calculate', 'datetime-convert', 'datetime-schedule', 'math-calculate',
  'health-calculate', 'health-track', 'color-convert', 'color-contrast', 'unit-convert', 'aspect-ratio',
  'eq-design',
] as const;
export type PatternId = (typeof PATTERN_IDS)[number];

/**
 * Patterns whose tools do NOT dispatch through their engine's processor registry.
 *
 * Most tools on a registry-backed engine are thin wrappers: the shared widget calls
 * `ToyTools.run<Engine>(processorId, ...)`, so a missing or unknown id is a broken page and
 * `validate-registry` rightly refuses to build one. A few tools sit on the same engine because they
 * share its subject matter while answering a question the registry cannot express. `encode-detect`
 * is the first: a detector has no codec to dispatch to until it has worked out which codec applies,
 * which is the entire tool.
 *
 * Declared here rather than inferred, so adding one stays a deliberate act with a reviewer, and so
 * the processorId rule keeps its full force everywhere else.
 */
export const NON_DISPATCHING_PATTERNS: ReadonlySet<PatternId> = new Set<PatternId>(['encode-detect', 'text-inspect']);

interface EngineDef {
  id: EngineId;
  name: string;
  category: string;
  patterns: PatternId[];
  runtimeGlobal: string;
  sharedWidget?: string;
  supportsGuides?: boolean;
  supportsFaqs?: boolean;
  /**
   * EVERY window.ToyTools.* name this engine's attach module installs, not just the primary
   * `runtimeGlobal` above. `validate-registry` fails the build when a widget calls a global no
   * declared engine provides, and it reads this list to know what each engine actually offers.
   *
   * Omitted for engines with no browser runtime at all (productivity is self-contained; physics
   * and math-lab lazy-load one simulation module per page instead of attaching to ToyTools).
   *
   * Data rather than something derived from the modules themselves, because those modules are
   * browser code a build-time validator cannot execute.
   */
  globals?: string[];
}

// Declared engine definitions. New engines register here exactly once.
const engineDefs: EngineDef[] = [
  { id: 'text-analysis', name: 'Text Analysis Engine', category: 'text-utilities', patterns: ['text-metric'], runtimeGlobal: 'analyze', sharedWidget: 'TextMetricWidget.astro', globals: ['analyze', 'textNotice', 'formatMetric'] },
  { id: 'text-processor', name: 'Text Processor Engine', category: 'text-utilities', patterns: ['text-transform', 'text-cleanup', 'text-inspect'], runtimeGlobal: 'process', sharedWidget: 'TextProcessorWidget.astro', globals: ['process', 'textHandoff', 'detectInvisible'] },
  { id: 'encoding', name: 'Encoding Engine', category: 'developer-utilities', patterns: ['encode-decode', 'encode-detect'], runtimeGlobal: 'runEncoding', sharedWidget: 'ConverterWidget.astro', globals: ['runEncoding', 'detectEncoding', 'transform'] },
  { id: 'hashing', name: 'Hashing Engine', category: 'developer-utilities', patterns: ['hash'], runtimeGlobal: 'runHash', sharedWidget: 'ConverterWidget.astro', globals: ['runHash', 'transform'] },
  { id: 'structured-data', name: 'Structured Data Engine', category: 'developer-utilities', patterns: ['structured-transform', 'structured-validate'], runtimeGlobal: 'runStructuredData', sharedWidget: 'StructuredDataWidget.astro', globals: ['runStructuredData', 'repairStructuredData', 'json', 'yaml'] },
  { id: 'jwt', name: 'JWT Engine', category: 'developer-utilities', patterns: ['token-decode'], runtimeGlobal: 'runJwt', sharedWidget: 'JwtWidget.astro', globals: ['runJwt'] },
  { id: 'text-interactive', name: 'Text Interactive Engine', category: 'text-utilities', patterns: ['text-interactive'], runtimeGlobal: '', globals: ['diff', 'diffStats', 'whitespaceNoise', 'shell'] },
  { id: 'calculator', name: 'Calculator Engine', category: 'number-utilities', patterns: ['calculate'], runtimeGlobal: '', globals: ['pitfall'] },
  { id: 'productivity', name: 'Productivity Engine', category: 'productivity', patterns: ['stateful'], runtimeGlobal: '' },
  { id: 'finance', name: 'Finance Engine', category: 'money-finance', patterns: ['finance-growth', 'finance-planning'], runtimeGlobal: 'runFinance', sharedWidget: 'FinanceWidget.astro', globals: ['runFinance', 'experience'] },
  { id: 'csv', name: 'CSV Engine', category: 'developer-utilities', patterns: ['csv-transform'], runtimeGlobal: 'runCsv', sharedWidget: 'CsvWidget.astro', globals: ['runCsv', 'csv'] },
  { id: 'generation', name: 'Generation Engine', category: 'generate', patterns: ['generate-credential', 'generate-identifier', 'generate-placeholder', 'generate-code', 'generate-chance'], runtimeGlobal: 'runGeneration', sharedWidget: 'GeneratorWidget.astro', globals: ['runGeneration'] },
  // Physics Playground: interactive canvas simulations. runtimeGlobal is '' — unlike the
  // string-transform engines, physics does NOT attach to window.ToyTools in ToyToolsRuntime
  // (that loads site-wide). Instead SimulationWidget ships a bundled per-page script that
  // lazy-loads one simulation module, so physics code never touches non-physics pages.
  { id: 'physics', name: 'Physics Playground Engine', category: 'physics', patterns: ['simulate'], runtimeGlobal: '', sharedWidget: 'SimulationWidget.astro' },
  // Date & Time: date/duration/timezone/timestamp/schedule tools. Reuses the platform experience
  // renderer (ToyTools.experience) for output; runtimeGlobal runDateTime resolves the calculator.
  { id: 'datetime', name: 'Date & Time Engine', category: 'date-time', patterns: ['datetime-calculate', 'datetime-convert', 'datetime-schedule'], runtimeGlobal: 'runDateTime', sharedWidget: 'DateTimeWidget.astro', globals: ['runDateTime', 'experience'] },
  // Applied Math Lab: the second domain plugin on the generic simulation platform (see
  // src/lib/simulation/plugins/math/). Same runtime story as physics: no ToyTools global,
  // SimulationWidget lazy-loads exactly one simulation module per page.
  { id: 'math-lab', name: 'Math Lab Engine', category: 'applied-math', patterns: ['simulate'], runtimeGlobal: '', sharedWidget: 'SimulationWidget.astro' },
  // Math Calculator Engine: classic-tool sibling of math-lab for data-input calculators
  // (fractions, combinatorics, primes). Mirrors the datetime engine: SmartField schemas in,
  // InteractiveResult out, rendered by the platform experience layer.
  { id: 'math', name: 'Math Calculator Engine', category: 'applied-math', patterns: ['math-calculate'], runtimeGlobal: 'runMath', sharedWidget: 'MathWidget.astro', globals: ['runMath', 'experience'] },
  // Chemistry Lab: the third domain plugin on the generic simulation platform (see
  // src/lib/simulation/plugins/chemistry/). Same runtime story as physics and math-lab: no ToyTools
  // global, SimulationWidget lazy-loads exactly one simulation module per page. One engine covers
  // organic, inorganic and physical chemistry because the platform seam is the RUNTIME (a canvas
  // simulation driven by a SimulationDef), not the branch of chemistry; the branches are families.
  { id: 'chemistry-lab', name: 'Chemistry Lab Engine', category: 'chemistry', patterns: ['simulate'], runtimeGlobal: '', sharedWidget: 'SimulationWidget.astro' },
  // Wellness Engine: health & fitness metric calculators (BMI, TDEE, body fat, ...). Mirrors the
  // math/datetime engines: SmartField schemas in, InteractiveResult out, rendered by the platform
  // experience layer. runtimeGlobal runWellness resolves the calculator; no currency, no units DB.
  { id: 'wellness', name: 'Wellness Engine', category: 'health-fitness', patterns: ['health-calculate'], runtimeGlobal: 'runWellness', sharedWidget: 'WellnessWidget.astro', globals: ['runWellness', 'wellnessCaveat', 'experience', 'viz'] },
  // Tracker Engine: stateful habit/measurement trackers (water, weight, ...). Unlike the calculator
  // engines this is a repeat-entry log persisted in ToyTools.state, with streaks and a mini trend
  // chart. Every tracker shares one TrackerWidget shell; a tracker is a declarative TrackerDef, and
  // the pure model/viz + streak logic live in src/lib/engines/tracker/ (attached as ToyTools.tracker).
  { id: 'tracker', name: 'Tracker Engine', category: 'health-fitness', patterns: ['health-track'], runtimeGlobal: 'tracker', sharedWidget: 'TrackerWidget.astro', globals: ['tracker', 'viz'] },
  // Design & CSS: two deterministic client-side math engines with bespoke widgets (like the
  // calculator engine — runtimeGlobal exposes a namespace object on ToyTools.*, no shared widget).
  // 'color' does parse/convert/contrast across HEX/RGB/HSL/HSV/OKLCH/CMYK; 'units' does CSS +
  // native unit math (px/rem/em/pt/dp/sp) and aspect-ratio solving.
  { id: 'color', name: 'Color Engine', category: 'design-tools', patterns: ['color-convert', 'color-contrast'], runtimeGlobal: 'color', globals: ['color'] },
  { id: 'units', name: 'CSS Unit Engine', category: 'design-tools', patterns: ['unit-convert', 'aspect-ratio'], runtimeGlobal: 'units', globals: ['units'] },
  // Music & Audio: equalizer design. An EQ is a DEFINITION here (bands, presets, limits) resolved
  // by processorId, so a second tool on a different band layout is a registry entry rather than a
  // second widget, and EqWidget stays the one place the curve and the controls are drawn.
  { id: 'audio', name: 'Audio Engine', category: 'music-audio', patterns: ['eq-design'], runtimeGlobal: 'eq', sharedWidget: 'EqWidget.astro', globals: ['eq'] },
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

/**
 * Engine id → every ToyTools.* global its attach module installs. Derived from `engineDefs` above,
 * so the globals an engine declares live in the same line as the engine itself.
 *
 * Consumed at BUILD TIME only — `validate-registry` (to check widget calls against the engine that
 * must provide them) and `loaders.test.ts`. Deliberately NOT re-exported from
 * src/lib/runtime/loaders.ts, even though that is where it used to live and where its sibling
 * ENGINE_LOADERS still lives: loaders.ts is browser code, and importing this module from it would
 * drag the entire tool registry into the runtime chunk. ENGINE_LOADERS has to stay hand-written
 * there for a separate reason — its literal import() calls are what make Vite emit one chunk per
 * engine, which is what keeps a tool page from downloading every engine on the site.
 */
export const ENGINE_GLOBALS: Record<string, string[]> = Object.fromEntries(
  engineDefs.filter(d => d.globals?.length).map(d => [d.id, d.globals!]),
);
