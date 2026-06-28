import { describe, it, expect } from 'vitest';
import { seedRecord } from '../fixtures';
import { seedDatasetProvider } from './seed-dataset/index';
import { PROVIDERS } from '../registry';
import type { ProviderContext } from '../models/provider';

function ctx(records = [seedRecord({ proposedTool: 'b-tool' }), seedRecord({ proposedTool: 'a-tool' })]): ProviderContext {
  return { datasets: [{ domain: 'test', records }], existingSlugs: new Set() };
}

describe('seed-dataset provider', () => {
  it('normalizes records into raw opportunities in stable (sorted) order', () => {
    const out = seedDatasetProvider.discover(ctx());
    expect(out.map(o => o.proposedTool)).toEqual(['a-tool', 'b-tool']);
    expect(out[0].source).toBe('seed-dataset');
  });

  it('fills defaults and dedupes the query into searchQueries', () => {
    const out = seedDatasetProvider.discover(ctx([seedRecord({ proposedTool: 'x', query: 'x', searchQueries: ['x', 'y'] })]));
    expect(out[0].evergreen).toBe(80); // default
    expect(out[0].searchQueries).toEqual(['x', 'y']);
  });

  it('clamps out-of-range numbers', () => {
    const out = seedDatasetProvider.discover(ctx([seedRecord({ proposedTool: 'x', demand: 999, competition: -5 })]));
    expect(out[0].demand).toBe(100);
    expect(out[0].competition).toBe(0);
  });
});

describe('provider registry', () => {
  it('every provider implements discover() and the live seams return []', () => {
    const c = ctx([]);
    for (const p of PROVIDERS) {
      expect(typeof p.discover).toBe('function');
      if (p.id !== 'seed-dataset') expect(p.discover(c)).toEqual([]);
    }
  });

  it('has unique provider ids', () => {
    const ids = PROVIDERS.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
