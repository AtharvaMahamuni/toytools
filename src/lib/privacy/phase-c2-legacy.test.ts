// Phase C PR 2 item 2: Split Bill, the UPI calculators and UUID Inspector are private, and the
// one-time cleanup strips what they saved before.
import { describe, it, expect } from 'vitest';
import { clearLegacyInputs, type KeyValueStore } from './legacy-storage';
import { config as splitBill } from '@tools/finance/split-bill/config';
import { config as mdr } from '@tools/finance/upi-mdr-estimator/config';
import { config as upi1999 } from '@tools/finance/upi-1999-split/config';
import { config as uuid } from '@tools/generate/uuid-inspector/config';

function store(init: Record<string, string>): KeyValueStore & { data: Map<string, string> } {
  const data = new Map(Object.entries(init));
  return {
    data,
    get length() { return data.size; },
    key: (i) => [...data.keys()][i] ?? null,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => { data.set(k, v); },
    removeItem: (k) => { data.delete(k); },
  };
}
const env = (data: unknown) => JSON.stringify({ v: 1, data });

describe('private finance and UUID pages (item 2)', () => {
  it('are private and do not keep input', () => {
    for (const c of [splitBill, mdr, upi1999, uuid]) {
      expect(c.trustVariant ?? 'private', c.slug).toBe('private');
      expect(c.keepInput, c.slug).not.toBe(true);
    }
  });

  it('the cleanup keeps settings and drops typed values', () => {
    const local = store({
      'toytools:split-bill': env({ currency: 'USD', fields: { bill: { value: '4321', raw: '4321' } }, opts: {} }),
      'toytools:upi-mdr-estimator': env({ currency: 'USD', fields: { amount: { value: '5000', raw: '5000' } }, opts: { kind: 'essential' } }),
      'toytools:uuid-inspector': env({ options: { input: '123e4567-e89b-12d3-a456-426614174000', expect: 'v4' } }),
    });
    clearLegacyInputs(local, null);
    expect(local.data.has('toytools:split-bill')).toBe(false);
    expect(JSON.parse(local.data.get('toytools:upi-mdr-estimator')!).data).toEqual({ opts: { kind: 'essential' } });
    expect(JSON.parse(local.data.get('toytools:uuid-inspector')!).data).toEqual({ options: { expect: 'v4' } });
  });
});
