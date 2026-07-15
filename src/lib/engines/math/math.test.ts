// Calculator-level tests for the math engine: the registry contract (never-throws), each worked
// example re-run against its expected card values, and the fraction calculator's step narration
// and error paths.

import { describe, expect, it } from 'vitest';
import { MATH_CALCULATORS, mathFields, runMath } from './registry';
import { MATH_EXAMPLES } from './examples';
import type { InteractiveResult } from '@lib/results/types';

function cardRaw(result: InteractiveResult, id: string): number | undefined {
  if (result.hero?.id === id) return result.hero.raw;
  return result.metrics.find((c) => c.id === id)?.raw;
}

describe('math registry', () => {
  it('every calculator exposes fields and a calculate()', () => {
    for (const [id, calc] of Object.entries(MATH_CALCULATORS)) {
      expect(calc.id).toBe(id);
      expect(mathFields(id).length).toBeGreaterThan(0);
      expect(typeof calc.calculate).toBe('function');
    }
  });

  it('unknown ids and thrown errors surface as calculation errors, never exceptions', () => {
    expect(runMath('nope', {}, {}).uiState).toBe('calculation-error');
  });
});

describe('worked examples', () => {
  it.each(MATH_EXAMPLES.map((e) => [e.id, e] as const))('%s reproduces its expected values', (_id, ex) => {
    const res = runMath(ex.ref, ex.inputs, {});
    expect(res.uiState).toBe('success');
    for (const [cardId, raw] of Object.entries(ex.expect ?? {})) {
      expect(cardRaw(res, cardId), cardId).toBeCloseTo(raw, 6);
    }
  });
});

describe('fraction calculator', () => {
  it('narrates the LCD steps for unlike denominators', () => {
    const res = runMath('fraction', { first: '1/2', op: 'add', second: '3/4' }, {});
    expect(res.uiState).toBe('success');
    expect(res.hero?.value).toBe('5/4');
    const text = (res.insights ?? []).map((i) => i.text).join(' ');
    expect(text).toContain('least common denominator');
    expect(text).toContain('2/4');
    expect(text).toContain('5/4');
  });

  it('simplifies and reports mixed + decimal forms', () => {
    const res = runMath('fraction', { first: '1 1/2', op: 'multiply', second: '2 2/3' }, {});
    expect(res.hero?.value).toBe('4');
    expect(res.metrics.find((c) => c.id === 'mixed')?.value).toBe('4');
    expect(res.metrics.find((c) => c.id === 'decimal')?.raw).toBe(4);
  });

  it('rejects malformed input and division by zero with validation errors', () => {
    expect(runMath('fraction', { first: 'abc', op: 'add', second: '1/2' }, {}).uiState).toBe('validation-error');
    expect(runMath('fraction', { first: '1/2', op: 'divide', second: '0' }, {}).uiState).toBe('validation-error');
    expect(runMath('fraction', { first: '', op: 'add', second: '1/2' }, {}).uiState).toBe('validation-error');
  });
});
