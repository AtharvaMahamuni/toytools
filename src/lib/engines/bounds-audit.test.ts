// Round 1 of #253 (M3): SmartInput no longer clamps a typed value on blur, so every bound a field
// declares (min / max) must be enforced by its engine. This walks every numeric field of every
// SmartInput engine, pushes it past each declared bound with the other fields at their defaults,
// and expects a result error, never a quiet answer.
import { describe, it, expect } from 'vitest';
import { FINANCE_CALCULATORS } from './finance/registry';
import { WELLNESS_CALCULATORS } from './wellness/registry';
import { MATH_CALCULATORS } from './math/registry';
import { DATETIME_TOOLS } from './datetime/registry';
import { NETWORK_CALCULATORS } from './network/registry';

type Field = { id: string; type: string; default?: unknown; min?: number; max?: number; optional?: boolean };
type Calc = { id: string; fields: Field[]; calculate(input: Record<string, unknown>, opts: never): { ok?: boolean } };

const NUMERIC = new Set(['number', 'integer', 'currency', 'percent', 'slider', 'duration']);
const ENGINES: Record<string, Record<string, unknown>> = {
  finance: FINANCE_CALCULATORS,
  wellness: WELLNESS_CALCULATORS,
  math: MATH_CALCULATORS,
  datetime: DATETIME_TOOLS,
  network: NETWORK_CALCULATORS,
};

export function boundViolations(): string[] {
  const out: string[] = [];
  for (const [engine, reg] of Object.entries(ENGINES)) {
    for (const calc of Object.values(reg) as Calc[]) {
      if (!Array.isArray(calc.fields) || typeof calc.calculate !== 'function') continue;
      const base: Record<string, unknown> = Object.fromEntries(calc.fields.map((f) => [f.id, f.default]));
      const opts = { currency: 'USD' } as never;
      let baseOk: boolean;
      try { baseOk = calc.calculate({ ...base }, opts).ok !== false; } catch { baseOk = false; }
      if (!baseOk) continue;
      for (const f of calc.fields) {
        if (!NUMERIC.has(f.type)) continue;
        const probes: number[] = [];
        if (typeof f.max === 'number') probes.push(f.max + Math.max(1, Math.abs(f.max)) * 10);
        if (typeof f.min === 'number') probes.push(f.min - Math.max(1, Math.abs(f.min)) * 10);
        for (const v of probes) {
          let ok: boolean;
          try { ok = calc.calculate({ ...base, [f.id]: v }, opts).ok !== false; } catch { ok = false; }
          if (ok) out.push(`${engine}/${calc.id}.${f.id} = ${v} (min ${f.min ?? '-'}, max ${f.max ?? '-'})`);
        }
      }
    }
  }
  return out;
}

describe('every declared field bound is enforced by its engine', () => {
  it('has no field whose out-of-range value is quietly accepted', () => {
    expect(boundViolations()).toEqual([]);
  });
});
