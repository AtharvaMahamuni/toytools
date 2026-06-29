import { describe, it, expect } from 'vitest';
import { raw, catalogRef, makeInputs, seedRecord, FIXED_NOW } from './fixtures';
import { runPipeline } from './pipeline';
import { seedDatasetProvider } from './providers/seed-dataset/index';
import { deduplicate } from './analyzers/deduplicate';
import { scoreOpportunities } from './analyzers/opportunity-score';
import { recommendEngines } from './analyzers/engine-match';
import { buildClusters } from './analyzers/cluster';
import { buildProblemGraph } from './analyzers/topic-cluster';
import { classifyGap } from './analyzers/gaps';
import { describeWorkflow } from './analyzers/workflow';
import { deriveRelatedTools } from './analyzers/related-tools';
import { jaccard } from './analyzers/similarity';
import { scoreDemand } from './scorers/demand';
import {
  opportunitiesJson,
  topOpportunitiesJson,
  missingEnginesJson,
  clustersJson,
  trendsJson,
  graphJson,
  indexJson,
} from './reports/json';
import { opportunitiesCsv } from './reports/csv';
import { renderRoadmap, renderNextBuild } from './reports/markdown';
import { validateRegistry, validateDatasets, validateReports } from './validate';

// ---- gap classification (all already-exists sub-branches) ----
describe('classifyGap branches', () => {
  const base = { existingSlugs: ['t'], engineIds: ['text-processor'] };
  it('guide-missing when tool exists but has no guide', () => {
    const i = makeInputs({ raw: [], ...base });
    expect(classifyGap('t', 'text-processor', i)).toBe('guide-missing');
  });
  it('faq-missing when guide present but no faq', () => {
    const i = makeInputs({ raw: [], ...base, guideSlugs: ['t'] });
    expect(classifyGap('t', 'text-processor', i)).toBe('faq-missing');
  });
  it('knowledge-gap when guide+faq present but no knowledge', () => {
    const i = makeInputs({ raw: [], ...base, guideSlugs: ['t'], faqSlugs: ['t'] });
    expect(classifyGap('t', 'text-processor', i)).toBe('knowledge-gap');
  });
  it('needs-improvement when everything present', () => {
    const i = makeInputs({ raw: [], ...base, guideSlugs: ['t'], faqSlugs: ['t'], knowledgeSlugs: ['t'] });
    expect(classifyGap('t', 'text-processor', i)).toBe('needs-improvement');
  });
});

// ---- engine-match: below-bar new engine + existing reuse rationale ----
describe('engine-match branches', () => {
  it('flags a below-bar new engine without listing it as missing-required', () => {
    const inputs = makeInputs({ raw: [] });
    const ops = scoreOpportunities(deduplicate([raw({ proposedTool: 'solo', proposedEngine: 'newx' })]).merged, inputs);
    const recs = recommendEngines(ops, inputs);
    const solo = recs.find(r => r.engine === 'newx')!;
    expect(solo.exists).toBe(false);
    expect(solo.rationale.join(' ')).toMatch(/Below the/);
  });
});

// ---- cluster: existing members + internal links ----
describe('cluster branches', () => {
  it('records existing catalog members and internal links', () => {
    const inputs = makeInputs({
      raw: [],
      catalog: [catalogRef({ slug: 'uppercase-converter', engine: 'text-processor' })],
    });
    const ops = scoreOpportunities(
      deduplicate([
        raw({ proposedTool: 'a', transformation: 'T', proposedEngine: 'text-processor', relatedTools: ['uppercase-converter'] }),
        raw({ proposedTool: 'b', transformation: 'T', proposedEngine: 'text-processor' }),
      ]).merged,
      inputs,
    );
    const clusters = buildClusters(ops, inputs);
    const c = clusters.find(x => x.engine === 'text-processor')!;
    expect(c.existingMembers).toContain('uppercase-converter');
    expect(c.internalLinks).toContain('uppercase-converter');
    expect(c.size).toBe(2);
  });
});

// ---- related-tools ranking branch + topic-graph related-problem / links-to-tool ----
describe('related-tools + problem graph branches', () => {
  const inputs = makeInputs({
    raw: [],
    existingSlugs: ['uppercase-converter', 'kebab-case-converter'],
    catalog: [
      catalogRef({ slug: 'uppercase-converter', engine: 'text-processor', family: 'transform' }),
      catalogRef({ slug: 'kebab-case-converter', engine: 'text-processor', family: 'reversal' }),
    ],
  });
  it('ranks same-engine catalog tools by family relevance', () => {
    const links = deriveRelatedTools(
      raw({ proposedTool: 'x', transformation: 'reversal', proposedEngine: 'text-processor', relatedTools: ['uppercase-converter'] }),
      inputs,
    );
    expect(links).toContain('uppercase-converter');
    expect(links).toContain('kebab-case-converter');
  });
  it('emits related-problem and links-to-tool edges', () => {
    const ops = scoreOpportunities(
      deduplicate([
        raw({ proposedTool: 'a', transformation: 'Reversal', proposedEngine: 'text-processor', relatedProblems: ['Casing'], relatedTools: ['uppercase-converter'] }),
        raw({ proposedTool: 'b', transformation: 'Casing', proposedEngine: 'text-processor' }),
      ]).merged,
      inputs,
    );
    const g = buildProblemGraph(ops, inputs);
    expect(g.edges.some(e => e.kind === 'related-problem')).toBe(true);
    expect(g.edges.some(e => e.kind === 'links-to-tool')).toBe(true);
    expect(g.nodes.some(n => n.existing)).toBe(true);
  });
});

