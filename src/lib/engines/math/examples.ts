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
];

export const MATH_EXAMPLE_MAP = buildExampleRegistry(MATH_EXAMPLES);

export function mathExamplesFor(ref: string): WorkedExample<MathInput>[] {
  return examplesForRef(MATH_EXAMPLES, 'math', ref);
}
