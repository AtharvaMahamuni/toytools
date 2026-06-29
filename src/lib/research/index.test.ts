import { describe, it, expect } from 'vitest';
import { catalogInputs, defaultInputs, runResearchIntelligence } from './index';
import type { SeedDataset } from './models/provider';

// Integration test over the REAL registries (exercises index.ts wiring + the analyzers against the
// live catalog, so catalog-derived branches - related-tools ranking, cluster members, gap
// classification, engine reuse - are covered end to end).

const datasets: SeedDataset[] = [
  {
    domain: 'test',
    records: [
      // existing tool -> already-exists + deepest gap branch
      {
        query: 'word counter',
        problem: 'count the words in a block of text',
        intent: 'transactional',
        transformation: 'Word Counting',
        proposedTool: 'word-counter',
        proposedEngine: 'text-analysis',
        searchQueries: ['word counter', 'count words'],
        relatedTools: ['character-counter'],
        demand: 80,
        competition: 50,
        difficulty: 'low',
      },
      // new tool reusing an existing engine, related tools that resolve in the catalog
      {
        query: 'mirror text',
        problem: 'flip a phrase so it reads backwards for a banner',
        intent: 'transactional',
        transformation: 'Text Reversal',
        proposedTool: 'mirror-text',
        proposedEngine: 'text-processor',
        searchQueries: ['mirror text', 'backwards banner'],
        relatedTools: ['uppercase-converter', 'kebab-case-converter'],
        relatedProblems: ['Text Reversal'],
        demand: 72,
        competition: 40,
        difficulty: 'low',
      },
      // new-engine cluster of 3 (distinct problems so dedup keeps them) -> missing-engine
      {
        query: 'csv diff',
        problem: 'compare two exported spreadsheets and highlight which rows changed',
        intent: 'transactional',
        transformation: 'CSV Diff',
        proposedTool: 'csv-diff-x',
        proposedEngine: 'csvx',
        searchQueries: ['csv diff'],
        demand: 70,
        competition: 40,
        difficulty: 'medium',
      },
      {
        query: 'csv clean',
        problem: 'strip empty rows and stray quotes out of a messy data file',
        intent: 'troubleshooting',
        transformation: 'CSV Cleaning',
        proposedTool: 'csv-clean-x',
        proposedEngine: 'csvx',
        searchQueries: ['csv clean'],
        demand: 65,
        competition: 35,
        difficulty: 'medium',
      },
      {
        query: 'csv sort',
        problem: 'reorder the rows alphabetically by their first column value',
        intent: 'transactional',
        transformation: 'CSV Sort',
        proposedTool: 'csv-sort-x',
        proposedEngine: 'csvx',
        searchQueries: ['csv sort'],
        demand: 60,
        competition: 30,
        difficulty: 'medium',
      },
      // single new-engine -> below the new-engine bar
      {
        query: 'xyz tool',
        problem: 'perform an obscure one-off xyz transformation',
        intent: 'informational',
        transformation: 'XYZ',
        proposedTool: 'xyz-tool',
        proposedEngine: 'xyzengine',
        searchQueries: ['xyz'],
        demand: 40,
        competition: 60,
        difficulty: 'high',
      },
    ],
  },
];

describe('RIE integration (real registries)', () => {
  it('catalogInputs derives existing slugs, engines, and catalog from the registry', () => {
    const c = catalogInputs();
    expect(c.existingSlugs.has('word-counter')).toBe(true);
    expect(c.engineIds.has('text-processor')).toBe(true);
    expect(c.catalog.length).toBeGreaterThan(20);
  });

  it('runs end to end, classifying existing vs new and detecting a missing engine', () => {
    const r = runResearchIntelligence(defaultInputs(datasets, '2026-01-01T00:00:00.000Z'));
    expect(r.summary.discovered).toBe(6);

    const wc = r.opportunities.find(o => o.proposedTool === 'word-counter')!;
    expect(wc.status).toBe('already-exists');

    const mirror = r.opportunities.find(o => o.proposedTool === 'mirror-text')!;
    expect(mirror.engineExists).toBe(true);
    expect(mirror.relatedTools).toContain('uppercase-converter');

    // csvx cluster (3) clears the bar; xyzengine (1) does not.
    expect(r.summary.missingEngines).toBe(1);
    expect(r.engines.some(e => e.engine === 'csvx' && !e.exists)).toBe(true);
    expect(r.engines.some(e => e.engine === 'xyzengine' && !e.exists)).toBe(true);
    expect(r.engines.some(e => e.engine === 'text-processor' && e.exists)).toBe(true);

    expect(r.roadmap.nextBuild).toBeTruthy();
  });
});
