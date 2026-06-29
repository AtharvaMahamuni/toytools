import { describe, it, expect } from 'vitest';
import { raw, catalogRef, makeInputs } from '../fixtures';
import { deduplicate } from './deduplicate';
import { classifyIntent } from './intent';
import { transformationId, groupByTransformation } from './transformation';
import { scoreOpportunities } from './opportunity-score';
import { buildClusters } from './cluster';
import { recommendEngines, missingEngines } from './engine-match';
import { classifyGap, summarizeGaps } from './gaps';
import { analyzeTrends } from './trend';
import { buildProblemGraph } from './topic-cluster';

describe('deduplicate', () => {
  it('merges same-id raws and records sources', () => {
    const r = deduplicate([
      raw({ proposedTool: 'reverse-text', source: 'seed-dataset' }),
      raw({ proposedTool: 'reverse-text', source: 'reddit' }),
    ]);
    expect(r.merged).toHaveLength(1);
    expect(r.merged[0].sources).toEqual(['reddit', 'seed-dataset']);
    expect(r.duplicateIds).toEqual(['reverse-text']);
  });

  it('merges near-identical problems on the same engine', () => {
    const r = deduplicate([
      raw({ proposedTool: 'remove-line-breaks', problem: 'strip newlines from pasted text into one paragraph' }),
      raw({ proposedTool: 'delete-line-breaks', problem: 'strip newlines from pasted text into one paragraph' }),
    ]);
    expect(r.merged).toHaveLength(1);
  });

  it('keeps distinct opportunities separate', () => {
    const r = deduplicate([raw({ proposedTool: 'a' }), raw({ proposedTool: 'b' })]);
    expect(r.merged).toHaveLength(2);
    expect(r.duplicateIds).toEqual([]);
  });
});

describe('intent', () => {
  it('classifies from cues, falling back to the hint', () => {
    expect(classifyIntent(raw({ proposedTool: 'x', query: 'json formatter online' }))).toBe('transactional');
    expect(classifyIntent(raw({ proposedTool: 'x', query: 'how to do x', problem: 'how to' }))).toBe('howTo');
    expect(classifyIntent(raw({ proposedTool: 'x', query: 'plain', problem: 'plain', intent: 'informational' }))).toBe('informational');
  });
});

describe('transformation grouping', () => {
  it('slugifies + groups by transformation id', () => {
    expect(transformationId('CSV Diff')).toBe('csv-diff');
    const g = groupByTransformation([raw({ proposedTool: 'a', transformation: 'CSV Diff' }), raw({ proposedTool: 'b', transformation: 'CSV Diff' })]);
    expect(g.get('csv-diff')).toHaveLength(2);
  });
});

describe('opportunity-score', () => {
  const inputs = makeInputs({
    raw: [],
    existingSlugs: ['reverse-text'],
    catalog: [catalogRef({ slug: 'uppercase-converter', engine: 'text-processor' })],
    guideSlugs: ['uppercase-converter'],
  });
  const merged = deduplicate([
    raw({ proposedTool: 'slugify-text', proposedEngine: 'text-processor', demand: 90, difficulty: 'low' }),
    raw({ proposedTool: 'csv-diff', proposedEngine: 'csv', demand: 50, difficulty: 'high' }),
    raw({ proposedTool: 'reverse-text', proposedEngine: 'text-processor' }),
  ]).merged;

  it('ranks by finalScore and stamps scores in range', () => {
    const ops = scoreOpportunities(merged, inputs);
    expect(ops[0].finalScore).toBeGreaterThanOrEqual(ops[ops.length - 1].finalScore);
    for (const o of ops) {
      expect(o.finalScore).toBeGreaterThanOrEqual(0);
      expect(o.finalScore).toBeLessThanOrEqual(100);
      expect(o.confidence).toBeLessThanOrEqual(1);
    }
  });

  it('reuse tool outscores new-engine tool, all else equal-ish', () => {
    const ops = scoreOpportunities(merged, inputs);
    const slug = ops.find(o => o.id === 'slugify-text')!;
    const csv = ops.find(o => o.id === 'csv-diff')!;
    expect(slug.finalScore).toBeGreaterThan(csv.finalScore);
    expect(slug.engineExists).toBe(true);
    expect(csv.engineExists).toBe(false);
  });

  it('marks existing tools already-exists, derives related links', () => {
    const ops = scoreOpportunities(merged, inputs);
    const rev = ops.find(o => o.id === 'reverse-text')!;
    expect(rev.status).toBe('already-exists');
    expect(rev.relatedTools).toContain('uppercase-converter');
  });
});

describe('engine-match', () => {
  const inputs = makeInputs({ raw: [] });
  const ops = scoreOpportunities(
    deduplicate([
      raw({ proposedTool: 'csv-diff', proposedEngine: 'csv' }),
      raw({ proposedTool: 'csv-cleaner', proposedEngine: 'csv' }),
      raw({ proposedTool: 'csv-sort', proposedEngine: 'csv' }),
      raw({ proposedTool: 'reverse-text', proposedEngine: 'text-processor' }),
    ]).merged,
    inputs,
  );

  it('recommends a new engine when the cluster clears the bar', () => {
    const recs = recommendEngines(ops, inputs);
    const csv = recs.find(r => r.engine === 'csv')!;
    expect(csv.exists).toBe(false);
    expect(csv.unlocksTools.length).toBe(3);
    expect(missingEngines(recs).map(r => r.engine)).toContain('csv');
  });

  it('marks existing engines as reuse with confidence 1', () => {
    const recs = recommendEngines(ops, inputs);
    expect(recs.find(r => r.engine === 'text-processor')!.confidence).toBe(1);
  });
});

describe('gaps', () => {
  const inputs = makeInputs({ raw: [], existingSlugs: ['word-counter'], guideSlugs: [], faqSlugs: [] });
  it('classifies relationship to the catalog', () => {
    expect(classifyGap('word-counter', 'text-analysis', inputs)).toBe('guide-missing');
    expect(classifyGap('csv-diff', 'csv', inputs)).toBe('engine-missing');
    expect(classifyGap('reverse-text', 'text-processor', inputs)).toBe('cluster-missing');
  });
  it('summarizes counts sorted desc', () => {
    const ops = scoreOpportunities(deduplicate([raw({ proposedTool: 'a' }), raw({ proposedTool: 'b' })]).merged, inputs);
    const s = summarizeGaps(ops);
    expect(s.reduce((n, g) => n + g.count, 0)).toBe(ops.length);
  });
});

describe('trends + problem graph', () => {
  const inputs = makeInputs({ raw: [] });
  const ops = scoreOpportunities(
    deduplicate([
      raw({ proposedTool: 'a', transformation: 'CSV Diff', proposedEngine: 'csv' }),
      raw({ proposedTool: 'b', transformation: 'CSV Diff', proposedEngine: 'csv' }),
    ]).merged,
    inputs,
  );
  it('aggregates trends by transformation', () => {
    const t = analyzeTrends(ops);
    expect(t[0].transformation).toBe('CSV Diff');
    expect(t[0].count).toBe(2);
  });
  it('builds a graph with resolvable edges only', () => {
    const g = buildProblemGraph(ops, inputs);
    const ids = new Set(g.nodes.map(n => n.id));
    for (const e of g.edges) {
      expect(ids.has(e.from)).toBe(true);
      expect(ids.has(e.to)).toBe(true);
    }
    expect(g.edges.some(e => e.kind === 'same-transformation')).toBe(true);
  });
});
