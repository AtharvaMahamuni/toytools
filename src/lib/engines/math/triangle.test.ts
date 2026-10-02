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

  it('rejects three angles, a short SSA side, and the wrong number of parts', () => {
    expect(solveTriangle({ ...blank, A: 60, B: 60, C: 60 })).toEqual({
      error: 'Three angles fix the shape, not the size. Add a side, or clear one angle.',
    });
    const miss = solveTriangle({ ...blank, A: 30, a: 4, b: 10 });
    expect('error' in miss && miss.error.startsWith('No triangle')).toBe(true);
    expect(solveTriangle({ ...blank, a: 3, b: 4 }).error).toMatch(/any three parts/);
    expect(solveTriangle({ ...blank, a: 3, b: 4, c: 5, C: 90 }).error).toMatch(/exactly three parts/);
  });
});

describe('triangle calculator', () => {
  it('names the second triangle in the result when SSA is ambiguous', () => {
    const res = runMath('triangle', { a: 7, b: 10, c: '', A: 30, B: '', C: '' }, {});
    expect(res.uiState).toBe('success');
    expect(res.hero?.raw).toBe(2);
    expect(res.insights.some((item) => item.tone === 'caution' && item.text.includes('second triangle'))).toBe(true);
    expect(res.visualization?.kind).toBe('polygon');
    expect(res.visualization?.data.series).toHaveLength(2);
  });
});
