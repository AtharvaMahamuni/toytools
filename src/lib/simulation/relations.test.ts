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
    const wave = deriveSimRelations(get('wave-speed-simulator'), MANIFESTS).usedWith.map((r) => r.slug);
    expect(wave).toContain('doppler-effect-simulator');
    const doppler = deriveSimRelations(get('doppler-effect-simulator'), MANIFESTS).usedWith.map((r) => r.slug);
    expect(doppler).toContain('wave-speed-simulator');
  });

  it('links the two thermodynamics sims by family', () => {
    const rel = deriveSimRelations(get('ideal-gas-law-simulator'), MANIFESTS);
    const slugs = [...rel.usedWith, ...rel.nextSteps].map((r) => r.slug);
    expect(slugs).toContain('heat-transfer-simulator');
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
    const m = get('ohms-law-simulator');
    expect(m.relationships).toBeUndefined();
    const resolved = resolveRelations(m, MANIFESTS);
    expect(resolved.usedWith).toEqual(deriveSimRelations(m, MANIFESTS).usedWith);
  });
});
