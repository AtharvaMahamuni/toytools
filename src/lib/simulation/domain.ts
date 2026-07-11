// A simulation DOMAIN is a plugin: a named bundle of SimulationDefs plus its presentation hints.
// The generic engine (loop, graph, canvas, loader, boot, widget) knows nothing about physics or any
// other subject — it only consumes SimulationDefs. Domains are the seam where subject-specific
// content (and, later, subject-specific palettes/vocabulary/units) plug in. Adding chemistry,
// biology, astronomy, electronics, or mathematics is: add a domain plugin + one line in
// simulations/registry.ts. Physics is simply the first domain, not the owner of the engine.

import type { SimulationDef } from './types';

export interface SimulationDomain {
  /** Stable domain id, e.g. 'physics'. */
  id: string;
  /** Human label for future curriculum/discovery surfaces. */
  label: string;
  /** The simulations this domain contributes, keyed by SimulationDef.id. */
  simulations: Record<string, SimulationDef>;
}

/** Compose many domain plugins into one flat id → def map, failing loudly on an id collision. */
export function composeDomains(domains: SimulationDomain[]): Record<string, SimulationDef> {
  const out: Record<string, SimulationDef> = {};
  for (const domain of domains) {
    for (const [id, def] of Object.entries(domain.simulations)) {
      if (out[id]) throw new Error(`[simulation] duplicate simulation id "${id}" across domains`);
      out[id] = def;
    }
  }
  return out;
}
