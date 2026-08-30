// Engine id → lazy attach module. One literal `import()` per engine, which is what makes Vite emit
// one chunk per engine; a page then downloads only the engine its tool declares.
//
// Engines absent from this map have no browser runtime at all and are correct to omit:
//   productivity              — self-contained bespoke widgets, no ToyTools.* engine surface
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
  calculator: () => import('./engines/calculator'),
  wellness: () => import('./engines/wellness'),
  tracker: () => import('./engines/tracker'),
  color: () => import('./engines/color'),
  units: () => import('./engines/units'),
  audio: () => import('./engines/audio'),
};

/** Engine ids that have a lazily-loaded browser runtime. */
export const RUNTIME_ENGINE_IDS = Object.keys(ENGINE_LOADERS);

// ENGINE_GLOBALS — what each engine attaches to window.ToyTools — now lives beside the engine
// definitions themselves, in src/data/engines.ts, so an engine declares its globals on the same
// line that declares the engine. Import it from there.
//
// It is NOT re-exported here on purpose. This module is browser code, and src/data/engines.ts
// imports the tool registry; re-exporting through this file would pull every tool config into the
// runtime chunk. The map above stays here for the opposite reason: Vite needs those literal
// import() calls to emit one chunk per engine.
//
// loaders.test.ts still cross-checks the two against each other, so they cannot drift apart.
