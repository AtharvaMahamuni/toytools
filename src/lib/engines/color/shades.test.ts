import { describe, expect, it } from 'vitest';
import { parseColor, rgbToOklch } from './convert';
import { oklchToRgb, shadeScale } from './shades';

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
  it('holds hue, walks lightness down, and names a failing brand stop', () => {
    const scale = shadeScale('#3b82f6');
    expect(scale.ok).toBe(true);
    if (!scale.ok) return;
    expect(scale.scale.stops).toHaveLength(11);
    expect(scale.scale.stops[0].stop).toBe(50);
    expect(scale.scale.stops[0].l).toBeGreaterThan(scale.scale.stops[10].l);
    const hues = new Set(scale.scale.stops.map((s) => s.h));
    expect(hues.size).toBe(1);
    expect(scale.scale.css).toContain('--shade-500:');
    expect(scale.scale.onWhiteNote).toMatch(/Stop \d+ on white is/);
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
