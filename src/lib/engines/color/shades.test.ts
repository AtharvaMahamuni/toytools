import { describe, expect, it } from 'vitest';
import { parseColor, rgbToOklch } from './convert';
import { contrastRatio } from './contrast';
import { inkFor, oklchToRgb, shadeScale } from './shades';

describe('oklchToRgb', () => {
  it('round-trips a mid blue through the existing forward transform', () => {
    const parsed = parseColor('#3b82f6');
    expect(parsed.ok).toBe(true);
    const ok = rgbToOklch(parsed.rgb!);
    const back = oklchToRgb(ok.l, ok.c, ok.h);
    expect(back.inGamut).toBe(true);
    expect(back.rgb.r).toBeCloseTo(parsed.rgb!.r, -1);
    expect(back.rgb.g).toBeCloseTo(parsed.rgb!.g, -1);
    expect(back.rgb.b).toBeCloseTo(parsed.rgb!.b, -1);
  });
});

describe('shadeScale', () => {
  it('holds hue on every output stop, walks lightness down, and names the typed color', () => {
    const scale = shadeScale('#3b82f6');
    expect(scale.ok).toBe(true);
    if (!scale.ok) return;
    expect(scale.scale.stops).toHaveLength(11);
    expect(scale.scale.stops[0].stop).toBe(50);
    expect(scale.scale.stops[0].l).toBeGreaterThan(scale.scale.stops[10].l);
    const srcHue = rgbToOklch(parseColor('#3b82f6').rgb!).h;
    for (const stop of scale.scale.stops) {
      const out = rgbToOklch(parseColor(stop.hex).rgb!);
      const dh = Math.abs(((out.h - srcHue + 540) % 360) - 180);
      expect(dh, `stop ${stop.stop} ${stop.hex}`).toBeLessThanOrEqual(5);
    }
    expect(scale.scale.css).toContain('--shade-500:');
    expect(scale.scale.onWhiteNote).toBe('#3b82f6 (stop 500) on white is 3.68:1. Body text needs 4.5.');
  });

  it('puts the typed color into the scale as the brand stop', () => {
    const scale = shadeScale('#3b82f6');
    if (!scale.ok) throw new Error('expected a scale');
    const brand = scale.scale.stops.find((s) => s.stop === scale.scale.brandStop)!;
    expect(brand.hex).toBe('#3b82f6');
    expect(scale.scale.css).toContain('#3b82f6;');
  });

  it('warns about a typed color that fails 4.5 even when a neighbouring stop passes', () => {
    const scale = shadeScale('#f01ea5');
    if (!scale.ok) throw new Error('expected a scale');
    expect(scale.scale.onWhiteNote).toMatch(/^#f01ea5 \(stop \d+\) on white is 3\.86:1/);
  });

  it('stays silent for a typed color that passes 4.5, even when its nearest stop fails', () => {
    const scale = shadeScale('#d32f2f');
    if (!scale.ok) throw new Error('expected a scale');
    expect(scale.scale.onWhiteNote).toBeNull();
  });

  it('labels every swatch with the higher-contrast ink, at least 4.5:1', () => {
    for (const color of ['#3b82f6', '#f01ea5', '#d32f2f', '#10b981', '#eab308']) {
      const scale = shadeScale(color);
      if (!scale.ok) throw new Error('expected a scale');
      for (const stop of scale.scale.stops) {
        const bg = parseColor(stop.hex).rgb!;
        const ratio = contrastRatio(parseColor(stop.ink).rgb!, bg);
        expect(ratio, `${color} stop ${stop.stop} ${stop.hex} ink ${stop.ink}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('picks ink by contrast: dark on #5696ff (white is 2.91:1), white on navy, black on a mid gold', () => {
    expect(inkFor(parseColor('#5696ff').rgb!)).toBe('#1a1a1a');
    expect(inkFor(parseColor('#1e3a8a').rgb!)).toBe('#ffffff');
    expect(inkFor(parseColor('#a17a00').rgb!)).toBe('#000000');
  });

  it('stays silent when the brand stop already clears 4.5 on white', () => {
    const scale = shadeScale('#1e3a8a');
    expect(scale.ok).toBe(true);
    if (!scale.ok) return;
    expect(scale.scale.onWhiteNote).toBeNull();
  });

  it('rejects a value that is not a color', () => {
    expect(shadeScale('not a color').ok).toBe(false);
  });
});
