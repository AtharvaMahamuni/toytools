// Numeric assertions for the Normal Distribution Visualizer. Pins z, the Abramowitz and
// Stegun CDF anchors, the left/right split, the sigma floor, the bound drag, and determinism.

import { describe, expect, it } from 'vitest';
import type { SimState } from '../types';
import { expectSimulation } from '../contract';
import { manifest } from './normal-distribution.manifest';
import normalDistribution, {
  empiricalBand,
  leftArea,
  rightArea,
  standardNormalCdf,
  zScore,
  SIGMA_MIN,
} from './normal-distribution';

function stateFor(mean: number, sigma: number, bound: number): SimState {
  const params = { mean, sigma, bound };
  return { t: 0, params, vars: normalDistribution.init(params) };
}

function sentenceCount(text: string): number {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z])|(?<=[.!?])$/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0).length;
}

describe('normal distribution model', () => {
  expectSimulation(normalDistribution);

  it('computes z = (bound - mean) / sigma', () => {
    expect(zScore(stateFor(0, 1, 1))).toBeCloseTo(1, 12);
    expect(zScore(stateFor(2, 0.5, 3))).toBeCloseTo(2, 12);
    expect(zScore(stateFor(-1, 2, -1))).toBeCloseTo(0, 12);
    expect(zScore(stateFor(0, 1, 1.96))).toBeCloseTo(1.96, 12);
  });

  it('matches the Abramowitz and Stegun CDF anchors', () => {
    expect(standardNormalCdf(0)).toBeCloseTo(0.5, 6);
    expect(standardNormalCdf(1)).toBeCloseTo(0.8413, 4);
    expect(standardNormalCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(standardNormalCdf(-1)).toBeCloseTo(1 - standardNormalCdf(1), 12);
  });

  it('splits the bell so the left area and the right area add to 1', () => {
    for (const bound of [-1.96, -1, 0, 0.5, 1, 1.96, 3]) {
      const s = stateFor(0, 1, bound);
      expect(leftArea(s) + rightArea(s)).toBeCloseTo(1, 12);
      expect(leftArea(s)).toBeCloseTo(standardNormalCdf(bound), 12);
      expect(rightArea(s)).toBeCloseTo(1 - leftArea(s), 12);
    }
    const s = stateFor(0, 1, 1);
    const byId = Object.fromEntries(normalDistribution.measurements.map((m) => [m.id, m.compute(s)]));
    expect(byId.z).toBeCloseTo(1, 12);
    expect(byId.leftArea).toBeCloseTo(0.8413, 3);
    expect(byId.leftArea + byId.rightArea).toBeCloseTo(1, 12);
    expect(byId.empiricalBand).toBe(1);
  });

  it('keeps a sigma floor through the param min and never asks for sigma 0', () => {
    const sigma = normalDistribution.params.find((p) => p.id === 'sigma')!;
    expect(sigma.min).toBe(SIGMA_MIN);
    expect(sigma.min).toBe(0.2);
    expect(sigma.min).toBeGreaterThan(0);
    expect(sigma.max).toBe(4);
    expect(sigma.default).toBe(1);
    const s = stateFor(0, sigma.min, 1);
    expect(zScore(s)).toBeCloseTo(1 / sigma.min, 12);
    for (const m of normalDistribution.measurements) {
      expect(Number.isFinite(m.compute(s)), m.id).toBe(true);
    }
  });

  it('maps a horizontal drag at x = 0.5 onto bound 0', () => {
    const bound = normalDistribution.params.find((p) => p.id === 'bound')!;
    expect(bound.min).toBe(-4);
    expect(bound.max).toBe(4);
    const s = stateFor(0, 1, 1);
    expect(normalDistribution.pointer?.hint).toBe('Drag the bound');
    expect(normalDistribution.pointer!.handle(s, { type: 'move', x: 0.5, y: 0.25, t: 0 })).toEqual({ bound: 0 });
    expect(normalDistribution.pointer!.handle(s, { type: 'down', x: 0, y: 0, t: 0 })?.bound).toBe(-4);
    expect(normalDistribution.pointer!.handle(s, { type: 'move', x: 1, y: 1, t: 0 })?.bound).toBe(4);
  });

  it('keeps identical steps identical', () => {
    const a = stateFor(0.4, 1.2, -0.3);
    const b = stateFor(0.4, 1.2, -0.3);
    for (let i = 0; i < 8; i++) {
      normalDistribution.step(a, 0.125);
      normalDistribution.step(b, 0.125);
    }
    expect(a).toEqual(b);
    expect(a.t).toBeCloseTo(1, 12);
    expect(a.vars).toEqual({});
    expect(a.params).toEqual({ mean: 0.4, sigma: 1.2, bound: -0.3 });
  });

  it('bands the empirical rule and stays silent on an ordinary curve', () => {
    expect(empiricalBand(stateFor(0, 1, 0.5))).toBe(1);
    expect(empiricalBand(stateFor(0, 1, 1))).toBe(1);
    expect(empiricalBand(stateFor(0, 1, 1.5))).toBe(2);
    expect(empiricalBand(stateFor(0, 1, 2.5))).toBe(3);
    expect(empiricalBand(stateFor(0, 1, 3.5))).toBe(0);

    expect(normalDistribution.observations.every((rule) => rule(stateFor(0, 1, 0.4)) === null)).toBe(true);

    expect(normalDistribution.observations[0](stateFor(0, 1, 1))).toMatch(/68/);
    expect(normalDistribution.observations[0](stateFor(0, 1, -2))).toMatch(/95/);
    expect(normalDistribution.observations[0](stateFor(0, 1, 3))).toMatch(/99\.7/);
    expect(normalDistribution.observations[0](stateFor(0, 1, 1.2))).toBeNull();

    const floor = normalDistribution.observations.map((rule) => rule(stateFor(0, 0.2, 0))).filter(Boolean).join(' ');
    expect(floor.toLowerCase()).toContain('zero width');
    expect(floor.toLowerCase()).toContain('refused');
    expect(normalDistribution.observations[0](stateFor(0, 0.2, 0))).toBeNull();
  });

  it('explains the current mean, sigma, z, and both areas with real numbers', () => {
    const text = normalDistribution.explanation(stateFor(0, 1, 1));
    expect(text).toContain('Mean 0.0');
    expect(text).toContain('sigma 1.0');
    expect(text).toContain('z = 1.00');
    expect(text).toMatch(/0\.8413/);
    expect(text).toMatch(/0\.1587/);
  });

  it('pins the manifest copy to the model and the required prose', () => {
    expect(normalDistribution.id).toBe('normal-distribution');
    expect(manifest.metadata.processorId).toBe('normal-distribution');
    expect(manifest.metadata.slug).toBe('normal-distribution-visualizer');
    expect(manifest.metadata.title).toBe('Normal Distribution Visualizer');
    expect(manifest.concepts.primary).toEqual(['normal distribution calculator']);
    expect(manifest.paramBehavior).toBe(normalDistribution.paramBehavior);
    expect(manifest.aspect).toBe(normalDistribution.aspect);
    expect(manifest.params).toBe(normalDistribution.params);
    expect(manifest.presets).toBe(normalDistribution.presets);
    expect(manifest.formula).toBe(normalDistribution.formula);
    expect(manifest.formula?.expression).toBe('z = (x - μ) / σ');
    expect(manifest.job?.userJob).toBe(
      'Drag the mean, the standard deviation, and a bound on a bell curve and read the shaded probability.',
    );
    expect(manifest.citation?.nonGoal.startsWith('replace ')).toBe(true);
    expect(manifest.citation?.nonGoal.endsWith('.')).toBe(true);
    expect(manifest.relationships?.usedWith?.[0]?.slug).toBe('statistics-visualizer');
    expect(manifest.seo.description.length).toBeLessThanOrEqual(160);
    expect(manifest.seo.tagline!.length).toBeLessThanOrEqual(80);
    expect(manifest.guide.description.length).toBeLessThanOrEqual(160);
    expect(manifest.educational.summary.length).toBeLessThanOrEqual(160);
    expect(manifest.guide.sections).toHaveLength(4);
    expect(manifest.faq.length).toBeGreaterThanOrEqual(6);

    const questions = manifest.faq.map((item) => item.question);
    expect(questions).toEqual(expect.arrayContaining([
      'What is a normal distribution?',
      'What is the difference between a z-score and the shaded area?',
      'Why does a zero standard deviation get refused?',
      'How do the 68, 95, and 99.7 bands work?',
    ]));

    const blob = JSON.stringify(manifest);
    expect(blob).not.toContain('\u2014');
    expect(blob).not.toContain('\u2013');

    for (const item of manifest.faq) {
      const n = sentenceCount(item.answer);
      expect(n, item.question).toBeGreaterThanOrEqual(2);
      expect(n, item.question).toBeLessThanOrEqual(4);
    }
  });
});