// ---- scorer + helper edge branches ----
describe('edge branches', () => {
  it('scoreDemand handles NaN', () => expect(scoreDemand(raw({ proposedTool: 'a', demand: NaN }))).toBe(0));
  it('describeWorkflow falls back for unknown engine', () => {
    const w = describeWorkflow(raw({ proposedTool: 'a', proposedEngine: 'mystery' }));
    expect(w.startsWith('input ')).toBe(true);
    expect(w.endsWith(' output')).toBe(true);
  });
  it('seed provider clamps NaN numbers', () => {
    const out = seedDatasetProvider.discover({ datasets: [{ domain: 'd', records: [seedRecord({ proposedTool: 'x', demand: NaN })] }], existingSlugs: new Set() });
    expect(out[0].demand).toBe(0);
  });
  it('jaccard handles two empty strings and disjoint sets', () => {
    expect(jaccard('', '')).toBe(1);
    expect(jaccard('alpha beta', 'gamma delta')).toBe(0);
  });
});

// ---- report renderers ----
describe('report renderers', () => {
  const inputs = makeInputs({
    raw: [
      raw({ proposedTool: 'a', proposedName: 'A, "quoted"', proposedEngine: 'text-processor', demand: 90, difficulty: 'low' }),
      raw({ proposedTool: 'csv-1', proposedEngine: 'csv', demand: 80, problem: 'compare two spreadsheets and show changed rows' }),
      raw({ proposedTool: 'csv-2', proposedEngine: 'csv', demand: 70, problem: 'strip blank rows from a messy export file' }),
      raw({ proposedTool: 'csv-3', proposedEngine: 'csv', demand: 60, problem: 'reorder rows by the first column alphabetically' }),
    ],
    now: FIXED_NOW,
  });
  const r = runPipeline(inputs);

  it('all JSON renderers carry version + payload', () => {
    expect((opportunitiesJson(r) as any).opportunities.length).toBe(4);
    expect((topOpportunitiesJson(r, 2) as any).top.length).toBeLessThanOrEqual(2);
    expect((missingEnginesJson(r) as any).engines.every((e: any) => !e.exists)).toBe(true);
    expect((clustersJson(r) as any).clusters.length).toBeGreaterThan(0);
    expect((trendsJson(r) as any).trends.length).toBeGreaterThan(0);
    expect((graphJson(r) as any).nodes.length).toBeGreaterThan(0);
    expect((indexJson(r) as any).version).toBe(r.version);
  });

  it('CSV quotes values containing commas and quotes', () => {
    const csv = opportunitiesCsv(r);
    expect(csv).toContain('"A, ""quoted"""');
  });

  it('roadmap markdown renders with content', () => {
    expect(renderRoadmap(r)).toContain('Research Roadmap');
  });

  it('roadmap markdown handles empty tiers and no missing engines', () => {
    const empty = runPipeline(makeInputs({ raw: [raw({ proposedTool: 'x', proposedEngine: 'text-processor' })], existingSlugs: ['x'], now: FIXED_NOW }));
    const md = renderRoadmap(empty);
    expect(md).toContain('No new-engine clusters');
    expect(empty.roadmap.nextBuild).toBeNull();
    expect(renderNextBuild(null, empty.generatedAt)).toContain('No buildable opportunity');
  });
});

// ---- validators ----
describe('validators', () => {
  it('registry validates clean', () => expect(validateRegistry()).toEqual([]));

  it('flags malformed seed datasets', () => {
    const errs = validateDatasets([
      { domain: '', records: [{ proposedTool: 'a' } as any] },
      { domain: 'x', records: 'nope' as any },
    ]);
    expect(errs.length).toBeGreaterThan(0);
  });

  it('flags duplicate proposed tools across datasets', () => {
    const errs = validateDatasets([
      { domain: 'a', records: [seedRecord({ proposedTool: 'dup' })] },
      { domain: 'b', records: [seedRecord({ proposedTool: 'dup' })] },
    ]);
    expect(errs.some(e => /Duplicate proposed tool/.test(e))).toBe(true);
  });

  it('passes a clean generated report', () => {
    const r = runPipeline(makeInputs({ raw: [raw({ proposedTool: 'a' })], now: FIXED_NOW }));
    expect(validateReports(r)).toEqual([]);
  });
});
