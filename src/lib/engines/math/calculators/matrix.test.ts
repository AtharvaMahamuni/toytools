import { describe, expect, it } from 'vitest';
import { determinant, inverse, multiply, parseMatrix, tidy } from './matrix';
import { runMath } from '../registry';

describe('matrix arithmetic', () => {
  it('multiplies the textbook 2 by 2 pair', () => {
    const a = parseMatrix('1 2\n3 4', 'A');
    const b = parseMatrix('5 6\n7 8', 'B');
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect(multiply(a.matrix, b.matrix)).toEqual([
      [19, 22],
      [43, 50],
    ]);
  });

  it('names both shapes when the inner sizes differ', () => {
    const a = parseMatrix('1 2 3\n4 5 6', 'A');
    const b = parseMatrix('1 2 3\n4 5 6', 'B');
    if (!a.ok || !b.ok) throw new Error('parse');
    const message = multiply(a.matrix, b.matrix);
    expect(message).toBe('A is 2×3 and B is 2×3. Multiply needs the inner sizes to match.');
  });

  it('tidies 0.1 + 0.2', () => {
    const a = parseMatrix('0.1 0.2', 'A');
    const b = parseMatrix('1\n1', 'B');
    if (!a.ok || !b.ok) throw new Error('parse');
    expect(multiply(a.matrix, b.matrix)).toEqual([[0.3]]);
    expect(tidy(0.1 + 0.2)).toBe(0.3);
  });

  it('accepts commas and semicolons', () => {
    const parsed = parseMatrix('1, 2; 3, 4', 'A');
    expect(parsed.ok && parsed.ok && parsed.matrix).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('computes a 2 by 2 determinant and inverse', () => {
    const parsed = parseMatrix('1 2\n3 4', 'A');
    if (!parsed.ok) throw new Error('parse');
    expect(determinant(parsed.matrix)).toBe(-2);
    expect(inverse(parsed.matrix)).toEqual([
      [-2, 1],
      [1.5, -0.5],
    ]);
  });

  it('refuses a singular inverse', () => {
    const parsed = parseMatrix('1 2\n2 4', 'A');
    if (!parsed.ok) throw new Error('parse');
    expect(inverse(parsed.matrix)).toBe('The determinant is 0, so this matrix has no inverse.');
    expect(determinant(parsed.matrix)).toBe(0);
  });
});

describe('matrix calculator', () => {
  it('returns the product and a worked first step', () => {
    const res = runMath('matrix', {
      operation: 'multiply',
      a: '1 2\n3 4',
      b: '5 6\n7 8',
    }, {});
    expect(res.ok).toBe(true);
    expect(res.hero?.raw).toBe(19);
    expect(res.insights?.[0]?.text).toContain('1×5 + 2×7 = 19');
    expect(res.insights?.[0]?.text.startsWith('Step 1:')).toBe(true);
  });
});
