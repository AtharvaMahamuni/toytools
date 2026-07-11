// Heat Transfer Simulator — two equal blocks exchanging heat by conduction:
// dT_A/dt = k(T_B − T_A), dT_B/dt = k(T_A − T_B). The temperature DIFFERENCE decays as
// ΔT(t) = ΔT₀·e^(−2kt) while the sum is conserved, so each substep applies that exact
// exponential — no integration error, energy conserved to machine precision.
// Heat moved is reported as Q = m·c·ΔT with m·c fixed at 1 kJ/°C (stated in the UI copy).
// Pure model + config; all canvas work lives in heat-transfer.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { drawHeatTransfer } from './heat-transfer.draw';

/** Combined heat capacity m·c per block (kJ/°C) — fixed so Q reads in honest units. */
export const BLOCK_HEAT_CAPACITY = 1;
/** Blocks within this ΔT (°C) count as having reached thermal equilibrium. */
export const EQUILIBRIUM_EPSILON = 0.5;

export function initHeatTransfer(params: Record<string, number>): Record<string, number> {
  return { ta: params.tempA, tb: params.tempB, ta0: params.tempA };
}

/** Exact update over dt: the mean is invariant, the difference decays exponentially. */
export function stepHeatTransfer(s: SimState, dt: number): void {
  const mean = (s.vars.ta + s.vars.tb) / 2;
  const half = ((s.vars.ta - s.vars.tb) / 2) * Math.exp(-2 * s.params.conductance * dt);
  s.vars.ta = mean + half;
  s.vars.tb = mean - half;
  s.t += dt;
}

/** The shared temperature both blocks settle at: the mean of the starting temperatures. */
export function equilibriumTemp(params: Record<string, number>): number {
  return (params.tempA + params.tempB) / 2;
}

/** Heat that has left (or entered) block A so far: Q = m·c·(T_A0 − T_A) (kJ). */
export function heatMoved(state: SimState): number {
  return BLOCK_HEAT_CAPACITY * Math.abs(state.vars.ta0 - state.vars.ta);
}

export function isAtEquilibrium(state: SimState): boolean {
  return Math.abs(state.vars.ta - state.vars.tb) < EQUILIBRIUM_EPSILON;
}

const heatTransferSim: SimulationDef = {
  id: 'heat-transfer',
  aspect: 2,
  paramBehavior: 'restart',
  params: [
    { id: 'tempA', label: 'Block A temperature', unit: '°C', min: 0, max: 100, step: 1, default: 90, decimals: 0 },
    { id: 'tempB', label: 'Block B temperature', unit: '°C', min: 0, max: 100, step: 1, default: 10, decimals: 0 },
    { id: 'conductance', label: 'Thermal conductance', unit: '/s', min: 0.05, max: 1, step: 0.05, default: 0.25 },
  ],
  presets: [
    { id: 'coffee', label: 'Hot coffee, cool room', values: { tempA: 85, tempB: 21, conductance: 0.15 } },
    { id: 'ice', label: 'Ice water & warm water', values: { tempA: 40, tempB: 2, conductance: 0.3 } },
    { id: 'metal', label: 'Hot metal quench', values: { tempA: 100, tempB: 15, conductance: 0.9 } },
    { id: 'insulated', label: 'Well insulated', values: { tempA: 90, tempB: 10, conductance: 0.05 } },
  ],
  init: initHeatTransfer,
  step: stepHeatTransfer,
  measurements: [
    { id: 'tempA', label: 'Block A', unit: '°C', decimals: 1, compute: (s) => s.vars.ta },
    { id: 'tempB', label: 'Block B', unit: '°C', decimals: 1, compute: (s) => s.vars.tb },
    { id: 'average', label: 'Equilibrium temperature', unit: '°C', decimals: 1, compute: (s) => (s.vars.ta + s.vars.tb) / 2 },
    { id: 'heat', label: 'Heat moved', unit: 'kJ', decimals: 2, compute: heatMoved },
    { id: 'deltaA', label: 'Block A temperature change', unit: '°C', decimals: 1, hidden: true, compute: (s) => Math.abs(s.vars.ta0 - s.vars.ta) },
  ],
  formula: {
    expression: 'Q = m × c × ΔT',
    terms: [
      { symbol: 'Q', label: 'Heat moved', measurementId: 'heat' },
      { symbol: 'ΔT', label: 'Block A temperature change', measurementId: 'deltaA' },
    ],
  },
  graph: {
    mode: 'time',
    window: 20,
    xLabel: 'Time (s)',
    yLabel: 'Temperature (°C)',
    yRange: () => [0, 100],
    series: [
      { id: 'ta', label: 'Block A', color: 'danger', sample: (s) => s.vars.ta },
      { id: 'tb', label: 'Block B', color: 'accent', sample: (s) => s.vars.tb },
    ],
  },
  observations: [
    (s) => {
      if (isAtEquilibrium(s)) {
        return `The blocks have reached thermal equilibrium at about ${((s.vars.ta + s.vars.tb) / 2).toFixed(1)} °C — with no temperature difference, there is no net heat flow.`;
      }
      const hot = s.vars.ta > s.vars.tb ? 'A' : 'B';
      const cold = hot === 'A' ? 'B' : 'A';
      return `Heat is flowing from the hotter block ${hot} to the colder block ${cold} — never the other way on its own.`;
    },
    (s) =>
      !isAtEquilibrium(s) && Math.abs(s.vars.ta - s.vars.tb) < 10
        ? 'The flow is slowing down: heat transfer is fastest when the temperature difference is large, and fades as the blocks approach the same temperature.'
        : null,
    (s) =>
      s.params.conductance >= 0.7
        ? 'High conductance acts like good thermal contact (metal on metal) — the blocks equalize in just a few seconds.'
        : null,
    (s) =>
      s.params.conductance <= 0.1
        ? 'Low conductance acts like insulation — the same equilibrium is reached, it just takes far longer.'
        : null,
  ],
  pointer: {
    hint: 'Drag a block up or down to heat or cool it — tap for +5 °C',
    handle(s, ev) {
      if (ev.type === 'up') return null;
      // Left half targets block A, right half block B. Vertical position sets temperature
      // (top = 100 °C, bottom = 0 °C); a tap bumps by 5 °C and wraps at the top.
      const targetA = ev.x < 0.5;
      const current = targetA ? s.vars.ta : s.vars.tb;
      const next =
        ev.type === 'tap'
          ? ((current + 5) > 100 ? 0 : current + 5)
          : (1 - Math.min(Math.max(ev.y, 0), 1)) * 100;
      const clamped = Math.min(Math.max(next, 0), 100);
      // Set the block directly and reset its heat-accounting reference to the new value.
      if (targetA) {
        s.vars.ta = clamped;
        s.vars.ta0 = clamped;
        return { tempA: clamped };
      }
      s.vars.tb = clamped;
      return { tempB: clamped };
    },
  },
  explanation(s: SimState) {
    const eq = ((s.vars.ta + s.vars.tb) / 2).toFixed(1);
    if (isAtEquilibrium(s)) {
      return `Both blocks now sit at about ${eq} °C. Equilibrium is the average of the two starting temperatures because the blocks are identical: every joule block A lost, block B gained — energy was moved, never destroyed.`;
    }
    const dT = Math.abs(s.vars.ta - s.vars.tb).toFixed(1);
    return `The ${dT} °C temperature difference drives the heat flow, and the flow rate is proportional to that difference — so the gap shrinks exponentially. Both blocks are heading for the same ${eq} °C average, one cooling exactly as fast as the other warms.`;
  },
  draw: drawHeatTransfer,
};

export default heatTransferSim;
