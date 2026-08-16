// IO-graph tests. This module is the substrate the latent-demand analyzer reasons over, so its
// defensive paths matter more than they look: an engine with no row, a format with no definition,
// and a token that cannot discriminate all decide whether a silence gets reported or swallowed.

import { describe, it, expect } from 'vitest';
import { activeEngines, formatLabel, isConverter, seamIsCovered, toolsByEngine, ENGINE_IO } from './io-graph';
import { catalogRef } from '../fixtures';

describe('formatLabel', () => {
  it('labels known formats', () => {
    expect(formatLabel('encoded-text')).toBe('encoded text');
  });

  it('falls back to the id for a format nobody has defined', () => {
    expect(formatLabel('quaternion')).toBe('quaternion');
  });
});

describe('activeEngines / toolsByEngine', () => {
  it('lists only engines that actually have tools, sorted', () => {
    const catalog = [
      catalogRef({ slug: 'b-tool', engine: 'hashing' }),
      catalogRef({ slug: 'a-tool', engine: 'encoding' }),
    ];
    expect(activeEngines(catalog)).toEqual(['encoding', 'hashing']);
  });

  it('skips tools with no engine rather than inventing an empty one', () => {
    const catalog = [catalogRef({ slug: 'orphan', engine: '' }), catalogRef({ slug: 'real', engine: 'hashing' })];
    expect(activeEngines(catalog)).toEqual(['hashing']);
    expect([...toolsByEngine(catalog).keys()]).toEqual(['hashing']);
  });

  it('groups by engine with tools in stable slug order', () => {
    const catalog = [
      catalogRef({ slug: 'z-tool', engine: 'hashing' }),
      catalogRef({ slug: 'a-tool', engine: 'hashing' }),
    ];
    expect(toolsByEngine(catalog).get('hashing')!.map(t => t.slug)).toEqual(['a-tool', 'z-tool']);
  });
});

describe('isConverter', () => {
  it('is true for an engine that changes format', () => {
    expect(isConverter('jwt')).toBe(true); // token -> json
    expect(isConverter('hashing')).toBe(true); // text -> hash
  });

  it('is false for an engine that works within one format', () => {
    expect(isConverter('text-processor')).toBe(false); // text -> text
  });

  it('is false for an engine with no row, rather than guessing at one', () => {
    expect(ENGINE_IO['not-an-engine']).toBeUndefined();
    expect(isConverter('not-an-engine')).toBe(false);
  });
});

describe('seamIsCovered', () => {
  const catalog = [
    catalogRef({ slug: 'csv-to-json-converter' }),
    catalogRef({ slug: 'jwt-decoder' }),
    catalogRef({ slug: 'json-tree-viewer' }),
  ];

  it('matches a slug naming both formats when the formats differ', () => {
    expect(seamIsCovered(catalog, 'csv', 'json', 'csv')).toBe(true);
  });

  it('does not match when only one side is named', () => {
    expect(seamIsCovered(catalog, 'csv', 'text', 'csv')).toBe(false);
  });

  it('normalizes the encoded- prefix so encoded text matches text', () => {
    expect(seamIsCovered([catalogRef({ slug: 'text-to-json' })], 'encoded-text', 'json', 'encoding')).toBe(true);
  });

  it('uses engine + format for a same-format join, where the format alone cannot discriminate', () => {
    // Every JSON tool contains "json"; only a tool naming the SOURCE spans jwt -> json.
    expect(seamIsCovered(catalog, 'json', 'json', 'jwt')).toBe(false);
    expect(seamIsCovered([...catalog, catalogRef({ slug: 'jwt-json-explorer' })], 'json', 'json', 'jwt')).toBe(true);
  });

  it('reports uncovered when a token is empty, rather than matching every slug', () => {
    // An empty token is contained in every string, so a naive check would mark everything covered
    // and delete the signal silently.
    expect(seamIsCovered(catalog, '', '', '')).toBe(false);
  });
});
