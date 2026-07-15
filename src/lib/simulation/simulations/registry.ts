// Static simulation registry — the tsx-safe source of truth consumed by the simulation widget
// frontmatter (build time), the engine contract tests, and the validate-registry /
// validate-architecture scripts. Its lazy client twin is ../loader.ts (import.meta.glob):
// keys here and module filenames there must match 1:1 — a vitest parity test enforces it.
//
// SIMULATIONS is COMPOSED from domain plugins (physics is the first). Adding a new subject is:
// create a domain plugin under ../plugins/<domain>/ and add it to DOMAINS below.

import type { SimulationDef } from '../types';
import { composeDomains, type SimulationDomain } from '../domain';
import { physicsDomain } from '../plugins/physics';
import { mathDomain } from '../plugins/math';

/** Every registered simulation domain. Add a subject here to plug it into the engine. */
export const DOMAINS: SimulationDomain[] = [physicsDomain, mathDomain];

export const SIMULATIONS: Record<string, SimulationDef> = composeDomains(DOMAINS);

/** Look up one simulation. Never throws; returns undefined when absent. */
export function getSimulation(id: string): SimulationDef | undefined {
  return SIMULATIONS[id];
}
