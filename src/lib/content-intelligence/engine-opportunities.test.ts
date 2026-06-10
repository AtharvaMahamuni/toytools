import { describe, it, expect } from 'vitest';
import { analyzeEngineOpportunities } from './engine-opportunities';
import { tool, category, engine, makeInputs } from './fixtures';

const categories = [category({ slug: 'developer-tools', segment: 'developer' })];

describe('analyzeEngineOpportunities', () => {
  it('lists existing tools and taxonomy-derived missing members', () => {
    const tools = [tool({ slug: 'json-formatter', engine: 'structured-data', pattern: 'structured-transform', family: 'json' })];
    const engines = [engine({ id: 'structured-data', patterns: ['structured-transform'] })];
    const taxonomy = [{ engine: 'structured-data', families: [{ family: 'json', expected: ['json-formatter', 'json-to-csv-converter'] }] }];
    const [opp] = analyzeEngineOpportunities(makeInputs({ tools, categories, engines, taxonomy }));
    expect(opp.existing).toEqual(['json-formatter']);
    expect(opp.missingFamilyMembers).toEqual([{ family: 'json', expected: 'json-to-csv-converter' }]);
  });

  it('emits a structural signal for a declared pattern with no tools', () => {
    const tools = [tool({ slug: 'json-formatter', engine: 'structured-data', pattern: 'structured-transform', family: 'json' })];
    const engines = [engine({ id: 'structured-data', patterns: ['structured-transform', 'structured-validate'] })];
    const [opp] = analyzeEngineOpportunities(makeInputs({ tools, categories, engines }));
    expect(opp.structuralSignals.some(s => s.includes('structured-validate'))).toBe(true);
  });

  it('flags a family far below the engine mean', () => {
    const tools = [
      tool({ slug: 'a', engine: 'e', pattern: 'p', family: 'big' }),
      tool({ slug: 'b', engine: 'e', pattern: 'p', family: 'big' }),
      tool({ slug: 'c', engine: 'e', pattern: 'p', family: 'big' }),
      tool({ slug: 'd', engine: 'e', pattern: 'p', family: 'big' }),
      tool({ slug: 'e', engine: 'e', pattern: 'p', family: 'big' }),
      tool({ slug: 'f', engine: 'e', pattern: 'p', family: 'small' }),
    ];
    const engines = [engine({ id: 'e', patterns: ['p'] })];
    const [opp] = analyzeEngineOpportunities(makeInputs({ tools, categories, engines }));
    expect(opp.structuralSignals.some(s => s.includes('family "small"'))).toBe(true);
  });

  it('returns only structural signals when no taxonomy is supplied', () => {
    const tools = [tool({ slug: 'a', engine: 'e', pattern: 'p', family: 'f' })];
    const engines = [engine({ id: 'e', patterns: ['p', 'q'] })];
    const [opp] = analyzeEngineOpportunities(makeInputs({ tools, categories, engines }));
    expect(opp.missingFamilyMembers).toEqual([]);
    expect(opp.structuralSignals.length).toBeGreaterThan(0);
  });
});
