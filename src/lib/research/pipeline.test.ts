import { describe, it, expect } from 'vitest';
import { raw, catalogRef, makeInputs, FIXED_NOW } from './fixtures';
import { runPipeline } from './pipeline';
import { buildRoadmap } from './analyzers/roadmap';
import { recommendEngines } from './analyzers/engine-match';
import { scoreOpportunities } from './analyzers/opportunity-score';
import { deduplicate } from './analyzers/deduplicate';
import { opportunitiesCsv } from './reports/csv';
import { renderNextBuild, renderRoadmap } from './reports/markdown';
import { indexJson } from './reports/json';
import { validateAll, validateReports } from './validate';

function sampleInputs() {
  return makeInputs({
    raw: [
      raw({ proposedTool: 'remove-line-breaks', proposedEngine: 'text-processor', demand: 84, difficulty: 'low' }),
      raw({ proposedTool: 'reverse-text', proposedEngine: 'text-processor', demand: 78, difficulty: 'low' }),
      raw({ proposedTool: 'csv-diff', proposedEngine: 'csv', demand: 82, difficulty: 'medium' }),
      raw({ proposedTool: 'csv-cleaner', proposedEngine: 'csv', demand: 70, difficulty: 'medium' }),
      raw({ proposedTool: 'csv-sort', proposedEngine: 'csv', demand: 60, difficulty: 'medium' }),
    ],
    catalog: [catalogRef({ slug: 'remove-blank-lines', engine: 'text-processor' })],
    now: FIXED_NOW,
  });
}

describe('pipeline', () => {
  it('produces a deterministic, byte-stable report for identical inputs', () => {
    const a = JSON.stringify(runPipeline(sampleInputs()));
    const b = JSON.stringify(runPipeline(sampleInputs()));
    expect(a).toBe(b);
  });

  it('summarizes discovery + ranks a reuse tool as the next build', () => {
    const r = runPipeline(sampleInputs());
    expect(r.summary.discovered).toBe(5);
    expect(r.roadmap.nextBuild?.engineExists).toBe(true);
    expect(r.summary.missingEngines).toBe(1); // csv cluster of 3
  });

  it('every opportunity satisfies the schema (validateReports finds no errors)', () => {
    const r = runPipeline(sampleInputs());
    expect(validateReports(r)).toEqual([]);
  });

  it('stamps the fixed timestamp', () => {
    expect(runPipeline(sampleInputs()).generatedAt).toBe(FIXED_NOW);
  });
});

describe('roadmap', () => {
  it('tiers buildable items and excludes already-existing tools', () => {
    const inputs = makeInputs({
      raw: [raw({ proposedTool: 'a', demand: 90, difficulty: 'low' }), raw({ proposedTool: 'b', demand: 90 })],
      existingSlugs: ['b'],
    });
    const ops = scoreOpportunities(deduplicate(inputs.raw).merged, inputs);
    const rm = buildRoadmap(ops, recommendEngines(ops, inputs));
    expect(rm.all.some(i => i.proposedTool === 'b')).toBe(false);
    expect(rm.nextBuild?.proposedTool).toBe('a');
  });
});

describe('reports', () => {
  const r = runPipeline(sampleInputs());

  it('CSV has a header row + one row per opportunity', () => {
    const lines = opportunitiesCsv(r).trim().split('\n');
    expect(lines.length).toBe(r.opportunities.length + 1);
    expect(lines[0]).toContain('finalScore');
  });

  it('next-build markdown contains the headline sections', () => {
    const md = renderNextBuild(r.roadmap.nextBuild, r.generatedAt);
    expect(md).toContain('Recommended Next Build');
    expect(md).toContain('Why ToyTools can win');
    expect(md).not.toContain('—'); // no em-dashes in generated reports
  });

  it('roadmap markdown lists missing engines', () => {
    expect(renderRoadmap(r)).toContain('Missing engines');
  });

  it('index json carries the summary + next build', () => {
    const idx = indexJson(r) as Record<string, unknown>;
    expect(idx.nextBuild).toBe(r.roadmap.nextBuild?.proposedTool);
  });
});

describe('validation failure modes', () => {
  it('flags an out-of-range score', () => {
    const r = runPipeline(sampleInputs());
    r.opportunities[0].finalScore = 250;
    expect(validateReports(r).some(e => /finalScore out of/.test(e))).toBe(true);
  });

  it('flags a broken graph edge', () => {
    const r = runPipeline(sampleInputs());
    r.graph.edges.push({ from: 'ghost', to: 'phantom', kind: 'shares-engine' });
    expect(validateReports(r).some(e => /unknown node/.test(e))).toBe(true);
  });

  it('flags invalid datasets', () => {
    const r = runPipeline(sampleInputs());
    const errs = validateAll(
      [{ domain: 'x', records: [{ ...({} as never) }] as never }],
      r,
    );
    expect(errs.length).toBeGreaterThan(0);
  });
});
