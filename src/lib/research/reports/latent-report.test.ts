// Tests for latent.md and the validation that guards it.
//
// The renderer is tested rather than eyeballed because latent.md is the deliverable a build decision
// gets made from, and its ORDER carries an argument: the derived silences come first, and the
// proposals answering them come second. Read the other way round, a well-argued proposal looks like
// evidence for itself, which is the exact reasoning error the anchor gate exists to prevent.

import { describe, it, expect } from 'vitest';
import { runPipeline } from '../pipeline';
import { renderLatent } from './markdown';
import { latentJson } from './json';
import { validateReports } from '../validate';
import { raw, catalogRef, makeInputs, FIXED_NOW } from '../fixtures';
import type { LatentEvidence } from '../models/provider';

const LATENT: LatentEvidence = {
  whyUnnamed: 'The failure is invisible until long after it happens.',
  consequence: 90,
  observedBehaviour: ['People check by hand and assume the result is right.'],
};

function reportsWith(opts: { latent?: boolean; unanchored?: boolean } = {}) {
  return runPipeline(
    makeInputs({
      raw: [
        raw({ proposedTool: 'ordinary-tool', proposedEngine: 'text-processor', demand: 80 }),
        ...(opts.latent
          ? [raw({ proposedTool: 'hash-identifier', proposedEngine: 'hashing', demand: 9, latent: LATENT })]
          : []),
        ...(opts.unanchored
          ? [raw({ proposedTool: 'no-evidence-tool', proposedEngine: 'calculator', demand: 9, latent: LATENT })]
          : []),
      ],
      catalog: [
        catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' }),
        catalogRef({ slug: 'percentage-calculator', engine: 'calculator', pattern: 'calculate' }),
      ],
      now: FIXED_NOW,
    }),
  );
}

