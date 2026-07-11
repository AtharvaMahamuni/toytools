// Wave Speed Explorer — a travelling transverse sine wave y(x,t) = A·sin(2π(x/λ − f·t)).
// Pure model + config; all canvas work lives in wave-speed.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { singleStream } from '../graphs';
import { drawWaveSpeed } from './wave-speed.draw';

/** Spatial domain of the simulation and graph, in metres. */
export const WAVE_DOMAIN_M = 8;

/** Transverse displacement (m) at position x (m) and time t (s). */
export function displacement(params: Record<string, number>, x: number, t: number): number {
  return params.amplitude * Math.sin(2 * Math.PI * (x / params.wavelength - params.frequency * t));
}

/** v = f × λ (m/s). */
export function waveSpeed(params: Record<string, number>): number {
  return params.frequency * params.wavelength;
}

/** T = 1 / f (s). */
export function period(params: Record<string, number>): number {
  return 1 / params.frequency;
}

/**
 * Relative energy index ∝ ½ω²A², normalized so the default state (f=1 Hz, A=0.5 m) reads 1.
 * Honest labelling: a wave's true energy needs a medium's density, so we show a unitless index.
 */
export function energyIndex(params: Record<string, number>): number {
  const omega = 2 * Math.PI * params.frequency;
  const reference = 0.5 * (2 * Math.PI) ** 2 * 0.5 ** 2;
  return (0.5 * omega ** 2 * params.amplitude ** 2) / reference;
}

/** Position (m) of the tracked crest at time t, wrapped into the visible domain. */
export function crestX(params: Record<string, number>, t: number): number {
  // A crest sits where the phase is π/2: x = λ(1/4 + f·t), travelling right at v = fλ.
  const x = params.wavelength * 0.25 + waveSpeed(params) * t;
  return ((x % WAVE_DOMAIN_M) + WAVE_DOMAIN_M) % WAVE_DOMAIN_M;
}

const waveSpeedSim: SimulationDef = {
  id: 'wave-speed',
  paramBehavior: 'continuous',
  params: [
    { id: 'frequency', label: 'Frequency', unit: 'Hz', min: 0.2, max: 3, step: 0.05, default: 1 },
    { id: 'wavelength', label: 'Wavelength', unit: 'm', min: 0.5, max: 4, step: 0.1, default: 2, decimals: 1 },
    { id: 'amplitude', label: 'Amplitude', unit: 'm', min: 0.1, max: 1, step: 0.05, default: 0.5 },
  ],
  presets: [
    { id: 'ocean', label: 'Ocean swell', values: { frequency: 0.25, wavelength: 4, amplitude: 0.8 } },
    { id: 'ripple', label: 'Pond ripple', values: { frequency: 2, wavelength: 0.6, amplitude: 0.15 } },
    { id: 'rope', label: 'Shaken rope', values: { frequency: 1, wavelength: 2, amplitude: 0.5 } },
    { id: 'fast', label: 'Fast & tight', values: { frequency: 3, wavelength: 0.8, amplitude: 0.3 } },
  ],
  init: () => ({}),
  step(s: SimState, dt: number) {
    s.t += dt;
  },
  measurements: [
    { id: 'waveSpeed', label: 'Wave speed', unit: 'm/s', compute: (s) => waveSpeed(s.params) },
    { id: 'period', label: 'Period', unit: 's', compute: (s) => period(s.params) },
    { id: 'frequency', label: 'Frequency', unit: 'Hz', compute: (s) => s.params.frequency },
    { id: 'energy', label: 'Energy (relative)', unit: '×', compute: (s) => energyIndex(s.params) },
  ],
  formula: {
    expression: 'v = f × λ',
    substitution: '{frequency} × {wavelength}',
    terms: [
      { symbol: 'v', label: 'Wave speed', measurementId: 'waveSpeed' },
      { symbol: 'f', label: 'Frequency', paramId: 'frequency' },
      { symbol: 'λ', label: 'Wavelength', paramId: 'wavelength' },
    ],
  },
  graph: singleStream({
    yLabel: 'Displacement at x = 0 (m)',
    window: 6,
    yRange: () => [-1.1, 1.1],
    id: 'y0',
    label: 'y(0, t)',
    sample: (s) => displacement(s.params, 0, s.t),
  }),
  observations: [
    (s) => {
      const v = waveSpeed(s.params);
      return `Every second, ${v.toFixed(2)} metres of wave pass any fixed point — frequency ${s.params.frequency.toFixed(2)} Hz times wavelength ${s.params.wavelength.toFixed(1)} m.`;
    },
    (s) =>
      s.params.frequency >= 2
        ? 'The high frequency packs many oscillations into each second, so crests race past the marker particles.'
        : null,
    (s) =>
      s.params.wavelength >= 3
        ? 'The long wavelength stretches the crests far apart; each one carries the pattern further per cycle.'
        : null,
    (s) =>
      s.params.amplitude >= 0.8
        ? 'Amplitude changes how tall the wave is and how much energy it carries — but not how fast it travels.'
        : null,
  ],
  pointer: {
    hint: 'Drag the wave taller or flatter',
    handle(_s, ev) {
      if (ev.type === 'tap' || ev.type === 'up') return null;
      // Vertical distance from the mid-line maps to amplitude; the wave follows your finger.
      // The canvas draws ±1 m across 38% of the half-height, so invert that mapping.
      const fromMid = Math.abs(ev.y - 0.5);
      const amplitude = (fromMid / 0.5) * (1 / 0.76);
      return { amplitude: Math.min(Math.max(amplitude, 0.1), 1) };
    },
  },
  explanation(s: SimState) {
    const v = waveSpeed(s.params);
    const f = s.params.frequency;
    const lam = s.params.wavelength;
    if (f >= 2 && lam <= 1) {
      return `The wave oscillates rapidly (${f.toFixed(2)} Hz) but its crests sit close together (${lam.toFixed(1)} m), so the speed stays moderate at ${v.toFixed(2)} m/s. Speed depends on the product of both, not on either alone.`;
    }
    if (v >= 6) {
      return `At ${f.toFixed(2)} Hz with crests ${lam.toFixed(1)} m apart, each cycle pushes the pattern a long way: the wave sweeps by at ${v.toFixed(2)} m/s.`;
    }
    return `Each cycle moves the wave forward one wavelength (${lam.toFixed(1)} m), and ${f.toFixed(2)} cycles complete every second — so the pattern travels at v = f × λ = ${v.toFixed(2)} m/s. The dots show that the medium itself only bobs up and down.`;
  },
  draw: drawWaveSpeed,
};

export default waveSpeedSim;
