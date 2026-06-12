import { describe, it, expect } from 'vitest';
import { scorePriorities } from './priorities';
import { detectGaps } from './gaps';
import { analyzeCategoryHealth } from './category-health';
import { analyzeTopicClusters } from './clusters';
import { tool, category, engine, makeInputs } from './fixtures';
import type { AnalyzerInputs } from './types';

function parts(inputs: AnalyzerInputs) {
  return {
    gaps: detectGaps(inputs),
    categoryHealth: analyzeCategoryHealth(inputs),
    clusters: analyzeTopicClusters(inputs),
  };
}

const categories = [category({ slug: 'developer-tools', segment: 'developer' })];

describe('scorePriorities', () => {
  it('emits an entry for an existing tool with content gaps, with reasons + explanation', () => {
    const tools = [tool({ slug: 'lonely', engine: 'e', pattern: 'p', family: 'f', categorySlug: 'developer-tools' })];
    const inputs = makeInputs({ tools, categories, engines: [] });
    const roadmap = scorePriorities(inputs, parts(inputs));
    const e = roadmap.find(r => r.slug === 'lonely')!;
    expect(e.reasons).toContain('missing-guide');
    expect(e.reasons).toContain('missing-faq');
    expect(e.reasons).toContain('orphan-cluster');
    expect(e.explanation.length).toBeGreaterThan(0);
    expect(e.score).toBeGreaterThan(0);
  });

  it('emits a missing-family-member entry from the taxonomy with engineExpansion=1', () => {
    const tools = [tool({ slug: 'json-formatter', engine: 'structured-data', pattern: 'st', family: 'json', categorySlug: 'developer-tools' })];
    const engines = [engine({ id: 'structured-data', category: 'developer-tools', patterns: ['st'] })];
    const taxonomy = [{ engine: 'structured-data', families: [{ family: 'json', expected: ['json-formatter', 'json-to-csv-converter'] }] }];
    const inputs = makeInputs({ tools, categories, engines, taxonomy });
    const roadmap = scorePriorities(inputs, parts(inputs));
    const e = roadmap.find(r => r.slug === 'json-to-csv-converter')!;
    expect(e.reasons).toContain('missing-family-member');
    expect(e.factors.engineExpansion).toBe(1);
    expect(e.factors.coverageGap).toBe(1);
  });

  it('confidence rises with the number of independent signals', () => {
    const tools = [tool({ slug: 'lonely', engine: 'e', pattern: 'p', family: 'f', categorySlug: 'developer-tools' })];
    const inputs = makeInputs({ tools, categories, engines: [] });
    const e = scorePriorities(inputs, parts(inputs)).find(r => r.slug === 'lonely')!;
    expect(e.confidence).toBeGreaterThan(0);
    expect(e.confidence).toBeLessThanOrEqual(1);
  });

  it('returns a descending-sorted roadmap', () => {
    const tools = [
      tool({ slug: 'a', engine: 'e', pattern: 'p', family: 'f', categorySlug: 'developer-tools' }),
      tool({ slug: 'b', engine: 'e', pattern: 'p', family: 'f', categorySlug: 'developer-tools', guide: { slug: 'gb', categorySlug: 'developer', title: 'GB', description: '', readMinutes: 3, updatedAt: 'x' } }),
    ];
    const inputs = makeInputs({ tools, categories, engines: [] });
    const roadmap = scorePriorities(inputs, parts(inputs));
    for (let i = 1; i < roadmap.length; i++) {
      expect(roadmap[i - 1].score).toBeGreaterThanOrEqual(roadmap[i].score);
    }
  });

  it('reads the external-signals seam when present (dormant otherwise)', () => {
    const tools = [tool({ slug: 'lonely', engine: 'e', pattern: 'p', family: 'f', categorySlug: 'developer-tools' })];
    const base = makeInputs({ tools, categories, engines: [] });
    const withSignals: AnalyzerInputs = { ...base, signals: { lonely: { impressions: 1000 } } };
    const e = scorePriorities(withSignals, parts(withSignals)).find(r => r.slug === 'lonely')!;
    expect(e.factors.categoryImportance).toBeGreaterThanOrEqual(0);
  });
});
