import { describe, it, expect } from 'vitest';
import { runContentIntelligence, defaultInputs } from './index';
import { INTELLIGENCE_SCHEMA_VERSION } from './types';
import { tool, category, engine, makeInputs, makeKnowledge } from './fixtures';

describe('runContentIntelligence', () => {
  it('returns a versioned report with every section', () => {
    const tools = [
      tool({ slug: 'json-formatter', engine: 'structured-data', pattern: 'st', family: 'json', categorySlug: 'developer-tools' }),
      tool({ slug: 'json-minifier', engine: 'structured-data', pattern: 'st', family: 'json', categorySlug: 'developer-tools' }),
    ];
    const categories = [category({ slug: 'developer-tools', segment: 'developer', engines: ['structured-data'] })];
    const engines = [engine({ id: 'structured-data', category: 'developer-tools', patterns: ['st'] })];
    const knowledge = [makeKnowledge({ slug: 'json-formatter', usedWith: [{ slug: 'json-minifier', reason: 'shrink' }] })];
    const taxonomy = [{ engine: 'structured-data', families: [{ family: 'json', expected: ['json-formatter', 'json-to-csv-converter'] }] }];

    const reports = runContentIntelligence(makeInputs({ tools, categories, engines, knowledge, taxonomy }));

    expect(reports.version).toBe(INTELLIGENCE_SCHEMA_VERSION);
    expect(typeof reports.generatedAt).toBe('string');
    expect(Object.keys(reports.coverage)).toContain('json-formatter');
    expect(reports.gaps.missingTools.map(m => m.expected)).toContain('json-to-csv-converter');
    expect(reports.categoryHealth[0].slug).toBe('developer-tools');
    expect(reports.engineOpportunities[0].engine).toBe('structured-data');
    expect(reports.topicClusters.length).toBe(2);
    expect(reports.roadmap.length).toBeGreaterThan(0);
    expect(reports.ecosystem.toolCount).toBe(2);
  });
});

describe('defaultInputs', () => {
  it('wires the real registries', () => {
    const inputs = defaultInputs();
    expect(inputs.tools.length).toBeGreaterThan(0);
    expect(inputs.categories.length).toBeGreaterThan(0);
    expect(inputs.engines.length).toBeGreaterThan(0);
    expect(inputs.taxonomy.length).toBeGreaterThan(0);
    expect(inputs.graph.nodes.length).toBeGreaterThan(0);
  });

  it('runs end-to-end over the real platform data', () => {
    const reports = runContentIntelligence(defaultInputs());
    expect(reports.ecosystem.toolCount).toBeGreaterThan(0);
    // The roadmap lists expansion opportunities; an empty roadmap is a valid healthy state
    // (every taxonomy-expected tool exists and coverage is complete). Assert shape, not size.
    expect(Array.isArray(reports.roadmap)).toBe(true);
  });
});
