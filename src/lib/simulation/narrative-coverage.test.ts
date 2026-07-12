// Narrative + interaction coverage: every simulation's observations(), explanation(), and pointer
// handler must stay total (never throw, always finite/serializable) across the whole parameter space,
// including the conditional regimes that trigger their different messages. Rather than hand-pick
// states per sim, this sweeps each sim's parameter ranges with a seeded PRNG so the branch-heavy
// narrative logic is exercised deterministically for all sims at once.

import { describe, expect, it } from 'vitest';
import { SIMULATIONS } from './simulations/registry';
import type { SimState, SimulationDef, PointerEvent } from './types';

/** Deterministic PRNG so the sweep is reproducible. */
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function stateFor(def: SimulationDef, params: Record<string, number>, t: number): SimState {
  return { t, params, vars: def.init(params) };
}

const TIMES = [0, 0.4, 1.7, 5.3];
const POINTER_TYPES: PointerEvent['type'][] = ['down', 'move', 'up', 'tap'];

describe.each(Object.values(SIMULATIONS).map((d) => [d.id, d] as const))(
  'narrative coverage: %s',
  (_id, def) => {
    it('observations, explanation, and pointer stay total across the parameter space', () => {
      const rng = makeRng(1337); // fixed seed for a reproducible sweep
      for (let i = 0; i < 120; i++) {
        const params: Record<string, number> = {};
        for (const p of def.params) {
          // Bias toward the extremes so threshold branches (min/max regimes) are hit often.
          const r = rng();
          const v = r < 0.25 ? p.min : r > 0.75 ? p.max : p.min + rng() * (p.max - p.min);
          params[p.id] = v;
        }
        const t = TIMES[i % TIMES.length];
        const state = stateFor(def, params, t);

        // explanation() must always return a non-empty string.
        const explanation = def.explanation(state);
        expect(typeof explanation).toBe('string');
        expect(explanation.length).toBeGreaterThan(0);

        // every observation rule returns a string or null, and never throws.
        for (const rule of def.observations) {
          const out = rule(state);
          expect(out === null || typeof out === 'string').toBe(true);
        }

        // measurements stay finite for any in-range state.
        for (const m of def.measurements) {
          expect(Number.isFinite(m.compute(state))).toBe(true);
        }

        // pointer handler (if any) is total for every event type and returns clamped params or null.
        if (def.pointer) {
          for (const type of POINTER_TYPES) {
            const ev: PointerEvent = { type, x: rng(), y: rng(), t };
            const patch = def.pointer.handle(state, ev);
            if (patch) {
              for (const [id, value] of Object.entries(patch)) {
                const pd = def.params.find((p) => p.id === id);
                expect(Number.isFinite(value)).toBe(true);
                if (pd) {
                  expect(value).toBeGreaterThanOrEqual(pd.min);
                  expect(value).toBeLessThanOrEqual(pd.max);
                }
              }
            }
          }
        }
      }
    });
  },
);
