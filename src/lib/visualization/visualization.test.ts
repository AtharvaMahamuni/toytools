import { describe, it, expect } from 'vitest';
import { lineSpec, progressSpec, partsSpec } from './types';

describe('visualization builders', () => {
  it('lineSpec builds a single-series line by default', () => {
    const spec = lineSpec('balance', [{ x: 0, y: 100 }, { x: 1, y: 110 }]);
    expect(spec.kind).toBe('line');
    expect(spec.data.series?.[0].id).toBe('balance');
    expect(spec.data.series?.[0].points).toHaveLength(2);
  });

  it('lineSpec honours an area kind + title', () => {
    const spec = lineSpec('b', [{ x: 0, y: 1 }], { kind: 'area', title: 'Growth' });
    expect(spec.kind).toBe('area');
    expect(spec.title).toBe('Growth');
  });

  it('progressSpec carries value + target', () => {
    const spec = progressSpec(3, 6);
    expect(spec.kind).toBe('progress');
    expect(spec.data.value).toBe(3);
    expect(spec.data.target).toBe(6);
  });

  it('partsSpec builds a stacked part-to-whole by default', () => {
    const spec = partsSpec([
      { id: 'p', label: 'Principal', value: 1000 },
      { id: 'i', label: 'Interest', value: 500 },
    ]);
    expect(spec.kind).toBe('stacked');
    expect(spec.data.parts).toHaveLength(2);
  });
});
