import { describe, expect, it } from 'vitest';
import { gradientNote, lerpHue, perceptualGradient } from './gradient';
import { parseColor, rgbToOklch } from './convert';

describe('perceptual gradient', () => {
  it('copies an OKLCH linear-gradient and keeps hex samples for the strip', () => {
    const g = perceptualGradient('#0000ff', '#ffff00');
    expect(g.ok).toBe(true);
    if (!g.ok) return;
    expect(g.css).toBe('linear-gradient(to right in oklch, #0000ff, #ffff00)');
    expect(g.samples).toHaveLength(9);
    expect(g.samples[0]?.hex).toBe('#0000ff');
    expect(g.samples[8]?.hex).toBe('#ffff00');
    expect(g.fallbackCss.startsWith('linear-gradient(to right,')).toBe(true);
    expect(g.note).toContain('sRGB midpoint is grayer');
    expect(g.chromaDrop).toBeGreaterThanOrEqual(0.04);
  });

  it('stays silent for two near-gray stops', () => {
    const g = perceptualGradient('#777777', '#bbbbbb');
    expect(g.ok).toBe(true);
    if (!g.ok) return;
    expect(g.note).toBeNull();
    expect(g.chromaDrop).toBeLessThan(0.02);
  });

  it('rejects a value that is not a color', () => {
    const g = perceptualGradient('not-a-color', '#fff');
    expect(g.ok).toBe(false);
  });

  it('carries the chromatic hue when the other stop is a gray', () => {
    const blue = parseColor('#0000ff');
    expect(blue.ok && blue.rgb).toBeTruthy();
    if (!blue.rgb) return;
    const hue = rgbToOklch(blue.rgb).h;
    for (const gray of ['#000000', '#ffffff', '#808080']) {
      const g = perceptualGradient(gray, '#0000ff');
      expect(g.ok, gray).toBe(true);
      if (!g.ok) continue;
      expect(g.midpoint.h, gray).toBeCloseTo(hue, 4);
      expect(g.samples[1]?.hex, gray).not.toMatch(/^#(e9|03|7b)/);
    }
  });

  it('takes the short way around the hue circle', () => {
    const from = parseColor('#ff0000');
    const to = parseColor('#ff00aa');
    expect(from.ok && to.ok).toBe(true);
    if (!from.rgb || !to.rgb) return;
    const expected = lerpHue(rgbToOklch(from.rgb).h, rgbToOklch(to.rgb).h, 0.5);
    const g = perceptualGradient('#ff0000', '#ff00aa');
    if (!g.ok) return;
    expect(g.midpoint.h).toBeCloseTo(expected, 5);
    expect(Math.abs(g.midpoint.h - expected)).toBeLessThan(1);
  });
});

describe('gradientNote', () => {
  it('names the chroma drop once it is material', () => {
    expect(gradientNote(0.2, 0.1, true)).toContain('drops it by 0.100');
  });

  it('mentions the clamp only when the middle is not muddy', () => {
    expect(gradientNote(0.11, 0.1, true)).toContain('clamped');
  });

  it('stays silent under the muddy threshold when every sample is in gamut', () => {
    expect(gradientNote(0.11, 0.1, false)).toBeNull();
    expect(gradientNote(0.02, 0.01, false)).toBeNull();
  });
});