describe('renderLatent', () => {
  it('puts the derived silences before the proposals answering them', () => {
    const md = renderLatent(reportsWith({ latent: true }));
    expect(md.indexOf('## Derived silences')).toBeGreaterThan(-1);
    expect(md.indexOf('## Derived silences')).toBeLessThan(md.indexOf('## Anchored candidates'));
  });

  it('states outright that the two rankings are not comparable', () => {
    expect(renderLatent(reportsWith({ latent: true }))).toMatch(/not comparable and are never merged/);
  });

  it('renders a candidate with its anchors, signals and score', () => {
    const md = renderLatent(reportsWith({ latent: true }));
    expect(md).toContain('`hash-identifier`');
    expect(md).toContain('asymmetry:hashing');
    expect(md).toMatch(/\*\*Latent score:\*\* \d+(\.\d+)? \/ 100/);
    expect(md).toContain('anchorStrength');
  });

  it('reports unanchored proposals instead of hiding them', () => {
    const md = renderLatent(reportsWith({ latent: true, unanchored: true }));
    expect(md).toContain('## Unanchored proposals (reported, not recommended)');
    expect(md).toContain('`no-evidence-tool`');
    expect(md).toMatch(/do not build it on this report/i);
  });

  it('says so plainly when there is nothing to report, rather than rendering empty headings', () => {
    const md = renderLatent(reportsWith());
    expect(md).toContain('_No proposal matched a derived silence._');
    expect(md).toContain('_None._');
  });

  it('contains no em-dashes, matching house style', () => {
    expect(renderLatent(reportsWith({ latent: true, unanchored: true }))).not.toContain('—');
  });

  it('renders what an unmet need costs when failures are on record', () => {
    const r = runPipeline(
      makeInputs({
        raw: [
          raw({
            proposedTool: 'hash-identifier',
            proposedEngine: 'hashing',
            demand: 9,
            userFailures: ['pastes a digest and cannot tell which algorithm produced it'],
            latent: LATENT,
          }),
        ],
        catalog: [catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' })],
        now: FIXED_NOW,
      }),
    );
    expect(renderLatent(r)).toContain('**What it costs when unmet:** pastes a digest');
  });

  it('marks a candidate below the promote bar rather than presenting it as build-worthy', () => {
    const r = runPipeline(
      makeInputs({
        raw: [
          raw({
            proposedTool: 'marginal-tool',
            proposedEngine: 'hashing',
            demand: 92,
            algorithmicFit: 8,
            latent: { ...LATENT, consequence: 4 },
          }),
        ],
        catalog: [catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' })],
        now: FIXED_NOW,
      }),
    );
    expect(r.latent.candidates[0].latentScore).toBeLessThan(55);
    expect(renderLatent(r)).toContain('below the promote bar');
  });

  it('orders candidates on equal scores by id, so the report never reshuffles on its own', () => {
    const twins = (slugs: string[]) =>
      runPipeline(
        makeInputs({
          raw: slugs.map(s => raw({ proposedTool: s, proposedEngine: 'hashing', demand: 9, latent: LATENT })),
          catalog: [catalogRef({ slug: 'sha256-hash-generator', engine: 'hashing', pattern: 'hash' })],
          now: FIXED_NOW,
        }),
      ).latent.candidates;

    const forward = twins(['zeta-checker', 'alpha-checker']);
    expect(forward.map(c => c.id)).toEqual(['alpha-checker', 'zeta-checker']);
    expect(forward[0].latentScore).toBe(forward[1].latentScore);
    expect(twins(['alpha-checker', 'zeta-checker']).map(c => c.id)).toEqual(forward.map(c => c.id));
  });

  it('is byte-stable across runs', () => {
    expect(renderLatent(reportsWith({ latent: true }))).toBe(renderLatent(reportsWith({ latent: true })));
  });
});

describe('latentJson', () => {
  it('carries the version, timestamp and both halves of the report', () => {
    const j = latentJson(reportsWith({ latent: true })) as Record<string, unknown>;
    expect(j.version).toBeTypeOf('number');
    expect(j.generatedAt).toBe(FIXED_NOW);
    expect(Array.isArray(j.signals)).toBe(true);
    expect(Array.isArray(j.candidates)).toBe(true);
    expect(Array.isArray(j.unanchored)).toBe(true);
  });
});

describe('validateReports - the latent guardrail', () => {
  it('passes a well-formed report', () => {
    expect(validateReports(reportsWith({ latent: true, unanchored: true }))).toEqual([]);
  });

  it('catches a candidate promoted with no anchors', () => {
    const r = reportsWith({ latent: true });
    r.latent.candidates[0].anchors = [];
    expect(validateReports(r).join('\n')).toMatch(/promoted to candidate with zero anchors/);
  });

  it('catches an anchor pointing at a signal that does not exist', () => {
    const r = reportsWith({ latent: true });
    r.latent.candidates[0].anchors[0].signalId = 'asymmetry:invented';
    expect(validateReports(r).join('\n')).toMatch(/unknown signal asymmetry:invented/);
  });

  it('catches an unanchored entry that carries anchors or drops its reason', () => {
    const r = reportsWith({ latent: true, unanchored: true });
    r.latent.unanchored[0].anchors = [{ signalId: 'asymmetry:hashing', kind: 'asymmetry', because: 'x' }];
    delete r.latent.unanchored[0].note;
    const errors = validateReports(r).join('\n');
    expect(errors).toMatch(/listed as unanchored but carries anchors/);
    expect(errors).toMatch(/unanchored without a stated reason/);
  });

  it('catches out-of-range scores and missing prose', () => {
    const r = reportsWith({ latent: true });
    r.latent.candidates[0].consequence = 1.4;
    r.latent.candidates[0].latentScore = 140;
    r.latent.candidates[0].whyUnnamed = '';
    r.latent.signals[0].weight = -1;
    r.latent.signals[0].implication = '';
    const errors = validateReports(r).join('\n');
    expect(errors).toMatch(/consequence out of 0\.\.1/);
    expect(errors).toMatch(/latentScore out of 0\.\.100/);
    expect(errors).toMatch(/missing whyUnnamed/);
    expect(errors).toMatch(/weight out of 0\.\.1/);
    expect(errors).toMatch(/missing observation\/implication/);
  });
});
