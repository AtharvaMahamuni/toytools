import { describe, expect, it } from 'vitest';
import { typeScale } from './scale';

describe('typeScale', () => {
  it('builds rem from a 16px body and a major second, and stays quiet', () => {
    const scale = typeScale(16, 1.125);
    expect(scale.ok).toBe(true);
    if (!scale.ok) return;
    const body = scale.steps.find((s) => s.id === 'body');
    expect(body).toMatchObject({ px: 16, rem: 1 });
    expect(scale.steps[0].px).toBeGreaterThanOrEqual(12);
    expect(scale.steps[scale.steps.length - 1].px).toBeLessThanOrEqual(64);
    expect(scale.note).toBeNull();
    expect(scale.css).toContain('--type-body: 1rem;');
  });

  it('names a caption under 12px at the major third', () => {
    const scale = typeScale(16, 1.25);
    expect(scale.ok).toBe(true);
    if (!scale.ok) return;
    expect(scale.steps[0].px).toBeLessThan(12);
    expect(scale.note).toContain('Caption is');
    expect(scale.note).toContain('12px floor');
    expect(scale.note).not.toContain('overflows');
  });

  it('names both ends of a golden-ratio scale', () => {
    const scale = typeScale(16, 1.618);
    expect(scale.ok).toBe(true);
    if (!scale.ok) return;
    expect(scale.note).toContain('Caption is');
    expect(scale.note).toContain('Display is');
    expect(scale.note).toContain('overflows a phone');
  });

  it('rejects an empty base', () => {
    expect(typeScale(Number.NaN, 1.25).ok).toBe(false);
    expect(typeScale(0, 1.25).ok).toBe(false);
  });

  it('keeps the base inside the 1 to 200 pixels its error message promises', () => {
    for (const base of [0.5, 1e-9, 0.999, 200.01]) {
      const scale = typeScale(base, 1.25);
      expect(scale.ok).toBe(false);
      if (scale.ok) continue;
      expect(scale.error).toBe('Enter a base size between 1 and 200 pixels.');
    }
    expect(typeScale(1, 1.25).ok).toBe(true);
    expect(typeScale(200, 1.25).ok).toBe(true);
  });
});
