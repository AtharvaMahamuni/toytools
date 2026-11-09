import { describe, expect, it } from 'vitest';
import { tools } from '@data/registry';
import { buildCatalogWire, buildClientIndex, hydrateCatalogWire, nameFromSlug } from './index';

describe('catalog wire display names', () => {
  it('rebuilds every registry tool name byte-identically from the wire', () => {
    const wire = buildCatalogWire();
    const hydrated = hydrateCatalogWire(wire);
    const bySlug = new Map(hydrated.t.map((e) => [e.s, e.n]));

    expect(hydrated.t.length).toBe(tools.length);
    for (const tool of tools) {
      expect(bySlug.get(tool.slug), tool.slug).toBe(tool.name);
    }
  });

  it('omits n on the wire exactly when the name equals nameFromSlug(slug)', () => {
    const wire = buildCatalogWire();
    const full = buildClientIndex();
    expect(wire.t).toHaveLength(full.t.length);

    for (let i = 0; i < full.t.length; i++) {
      const src = full.t[i]!;
      const row = wire.t[i]!;
      expect(row.s).toBe(src.s);
      if (src.n === nameFromSlug(src.s)) {
        expect(row.n, src.s).toBeUndefined();
      } else {
        expect(row.n, src.s).toBe(src.n);
      }
    }
  });

  it('keeps hydrated names identical to buildClientIndex order and values', () => {
    const full = buildClientIndex();
    const hydrated = hydrateCatalogWire(buildCatalogWire());
    expect(hydrated.t.map((e) => e.n)).toEqual(full.t.map((e) => e.n));
    expect(hydrated.t.map((e) => e.s)).toEqual(full.t.map((e) => e.s));
  });
});
