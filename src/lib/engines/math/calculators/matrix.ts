// Matrix calculator. Add, subtract, multiply, transpose, determinant, and inverse.
// A bad product names both shapes. Values are tidied so 0.1 + 0.2 prints as 0.3.

import type { MathCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import { selectField } from '../validation';
import { assumption, step } from '../story';

const OPS = ['multiply', 'add', 'subtract', 'transpose', 'determinant', 'inverse'] as const;
type Op = (typeof OPS)[number];

const MAX = 8;

export type Matrix = number[][];

/**
 * Drop binary noise without changing a real value. A value within 1e-12 (relative) of an integer
 * snaps to it, everything else keeps 12 significant digits, so 0.1 + 0.2 prints 0.3 while
 * 12345.0001, 1e-13 and 1e297 print as typed. `scale` is the size of the numbers the value was
 * computed from: a result that small next to them is cancellation noise and becomes 0. With no
 * scale nothing snaps to 0, so a tiny typed value is never erased.
 */
export function tidy(n: number, scale = 0): number {
  if (!Number.isFinite(n)) return n;
  if (scale > 0 && Math.abs(n) <= 1e-12 * scale) return 0;
  const nearest = Math.round(n);
  if (nearest !== 0 && Math.abs(n - nearest) <= 1e-12 * Math.max(1, Math.abs(n))) return nearest;
  return Number(n.toPrecision(12));
}

export function fmt(n: number): string {
  return String(tidy(n));
}

function maxAbs(m: Matrix): number {
  let max = 0;
  for (const row of m) for (const v of row) max = Math.max(max, Math.abs(v));
  return max;
}

/**
 * One singularity test for determinant and inverse, relative to the size of the entries, so a
 * matrix scaled by 1e5 is judged the same as the unscaled one and diag(1e-9) is not called singular.
 * `scale` is the largest entry of the pivot's own row as typed (a scaled pivot), so a row of small
 * entries is not judged against a large row: diag(1e160, 1) and diag(1, 1e-15) are invertible,
 * the same way diag(1e-9) is.
 */
function isSingularPivot(pivot: number, n: number, scale: number): boolean {
  return Math.abs(pivot) <= n * Number.EPSILON * scale * 16;
}

/** The determinant of a matrix of integers is an integer, so elimination noise around one is dropped. */
function isIntegerMatrix(m: Matrix): boolean {
  return m.every((row) => row.every((v) => Number.isInteger(v)));
}

function nearInteger(v: number): number {
  const nearest = Math.round(v);
  return Math.abs(v - nearest) <= 1e-8 * Math.max(1, Math.abs(nearest)) ? nearest : tidy(v);
}

function rowScales(m: Matrix): number[] {
  return m.map((row) => row.reduce((max, v) => Math.max(max, Math.abs(v)), 0));
}

export function shapeOf(m: Matrix): string {
  return `${m.length}×${m[0]?.length ?? 0}`;
}

export function parseMatrix(raw: string, name: string): { ok: true; matrix: Matrix } | { ok: false; error: string } {
  const text = raw.trim();
  if (!text) return { ok: false, error: `Enter matrix ${name}. Put one row on each line.` };
  const lines = text.split(/[;\n]+/).map((line) => line.trim()).filter(Boolean);
  const rows: number[][] = [];
  for (let i = 0; i < lines.length; i++) {
    const cells = lines[i].split(/[\s,]+/).filter(Boolean);
    const nums = cells.map(Number);
    if (nums.some((n) => !Number.isFinite(n))) {
      return { ok: false, error: `Row ${i + 1} of ${name} has a value that is not a number.` };
    }
    if (nums.length === 0) return { ok: false, error: `Row ${i + 1} of ${name} is empty.` };
    rows.push(nums);
  }
  const width = rows[0].length;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length !== width) {
      return {
        ok: false,
        error: `Row ${i + 1} of ${name} has ${rows[i].length} numbers and row 1 has ${width}.`,
      };
    }
  }
  if (rows.length > MAX || width > MAX) {
    return { ok: false, error: `${name} is ${rows.length}×${width}. Keep each matrix at 8 by 8 or smaller.` };
  }
  return { ok: true, matrix: rows };
}

export function multiply(a: Matrix, b: Matrix): Matrix | string {
  if (a[0].length !== b.length) {
    return `A is ${shapeOf(a)} and B is ${shapeOf(b)}. Multiply needs the inner sizes to match.`;
  }
  const out: Matrix = [];
  for (let i = 0; i < a.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0;
      let size = 0;
      for (let k = 0; k < b.length; k++) {
        sum += a[i][k] * b[k][j];
        size += Math.abs(a[i][k] * b[k][j]);
      }
      row.push(tidy(sum, size));
    }
    out.push(row);
  }
  return out;
}

