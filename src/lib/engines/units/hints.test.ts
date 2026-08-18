import { describe, expect, it } from 'vitest';
import { unitHint } from './hints';

const aspect = (width: number, ratioW: number, ratioH: number) =>
  unitHint('aspect-ratio-calculator', { width, height: (width * ratioH) / ratioW, ratioW, ratioH });

describe('unitHint — what the converted number is about to run into', () => {
  it('catches a 16:9 width that produces half a pixel', () => {
    // 1000 x 562.5. ffmpeg rejects it; 1008 x 567 is odd, so the answer is the nearest even pair.
    const r = aspect(1000, 16, 9);
    expect(r).toContain('not whole pixels');
    expect(r).toContain('992 by 558');
  });

  it('catches a whole but odd pair, which H.264 also refuses', () => {
    const r = aspect(999, 3, 1);
    expect(r).toContain('both dimensions even');
    expect(r).toContain('996 by 332');
  });

  it('names the densities where a dp value lands on a fraction of a pixel', () => {
    // 5dp is 3.75px at ldpi and 7.5px at hdpi.
    const r = unitHint('px-to-dp-converter', { mode: 'dp2px', dp: 5 });
    expect(r).toContain('ldpi and hdpi');
    expect(r).toContain('4dp is whole');
  });

  it('explains that em compounds, because it is relative to the parent', () => {
    const r = unitHint('px-to-rem-converter', { unit: 'em', base: 16 });
    expect(r).toContain('relative to the parent');
    expect(r).toContain('16px root');
  });

  it('reports the root the user actually set, not the browser default', () => {
    expect(unitHint('px-to-rem-converter', { unit: 'em', base: 10 })).toContain('10px root');
  });
});

// Silence is half the contract: these fire on values a designer types by accident, not by habit.
describe('unitHint — silence', () => {
  it('says nothing about a pair that is already even', () => {
    expect(aspect(1920, 16, 9)).toBeNull();
    expect(aspect(3840, 16, 9)).toBeNull();
    expect(aspect(1080, 1, 1)).toBeNull();
  });

  it('says nothing for an incomplete or nonsensical aspect input', () => {
    expect(unitHint('aspect-ratio-calculator', {})).toBeNull();
    expect(unitHint('aspect-ratio-calculator', { width: 0, height: 0, ratioW: 16, ratioH: 9 })).toBeNull();
  });

  it('says nothing for dp values on the 4dp grid, which divide cleanly everywhere', () => {
    for (const dp of [4, 8, 12, 16, 24, 48]) {
      expect(unitHint('px-to-dp-converter', { mode: 'dp2px', dp })).toBeNull();
    }
  });

  it('says nothing in the px-to-dp direction, which has no per-bucket values', () => {
    expect(unitHint('px-to-dp-converter', { mode: 'px2dp', dp: 5 })).toBeNull();
  });

  it('says nothing about compounding for the units that do not compound', () => {
    for (const unit of ['px', 'rem', 'pt']) {
      expect(unitHint('px-to-rem-converter', { unit, base: 16 })).toBeNull();
    }
    expect(unitHint('px-to-rem-converter', {})).toBeNull();
  });
});
