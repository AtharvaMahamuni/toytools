// Latent-demand analyzer tests.
//
// Roughly half of these assert SILENCE, and that is the point rather than an accident of coverage.
// This analyzer's failure mode is not being wrong loudly, it is being confident about a tool nobody
// wants: `namelessness` rewards the absence of a search term, and a need nobody has is also missing
// a search term. So the cases that matter most are the ones where it must produce nothing - an
// unanchored proposal, a covered seam, a terminal format, an engine that already has a verifier.

import { describe, it, expect } from 'vitest';
import { analyzeLatentDemand, deriveSignals } from './latent-demand';
import { scoreOpportunities } from './opportunity-score';
import { deduplicate } from './deduplicate';
import { catalogRef, makeInputs, raw } from '../fixtures';
import type { ResearchInputs } from '../types';
import type { LatentEvidence } from '../models/provider';

const LATENT: LatentEvidence = {
  whyUnnamed: 'The workflow has no name, so nobody types it into a search box.',
  consequence: 80,
  observedBehaviour: ['People do it by hand across two browser tabs.'],
};

/** Run the real pipeline stages so tests exercise what the CLI actually runs. */
function analyze(inputs: ResearchInputs) {
  const opportunities = scoreOpportunities(deduplicate(inputs.raw).merged, inputs);
  return analyzeLatentDemand(opportunities, inputs);
}

describe('deriveSignals - asymmetry (producers with no verifier)', () => {
  it('reports an engine that produces artifacts and cannot check any of them', () => {
    const inputs = makeInputs({
      raw: [],
      catalog: [
        catalogRef({ slug: 'password-generator', engine: 'generation', pattern: 'generate-credential' }),
        catalogRef({ slug: 'uuid-generator', engine: 'generation', pattern: 'generate-identifier' }),
      ],
    });
    const asym = deriveSignals([], inputs).filter(s => s.kind === 'asymmetry');
    expect(asym).toHaveLength(1);
    expect(asym[0].id).toBe('asymmetry:generation');
    expect(asym[0].evidence).toEqual(['password-generator', 'uuid-generator']);
  });

  it('stays silent for an engine that already has a verifier', () => {
    const inputs = makeInputs({
      raw: [],
      catalog: [
        catalogRef({ slug: 'json-formatter', engine: 'structured-data', pattern: 'structured-transform' }),
        catalogRef({ slug: 'json-validator', engine: 'structured-data', pattern: 'structured-validate' }),
      ],
    });
    expect(deriveSignals([], inputs).filter(s => s.kind === 'asymmetry')).toHaveLength(0);
  });

  // Both cases below shipped as false positives: the analyzer read producer/verifier intent from a
  // regex over the pattern name, so it reported two holes the catalog had already filled.
  it('sees a verifier whose FAMILY says so when its pattern is shared with siblings', () => {
    // validate-registry forces every member of a tool group onto one engine/pattern, so csv-diff and
    // csv-to-tsv are both "csv-transform". Only the family separates the comparer from the converter.
    const inputs = makeInputs({
      raw: [],
      catalog: [
        catalogRef({ slug: 'csv-to-tsv', engine: 'csv', pattern: 'csv-transform', family: 'convert' }),
        catalogRef({ slug: 'csv-cleaner', engine: 'csv', pattern: 'csv-transform', family: 'clean' }),
        catalogRef({ slug: 'csv-diff', engine: 'csv', pattern: 'csv-transform', family: 'compare' }),
      ],
    });
    expect(deriveSignals([], inputs).filter(s => s.kind === 'asymmetry')).toHaveLength(0);
  });

  it('sees a verifier whose pattern carries no verifying word', () => {
    const inputs = makeInputs({
      raw: [],
      catalog: [
        catalogRef({ slug: 'color-format-converter', engine: 'color', pattern: 'color-convert', family: 'color' }),
        catalogRef({ slug: 'color-contrast-checker', engine: 'color', pattern: 'color-contrast', family: 'color' }),
      ],
    });
    expect(deriveSignals([], inputs).filter(s => s.kind === 'asymmetry')).toHaveLength(0);
  });

  it('does not mistake a family that merely sounds like checking for a verifier', () => {
    // crc32-hash-generator lives in the "checksum" family and produces a digest rather than checking
    // one. A regex over names silenced the real hashing hole here; the declared map must not.
    const inputs = makeInputs({
      raw: [],
      catalog: [
        catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash', family: 'digest' }),
        catalogRef({ slug: 'crc32-hash-generator', engine: 'hashing', pattern: 'hash', family: 'checksum' }),
      ],
    });
    const asym = deriveSignals([], inputs).filter(s => s.kind === 'asymmetry');
    expect(asym).toHaveLength(1);
    expect(asym[0]!.id).toBe('asymmetry:hashing');
  });

  it('stays silent for an engine that produces nothing (metrics are read, not checked)', () => {
    const inputs = makeInputs({
      raw: [],
      catalog: [catalogRef({ slug: 'word-counter', engine: 'text-analysis', pattern: 'text-metric' })],
    });
    expect(deriveSignals([], inputs).filter(s => s.kind === 'asymmetry')).toHaveLength(0);
  });
});

