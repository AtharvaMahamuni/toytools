import { describe, expect, it } from 'vitest';
import { runMath } from './registry';
import { solveTriangle } from './calculators/triangle';

const blank = { a: null, b: null, c: null, A: null, B: null, C: null };

describe('solveTriangle', () => {
  it('solves the 3-4-5 right triangle from three sides', () => {
    const solved = solveTriangle({ ...blank, a: 3, b: 4, c: 5 });
    expect('error' in solved).toBe(false);
    if ('error' in solved) return;
    expect(solved.kind).toBe('SSS');
    expect(solved.solutions).toHaveLength(1);
    expect(solved.solutions[0].C).toBeCloseTo(90, 6);
    expect(solved.solutions[0].A).toBeCloseTo(36.8698976, 4);
    expect(solved.solutions[0].B).toBeCloseTo(53.1301024, 4);
  });

  it('solves SAS when the included angle is the known one', () => {
    const solved = solveTriangle({ ...blank, a: 3, b: 4, C: 90 });
    expect('error' in solved).toBe(false);
    if ('error' in solved) return;
    expect(solved.kind).toBe('SAS');
    expect(solved.solutions[0].c).toBeCloseTo(5, 6);
  });

  it('returns both SSA triangles when the opposite side clears the height but is not the longest', () => {
    const solved = solveTriangle({ ...blank, a: 7, b: 10, A: 30 });
    expect('error' in solved).toBe(false);
    if ('error' in solved) return;
    expect(solved.kind).toBe('SSA');
    expect(solved.solutions).toHaveLength(2);
    const [first, second] = solved.solutions;
    expect(first.a).toBeCloseTo(7, 6);
    expect(first.b).toBeCloseTo(10, 6);
    expect(second.a).toBeCloseTo(7, 6);
    expect(second.b).toBeCloseTo(10, 6);
    expect(first.B).toBeCloseTo(45.5846914, 4);
    expect(second.B).toBeCloseTo(134.4153086, 4);
    expect(first.C + second.C).toBeCloseTo(120, 4);
  });

  it('solves SAS from either included angle', () => {
    const fromA = solveTriangle({ ...blank, b: 3, c: 4, A: 90 });
    const fromB = solveTriangle({ ...blank, a: 3, c: 4, B: 90 });
    expect('error' in fromA || 'error' in fromB).toBe(false);
    if ('error' in fromA || 'error' in fromB) return;
    expect(fromA.kind).toBe('SAS');
    expect(fromB.kind).toBe('SAS');
    expect(fromA.solutions[0].a).toBeCloseTo(5, 6);
    expect(fromB.solutions[0].b).toBeCloseTo(5, 6);
  });

  it('solves ASA and AAS from two angles and one side', () => {
    const asa = solveTriangle({ ...blank, A: 40, B: 60, c: 10 });
    const aas = solveTriangle({ ...blank, A: 40, B: 60, a: 10 });
    expect('error' in asa || 'error' in aas).toBe(false);
    if ('error' in asa || 'error' in aas) return;
    expect(asa.kind).toBe('ASA');
    expect(aas.kind).toBe('AAS');
    expect(asa.solutions[0].C).toBeCloseTo(80, 6);
    expect(aas.solutions[0].C).toBeCloseTo(80, 6);
  });

  it('rejects three angles, a short SSA side, and the wrong number of parts', () => {
    expect(solveTriangle({ ...blank, A: 60, B: 60, C: 60 })).toEqual({
      error: 'Three angles fix the shape, not the size. Add a side, or clear one angle.',
    });
    const miss = solveTriangle({ ...blank, A: 30, a: 4, b: 10 });
    expect('error' in miss && miss.error.startsWith('No triangle')).toBe(true);
    expect(solveTriangle({ ...blank, a: 3, b: 4 }).error).toMatch(/any three parts/);
    expect(solveTriangle({ ...blank, a: 3, b: 4, c: 5, C: 90 }).error).toMatch(/exactly three parts/);
    expect(solveTriangle({ ...blank, a: 2, b: 3, c: 6 }).error).toMatch(/cannot form a triangle/);
    expect(solveTriangle({ ...blank, A: 100, B: 90, c: 5 }).error).toMatch(/180 degrees or more/);
    expect(solveTriangle({ ...blank, a: 3, b: 4, C: 180 }).error).toMatch(/between 0 and 180/);
    expect(solveTriangle({ ...blank, A: 120, a: 9, b: 10 }).error).toMatch(/longest side/);
  });
});

describe('triangle calculator', () => {
  it('prints angles that add to 180 after rounding', () => {
    const res = runMath('triangle', { a: 1, b: 3, c: 3, A: '', B: '', C: '' }, {});
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const note = res.hero?.note ?? '';
    const shown = [...note.matchAll(/(\d+(?:\.\d+)?)°/g)].map((match) => Number(match[1]));
    expect(shown).toEqual([19.19, 80.41, 80.4]);
    expect(shown.reduce((sum, angle) => sum + angle, 0)).toBeCloseTo(180, 8);
    const raw = res.metrics.filter((metric) => metric.id.startsWith('angle-')).map((metric) => metric.raw);
    expect(raw).toEqual(shown);
  });

  it('names the second triangle in the result when SSA is ambiguous', () => {
    const res = runMath('triangle', { a: 7, b: 10, c: '', A: 30, B: '', C: '' }, {});
    expect(res.uiState).toBe('success');
    expect(res.hero?.raw).toBe(2);
    expect(res.insights.some((item) => item.tone === 'caution' && item.text.includes('second triangle'))).toBe(true);
    expect(res.visualization?.kind).toBe('polygon');
    expect(res.visualization?.data.series).toHaveLength(2);
  });
});
