// Client-side lazy simulation loader — the code-splitting twin of simulations/registry.ts.
//
// import.meta.glob (dynamic form) makes Vite emit one chunk per simulation module, so a
// physics page ships the shared engine core plus EXACTLY ONE simulation — flat cost from
// simulation #4 to #500. This module is Vite-only: tsx build scripts must import the static
// simulations/registry.ts instead (validate-registry / validate-architecture do). A vitest
// parity test (physics.test.ts) asserts the glob and the static registry never drift.

import type { SimulationDef } from './types';

const modules = import.meta.glob<{ default: SimulationDef }>([
  './simulations/*.ts',
  '!./simulations/*.test.ts',
  '!./simulations/*.draw.ts',
  '!./simulations/*.manifest.ts',
  '!./simulations/registry.ts',
]);

/** Simulation ids discoverable by the glob — exported for the registry-parity test. */
export const simulationModuleIds: string[] = Object.keys(modules)
  .map((key) => key.replace('./simulations/', '').replace(/\.ts$/, ''))
  .sort();

export async function loadSimulation(id: string): Promise<SimulationDef> {
  const load = modules[`./simulations/${id}.ts`];
  if (!load) throw new Error(`[physics] Unknown simulation id "${id}"`);
  const mod = await load();
  if (!mod?.default) throw new Error(`[physics] Simulation "${id}" has no default export`);
  return mod.default;
}
