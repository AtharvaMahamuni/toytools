import { describe, it, expect } from 'vitest';
import { EXPANSION_TAXONOMY, expectedFor, taxonomyEntries } from './taxonomy';
import { INTELLIGENCE_SCHEMA_VERSION } from './types';

describe('EXPANSION_TAXONOMY', () => {
  it('is hierarchical engine → family → expected[]', () => {
    for (const eng of EXPANSION_TAXONOMY) {
      expect(typeof eng.engine).toBe('string');
      expect(Array.isArray(eng.families)).toBe(true);
      for (const fam of eng.families) {
        expect(Array.isArray(fam.expected)).toBe(true);
        expect(fam.expected.length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps known existing tools in their expected lists (covered, not opportunities)', () => {
    expect(expectedFor('hashing', 'cryptographic')).toContain('md5-hash-generator');
    expect(expectedFor('calculator', 'arithmetic')).toContain('percentage-calculator');
  });
});

describe('expectedFor', () => {
  it('returns the expected slugs for a known engine/family', () => {
    expect(expectedFor('structured-data', 'json')).toContain('json-to-csv-converter');
  });

  it('never throws and returns [] for unknown engine or family', () => {
    expect(expectedFor('nope', 'json')).toEqual([]);
    expect(expectedFor('hashing', 'nope')).toEqual([]);
  });

  it('accepts an injected taxonomy', () => {
    const custom = [{ engine: 'e', families: [{ family: 'f', expected: ['a', 'b'] }] }];
    expect(expectedFor('e', 'f', custom)).toEqual(['a', 'b']);
  });
});

describe('taxonomyEntries', () => {
  it('flattens to (engine, family, expected) triples', () => {
    const custom = [{ engine: 'e', families: [{ family: 'f', expected: ['a', 'b'] }] }];
    expect(taxonomyEntries(custom)).toEqual([
      { engine: 'e', family: 'f', expected: 'a' },
      { engine: 'e', family: 'f', expected: 'b' },
    ]);
  });

  it('covers the real taxonomy without throwing', () => {
    expect(taxonomyEntries().length).toBeGreaterThan(0);
  });
});

describe('schema version', () => {
  it('exposes a numeric version constant', () => {
    expect(typeof INTELLIGENCE_SCHEMA_VERSION).toBe('number');
  });
});
