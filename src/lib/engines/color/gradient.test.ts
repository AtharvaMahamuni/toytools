import { describe, expect, it } from 'vitest';
import { gradientNote, lerpHue, perceptualGradient } from './gradient';
import { ALPHA_DROPPED, chipInk } from './gradient';
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

describe('PR #256 fixes', () => {
  it('chip labels are white on a dark stop and black on a light one (OKLCH L < 0.6)', () => {
    const res = perceptualGradient('#0000ff', '#ffff00');
    if (!res.ok) throw new Error('expected ok');
    expect(res.samples[0].ink).toBe('#ffffff');
    expect(res.samples[res.samples.length - 1].ink).toBe('#000000');
    expect(chipInk({ r: 0, g: 0, b: 0, a: 1 })).toBe('#ffffff');
    expect(chipInk({ r: 255, g: 255, b: 255, a: 1 })).toBe('#000000');
    // Either side of the flip: #888888 is OKLCH L 0.63, #777777 is 0.57.
    expect(chipInk({ r: 0x88, g: 0x88, b: 0x88, a: 1 })).toBe('#000000');
    expect(chipInk({ r: 0x77, g: 0x77, b: 0x77, a: 1 })).toBe('#ffffff');
  });

  it('takes the shortest hue path, wrapping through 0', () => {
    expect(lerpHue(350, 10, 0.5)).toBeCloseTo(0, 9);
    expect(lerpHue(10, 350, 0.5)).toBeCloseTo(0, 9);
    expect(lerpHue(350, 10, 0.25)).toBeCloseTo(355, 9);
    expect(lerpHue(20, 100, 0.5)).toBeCloseTo(60, 9);
    expect(lerpHue(300, 60, 0.5)).toBeCloseTo(0, 9);
    expect(lerpHue(60, 300, 0.5)).toBeCloseTo(0, 9);
    expect(lerpHue(-10, 370, 0.5)).toBeCloseTo(0, 9);
  });

  it('turns the same way as CSS "shorter hue" at exactly 180 degrees', () => {
    // CSS Color 4: a difference of exactly +180 or -180 is not adjusted.
    expect(lerpHue(0, 180, 0.5)).toBeCloseTo(90, 9);
    expect(lerpHue(180, 0, 0.5)).toBeCloseTo(90, 9);
    expect(lerpHue(90, 270, 0.5)).toBeCloseTo(180, 9);
    expect(lerpHue(270, 90, 0.5)).toBeCloseTo(180, 9);
  });

  it('says interpolated samples are clamped, not the stops', () => {
    const note = gradientNote(0.1, 0.09, true);
    expect(note).toBe('Some colors between the two stops fall outside sRGB, so those hex samples are clamped. The copied CSS still blends in OKLCH.');
  });

  it('says when transparency is dropped', () => {
    const res = perceptualGradient('#0000ff80', '#ffff00');
    if (!res.ok) throw new Error('expected ok');
    expect(res.fromHex).toBe('#0000ff');
    expect(res.note).toContain(ALPHA_DROPPED);
    const opaque = perceptualGradient('#0000ff', '#ffff00');
    if (!opaque.ok) throw new Error('expected ok');
    expect(opaque.note ?? '').not.toContain('Transparency');
  });
});
