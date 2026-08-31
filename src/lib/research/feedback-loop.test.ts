// The feedback loop: the three seams that carry evidence back INTO the engine, rather than
// recommendations out of it.
//
//   1. engagement signals  observed evidence -> corroboration -> confidence, and NEVER finalScore
//   2. craft debt          craft declarations x recorded failures, in both directions
//   3. the fingerprint     whether a report on disk still describes the current inputs
//
// Each of these has a failure mode that is silent and confident, which is the worst shape a
// suggestion engine can fail in, so the negative cases are asserted as hard as the positive ones:
// a signal that moved the score, a debt item for a tool that already has a craft, a fingerprint
// that changed because the clock did.

import { describe, it, expect } from 'vitest';
import { raw, catalogRef, makeInputs, seedRecord, FIXED_NOW } from './fixtures';
import { runPipeline } from './pipeline';
import { defaultInputs, runResearchIntelligence } from './index';
import { seedDatasetProvider } from './providers/seed-dataset/index';
import { scoreCorroboration } from './scorers/corroboration';
import { scoreConfidence } from './scorers/confidence';
import { analyzeCraftDebt } from './analyzers/craft-debt';
import { fingerprintInputs } from './fingerprint';
import { validateDatasets } from './validate';
import { craftDebtJson, indexJson } from './reports/json';
import { renderRoadmap, renderNextBuild } from './reports/markdown';
import type { EngagementSignal, SeedDataset } from './models/provider';

const signal = (o: Partial<EngagementSignal> = {}): EngagementSignal => ({
  kind: 'x-probe',
  date: '2026-08-30',
  observation: 'Three replies described diffing semicolon exports by eye.',
  strength: 60,
  ...o,
});

// ── 1. Engagement signals ─────────────────────────────────────────────────────

describe('corroboration scorer', () => {
  it('is zero with no observed signals, so desk research is not silently credited as observation', () => {
    expect(scoreCorroboration([])).toBe(0);
  });

  it('scores independent kinds above repeats of one kind', () => {
    const oneKind = [signal(), signal({ date: '2026-08-31' }), signal({ date: '2026-09-01' })];
    const threeKinds = [signal(), signal({ kind: 'feedback' }), signal({ kind: 'search-console' })];
    expect(scoreCorroboration(threeKinds)).toBeGreaterThan(scoreCorroboration(oneKind));
  });

  it('does not let a burst of weak repeats out-score one strong observation of the same kind', () => {
    const weakBurst = Array.from({ length: 6 }, () => signal({ strength: 20 }));
    const oneStrong = [signal({ strength: 90 })];
    expect(scoreCorroboration(oneStrong)).toBeGreaterThan(scoreCorroboration(weakBurst));
  });

  it('stays inside 0..1 at full saturation', () => {
    const maxed = [
      signal({ strength: 100 }),
      signal({ kind: 'feedback', strength: 100 }),
      signal({ kind: 'search-console', strength: 100 }),
      signal({ kind: 'x-reply', strength: 100 }),
      signal({ kind: 'support-thread', strength: 100 }),
    ];
    expect(scoreCorroboration(maxed)).toBeLessThanOrEqual(1);
    expect(scoreCorroboration(maxed)).toBeGreaterThan(0.9);
  });
});

describe('signals raise confidence', () => {
  it('lifts confidence when observed evidence exists', () => {
    const bare = raw({ proposedTool: 'a' });
    const observed = raw({ proposedTool: 'a', signals: [signal({ strength: 100 })] });
    expect(scoreConfidence(observed, 1)).toBeGreaterThan(scoreConfidence(bare, 1));
  });

  it('caps the observed contribution well below the asserted evidence', () => {
    // Nothing asserted at all, everything observed: confidence must stay low. A scorer that let
    // observation carry confidence on its own would re-create "a post did well, so build it".
    const observedOnly = raw({
      proposedTool: 'a',
      demand: 0,
      evergreen: 0,
      searchQueries: ['q'],
      existingSolutions: [],
      solutionWeaknesses: [],
      signals: [
        signal({ strength: 100 }),
        signal({ kind: 'feedback', strength: 100 }),
        signal({ kind: 'search-console', strength: 100 }),
      ],
    });
    expect(scoreConfidence(observedOnly, 1)).toBeLessThanOrEqual(0.2);
  });
});

