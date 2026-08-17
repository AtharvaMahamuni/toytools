// Engine id → lazy attach module. One literal `import()` per engine, which is what makes Vite emit
// one chunk per engine; a page then downloads only the engine its tool declares.
//
// Engines absent from this map have no browser runtime at all and are correct to omit:
//   calculator, productivity  — self-contained bespoke widgets, no ToyTools.* engine surface
//   physics, math-lab         — SimulationWidget lazy-loads one simulation module per page instead
//
// `validate-registry` cross-checks this map against src/data/engines.ts and against what every
// widget actually calls, so an engine cannot lose its runtime silently.

import type { AttachFn } from './types';

export const ENGINE_LOADERS: Record<string, () => Promise<{ attach: AttachFn }>> = {
  'text-analysis': () => import('./engines/text-analysis'),
  'text-processor': () => import('./engines/text-processor'),
  'text-interactive': () => import('./engines/text-interactive'),
  encoding: () => import('./engines/encoding'),
  hashing: () => import('./engines/hashing'),
  'structured-data': () => import('./engines/structured-data'),
  csv: () => import('./engines/csv'),
  jwt: () => import('./engines/jwt'),
  generation: () => import('./engines/generation'),
  finance: () => import('./engines/finance'),
  datetime: () => import('./engines/datetime'),
  math: () => import('./engines/math'),
  wellness: () => import('./engines/wellness'),
  tracker: () => import('./engines/tracker'),
  color: () => import('./engines/color'),
  units: () => import('./engines/units'),
};

/** Engine ids that have a lazily-loaded browser runtime. */
export const RUNTIME_ENGINE_IDS = Object.keys(ENGINE_LOADERS);

/**
 * Every ToyTools global attached by each engine module. Data, not derived from the modules
 * themselves, because the modules are browser code that build-time validators cannot execute.
 * `validate-registry` fails the build when a widget calls a global no declared engine provides.
 */
export const ENGINE_GLOBALS: Record<string, string[]> = {
  'text-analysis': ['analyze', 'textNotice', 'formatMetric'],
  'text-processor': ['process'],
  'text-interactive': ['diff', 'diffStats', 'shell'],
  encoding: ['runEncoding', 'transform'],
  hashing: ['runHash', 'transform'],
  'structured-data': ['runStructuredData', 'repairStructuredData', 'json', 'yaml'],
  csv: ['runCsv', 'csv'],
  jwt: ['runJwt'],
  generation: ['runGeneration'],
  finance: ['runFinance', 'experience'],
  datetime: ['runDateTime', 'experience'],
  math: ['runMath', 'experience'],
  wellness: ['runWellness', 'experience', 'viz'],
  tracker: ['tracker', 'viz'],
  color: ['color'],
  units: ['units'],
};
