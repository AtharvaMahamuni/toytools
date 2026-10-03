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

  it('keeps a tiny typed entry instead of snapping it to zero', () => {
    const parsed = parseMatrix('1e-9 0\n0 1', 'A');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.matrix[0][0]).toBe(1e-9);
    expect(determinant(parsed.matrix)).not.toBe(0);
    expect(tidy(1e-9)).toBe(1e-9);
    expect(tidy(0.1 + 0.2)).toBe(0.3);
    expect(tidy(1.000000001)).toBe(1);
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
  it('adds, subtracts, transposes, and inverts through the operation menu', () => {
    const add = runMath('matrix', { operation: 'add', a: '1 2\n3 4', b: '5 6\n7 8' }, {});
    expect(add.ok).toBe(true);
    expect(add.insights?.[0]?.text).toContain('1 + 5 = 6');

    const sub = runMath('matrix', { operation: 'subtract', a: '5 6\n7 8', b: '1 2\n3 4' }, {});
    expect(sub.ok).toBe(true);
    expect(sub.insights?.[0]?.text).toContain('5 - 1 = 4');

    const flip = runMath('matrix', { operation: 'transpose', a: '1 2 3\n4 5 6', b: '' }, {});
    expect(flip.ok).toBe(true);
    expect(flip.hero?.raw).toBe(1);

    const det = runMath('matrix', { operation: 'determinant', a: '1 2\n3 4', b: '' }, {});
    expect(det.hero?.raw).toBe(-2);

    const inv = runMath('matrix', { operation: 'inverse', a: '1 2\n3 4', b: '' }, {});
    expect(inv.ok).toBe(true);
    expect(inv.hero?.raw).toBe(-2);
  });

  it('names a shape mismatch and a bad paste', () => {
    const mismatch = runMath('matrix', { operation: 'add', a: '1 2\n3 4', b: '1 2 3' }, {});
    expect(mismatch.ok).toBe(false);
    if (mismatch.ok) return;
    expect(mismatch.error).toContain('same shape');

    const bigDet = runMath('matrix', { operation: 'determinant', a: '1 2 3\n0 1 4\n5 6 0', b: '' }, {});
    expect(bigDet.ok).toBe(true);
    const swapped = parseMatrix('0 1\n1 0', 'A');
    if (swapped.ok) expect(determinant(swapped.matrix)).toBe(-1);

    const ragged = parseMatrix('1 2\n3', 'A');
    expect(ragged.ok).toBe(false);
    const word = parseMatrix('1 x', 'A');
    expect(word.ok).toBe(false);
    const empty = parseMatrix('   ', 'B');
    expect(empty.ok).toBe(false);
    const wide = parseMatrix('1 2 3 4 5 6 7 8 9', 'A');
    expect(wide.ok).toBe(false);
    const flat = parseMatrix('1 2 3', 'A');
    expect(flat.ok).toBe(true);
    if (flat.ok) {
      expect(determinant(flat.matrix)).toMatch(/square/);
      expect(inverse(flat.matrix)).toMatch(/square/);
    }
  });

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
