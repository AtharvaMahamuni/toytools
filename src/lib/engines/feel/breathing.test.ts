import { describe, expect, it } from 'vitest';

import { cycleLength, phaseAt, presetById } from './breathing';

describe('breathing presets', () => {
  it('defaults to Box 4-4-4-4, never an unnamed calm', () => {
    const box = presetById('nope');
    expect(box.id).toBe('box');
    expect(box.name).toBe('Box');
    expect(box.pattern).toBe('4-4-4-4');
    expect(cycleLength(box)).toBe(16);
  });

  it('walks Box through inhale, hold, exhale, hold', () => {
    const box = presetById('box');
    expect(phaseAt(0, box).phase).toBe('inhale');
    expect(phaseAt(3.2, box).phase).toBe('inhale');
    expect(phaseAt(4, box).phase).toBe('holdIn');
    expect(phaseAt(8, box).phase).toBe('exhale');
    expect(phaseAt(12, box).phase).toBe('holdOut');
    expect(phaseAt(16, box).cycle).toBe(1);
  });

  it('skips zero-length holds on 4-7-8 and coherent', () => {
    const four = presetById('4-7-8');
    expect(phaseAt(4, four).phase).toBe('holdIn');
    expect(phaseAt(11, four).phase).toBe('exhale');
    const coh = presetById('coherent');
    expect(phaseAt(5, coh).phase).toBe('exhale');
    expect(phaseAt(0, coh).scale).toBe(1);
    expect(phaseAt(4.9, coh).scale).toBeGreaterThan(1.2);
  });

  it('marks done after the requested cycle count', () => {
    const box = presetById('box');
    expect(phaseAt(32, box, 2).done).toBe(true);
    expect(phaseAt(15, box, 2).done).toBe(false);
  });
});
