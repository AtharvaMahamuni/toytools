import { describe, expect, it } from 'vitest';
import { deriveSimRelations, resolveRelations } from './relations';
import { MANIFESTS } from './manifests';
import type { SimulationManifest } from './manifest';

const bySlug = new Map(MANIFESTS.map((m) => [m.metadata.slug, m]));
function get(slug: string): SimulationManifest {
  const m = bySlug.get(slug);
  if (!m) throw new Error(`missing manifest ${slug}`);
  return m;
}

describe('deriveSimRelations', () => {
  it('never references the target itself', () => {
    for (const m of MANIFESTS) {
      const { usedWith, nextSteps } = deriveSimRelations(m, MANIFESTS);
      for (const r of [...usedWith, ...nextSteps]) {
        expect(r.slug).not.toBe(m.metadata.slug);
      }
    }
  });

  it('only references real simulation slugs', () => {
    const valid = new Set(MANIFESTS.map((m) => m.metadata.slug));
    for (const m of MANIFESTS) {
      const { usedWith, nextSteps } = deriveSimRelations(m, MANIFESTS);
      for (const r of [...usedWith, ...nextSteps]) expect(valid.has(r.slug)).toBe(true);
    }
  });

  it('is deterministic', () => {
    for (const m of MANIFESTS) {
      const a = deriveSimRelations(m, MANIFESTS);
      const b = deriveSimRelations(m, MANIFESTS);
      expect(a).toEqual(b);
    }
  });

  it('links the two waves-family sims that share wave speed and frequency', () => {
    // wave-speed and doppler-effect are both in the waves family and share the wave-speed and
    // frequency concepts/quantities, so each should surface the other as a top match.
    const wave = deriveSimRelations(get('wave-speed-calculator'), MANIFESTS).usedWith.map((r) => r.slug);
    expect(wave).toContain('doppler-effect-calculator');
    const doppler = deriveSimRelations(get('doppler-effect-calculator'), MANIFESTS).usedWith.map((r) => r.slug);
    expect(doppler).toContain('wave-speed-calculator');
  });

  it('links the two thermodynamics sims by family', () => {
    const rel = deriveSimRelations(get('ideal-gas-law-calculator'), MANIFESTS);
    const slugs = [...rel.usedWith, ...rel.nextSteps].map((r) => r.slug);
    expect(slugs).toContain('heat-transfer-calculator');
  });

  it('every usedWith edge carries a reason and a strength', () => {
    for (const m of MANIFESTS) {
      for (const r of deriveSimRelations(m, MANIFESTS).usedWith) {
        expect(r.reason && r.reason.length).toBeTruthy();
        expect(r.strength).toBeGreaterThan(0);
        expect(r.reason).not.toContain('—');
      }
    }
  });

  it('resolveRelations returns derived edges when no manifest override is present', () => {
    const m = get('ohms-law-calculator');
    expect(m.relationships).toBeUndefined();
    const resolved = resolveRelations(m, MANIFESTS);
    expect(resolved.usedWith).toEqual(deriveSimRelations(m, MANIFESTS).usedWith);
  });
});

describe('resolveRelations overlay', () => {
  // The overlay ADDS to the derivation rather than replacing it. It used to replace, which meant
  // authoring one cross-subject link silently dropped every derived sibling edge.
  it('keeps the derived edges and adds the authored ones', () => {
    const m = get('reaction-rate-calculator');
    expect(m.relationships?.usedWith?.length).toBeGreaterThan(0);

    const derived = deriveSimRelations(m, MANIFESTS);
    const resolved = resolveRelations(m, MANIFESTS);
    const slugs = new Set(resolved.usedWith!.map((r) => r.slug));

    for (const d of derived.usedWith) expect(slugs.has(d.slug), `derived ${d.slug} survives`).toBe(true);
    for (const a of m.relationships!.usedWith!) expect(slugs.has(a.slug), `authored ${a.slug} present`).toBe(true);
  });

  it('lets an authored edge win over a derived one for the same slug', () => {
    const m = get('reaction-rate-calculator');
    const derivedSlug = deriveSimRelations(m, MANIFESTS).usedWith[0]!.slug;
    const overridden: SimulationManifest = {
      ...m,
      relationships: { usedWith: [{ slug: derivedSlug, reason: 'authored wins', strength: 0.99 }] },
    };
    const resolved = resolveRelations(overridden, MANIFESTS);
    const hit = resolved.usedWith!.find((r) => r.slug === derivedSlug)!;
    expect(hit.reason).toBe('authored wins');
    // Deduplicated: the derived copy of the same slug does not survive alongside it.
    expect(resolved.usedWith!.filter((r) => r.slug === derivedSlug)).toHaveLength(1);
  });

  it('reaches outside its own domain, so no engine is left isolated', () => {
    // Every chemistry simulator is the only member of its family, so nothing outside the domain
    // derives. These authored links are what connect chemistry-lab to physics on the architecture
    // map; check-engines gates the isolated-engine count that depends on them.
    const chemistry = ['newman-projection-calculator', 'crystal-field-splitting-calculator', 'reaction-rate-calculator'];
    const chemistrySlugs = new Set(chemistry);
    const outward = chemistry.flatMap((slug) => {
      const r = resolveRelations(get(slug), MANIFESTS);
      return [...(r.usedWith ?? []), ...(r.nextSteps ?? [])];
    });
    expect(outward.some((r) => !chemistrySlugs.has(r.slug))).toBe(true);
  });
});
