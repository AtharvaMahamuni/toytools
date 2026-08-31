import { describe, it, expect } from 'vitest';

import { EQ_DEFINITIONS, eq, eqDefinition } from './registry';
import { DEFAULT_BANDS } from './bands';
import { DEFAULT_PRESETS, matchPreset, presetById } from './presets';
import { clampGains, curvePath, curvePoints, gainAt, gainForFrequency } from './curve';
import { headroom, trimBoosts } from './headroom';
import { bandNote, presetNote } from './notes';
import { decodeGains, displayName, encodeGains, settingsText, shareValues } from './share';

const DEF = EQ_DEFINITIONS['music-eq-7']!;
const N = DEF.bands.length;
const flat = () => new Array(N).fill(0) as number[];

describe('definitions', () => {
  it('exposes a seven-band definition with matching preset lengths', () => {
    expect(N).toBe(7);
    for (const preset of DEF.presets) {
      expect(preset.gains).toHaveLength(N);
    }
  });

  it('keeps every preset inside the definition limits', () => {
    for (const preset of DEF.presets) {
      for (const g of preset.gains) {
        expect(g).toBeGreaterThanOrEqual(DEF.minGain);
        expect(g).toBeLessThanOrEqual(DEF.maxGain);
        expect(Number.isInteger(g)).toBe(true);
      }
    }
  });

  it('spaces the bands at an even ratio, which is what lets the curve use an even x axis', () => {
    const ratios = DEFAULT_BANDS.slice(1).map((b, i) => b.frequency / DEFAULT_BANDS[i]!.frequency);
    for (const r of ratios) {
      expect(r).toBeGreaterThan(2.2);
      expect(r).toBeLessThan(2.9);
    }
  });

  it('falls back rather than throwing on an unknown id', () => {
    expect(eqDefinition('nope').id).toBe('music-eq-7');
    expect(eqDefinition('music-eq-7')).toBe(DEF);
  });

  it('gives every band and preset a unique id', () => {
    expect(new Set(DEFAULT_BANDS.map((b) => b.id)).size).toBe(N);
    expect(new Set(DEFAULT_PRESETS.map((p) => p.id)).size).toBe(DEFAULT_PRESETS.length);
  });
});

describe('clampGains', () => {
  it('clamps, rounds and pads to the band count', () => {
    expect(clampGains([99, -99, 2.4], 4, -12, 12)).toEqual([12, -12, 2, 0]);
  });

  it('treats junk as flat rather than throwing', () => {
    expect(clampGains(undefined, 3, -12, 12)).toEqual([0, 0, 0]);
    expect(clampGains(['x', null, NaN], 3, -12, 12)).toEqual([0, 0, 0]);
  });

  it('drops values past the band count', () => {
    expect(clampGains([1, 2, 3, 4, 5], 2, -12, 12)).toEqual([1, 2]);
  });
});

describe('curve', () => {
  it('passes exactly through every band value', () => {
    const gains = [6, 3, -1, 0, 0, 0, 1];
    gains.forEach((g, i) => expect(gainAt(gains, i)).toBeCloseTo(g, 10));
  });

  it('holds flat beyond the first and last band', () => {
    const gains = [4, 0, 0, 0, 0, 0, -2];
    expect(gainAt(gains, -3)).toBe(4);
    expect(gainAt(gains, 99)).toBe(-2);
  });

  it('interpolates between bands instead of stepping', () => {
    const gains = [0, 6, 0, 0, 0, 0, 0];
    const mid = gainAt(gains, 0.5);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(6);
  });

  it('samples the requested number of points, clamped to the limits', () => {
    const points = curvePoints([12, -12, 12, -12, 12, -12, 12], -12, 12, 49);
    expect(points).toHaveLength(49);
    expect(points[0]!.x).toBe(0);
    expect(points[48]!.x).toBe(1);
    for (const p of points) {
      expect(p.y).toBeGreaterThanOrEqual(-12);
      expect(p.y).toBeLessThanOrEqual(12);
    }
  });

  it('survives degenerate inputs', () => {
    expect(gainAt([], 0)).toBe(0);
    expect(gainAt([5], 3)).toBe(5);
    expect(curvePoints([3], -12, 12, 49)).toEqual([{ x: 0, y: 3 }]);
  });
});