export function determinant(m: Matrix): number | string {
  if (m.length !== m[0].length) return `A is ${shapeOf(m)}. Determinant needs a square matrix.`;
  const n = m.length;
  const scale = maxAbs(m);
  if (scale === 0) return 0;
  const a = m.map((row) => row.slice());
  const rows = rowScales(m);
  let det = 1;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    }
    if (isSingularPivot(a[pivot][col], n, rows[pivot])) return 0;
    if (pivot !== col) {
      const swap = a[col];
      a[col] = a[pivot];
      a[pivot] = swap;
      [rows[col], rows[pivot]] = [rows[pivot], rows[col]];
      det = -det;
    }
    det *= a[col][col];
    for (let r = col + 1; r < n; r++) {
      const factor = a[r][col] / a[col][col];
      for (let c = col; c < n; c++) a[r][c] -= factor * a[col][c];
    }
  }
  // No snap to 0 here: the scaled pivot test above already returns 0 for singular input, and a
  // snap against the size of the rows erased real determinants (Pascal 8 has det 1).
  return isIntegerMatrix(m) ? nearInteger(det) : tidy(det);
}

export function inverse(m: Matrix): Matrix | string {
  if (m.length !== m[0].length) return `A is ${shapeOf(m)}. Inverse needs a square matrix.`;
  const SINGULAR = 'The determinant is 0, so this matrix has no inverse.';
  // Inverse and Determinant must never disagree, so the determinant decides first.
  if (determinant(m) === 0) return SINGULAR;
  const n = m.length;
  const rows = rowScales(m);
  const a = m.map((row, i) => {
    const aug = row.slice();
    for (let j = 0; j < n; j++) aug.push(i === j ? 1 : 0);
    return aug;
  });
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    }
    if (isSingularPivot(a[pivot][col], n, rows[pivot])) return SINGULAR;
    if (pivot !== col) {
      const swap = a[col];
      a[col] = a[pivot];
      a[pivot] = swap;
      [rows[col], rows[pivot]] = [rows[pivot], rows[col]];
    }
    const div = a[col][col];
    for (let c = 0; c < n * 2; c++) a[col][c] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = a[r][col];
      for (let c = 0; c < n * 2; c++) a[r][c] -= factor * a[col][c];
    }
  }
  // Tidy each entry against its own row of the inverse, so the 1e-160 in the inverse of
  // diag(1e160, 1) is not snapped to 0 by the 1 in the other row.
  const inv = a.map((row) => row.slice(n));
  return inv.map((row) => {
    const rowScale = row.reduce((max, v) => Math.max(max, Math.abs(v)), 0);
    return row.map((v) => tidy(v, rowScale));
  });
}

function sameShape(a: Matrix, b: Matrix, verb: string): string | null {
  if (a.length === b.length && a[0].length === b[0].length) return null;
  return `A is ${shapeOf(a)} and B is ${shapeOf(b)}. ${verb} needs both matrices to be the same shape.`;
}

function combine(a: Matrix, b: Matrix, op: 'add' | 'subtract'): Matrix {
  return a.map((row, i) =>
    row.map((value, j) =>
      tidy(op === 'add' ? value + b[i][j] : value - b[i][j], Math.max(Math.abs(value), Math.abs(b[i][j]))),
    ),
  );
}

function transpose(m: Matrix): Matrix {
  return m[0].map((_, j) => m.map((row) => row[j]));
}

function firstStep(op: Op, a: Matrix, b: Matrix | null, result: Matrix | number): string {
  if (op === 'multiply' && b) {
    const terms = a[0].map((value, k) => `${fmt(value)}×${fmt(b[k][0])}`).join(' + ');
    return `The first entry is row 1 of A dotted with column 1 of B: ${terms} = ${fmt((result as Matrix)[0][0])}.`;
  }
  if ((op === 'add' || op === 'subtract') && b) {
    const sign = op === 'add' ? '+' : '-';
    return `The first entry is ${fmt(a[0][0])} ${sign} ${fmt(b[0][0])} = ${fmt((result as Matrix)[0][0])}.`;
  }
  if (op === 'transpose') return 'Row 1 of A becomes column 1 of the result.';
  if (op === 'determinant' && a.length === 2) {
    const line = `${fmt(a[0][0])}×${fmt(a[1][1])} - ${fmt(a[0][1])}×${fmt(a[1][0])}`;
    const raw = a[0][0] * a[1][1] - a[0][1] * a[1][0];
    // The singularity test can call a rounding-sized ad - bc zero. Printing "= 0" then would be a
    // false equation, so the step says what happened instead.
    if (result === 0 && raw !== 0) {
      return `${line} ≈ 0. That is rounding error for entries this size, so the matrix is treated as singular.`;
    }
    return `${line} = ${fmt(result as number)}.`;
  }
  if (op === 'determinant') return `Elimination on this ${shapeOf(a)} matrix gives ${fmt(result as number)}.`;
  return `Gauss-Jordan on the augmented matrix puts ${fmt((result as Matrix)[0][0])} in the top-left of the inverse.`;
}

