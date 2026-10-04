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
  const shownAngles = (note: string) => [...note.matchAll(/(\d+(?:\.\d+)?)°/g)].map((match) => Number(match[1]));
  const exactAngles = (a: number, b: number, c: number) => {
    const A = (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
    const B = (Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180) / Math.PI;
    return [A, B, 180 - A - B];
  };

  it.each([
    [1, 3, 3],
    [2, 5, 5],
  ])('shows equal base angles for the isosceles triangle %s, %s, %s, each within 0.005 of exact', (a, b, c) => {
    const res = runMath('triangle', { a, b, c, A: '', B: '', C: '' }, {});
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const shown = shownAngles(res.hero?.note ?? '');
    expect(shown).toHaveLength(3);
    expect(shown[1]).toBe(shown[2]);
    exactAngles(a, b, c).forEach((exact, i) => expect(Math.abs(shown[i] - exact)).toBeLessThan(0.005));
    const raw = res.metrics.filter((metric) => metric.id.startsWith('angle-')).map((metric) => metric.raw);
    expect(raw).toEqual(shown);
    expect(res.assumptions.some((item) => item.value.includes('180.01'))).toBe(true);
  });

  it('solves a 0.003, 0.004, 0.005 right triangle and prints the real sides', () => {
    const res = runMath('triangle', { a: 0.003, b: 0.004, c: 0.005, A: '', B: '', C: '' }, {});
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.hero?.label).toBe('Right triangle');
    const sides = res.metrics.filter((metric) => metric.id.startsWith('side-')).map((metric) => metric.value);
    expect(sides).toEqual(['0.003', '0.004', '0.005']);
    expect(res.insights[0].text).toContain('side a 0.003, b 0.004, c 0.005');
  });

  it('does not call a 0.004 degree SAS triangle right just because B and C round toward 90', () => {
    const res = runMath('triangle', { a: '', b: 1, c: 1, A: 0.004, B: '', C: '' }, {});
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.hero?.label).toBe('SAS triangle');
    expect(res.metrics.find((metric) => metric.id === 'angle-b')?.value).toBe('89.998°');
    expect(res.metrics.find((metric) => metric.id === 'angle-a')?.value).toBe('0.004°');
  });

  it('solves a thin 179.97 degree SAS triangle instead of calling it impossible', () => {
    const res = runMath('triangle', { a: '', b: 1, c: 1, A: 179.97, B: '', C: '' }, {});
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(Number(res.metrics.find((metric) => metric.id === 'side-a')?.raw)).toBeCloseTo(2, 6);
    expect(res.metrics.find((metric) => metric.id === 'angle-b')?.value).toBe('0.015°');
  });

  it('still rejects lengths that lie on a straight line, at any scale', () => {
    expect(solveTriangle({ ...blank, a: 1, b: 2, c: 3 }).error).toMatch(/cannot form a triangle/);
    expect(solveTriangle({ ...blank, a: 0.001, b: 0.002, c: 0.003 }).error).toMatch(/cannot form a triangle/);
    expect(solveTriangle({ ...blank, a: 1e6, b: 2e6, c: 3e6 }).error).toMatch(/cannot form a triangle/);
  });

  it('keeps the 3-4-5 right angle exact', () => {
    const res = runMath('triangle', { a: 3, b: 4, c: 5, A: '', B: '', C: '' }, {});
    expect(res.hero?.label).toBe('Right triangle');
    expect(res.hero?.note).toBe('Angle A 36.87°, B 53.13°, C 90°.');
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
