// Frequency & Period Explorer — a single oscillator y(t) = A·sin(2πft) making the
// reciprocal pair T = 1/f tangible. Pure model + config; canvas in frequency-period.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { drawFrequencyPeriod } from './frequency-period.draw';

/** Fixed display amplitude (m) — this explorer is about timing, not size. */
export const OSC_AMPLITUDE = 0.6;

/** Oscillator displacement (m) at time t. */
export function oscillation(params: Record<string, number>, t: number): number {
  return OSC_AMPLITUDE * Math.sin(2 * Math.PI * params.frequency * t);
}

/** T = 1 / f (s). */
export function period(params: Record<string, number>): number {
  return 1 / params.frequency;
}

/** ω = 2πf (rad/s). */
export function angularFrequency(params: Record<string, number>): number {
  return 2 * Math.PI * params.frequency;
}

/** Whole cycles completed by time t. */
export function cyclesCompleted(params: Record<string, number>, t: number): number {
  return Math.floor(params.frequency * t);
}

const frequencyPeriodSim: SimulationDef = {
  id: 'frequency-period',
  paramBehavior: 'continuous',
  params: [
    { id: 'frequency', label: 'Frequency', unit: 'Hz', min: 0.2, max: 3, step: 0.05, default: 1 },
  ],
  presets: [
    { id: 'slow', label: 'Slow swing (0.25 Hz)', values: { frequency: 0.25 } },
    { id: 'second', label: 'Once a second (1 Hz)', values: { frequency: 1 } },
    { id: 'heartbeat', label: 'Resting heartbeat (1.2 Hz)', values: { frequency: 1.2 } },
    { id: 'fast', label: 'Rapid (3 Hz)', values: { frequency: 3 } },
  ],
  init: () => ({}),
  step(s: SimState, dt: number) {
    s.t += dt;
  },
  measurements: [
    { id: 'period', label: 'Period', unit: 's', compute: (s) => period(s.params) },
    { id: 'frequency', label: 'Frequency', unit: 'Hz', compute: (s) => s.params.frequency },
    { id: 'angular', label: 'Angular frequency', unit: 'rad/s', compute: (s) => angularFrequency(s.params) },
    { id: 'cycles', label: 'Cycles completed', unit: '', decimals: 0, compute: (s) => cyclesCompleted(s.params, s.t) },
  ],
  formula: {
    expression: 'T = 1 / f',
    terms: [
      { symbol: 'T', label: 'Period', measurementId: 'period' },
      { symbol: 'f', label: 'Frequency', paramId: 'frequency' },
    ],
  },
  graph: {
    mode: 'time',
    window: 6,
    xLabel: 'Time (s)',
    yLabel: 'Displacement (m)',
    yRange: () => [-OSC_AMPLITUDE * 1.15, OSC_AMPLITUDE * 1.15],
    series: [
      { id: 'y', label: 'y(t)', color: 'accent', sample: (s) => oscillation(s.params, s.t) },
    ],
  },
  observations: [
    (s) => {
      const T = period(s.params);
      return `At ${s.params.frequency.toFixed(2)} Hz, one full back-and-forth cycle takes ${T.toFixed(2)} seconds — frequency and period are reciprocals.`;
    },
    (s) =>
      s.params.frequency >= 2
        ? 'Doubling the frequency halves the period: more cycles per second means less time per cycle.'
        : null,
    (s) =>
      s.params.frequency <= 0.4
        ? 'At low frequency the timeline ticks spread far apart — each cycle takes several seconds to complete.'
        : null,
  ],
  pointer: {
    hint: 'Tap a steady beat to set the frequency',
    handle(s, ev) {
      // Tap tempo: derive frequency from the interval between the last two taps. A smoothed
      // running interval (s.vars.tapGap) rides out uneven taps; gaps over 3 s start fresh.
      if (ev.type !== 'down' && ev.type !== 'tap') return null;
      const last = s.vars.lastTap;
      s.vars.lastTap = ev.t;
      if (last == null || ev.t - last > 3 || ev.t - last <= 0) return null;
      const gap = ev.t - last;
      const smoothed = s.vars.tapGap ? s.vars.tapGap * 0.5 + gap * 0.5 : gap;
      s.vars.tapGap = smoothed;
      return { frequency: Math.min(Math.max(1 / smoothed, 0.2), 3) };
    },
  },
  explanation(s: SimState) {
    const f = s.params.frequency;
    const T = period(s.params);
    if (f >= 2) {
      return `The oscillator completes ${f.toFixed(2)} cycles every second, so each cycle lasts only ${T.toFixed(2)} s. Watch the graph: the peaks crowd together because the period shrank, exactly as T = 1/f predicts.`;
    }
    if (f <= 0.4) {
      return `At ${f.toFixed(2)} Hz the motion is slow and deliberate: a full cycle stretches over ${T.toFixed(2)} s. Fewer cycles fit in each second, so the period — the time one cycle takes — grows.`;
    }
    return `Frequency counts cycles per second (${f.toFixed(2)} Hz); period measures seconds per cycle (${T.toFixed(2)} s). They are two views of the same motion: multiply them and you always get exactly 1.`;
  },
  draw: drawFrequencyPeriod,
};

export default frequencyPeriodSim;
