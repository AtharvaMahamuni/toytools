// Static simulation registry — the tsx-safe source of truth consumed by PhysicsWidget
// frontmatter (build time), the engine contract tests, and the validate-registry /
// validate-architecture scripts. Its lazy client twin is ../loader.ts (import.meta.glob):
// keys here and module filenames there must match 1:1 — a vitest parity test enforces it.
//
// Adding a simulation: one model file + one draw file + one import/entry here.

import type { SimulationDef } from '../types';
import waveSpeed from './wave-speed';
import frequencyPeriod from './frequency-period';
import pendulum from './pendulum';
import heatTransfer from './heat-transfer';

export const SIMULATIONS: Record<string, SimulationDef> = {
  'wave-speed': waveSpeed,
  'frequency-period': frequencyPeriod,
  pendulum: pendulum,
  'heat-transfer': heatTransfer,
};

/** Look up one simulation. Never throws; returns undefined when absent. */
export function getSimulation(id: string): SimulationDef | undefined {
  return SIMULATIONS[id];
}
