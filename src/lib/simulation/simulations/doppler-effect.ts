// Doppler Effect — a source moving through a medium emits waves that bunch up ahead of it (higher
// observed frequency) and stretch out behind (lower observed frequency). For a moving source and a
// stationary observer, f' = f·v / (v ± v_source). The source loops across the scene emitting circular
// wavefronts whose radii grow at the wave speed. Pure model + config; canvas work is in
// doppler-effect.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { singleSnapshot } from '../graphs';
import { drawDopplerEffect } from './doppler-effect.draw';

/** Horizontal domain the source travels across, in metres. */
export const DOMAIN_M = 340;

/** Observed frequency ahead of the source (approaching): f' = f·v / (v - v_s). */
export function approachingFrequency(params: Record<string, number>): number {
  return (params.frequency * params.waveSpeed) / (params.waveSpeed - params.sourceSpeed);
}

/** Observed frequency behind the source (receding): f' = f·v / (v + v_s). */
export function recedingFrequency(params: Record<string, number>): number {
  return (params.frequency * params.waveSpeed) / (params.waveSpeed + params.sourceSpeed);
}

/** Mach number: source speed as a fraction of the wave speed. */
export function machNumber(params: Record<string, number>): number {
  return params.sourceSpeed / params.waveSpeed;
}

/** Source x-position (m) at time t, looping left to right across the domain. */
export function sourceX(params: Record<string, number>, t: number): number {
  if (params.sourceSpeed <= 0) return DOMAIN_M / 2;
  const span = DOMAIN_M * 0.8;
  const start = DOMAIN_M * 0.1;
  const d = (params.sourceSpeed * t) % span;
  return start + d;
}

const dopplerEffectSim: SimulationDef = {
  id: 'doppler-effect',
  aspect: 16 / 9,
  // Wavefronts keep propagating with the new values; nothing to re-initialise on a change.
  paramBehavior: 'continuous',
  params: [
    { id: 'frequency', label: 'Source frequency', unit: 'Hz', min: 200, max: 800, step: 10, default: 440, decimals: 0 },
    { id: 'sourceSpeed', label: 'Source speed', unit: 'm/s', min: 0, max: 180, step: 5, default: 60, decimals: 0 },
    { id: 'waveSpeed', label: 'Wave speed', unit: 'm/s', min: 200, max: 500, step: 5, default: 340, decimals: 0 },
  ],
  presets: [
    { id: 'ambulance', label: 'Passing ambulance', values: { frequency: 700, sourceSpeed: 30, waveSpeed: 340 } },
    { id: 'race-car', label: 'Race car', values: { frequency: 500, sourceSpeed: 120, waveSpeed: 340 } },
    { id: 'still', label: 'Source at rest', values: { sourceSpeed: 0 } },
    { id: 'fast', label: 'Near sonic', values: { sourceSpeed: 180, waveSpeed: 200 } },
  ],
  init: () => ({}),
  step(s: SimState, dt: number) {
    s.t += dt;
  },
  measurements: [
    { id: 'approaching', label: 'Approaching frequency', unit: 'Hz', decimals: 0, compute: (s) => approachingFrequency(s.params) },
    { id: 'receding', label: 'Receding frequency', unit: 'Hz', decimals: 0, compute: (s) => recedingFrequency(s.params) },
    { id: 'shift', label: 'Frequency shift', unit: 'Hz', decimals: 0, compute: (s) => approachingFrequency(s.params) - s.params.frequency },
    { id: 'mach', label: 'Mach number', unit: '', decimals: 2, compute: (s) => machNumber(s.params) },
  ],
  formula: {
    expression: "f' = f × v / (v - vs)",
    substitution: '{frequency} × {waveSpeed} / ({waveSpeed} - {sourceSpeed})',
    terms: [
      { symbol: "f'", label: 'Approaching frequency', measurementId: 'approaching' },
      { symbol: 'f', label: 'Source frequency', paramId: 'frequency' },
      { symbol: 'v', label: 'Wave speed', paramId: 'waveSpeed' },
      { symbol: 'vs', label: 'Source speed', paramId: 'sourceSpeed' },
    ],
  },
  // Observed approaching frequency as a function of source speed: it climbs and runs away toward the
  // wave speed, showing why a source near the speed of the medium piles its wavefronts up.
  graph: singleSnapshot({
    xLabel: 'Source speed (m/s)',
    yLabel: 'Approaching frequency (Hz)',
    xRange: (s) => [0, s.params.waveSpeed * 0.9],
    yRange: (s) => [0, s.params.frequency * 6],
    id: 'fapp',
    label: "f' = f·v / (v - vs)",
    sample: (s, x) => (s.params.frequency * s.params.waveSpeed) / (s.params.waveSpeed - x),
  }),
  observations: [
    (s) =>
      `A source at ${s.params.frequency.toFixed(0)} Hz moving at ${s.params.sourceSpeed.toFixed(0)} m/s sounds like ${approachingFrequency(s.params).toFixed(0)} Hz as it approaches and ${recedingFrequency(s.params).toFixed(0)} Hz once it has passed.`,
    (s) =>
      s.params.sourceSpeed === 0
        ? 'With the source at rest the wavefronts are evenly spaced circles, so there is no frequency shift.'
        : null,
    (s) =>
      machNumber(s.params) >= 0.6
        ? 'The source is moving at a large fraction of the wave speed, so the wavefronts pile up tightly in front of it.'
        : null,
  ],
  explanation(s: SimState) {
    const up = approachingFrequency(s.params);
    const down = recedingFrequency(s.params);
    if (s.params.sourceSpeed === 0) {
      return `With the source stationary the wavefronts spread as evenly spaced circles in every direction, so every observer hears the same ${s.params.frequency.toFixed(0)} Hz. There is no Doppler shift until the source moves.`;
    }
    return `As the source moves it chases its own wavefronts, squashing them ahead and stretching them behind. An observer it approaches hears a higher f' = f·v / (v - vs) = ${up.toFixed(0)} Hz, while one it has passed hears a lower ${down.toFixed(0)} Hz. The jump from one to the other as it passes is the familiar siren drop.`;
  },
  draw: drawDopplerEffect,
};

export default dopplerEffectSim;