describe('signals do NOT move finalScore', () => {
  // The load-bearing assertion of the whole design. searchDemand measures how loudly a need is
  // already being asked for; a post doing well is a different fact. If these two scores ever
  // diverge, one probe can reorder the roadmap.
  it('scores identically with and without observed evidence', () => {
    const without = runPipeline(makeInputs({ raw: [raw({ proposedTool: 'a' })] }));
    const with_ = runPipeline(
      makeInputs({
        raw: [
          raw({
            proposedTool: 'a',
            signals: [signal({ strength: 100 }), signal({ kind: 'feedback', strength: 100 })],
          }),
        ],
      }),
    );
    expect(with_.opportunities[0].finalScore).toBe(without.opportunities[0].finalScore);
    expect(with_.opportunities[0].confidence).toBeGreaterThan(without.opportunities[0].confidence);
  });
});

describe('signals survive the record -> provider -> opportunity -> report chain', () => {
  it('reaches the next-build recommendation as observed evidence', () => {
    const datasets: SeedDataset[] = [
      {
        domain: 'test',
        records: [seedRecord({ proposedTool: 'test-signal-tool', signals: [signal()] })],
      },
    ];
    const out = runResearchIntelligence(defaultInputs(datasets, FIXED_NOW));
    expect(out.roadmap.nextBuild!.observedEvidence).toHaveLength(1);
    const md = renderNextBuild(out.roadmap.nextBuild, FIXED_NOW, 'abc12345');
    expect(md).toContain('Observed evidence');
    expect(md).toContain('x-probe');
    // The report must state the limit, not just the evidence.
    expect(md).toContain('raise confidence, not the score');
  });

  it('clamps an out-of-range strength rather than carrying it into a scorer', () => {
    const [out] = seedDatasetProvider.discover({
      datasets: [{ domain: 'test', records: [seedRecord({ proposedTool: 't', signals: [signal({ strength: 400 })] })] }],
      existingSlugs: new Set(),
    });
    expect(out.signals[0].strength).toBe(100);
  });

  it('defaults to an empty list, never a manufactured signal', () => {
    const [out] = seedDatasetProvider.discover({
      datasets: [{ domain: 'test', records: [seedRecord({ proposedTool: 't' })] }],
      existingSlugs: new Set(),
    });
    expect(out.signals).toEqual([]);
  });
});

describe('signal validation', () => {
  const withSignal = (sig: unknown): SeedDataset[] => [
    { domain: 'test', records: [seedRecord({ proposedTool: 't', signals: [sig] as EngagementSignal[] })] },
  ];

  it('accepts a well-formed signal', () => {
    expect(validateDatasets(withSignal(signal()))).toEqual([]);
  });

  it('rejects an unknown kind', () => {
    expect(validateDatasets(withSignal(signal({ kind: 'tiktok' as EngagementSignal['kind'] }))).join()).toContain('invalid kind');
  });

  it('rejects a malformed date, so evidence stays auditable', () => {
    expect(validateDatasets(withSignal(signal({ date: 'last tuesday' }))).join()).toContain('YYYY-MM-DD');
  });

  it('rejects "did well" as an observation', () => {
    expect(validateDatasets(withSignal(signal({ observation: 'did well' }))).join()).toContain('what was actually seen');
  });

  it('rejects an out-of-range strength', () => {
    expect(validateDatasets(withSignal(signal({ strength: 900 }))).join()).toContain('strength out of range');
  });

  it('rejects a non-array signals field and a non-object entry', () => {
    const notArray: SeedDataset[] = [
      { domain: 'test', records: [seedRecord({ proposedTool: 't', signals: 'x' as unknown as EngagementSignal[] })] },
    ];
    expect(validateDatasets(notArray).join()).toContain('signals must be an array');
    expect(validateDatasets(withSignal(null)).join()).toContain('is not an object');
  });
});