describe('gainForFrequency', () => {
  const freqs = DEFAULT_BANDS.map((b) => b.frequency);

  it('returns the band value at a band frequency', () => {
    const gains = [6, 3, -1, 0, 2, 0, 1];
    freqs.forEach((f, i) => expect(gainForFrequency(gains, freqs, f)).toBeCloseTo(gains[i]!, 10));
  });

  it('reads between bands on a log axis, which is what a band converter needs', () => {
    const gains = [6, 0, 0, 0, 0, 0, 0];
    const at95 = gainForFrequency(gains, freqs, 95);
    expect(at95).toBeGreaterThan(0);
    expect(at95).toBeLessThan(6);
  });

  it('holds flat outside the band range and tolerates mismatched input', () => {
    const gains = [6, 0, 0, 0, 0, 0, -3];
    expect(gainForFrequency(gains, freqs, 20)).toBe(6);
    expect(gainForFrequency(gains, freqs, 20000)).toBe(-3);
    expect(gainForFrequency([1, 2], freqs, 1000)).toBe(0);
  });
});

describe('headroom', () => {
  it('says nothing when nothing is boosted', () => {
    expect(headroom(flat()).advice).toBe('');
    expect(headroom([0, -3, -4, 0, 0, 0, 0]).level).toBe('flat');
    expect(headroom([0, -3, -4, 0, 0, 0, 0]).peak).toBe(0);
  });

  it('stays quiet for a small boost and speaks for a moderate one', () => {
    expect(headroom([2, 0, 0, 0, 0, 0, 0]).advice).toBe('');
    const moderate = headroom([4, 0, 0, 0, 0, 0, 0]);
    expect(moderate.level).toBe('moderate');
    expect(moderate.preamp).toBe(-4);
    expect(moderate.advice).toContain('-4 dB');
  });

  it('names the risk and the preamp for a large boost', () => {
    const loud = headroom([9, 3, 0, 0, 0, 0, 0]);
    expect(loud.level).toBe('high');
    expect(loud.peak).toBe(9);
    expect(loud.preamp).toBe(-9);
    expect(loud.advice).toContain('clipping');
    expect(loud.advice).toContain('-9 dB');
  });

  it('trims boosts proportionally, leaving cuts and shape alone', () => {
    expect(trimBoosts([12, 6, -4, 0, 0, 0, 0], 6)).toEqual([6, 3, -2, 0, 0, 0, 0]);
  });

  it('leaves a curve that is already under the ceiling untouched', () => {
    const gains = [4, 2, -3, 0, 0, 0, 0];
    expect(trimBoosts(gains, 6)).toEqual(gains);
    expect(trimBoosts(gains, 6)).not.toBe(gains);
    expect(trimBoosts([0, -3, -5, 0, 0, 0, 0], 6)).toEqual([0, -3, -5, 0, 0, 0, 0]);
  });

  it('brings every preset under the trim ceiling', () => {
    for (const preset of DEF.presets) {
      expect(headroom(trimBoosts(preset.gains, 6)).peak).toBeLessThanOrEqual(6);
    }
  });
});

describe('notes', () => {
  const band = DEFAULT_BANDS[0]!;

  it('describes a boost and a cut differently', () => {
    expect(bandNote(band, 5).text).toContain(band.boost);
    expect(bandNote(band, -5).text).toContain(band.cut);
  });

  it('signs the heading and names the band', () => {
    expect(bandNote(band, 5).heading).toBe('60 Hz, +5 dB');
    expect(bandNote(band, -5).heading).toBe('60 Hz, -5 dB');
    expect(bandNote(band, 0).heading).toBe('60 Hz, 0 dB');
  });

  it('warns only once the move is large', () => {
    expect(bandNote(band, 5).text).not.toContain('headroom');
    expect(bandNote(band, 9).text).toContain('headroom');
  });

  it('hands back the preset description when a preset is loaded', () => {
    const preset = presetById(DEF.presets, 'more-bass')!;
    expect(presetNote(preset).text).toBe(preset.description);
    expect(presetNote(preset).heading).toBe('More Bass');
  });
});

