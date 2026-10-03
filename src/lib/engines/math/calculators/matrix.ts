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
const EPS = 1e-10;

export type Matrix = number[][];

/** Drop binary noise around an integer. A value already near zero stays, so 1e-9 is not rewritten to 0. */
export function tidy(n: number): number {
  if (!Number.isFinite(n)) return n;
  const rounded = Math.round(n * 1e12) / 1e12;
  const nearest = Math.round(rounded);
  if (nearest === 0) return Math.abs(rounded) < 1e-12 ? 0 : rounded;
  if (Math.abs(rounded - nearest) < 1e-8 * Math.abs(nearest)) return nearest;
  return Math.round(rounded * 1e8) / 1e8;
}

export function fmt(n: number): string {
  const t = tidy(n);
  if (Number.isInteger(t)) return String(t);
  return String(t);
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
      for (let k = 0; k < b.length; k++) sum += a[i][k] * b[k][j];
      row.push(tidy(sum));
    }
    out.push(row);
  }
  return out;
}

export function determinant(m: Matrix): number | string {
  if (m.length !== m[0].length) return `A is ${shapeOf(m)}. Determinant needs a square matrix.`;
  const n = m.length;
  const a = m.map((row) => row.slice());
  let det = 1;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivot][col])) pivot = r;
    }
    if (Math.abs(a[pivot][col]) < EPS) return 0;
    if (pivot !== col) {
      const swap = a[col];
      a[col] = a[pivot];
      a[pivot] = swap;
      det = -det;
    }
    det *= a[col][col];
    for (let r = col + 1; r < n; r++) {
      const factor = a[r][col] / a[col][col];
      for (let c = col; c < n; c++) a[r][c] -= factor * a[col][c];
    }
  }
  return tidy(det);
}

export function inverse(m: Matrix): Matrix | string {
  if (m.length !== m[0].length) return `A is ${shapeOf(m)}. Inverse needs a square matrix.`;
  const n = m.length;
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
    if (Math.abs(a[pivot][col]) < EPS) return 'The determinant is 0, so this matrix has no inverse.';
    if (pivot !== col) {
      const swap = a[col];
      a[col] = a[pivot];
      a[pivot] = swap;
    }
    const div = a[col][col];
    for (let c = 0; c < n * 2; c++) a[col][c] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = a[r][col];
      for (let c = 0; c < n * 2; c++) a[r][c] -= factor * a[col][c];
    }
  }
  return a.map((row) => row.slice(n).map(tidy));
}

function sameShape(a: Matrix, b: Matrix, verb: string): string | null {
  if (a.length === b.length && a[0].length === b[0].length) return null;
  return `A is ${shapeOf(a)} and B is ${shapeOf(b)}. ${verb} needs both matrices to be the same shape.`;
}

function combine(a: Matrix, b: Matrix, op: 'add' | 'subtract'): Matrix {
  return a.map((row, i) => row.map((value, j) => tidy(op === 'add' ? value + b[i][j] : value - b[i][j])));
}

function transpose(m: Matrix): Matrix {
  return m[0].map((_, j) => m.map((row) => tidy(row[j])));
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
    return `${fmt(a[0][0])}×${fmt(a[1][1])} - ${fmt(a[0][1])}×${fmt(a[1][0])} = ${fmt(result as number)}.`;
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