describe('deriveSignals - dead ends', () => {
  it('reports a non-terminal format nothing consumes', () => {
    const inputs = makeInputs({
      raw: [],
      catalog: [catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' })],
    });
    const ends = deriveSignals([], inputs).filter(s => s.kind === 'dead-end');
    expect(ends.map(s => s.id)).toContain('dead-end:hash');
  });

  it('does not report terminal formats - a word count is meant to be read, not consumed', () => {
    const inputs = makeInputs({
      raw: [],
      catalog: [catalogRef({ slug: 'word-counter', engine: 'text-analysis', pattern: 'text-metric' })],
    });
    const ends = deriveSignals([], inputs).filter(s => s.kind === 'dead-end');
    expect(ends.map(s => s.id)).not.toContain('dead-end:metrics');
  });

  it('does not report a format some engine does consume', () => {
    const inputs = makeInputs({
      raw: [],
      catalog: [
        catalogRef({ slug: 'jwt-decoder', engine: 'jwt', pattern: 'token-decode' }),
        catalogRef({ slug: 'json-formatter', engine: 'structured-data', pattern: 'structured-transform' }),
      ],
    });
    // jwt emits json and structured-data consumes json, so json is not a dead end.
    const ends = deriveSignals([], inputs).filter(s => s.kind === 'dead-end');
    expect(ends.map(s => s.id)).not.toContain('dead-end:json');
  });
});

describe('deriveSignals - handoff seams', () => {
  const jwtAndJson = [
    catalogRef({ slug: 'jwt-decoder', engine: 'jwt', pattern: 'token-decode' }),
    catalogRef({ slug: 'json-tree-viewer', engine: 'structured-data', pattern: 'structured-transform' }),
  ];

  it('reports a join where a converter hands off to another engine with nothing spanning it', () => {
    const seams = deriveSignals([], makeInputs({ raw: [], catalog: jwtAndJson })).filter(s => s.kind === 'handoff');
    expect(seams.map(s => s.id)).toContain('handoff:jwt->structured-data');
  });

  it('stays silent when a tool already spans the seam', () => {
    const inputs = makeInputs({
      raw: [],
      catalog: [...jwtAndJson, catalogRef({ slug: 'jwt-json-explorer', engine: 'jwt', pattern: 'token-decode' })],
    });
    const seams = deriveSignals([], inputs).filter(s => s.kind === 'handoff');
    expect(seams.map(s => s.id)).not.toContain('handoff:jwt->structured-data');
  });

  it('stays silent for engines that never change format - chaining them is a pipeline, not a gap', () => {
    const inputs = makeInputs({
      raw: [],
      catalog: [
        catalogRef({ slug: 'lowercase-converter', engine: 'text-processor', pattern: 'text-transform' }),
        catalogRef({ slug: 'text-compare', engine: 'text-interactive', pattern: 'text-interactive' }),
      ],
    });
    expect(deriveSignals([], inputs).filter(s => s.kind === 'handoff')).toHaveLength(0);
  });
});

describe('deriveSignals - unserved failures', () => {
  it('reports recorded failures that the demand ranking left below the bar', () => {
    const inputs = makeInputs({
      raw: [raw({ proposedTool: 'obscure-fixer', demand: 3, competition: 90, userFailures: ['loses data silently'] })],
      catalog: [],
    });
    const sig = analyze(inputs).signals.filter(s => s.kind === 'unserved-failure');
    expect(sig).toHaveLength(1);
    expect(sig[0].evidence).toEqual(['loses data silently']);
  });

  it('stays silent when the demand engine already recommends the tool', () => {
    const inputs = makeInputs({
      raw: [raw({ proposedTool: 'popular-fixer', demand: 99, competition: 5, userFailures: ['loses data silently'] })],
      catalog: [],
    });
    expect(analyze(inputs).signals.filter(s => s.kind === 'unserved-failure')).toHaveLength(0);
  });

  it('stays silent for a tool that already shipped', () => {
    const inputs = makeInputs({
      raw: [raw({ proposedTool: 'shipped-tool', demand: 3, userFailures: ['loses data silently'] })],
      existingSlugs: ['shipped-tool'],
    });
    expect(analyze(inputs).signals.filter(s => s.kind === 'unserved-failure')).toHaveLength(0);
  });
});

describe('the anchor gate', () => {
  it('refuses to score a latent proposal that matches no derived silence', () => {
    const inputs = makeInputs({
      raw: [raw({ proposedTool: 'nobody-wants-this', proposedEngine: 'text-processor', demand: 1, latent: LATENT })],
      // A catalog with a verifier and no seams: nothing structural to anchor to.
      catalog: [catalogRef({ slug: 'text-compare', engine: 'text-processor', pattern: 'text-interactive' })],
    });
    const r = analyze(inputs);
    expect(r.candidates).toHaveLength(0);
    expect(r.unanchored.map(c => c.proposedTool)).toEqual(['nobody-wants-this']);
    expect(r.unanchored[0].note).toMatch(/no derived silence/i);
  });

  it('promotes a proposal that fills a real silence', () => {
    const inputs = makeInputs({
      raw: [
        raw({
          proposedTool: 'hash-identifier',
          proposedEngine: 'hashing',
          demand: 8,
          relatedTools: ['sha256-hash-generator', 'md5-hash-generator'],
          latent: LATENT,
        }),
      ],
      catalog: [
        catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' }),
        catalogRef({ slug: 'md5-hash-generator', engine: 'hashing', pattern: 'hash' }),
      ],
    });
    const r = analyze(inputs);
    expect(r.candidates.map(c => c.proposedTool)).toEqual(['hash-identifier']);
    const kinds = r.candidates[0].anchors.map(a => a.kind);
    expect(kinds).toContain('asymmetry');
    expect(kinds).toContain('dead-end');
    expect(r.candidates[0].latentScore).toBeGreaterThan(0);
  });

  it('anchors a proposal to a handoff seam it would span', () => {
    const inputs = makeInputs({
      raw: [raw({ proposedTool: 'jwt-payload-explorer', proposedEngine: 'jwt', demand: 12, latent: LATENT })],
      catalog: [
        catalogRef({ slug: 'jwt-decoder', engine: 'jwt', pattern: 'token-decode' }),
        catalogRef({ slug: 'json-tree-viewer', engine: 'structured-data', pattern: 'structured-transform' }),
      ],
    });
    const c = analyze(inputs).candidates[0];
    expect(c.anchors.map(a => a.kind)).toContain('handoff');
    expect(c.anchors.find(a => a.kind === 'handoff')!.signalId).toBe('handoff:jwt->structured-data');
  });

  it('anchors a proposal to its own recorded failures when demand buried it', () => {
    const inputs = makeInputs({
      raw: [
        raw({
          proposedTool: 'quiet-need',
          proposedEngine: 'text-processor',
          demand: 2,
          competition: 95,
          userFailures: ['silently truncates', 'loses the last column'],
          latent: LATENT,
        }),
      ],
      catalog: [catalogRef({ slug: 'lowercase-converter', engine: 'text-processor', pattern: 'text-transform' })],
    });
    const c = analyze(inputs).candidates[0];
    expect(c.anchors.map(a => a.kind)).toContain('unserved-failure');
    expect(c.consequenceOf).toEqual(['silently truncates', 'loses the last column']);
  });

  it('marks a latent proposal for an already-shipped tool as such, not as a candidate', () => {
    const inputs = makeInputs({
      raw: [raw({ proposedTool: 'hash-identifier', proposedEngine: 'hashing', demand: 10, latent: LATENT })],
      catalog: [catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' })],
      existingSlugs: ['hash-identifier'],
    });
    const r = analyze(inputs);
    expect(r.candidates).toHaveLength(0);
    expect(r.unanchored).toHaveLength(0);
    expect(r.summary.considered).toBe(1);
  });

  it('falls back to the stated problem when a latent claim records no behaviour', () => {
    const inputs = makeInputs({
      raw: [
        raw({
          proposedTool: 'hash-identifier',
          proposedEngine: 'hashing',
          demand: 10,
          latent: { ...LATENT, observedBehaviour: [] },
        }),
      ],
      catalog: [catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' })],
    });
    expect(analyze(inputs).candidates[0].need).toBe('problem about hash-identifier');
  });

  it('scores a proposal on an engine with no IO row without inventing seams for it', () => {
    const inputs = makeInputs({
      raw: [raw({ proposedTool: 'mystery-tool', proposedEngine: 'not-an-engine', demand: 5, latent: LATENT })],
      catalog: [catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' })],
    });
    const r = analyze(inputs);
    // The unserved-failure path cannot fire (no failures recorded) and no IO-derived silence can
    // match an engine the graph has never heard of, so it lands unanchored rather than scored.
    expect(r.candidates).toHaveLength(0);
    expect(r.unanchored.map(c => c.proposedTool)).toEqual(['mystery-tool']);
  });

  it('ignores opportunities that make no latent claim at all', () => {
    const inputs = makeInputs({
      raw: [raw({ proposedTool: 'ordinary-tool', proposedEngine: 'hashing' })],
      catalog: [catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' })],
    });
    const r = analyze(inputs);
    expect(r.summary.considered).toBe(0);
    expect(r.candidates).toHaveLength(0);
  });
});

describe('latent scoring', () => {
  it('reads no-query as evidence, the opposite sign to the demand engine', () => {
    const build = (demand: number) =>
      analyze(
        makeInputs({
          raw: [raw({ proposedTool: 'hash-identifier', proposedEngine: 'hashing', demand, latent: LATENT })],
          catalog: [catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' })],
        }),
      ).candidates[0];

    expect(build(5).namelessness).toBeGreaterThan(build(95).namelessness);
    expect(build(5).latentScore).toBeGreaterThan(build(95).latentScore);
  });

  it('rewards independent KINDS of evidence over a pile of one kind', () => {
    // Same proposal, same anchors count-wise, but one lands on an engine with two distinct silences.
    const oneKind = analyze(
      makeInputs({
        raw: [raw({ proposedTool: 'a-tool', proposedEngine: 'text-processor', demand: 10, latent: LATENT })],
        catalog: [
          catalogRef({ slug: 'lowercase-converter', engine: 'text-processor', pattern: 'text-transform' }),
          catalogRef({ slug: 'json-formatter', engine: 'structured-data', pattern: 'structured-transform' }),
        ],
      }),
    ).candidates[0];

    const twoKinds = analyze(
      makeInputs({
        raw: [raw({ proposedTool: 'a-tool', proposedEngine: 'hashing', demand: 10, latent: LATENT })],
        catalog: [catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' })],
      }),
    ).candidates[0];

    expect(new Set(twoKinds.anchors.map(a => a.kind)).size).toBeGreaterThan(
      new Set(oneKind.anchors.map(a => a.kind)).size,
    );
    expect(twoKinds.anchorStrength).toBeGreaterThan(oneKind.anchorStrength);
  });

  it('counts catalog adjacency as reachability, because search will not deliver anyone', () => {
    const withBridges = analyze(
      makeInputs({
        raw: [
          raw({
            proposedTool: 'hash-identifier',
            proposedEngine: 'hashing',
            demand: 10,
            relatedTools: ['a', 'b', 'c', 'd', 'e', 'f'],
            latent: LATENT,
          }),
        ],
        catalog: [
          catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' }),
          ...['a', 'b', 'c', 'd', 'e', 'f'].map(s => catalogRef({ slug: s, engine: 'hashing', pattern: 'hash' })),
        ],
        existingSlugs: ['a', 'b', 'c', 'd', 'e', 'f'],
      }),
    ).candidates[0];

    expect(withBridges.reachability).toBe(1);
  });
});

describe('determinism', () => {
  it('produces byte-identical output across runs', () => {
    const make = () =>
      makeInputs({
        raw: [raw({ proposedTool: 'hash-identifier', proposedEngine: 'hashing', demand: 10, latent: LATENT })],
        catalog: [
          catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' }),
          catalogRef({ slug: 'password-generator', engine: 'generation', pattern: 'generate-credential' }),
        ],
      });
    expect(JSON.stringify(analyze(make()))).toBe(JSON.stringify(analyze(make())));
  });
});