describe('sharing', () => {
  it('round-trips gains through the link', () => {
    const gains = [6, 3, -1, 0, 0, 0, 1];
    expect(encodeGains(gains)).toBe('6_3_-1_0_0_0_1');
    expect(decodeGains(encodeGains(gains), N, -12, 12)).toEqual(gains);
  });

  it('still reads a comma-separated link, which is how one may come back from a chat client', () => {
    expect(decodeGains('6,3,-1,0,0,0,1', N, -12, 12)).toEqual([6, 3, -1, 0, 0, 0, 1]);
  });

  it('recovers a flat EQ from a mangled link instead of failing', () => {
    expect(decodeGains('6__x_999_-999', N, -12, 12)).toEqual([6, 0, 0, 12, -12, 0, 0]);
    expect(decodeGains(undefined, N, -12, 12)).toEqual(flat());
  });

  it('omits an empty name from the query and caps a long one', () => {
    expect(shareValues(flat())).toEqual({ eq: '0_0_0_0_0_0_0' });
    expect(shareValues(flat(), '   ').name).toBeUndefined();
    expect(shareValues(flat(), 'x'.repeat(80)).name).toHaveLength(48);
  });

  it('names a set of gains by the preset it matches', () => {
    const preset = presetById(DEF.presets, 'more-bass')!;
    expect(displayName(DEF, preset.gains)).toBe('More Bass');
    expect(displayName(DEF, [7, 3, -1, 0, 0, 0, 1])).toBe('Custom EQ');
    expect(displayName(DEF, preset.gains, 'Deep Bass + Vocals')).toBe('Deep Bass + Vocals');
  });

  it('matches a preset only on an exact set of gains', () => {
    expect(matchPreset(DEF.presets, flat())?.id).toBe('balanced');
    expect(matchPreset(DEF.presets, [0, 0, 0, 0, 0, 0, 1])).toBeUndefined();
    expect(matchPreset(DEF.presets, [0, 0])).toBeUndefined();
  });

  it('writes copyable settings with the preamp and the band caveat', () => {
    const text = settingsText(DEF, [8, 3, -1, 0, 0, 0, 1], 'Deep Bass', 'https://example.test/x/');
    expect(text).toContain('Deep Bass - EQ settings');
    expect(text).toContain('+8 dB');
    expect(text).toContain('-1 dB');
    expect(text).toContain('Preamp');
    expect(text).toContain('-8 dB');
    expect(text).toContain('Equalizers vary by app and device');
    expect(text).toContain('https://example.test/x/');
  });

  it('leaves the preamp line out when nothing is boosted', () => {
    expect(settingsText(DEF, [0, 0, 0, 0, -3, -4, 0], 'Less Harsh')).not.toContain('Preamp');
  });
});

describe('the runtime namespace', () => {
  it('exposes everything the widget calls', () => {
    for (const key of ['definition', 'curve', 'headroom', 'trim', 'bandNote', 'presetNote', 'encode', 'decode', 'name', 'shareValues', 'text', 'match', 'clamp']) {
      expect(typeof (eq as unknown as Record<string, unknown>)[key]).toBe('function');
    }
    expect(eq.card.size).toEqual({ width: 1200, height: 675 });
    expect(typeof eq.card.draw).toBe('function');
    expect(eq.regions).toHaveLength(5);
  });

  it('covers every band region with a described region', () => {
    for (const band of DEFAULT_BANDS) {
      expect(eq.regionOf(band)?.summary.length).toBeGreaterThan(20);
    }
  });
});

describe('curvePath', () => {
  it('draws a flat line on the 0 dB axis for a flat EQ', () => {
    const { line } = curvePath([0, 0, 0], 12, 5);
    expect(line.startsWith('M0,120')).toBe(true);
    expect(line).toContain('300,120');
    expect(/,\s*[^1]/.test(line.replace(/M|L| /g, ' '))).toBe(false);
  });

  it('spans one unit per band and puts the curve on the column centres', () => {
    const { line } = curvePath([12, 0, 0, 0, 0, 0, 0], 12, 49);
    // 7 bands * 100 units wide, and a full boost reaches the top of the 100-unit span.
    expect(line).toContain('700,');
    expect(line.startsWith('M0,20')).toBe(true);
  });

  it('closes the area back to the axis', () => {
    const { area } = curvePath([6, 0, 0], 12, 5);
    expect(area.endsWith('L300,120 L0,120 Z')).toBe(true);
  });

  it('returns a flat axis rather than NaN for degenerate input', () => {
    expect(curvePath([], 12).line).toBe('M0,120 L0,120');
    expect(curvePath([3], 0).line).toBe('M0,120 L100,120');
  });
});

describe('customNote', () => {
  it('describes an unmatched curve rather than the preset the page shipped with', () => {
    const note = eq.customNote();
    expect(note.text).toContain('your own curve');
    expect(note.text).not.toContain('0 dB');
  });
});