// ── 2. Craft debt ─────────────────────────────────────────────────────────────

describe('craft debt', () => {
  const FAILURE = 'A semicolon-delimited export parses as one column and every row reads as changed.';

  function debt(opts: { craftSlugs?: string[] } = {}) {
    const inputs = makeInputs({
      raw: [
        raw({ proposedTool: 'shipped-with-evidence', userFailures: [FAILURE], demand: 90 }),
        raw({ proposedTool: 'shipped-no-evidence', demand: 50 }),
        raw({ proposedTool: 'shipped-has-craft', userFailures: [FAILURE] }),
        raw({ proposedTool: 'buildable-no-evidence' }),
        raw({ proposedTool: 'buildable-with-evidence', userFailures: [FAILURE] }),
      ],
      existingSlugs: ['shipped-with-evidence', 'shipped-no-evidence', 'shipped-has-craft'],
      craftSlugs: opts.craftSlugs ?? ['shipped-has-craft'],
    });
    return runPipeline(inputs).craftDebt;
  }

  it('names shipped tools whose craft the evidence already specifies', () => {
    const d = debt();
    expect(d.readyToPolish.map(i => i.slug)).toEqual(['shipped-with-evidence']);
    expect(d.readyToPolish[0].userFailures).toEqual([FAILURE]);
  });

  it('separates shipped tools that need evidence before a craft can be honest', () => {
    expect(debt().needsEvidence.map(i => i.slug)).toEqual(['shipped-no-evidence']);
  });

  it('says nothing about a tool that already declares a craft, however much evidence it has', () => {
    const d = debt();
    const all = [...d.readyToPolish, ...d.needsEvidence].map(i => i.slug);
    expect(all).not.toContain('shipped-has-craft');
  });

  it('moves a tool out of the debt list the moment it declares a craft', () => {
    const after = debt({ craftSlugs: ['shipped-has-craft', 'shipped-with-evidence'] });
    expect(after.readyToPolish).toEqual([]);
  });

  it('flags buildable opportunities that would ship craftless, and only those', () => {
    const d = debt();
    expect(d.atRisk.map(i => i.proposedTool)).toEqual(['buildable-no-evidence']);
  });

  it('orders each kind by demand so a batch starts where it matters most', () => {
    const inputs = makeInputs({
      raw: [
        raw({ proposedTool: 'low-demand', userFailures: ['x'], demand: 10 }),
        raw({ proposedTool: 'high-demand', userFailures: ['y'], demand: 95 }),
      ],
      existingSlugs: ['low-demand', 'high-demand'],
    });
    expect(analyzeCraftDebt(runPipeline(inputs).opportunities, inputs).readyToPolish.map(i => i.slug)).toEqual([
      'high-demand',
      'low-demand',
    ]);
  });

  it('counts only the shipped tools the datasets actually cover', () => {
    expect(debt().summary.shippedCovered).toBe(3);
  });
});

describe('craft risk reaches the builder before anything is scaffolded', () => {
  it('states the risk in the roadmap reasons', () => {
    const r = runPipeline(makeInputs({ raw: [raw({ proposedTool: 'a' })] }));
    expect(r.roadmap.nextBuild!.reason.join(' ')).toContain('CRAFT RISK');
  });

  it('says nothing when a task-level failure is recorded', () => {
    const r = runPipeline(makeInputs({ raw: [raw({ proposedTool: 'a', userFailures: ['fails at X'] })] }));
    expect(r.roadmap.nextBuild!.reason.join(' ')).not.toContain('CRAFT RISK');
    expect(r.opportunities[0].craftRisk).toBe(false);
  });

  it('never flags an already-shipped tool, whose debt is a different question', () => {
    const r = runPipeline(makeInputs({ raw: [raw({ proposedTool: 'a' })], existingSlugs: ['a'] }));
    expect(r.opportunities[0].craftRisk).toBe(false);
  });
});

// ── 3. The fingerprint ────────────────────────────────────────────────────────

