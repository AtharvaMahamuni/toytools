// Normal Distribution Visualizer. The state is a mean, a standard deviation, and a
// bound on the bell curve. Dragging the canvas moves the bound. Sigma cannot reach 0,
// so the z-score never divides by zero. Pure model; canvas work is in the draw file.

import type { SimState, SimulationDef } from '../types';
import { drawNormalDistribution } from './normal-distribution.draw';

/** Shared x window for the curve, the mean, the bound, and the pointer map. */
export const AXIS_MIN = -4;
export const AXIS_MAX = 4;

/** Sigma floor. A width of 0 would make z undefined, so the slider stops here. */
export const SIGMA_MIN = 0.2;
export const SIGMA_MAX = 4;

/** How close |z| must be to 1, 2, or 3 before the empirical-rule note speaks. */
export const EMPIRICAL_TOLERANCE = 0.08;

const SQRT_2PI = Math.sqrt(2 * Math.PI);

/** Abramowitz and Stegun 7.1.26 coefficients for erf. */
const ERF_P = 0.3275911;
const ERF_A = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429] as const;

export function effectiveSigma(sigma: number): number {
  return sigma >= SIGMA_MIN ? sigma : SIGMA_MIN;
}

/** z = (bound - mean) / sigma, with sigma held at the floor. */
export function zScore(s: SimState): number {
  return (s.params.bound - s.params.mean) / effectiveSigma(s.params.sigma);
}

/** Abramowitz and Stegun approximation to the error function. Odd, and 0 at 0. */
export function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + ERF_P * ax);
  const [a1, a2, a3, a4, a5] = ERF_A;
  const poly = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t;
  return sign * (1 - poly * Math.exp(-ax * ax));
}

/** Standard normal CDF via the erf approximation. Φ(0) is 0.5. */
export function standardNormalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

export function leftArea(s: SimState): number {
  return standardNormalCdf(zScore(s));
}

export function rightArea(s: SimState): number {
  return 1 - leftArea(s);
}

/** 1, 2, or 3 when |z| is inside that empirical band, otherwise 0. */
export function empiricalBand(s: SimState): number {
  const az = Math.abs(zScore(s));
  if (az <= 1) return 1;
  if (az <= 2) return 2;
  if (az <= 3) return 3;
  return 0;
}

/** Density of the current normal, used to draw the bell. */
export function normalPdf(s: SimState, x: number): number {
  const sigma = effectiveSigma(s.params.sigma);
  const z = (x - s.params.mean) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * SQRT_2PI);
}

const EMPIRICAL_MARKS = [
  { z: 1, percent: '68', width: 'one standard deviation' },
  { z: 2, percent: '95', width: 'two standard deviations' },
  { z: 3, percent: '99.7', width: 'three standard deviations' },
] as const;

export function empiricalObservation(s: SimState): string | null {
  const az = Math.abs(zScore(s));
  for (const mark of EMPIRICAL_MARKS) {
    if (Math.abs(az - mark.z) <= EMPIRICAL_TOLERANCE + 1e-9) {
      return `About ${mark.percent}% of the area lies within ${mark.width} of the mean.`;
    }
  }
  return null;
}

export function sigmaFloorObservation(s: SimState): string | null {
  if (s.params.sigma > SIGMA_MIN + 1e-6) return null;
  return 'A zero width was refused, so sigma stays at 0.2 and the curve never divides by zero.';
}

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

const normalDistributionSim: SimulationDef = {
  id: 'normal-distribution',
  aspect: 16 / 9,
  paramBehavior: 'continuous',
  params: [
    { id: 'mean', label: 'Mean', unit: '', min: AXIS_MIN, max: AXIS_MAX, step: 0.1, default: 0, decimals: 1 },
    { id: 'sigma', label: 'Standard deviation', unit: '', min: SIGMA_MIN, max: SIGMA_MAX, step: 0.1, default: 1, decimals: 1 },
    { id: 'bound', label: 'Bound', unit: '', min: AXIS_MIN, max: AXIS_MAX, step: 0.1, default: 1, decimals: 1 },
  ],
  presets: [
    { id: 'standard', label: 'Standard', values: { mean: 0, sigma: 1, bound: 0 } },
    { id: 'one-sigma', label: 'One sigma', values: { mean: 0, sigma: 1, bound: 1 } },
    { id: 'two-sigma', label: 'Two sigma', values: { mean: 0, sigma: 1, bound: 2 } },
  ],
  init: () => ({}),
  step(s: SimState, dt: number): void {
    s.t += dt;
  },
  measurements: [
    { id: 'z', label: 'z-score', unit: '', decimals: 2, compute: zScore },
    { id: 'leftArea', label: 'Left area Φ', unit: '', decimals: 4, compute: leftArea },
    { id: 'rightArea', label: 'Right area', unit: '', decimals: 4, compute: rightArea },
    { id: 'empiricalBand', label: 'Empirical band', unit: '', decimals: 0, compute: empiricalBand },
  ],
  formula: {
    expression: 'z = (x - μ) / σ',
    substitution: '({bound} - {mean}) / {sigma}',
    terms: [
      { symbol: 'z', label: 'z-score', measurementId: 'z' },
      { symbol: 'x', label: 'Bound', paramId: 'bound' },
      { symbol: 'μ', label: 'Mean', paramId: 'mean' },
      { symbol: 'σ', label: 'Standard deviation', paramId: 'sigma' },
    ],
  },
  observations: [empiricalObservation, sigmaFloorObservation],
  pointer: {
    hint: 'Drag the bound',
    handle(_s, ev) {
      const bound = AXIS_MIN + ev.x * (AXIS_MAX - AXIS_MIN);
      return { bound: clamp(bound, AXIS_MIN, AXIS_MAX) };
    },
  },
  explanation(s: SimState): string {
    const { mean, sigma } = s.params;
    const z = zScore(s);
    const left = leftArea(s);
    const right = rightArea(s);
    return `Mean ${mean.toFixed(1)} and sigma ${sigma.toFixed(1)} put this bound at z = ${z.toFixed(2)}. The shaded left area is ${left.toFixed(4)} and the right area is ${right.toFixed(4)}.`;
  },
  draw: drawNormalDistribution,
};

export default normalDistributionSim;