const HERO_LABEL: Record<Op, string> = {
  multiply: 'Product',
  add: 'Sum',
  subtract: 'Difference',
  transpose: 'Transpose',
  determinant: 'Determinant',
  inverse: 'Inverse',
};

function matrixCards(result: Matrix, heroLabel: string): { hero: ResultCard; metrics: ResultCard[] } {
  const hero = card('entry', heroLabel, fmt(result[0][0]), {
    raw: result[0][0],
    emphasis: 'hero',
    note: `${shapeOf(result)} result. The headline is the top-left entry.`,
  });
  const metrics = [
    card('rows', 'Rows', String(result.length), { raw: result.length }),
    card('cols', 'Columns', String(result[0].length), { raw: result[0].length }),
    ...result.map((row, i) => card(`row-${i + 1}`, `Row ${i + 1}`, row.map(fmt).join('  '))),
  ];
  return { hero, metrics };
}

export const matrixCalculator: MathCalculator = {
  id: 'matrix',
  family: 'matrices',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'operation',
      label: 'Operation',
      type: 'select',
      default: 'multiply',
      options: [
        { value: 'multiply', label: 'Multiply' },
        { value: 'add', label: 'Add' },
        { value: 'subtract', label: 'Subtract' },
        { value: 'transpose', label: 'Transpose' },
        { value: 'determinant', label: 'Determinant' },
        { value: 'inverse', label: 'Inverse' },
      ],
    },
    {
      id: 'a',
      label: 'Matrix A',
      type: 'text',
      multiline: true,
      default: '1 2\n3 4',
      help: 'One row per line. Separate numbers with spaces or commas. A semicolon also starts a row.',
    },
    {
      id: 'b',
      label: 'Matrix B',
      type: 'text',
      multiline: true,
      default: '5 6\n7 8',
      optional: true,
      help: 'Used for add, subtract, and multiply. Transpose, determinant, and inverse read A only.',
    },
  ],

  calculate(input) {
    const opField = selectField(input, 'operation', 'an operation', OPS);
    if (!opField.ok) return opField.result;
    const op = opField.value;

    const parsedA = parseMatrix(String(input.a ?? ''), 'A');
    if (!parsedA.ok) return validationError(parsedA.error);
    const a = parsedA.matrix;

    const needsB = op === 'multiply' || op === 'add' || op === 'subtract';
    let b: Matrix | null = null;
    if (needsB) {
      const parsedB = parseMatrix(String(input.b ?? ''), 'B');
      if (!parsedB.ok) return validationError(parsedB.error);
      b = parsedB.matrix;
    }

    let result: Matrix | number | string;
    if (op === 'multiply') result = multiply(a, b!);
    else if (op === 'add') {
      const mismatch = sameShape(a, b!, 'Add');
      result = mismatch ?? combine(a, b!, 'add');
    } else if (op === 'subtract') {
      const mismatch = sameShape(a, b!, 'Subtract');
      result = mismatch ?? combine(a, b!, 'subtract');
    } else if (op === 'transpose') result = transpose(a);
    else if (op === 'determinant') result = determinant(a);
    else result = inverse(a);

    if (typeof result === 'string') return validationError(result);

    const worked = firstStep(op, a, b, result);
    const shared = {
      insights: [step(1, worked)],
      assumptions: [
        assumption('Size', 'Each matrix is at most 8 by 8.'),
        assumption('Rounding', 'Binary noise is tidied, so 0.1 + 0.2 prints as 0.3.'),
      ],
      explanation: worked,
    };

    if (typeof result === 'number') {
      return successResult({
        ...shared,
        hero: card('determinant', 'Determinant', fmt(result), { raw: result, emphasis: 'hero' }),
        metrics: [card('order', 'Order', String(a.length), { raw: a.length })],
      });
    }

    const cards = matrixCards(result, HERO_LABEL[op]);
    return successResult({ ...shared, hero: cards.hero, metrics: cards.metrics });
  },
};
