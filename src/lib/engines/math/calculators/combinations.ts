// Combinations & permutations calculator: nCr and nPr, with or without repetition, computed
// exactly on BigInt with the formula expanded step by step and a plain-language reading of what
// the count means ("ways to choose 2 of 5 when order does not matter").

import type { MathCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import {
  approxBigInt,
  factorialBig,
  formatBigInt,
  nCr,
  nCrWithRepetition,
  nPr,
  nPrWithRepetition,
  MAX_COMBINATORICS_N,
} from '../models';
import { integerField, selectField } from '../validation';
import { assumption, decisions, insight, step, toolDecision } from '../story';

const MODES = ['combinations', 'permutations'] as const;
const REPS = ['no', 'yes'] as const;

/** Grouped digits, with a scientific approximation appended for astronomical counts. */
function show(v: bigint): string {
  const approx = approxBigInt(v);
  return approx ? `${approx}` : formatBigInt(v);
}

export const combinationsCalculator: MathCalculator = {
  id: 'combinations',
  family: 'combinatorics',
  capabilities: { loadExample: true },
  fields: [
    {
      id: 'n',
      label: 'Items to choose from (n)',
      type: 'integer',
      default: 5,
      min: 0,
      max: MAX_COMBINATORICS_N,
      step: 1,
    },
    {
      id: 'r',
      label: 'Items chosen (r)',
      type: 'integer',
      default: 2,
      min: 0,
      max: MAX_COMBINATORICS_N,
      step: 1,
    },
    {
      id: 'mode',
      label: 'Order',
      type: 'select',
      default: 'combinations',
      options: [
        { value: 'combinations', label: 'Order does not matter (nCr)' },
        { value: 'permutations', label: 'Order matters (nPr)' },
      ],
    },
    {
      id: 'repetition',
      label: 'Repetition',
      type: 'select',
      default: 'no',
      options: [
        { value: 'no', label: 'Each item used once' },
        { value: 'yes', label: 'Items may repeat' },
      ],
    },
  ],

  calculate(input, _opts) {
    const n = integerField(input, 'n', 'n (items to choose from)', { min: 0, max: MAX_COMBINATORICS_N });
    if (!n.ok) return n.result;
    const r = integerField(input, 'r', 'r (items chosen)', { min: 0, max: MAX_COMBINATORICS_N });
    if (!r.ok) return r.result;
    const mode = selectField(input, 'mode', 'whether order matters', MODES);
    if (!mode.ok) return mode.result;
    const rep = selectField(input, 'repetition', 'whether items may repeat', REPS);
    if (!rep.ok) return rep.result;

    const N = n.value;
    const R = r.value;
    const withRep = rep.value === 'yes';
    const isComb = mode.value === 'combinations';

    if (!withRep && R > N) {
      return validationError(`Without repetition, r cannot exceed n: you cannot choose ${R} distinct items from only ${N}.`);
    }

    const value = isComb
      ? withRep
        ? nCrWithRepetition(N, R)
        : nCr(N, R)
      : withRep
        ? nPrWithRepetition(N, R)
        : nPr(N, R);
    if (value === null) {
      return validationError(
        withRep && !isComb
          ? 'That n^r is astronomically large (thousands of digits). Reduce n or r.'
          : `Keep n (and n + r - 1 for repetition) at or below ${MAX_COMBINATORICS_N.toLocaleString('en-US')}.`,
      );
    }

    const symbol = isComb ? (withRep ? `C(${N} + ${R} - 1, ${R})` : `C(${N}, ${R})`) : withRep ? `${N}^${R}` : `P(${N}, ${R})`;
    const steps = [];
    let i = 1;
    if (isComb && !withRep) {
      steps.push(step(i++, `The formula is C(n, r) = n! / (r! × (n - r)!).`));
      if (N <= 12) {
        steps.push(step(i++, `Substitute: ${N}! / (${R}! × ${N - R}!) = ${formatBigInt(factorialBig(N)!)} / (${formatBigInt(factorialBig(R)!)} × ${formatBigInt(factorialBig(N - R)!)}) = ${formatBigInt(value)}.`));
      } else {
        steps.push(step(i++, `Substitute n = ${N}, r = ${R} and cancel the (n - r)! factor: C(${N}, ${R}) = ${show(value)}.`));
      }
    } else if (!isComb && !withRep) {
      steps.push(step(i++, `The formula is P(n, r) = n! / (n - r)!, the first r factors counting down from n.`));
      if (R <= 6) {
        const factors = Array.from({ length: R }, (_, k) => N - k);
        steps.push(step(i++, `Multiply the falling factors: ${factors.join(' × ') || '1'} = ${formatBigInt(value)}.`));
      } else {
        steps.push(step(i++, `Multiply the ${R} falling factors from ${N} down to ${N - R + 1}: ${show(value)}.`));
      }
    } else if (isComb) {
      steps.push(step(i++, `With repetition allowed, combinations use the stars-and-bars formula C(n + r - 1, r).`));
      steps.push(step(i++, `Substitute: C(${N + R - 1}, ${R}) = ${show(value)}.`));
    } else {
      steps.push(step(i++, `With repetition and order, each of the ${R} slots has all ${N} choices: n^r.`));
      steps.push(step(i++, `Compute: ${N}^${R} = ${show(value)}.`));
    }

    const reading = isComb
      ? `There are ${show(value)} ways to choose ${R} of ${N} items when order does not matter${withRep ? ' and items may repeat' : ''}.`
      : `There are ${show(value)} ways to arrange ${R} of ${N} items when order matters${withRep ? ' and items may repeat' : ''}.`;

    const raw = value <= 9007199254740991n ? Number(value) : undefined;
    const hero = card('count', isComb ? 'Combinations' : 'Permutations', formatBigInt(value), { raw, emphasis: 'hero', note: symbol });
    const metrics: ResultCard[] = [];
    const approx = approxBigInt(value);
    if (approx) metrics.push(card('approx', 'In scientific form', approx, { emphasis: 'primary' }));
    if (!withRep) {
      const other = isComb ? nPr(N, R) : nCr(N, R);
      if (other !== null) {
        metrics.push(
          card(
            isComb ? 'npr' : 'ncr',
            isComb ? 'If order mattered (nPr)' : 'If order did not matter (nCr)',
            formatBigInt(other),
            { raw: other <= 9007199254740991n ? Number(other) : undefined },
          ),
        );
      }
    }

    return successResult({
      hero,
      metrics,
      insights: [...steps, insight(reading, 'positive')],
      assumptions: [
        assumption('Order', isComb ? 'does not matter (combinations)' : 'matters (permutations)'),
        assumption('Repetition', withRep ? 'items may repeat' : 'each item used once'),
        assumption('Arithmetic', `exact BigInt, n capped at ${MAX_COMBINATORICS_N.toLocaleString('en-US')}`),
      ],
      decisions: decisions([
        toolDecision('Work with the factorials as fractions', 'fraction-calculator'),
        toolDecision('See probabilities converge in the Probability Lab', 'probability-simulator'),
      ]),
      nextQuestions: ['When does order matter?', 'What is the stars-and-bars formula?'],
      explanation: isComb
        ? 'Combinations count selections where order is irrelevant, so nCr divides the ordered count by the r! ways to shuffle each selection.'
        : 'Permutations count ordered arrangements: multiply the shrinking number of choices for each slot.',
      meta: raw !== undefined ? { count: raw } : {},
    });
  },
};
