// Fraction calculator: add, subtract, multiply, or divide two fractions (integers, a/b, or mixed
// numbers like "1 2/3"), with the arithmetic worked step by step (LCD, conversion, combination,
// simplification) and the answer shown simplified, as a mixed number, and as a decimal.

import type { MathCalculator } from '../types';
import { successResult, card } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  bgcd,
  blcm,
  divFractions,
  formatBigInt,
  formatFraction,
  formatMixed,
  fractionToDecimal,
  mulFractions,
  simplify,
  type Fraction,
} from '../models';
import { fractionField, selectField } from '../validation';
import { validationError } from '@lib/results/index';
import { assumption, decisions, insight, step, toolDecision } from '../story';

const OPS = ['add', 'subtract', 'multiply', 'divide'] as const;
type Op = (typeof OPS)[number];

const OP_SYMBOL: Record<Op, string> = { add: '+', subtract: '-', multiply: '×', divide: '÷' };

export const fractionCalculator: MathCalculator = {
  id: 'fraction',
  family: 'fractions',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'first',
      label: 'First fraction',
      type: 'text',
      default: '1/2',
      placeholder: 'e.g. 3/4, 7, or 1 2/3',
      required: true,
    },
    {
      id: 'op',
      label: 'Operation',
      type: 'select',
      default: 'add',
      options: [
        { value: 'add', label: 'Add (+)' },
        { value: 'subtract', label: 'Subtract (-)' },
        { value: 'multiply', label: 'Multiply (×)' },
        { value: 'divide', label: 'Divide (÷)' },
      ],
    },
    {
      id: 'second',
      label: 'Second fraction',
      type: 'text',
      default: '3/4',
      placeholder: 'e.g. 3/4, 7, or 1 2/3',
      required: true,
    },
  ],

  calculate(input, _opts) {
    const a = fractionField(input, 'first', 'the first fraction');
    if (!a.ok) return a.result;
    const b = fractionField(input, 'second', 'the second fraction');
    if (!b.ok) return b.result;
    const op = selectField(input, 'op', 'an operation', OPS);
    if (!op.ok) return op.result;

    const A = a.value;
    const B = b.value;
    const steps = [];
    let raw: Fraction;
    let n = 1;

    // Mixed numbers get rewritten as improper fractions before any arithmetic.
    if (String(input.first).trim().includes(' ') || String(input.second).trim().includes(' ')) {
      steps.push(step(n++, `Rewrite the mixed numbers as improper fractions: ${formatFraction(A)} and ${formatFraction(B)}.`));
    }

    if (op.value === 'add' || op.value === 'subtract') {
      const lcd = blcm(A.d, B.d);
      const an = (A.n * lcd) / A.d;
      const bn = (B.n * lcd) / B.d;
      if (A.d !== B.d) {
        steps.push(step(n++, `The least common denominator of ${formatBigInt(A.d)} and ${formatBigInt(B.d)} is ${formatBigInt(lcd)}.`));
        steps.push(step(n++, `Convert both: ${formatFraction(A)} = ${formatBigInt(an)}/${formatBigInt(lcd)} and ${formatFraction(B)} = ${formatBigInt(bn)}/${formatBigInt(lcd)}.`));
      }
      raw = { n: op.value === 'add' ? an + bn : an - bn, d: lcd };
      steps.push(
        step(
          n++,
          `${op.value === 'add' ? 'Add' : 'Subtract'} the numerators over the common denominator: (${formatBigInt(an)} ${OP_SYMBOL[op.value]} ${formatBigInt(bn)}) / ${formatBigInt(lcd)} = ${formatFraction(raw)}.`,
        ),
      );
    } else if (op.value === 'multiply') {
      raw = mulFractions(A, B);
      steps.push(step(n++, `Multiply straight across: (${formatBigInt(A.n)} × ${formatBigInt(B.n)}) / (${formatBigInt(A.d)} × ${formatBigInt(B.d)}) = ${formatFraction(raw)}.`));
    } else {
      const divided = divFractions(A, B);
      if (!divided) return validationError('Cannot divide by zero: the second fraction is 0.');
      const recip = divFractions({ n: 1n, d: 1n }, B)!;
      raw = divided;
      steps.push(step(n++, `Flip the second fraction and multiply: ${formatFraction(A)} × ${formatFraction(recip)} = ${formatFraction(raw)}.`));
    }

    const answer = simplify(raw);
    const g = bgcd(raw.n, raw.d);
    if (g > 1n) {
      steps.push(step(n++, `Simplify by the greatest common factor ${formatBigInt(g)}: ${formatFraction(raw)} = ${formatFraction(answer)}.`));
    }

    const decimal = fractionToDecimal(answer);
    const hero = card('answer', 'Result', formatFraction(answer), {
      raw: Number(decimal.toFixed(6)),
      emphasis: 'hero',
      note: `${formatFraction(A)} ${OP_SYMBOL[op.value]} ${formatFraction(B)}`,
    });
    const metrics: ResultCard[] = [
      card('mixed', 'As a mixed number', formatMixed(answer), { raw: Number(decimal.toFixed(6)), emphasis: 'primary' }),
      card('decimal', 'As a decimal', decimal.toLocaleString('en-US', { maximumFractionDigits: 6 }), { raw: Number(decimal.toFixed(6)) }),
    ];

    const insights = [...steps];
    if (answer.d === 1n) insights.push(insight('The result is a whole number: the denominator divides out completely.', 'positive'));

    return successResult({
      hero,
      metrics,
      insights,
      assumptions: [
        assumption('Arithmetic', 'exact integers (never rounded)'),
        assumption('Accepted inputs', 'whole numbers, fractions a/b, mixed numbers like 1 2/3'),
      ],
      decisions: decisions([
        toolDecision('Factor the GCF and LCM behind the simplification', 'prime-factorization-calculator'),
        toolDecision('Explore another applied-math tool', 'quadratic-equation-explorer'),
      ]),
      nextQuestions: ['What is the LCD of two denominators?', 'How do I simplify a fraction by hand?'],
      explanation:
        op.value === 'add' || op.value === 'subtract'
          ? 'Adding or subtracting fractions needs a common denominator: convert both fractions to the least common denominator, combine the numerators, then simplify by the greatest common factor.'
          : op.value === 'multiply'
            ? 'Multiplying fractions needs no common denominator: multiply the numerators, multiply the denominators, then simplify by the greatest common factor.'
            : 'Dividing by a fraction is multiplying by its reciprocal: flip the second fraction, multiply straight across, then simplify.',
      meta: { decimal: Number(decimal.toFixed(6)) },
    });
  },
};