describe('inputs fingerprint', () => {
  const base = {
    datasets: [{ domain: 'test', records: [seedRecord({ proposedTool: 'a' })] }],
    existingSlugs: new Set(['x']),
    engineIds: new Set(['text-processor']),
    craftSlugs: new Set<string>(),
  };

  it('is stable across runs with identical inputs', () => {
    expect(fingerprintInputs(base)).toBe(fingerprintInputs({ ...base }));
  });

  it('changes when the evidence changes', () => {
    const changed = { ...base, datasets: [{ domain: 'test', records: [seedRecord({ proposedTool: 'a', demand: 99 })] }] };
    expect(fingerprintInputs(changed)).not.toBe(fingerprintInputs(base));
  });

  it('changes when the CATALOG changes, which is how the reports went stale with no dataset edit', () => {
    expect(fingerprintInputs({ ...base, existingSlugs: new Set(['x', 'y']) })).not.toBe(fingerprintInputs(base));
  });

  it('changes when a craft declaration is added, since craft debt is derived from it', () => {
    expect(fingerprintInputs({ ...base, craftSlugs: new Set(['x']) })).not.toBe(fingerprintInputs(base));
  });

  it('ignores set iteration order and JSON key order', () => {
    const reordered = {
      ...base,
      existingSlugs: new Set(['b', 'a']),
      engineIds: new Set(['text-processor']),
    };
    const same = { ...base, existingSlugs: new Set(['a', 'b']) };
    expect(fingerprintInputs(reordered)).toBe(fingerprintInputs(same));
  });

  it('does NOT change when only the timestamp does, or "is this current" becomes "is this recent"', () => {
    const a = runResearchIntelligence(defaultInputs(base.datasets, '2026-01-01T00:00:00.000Z'));
    const b = runResearchIntelligence(defaultInputs(base.datasets, '2026-09-01T00:00:00.000Z'));
    expect(a.fingerprint).toBe(b.fingerprint);
    expect(a.generatedAt).not.toBe(b.generatedAt);
  });

  it('is stamped onto index.json, which is what research:status reads', () => {
    const r = runResearchIntelligence(defaultInputs(base.datasets, FIXED_NOW));
    expect((indexJson(r) as { fingerprint: string }).fingerprint).toBe(r.fingerprint);
  });
});

// ── Reports ───────────────────────────────────────────────────────────────────

describe('craft debt in the reports', () => {
  const inputs = makeInputs({
    raw: [
      raw({ proposedTool: 'polish-me', userFailures: ['loses the delimiter'] }),
      raw({ proposedTool: 'no-evidence-yet' }),
      raw({ proposedTool: 'buildable-craftless' }),
    ],
    catalog: [catalogRef({ slug: 'polish-me' })],
    existingSlugs: ['polish-me', 'no-evidence-yet'],
    fingerprint: 'abc12345',
  });
  const reports = runPipeline(inputs);

  it('renders all three sections in roadmap.md', () => {
    const md = renderRoadmap(reports);
    expect(md).toContain('Ready to polish');
    expect(md).toContain('polish-me');
    expect(md).toContain('Needs evidence');
    expect(md).toContain('At risk');
  });

  it('stamps the fingerprint on the roadmap so a reader can check it', () => {
    expect(renderRoadmap(reports)).toContain('abc12345');
    expect(renderRoadmap(reports)).toContain('research:status');
  });

  it('says so plainly when there is no debt, rather than rendering an empty heading', () => {
    const clean = runPipeline(
      makeInputs({ raw: [raw({ proposedTool: 'a', userFailures: ['x'] })], existingSlugs: ['a'], craftSlugs: ['a'] }),
    );
    expect(renderRoadmap(clean)).toContain('The evidence is fully worked through');
  });

  it('exports the debt as its own artifact', () => {
    const json = craftDebtJson(reports) as { readyToPolish: unknown[]; fingerprint: string };
    expect(json.readyToPolish).toHaveLength(1);
    expect(json.fingerprint).toBe('abc12345');
  });

  it('omits the fingerprint footer from next-build.md when none was supplied', () => {
    expect(renderNextBuild(reports.roadmap.nextBuild, FIXED_NOW)).not.toContain('research:status');
  });
});
