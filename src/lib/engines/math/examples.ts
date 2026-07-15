// Math engine worked examples — the engine's data for the platform example registry. One source of
// truth for guides, the widget Load Example action, and tests (math.test.ts re-runs each and
// asserts `expect` against the result cards' raw values).

import { buildExampleRegistry, examplesForRef, type WorkedExample } from '@lib/examples/types';
import type { MathInput } from './types';

export const MATH_EXAMPLES: WorkedExample<MathInput>[] = [
  {
    id: 'fraction-add-lcd',
    engine: 'math',
    ref: 'fraction',
    title: 'Add with unlike denominators',
    inputs: { first: '1/2', op: 'add', second: '3/4' },
    expect: { answer: 1.25, decimal: 1.25 },
    narrative: '1/2 + 3/4 converts to 2/4 + 3/4 over the LCD 4, giving 5/4, which is 1 1/4.',
  },
  {
    id: 'fraction-mixed-multiply',
    engine: 'math',
    ref: 'fraction',
    title: 'Multiply mixed numbers',
    inputs: { first: '1 1/2', op: 'multiply', second: '2 2/3' },
    expect: { answer: 4, decimal: 4 },
    narrative: '1 1/2 × 2 2/3 becomes 3/2 × 8/3 = 24/6, which simplifies to the whole number 4.',
  },
  {
    id: 'fraction-divide',
    engine: 'math',
    ref: 'fraction',
    title: 'Divide by a fraction',
    inputs: { first: '3/4', op: 'divide', second: '1/8' },
    expect: { answer: 6, decimal: 6 },
    narrative: '3/4 ÷ 1/8 flips to 3/4 × 8/1 = 24/4 = 6: dividing by an eighth asks how many eighths fit.',
  },
  {
    id: 'combinations-lottery',
    engine: 'math',
    ref: 'combinations',
    title: 'Lottery odds (49 choose 6)',
    inputs: { n: 49, r: 6, mode: 'combinations', repetition: 'no' },
    expect: { count: 13983816 },
    narrative: 'C(49, 6) = 13,983,816: the classic 6-of-49 lottery has nearly 14 million possible tickets.',
  },
  {
    id: 'permutations-podium',
    engine: 'math',
    ref: 'combinations',
    title: 'Podium finishes (10 pick 3, order matters)',
    inputs: { n: 10, r: 3, mode: 'permutations', repetition: 'no' },
    expect: { count: 720 },
    narrative: 'P(10, 3) = 10 × 9 × 8 = 720 gold-silver-bronze outcomes from ten runners.',
  },
  {
    id: 'permutations-pin',
    engine: 'math',
    ref: 'combinations',
    title: '4-digit PIN codes (repetition allowed)',
    inputs: { n: 10, r: 4, mode: 'permutations', repetition: 'yes' },
    expect: { count: 10000 },
    narrative: 'Each of the 4 slots has 10 digit choices, so 10^4 = 10,000 possible PINs.',
  },
  {
    id: 'prime-factorization-360',
    engine: 'math',
    ref: 'prime-factorization',
    title: 'Factor 360',
    inputs: { number: 360, second: '' },
    expect: { factorization: 360, divisors: 24 },
    narrative: '360 = 2³ × 3² × 5, and its 24 divisors follow from (3+1) × (2+1) × (1+1).',
  },
  {
    id: 'prime-gcf-lcm',
    engine: 'math',
    ref: 'prime-factorization',
    title: 'GCF and LCM of 36 and 60',
    inputs: { number: 36, second: 60 },
    expect: { gcf: 12, lcm: 180 },
    narrative: '36 = 2² × 3² and 60 = 2² × 3 × 5 share 2² × 3 = 12 (GCF); taking the higher exponents gives 2² × 3² × 5 = 180 (LCM).',
  },
];

export const MATH_EXAMPLE_MAP = buildExampleRegistry(MATH_EXAMPLES);

export function mathExamplesFor(ref: string): WorkedExample<MathInput>[] {
  return examplesForRef(MATH_EXAMPLES, 'math', ref);
}
