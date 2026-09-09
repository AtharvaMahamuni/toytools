import { describe, expect, it } from 'vitest';

import {
  DEFAULT_DRIVEN_TEETH,
  DEFAULT_DRIVER_TEETH,
  TEETH_CHOICES,
  canMesh,
  drivenAngle,
  drivenOmega,
  formatRatio,
  gearPath,
  layoutPair,
  meshDistance,
  meshPhase,
  pitchRadius,
} from './gears';

describe('gears layout', () => {
  it('makes radius from tooth count so a default pair meshes', () => {
    const layout = layoutPair(DEFAULT_DRIVER_TEETH, DEFAULT_DRIVEN_TEETH);
    expect(layout.ok).toBe(true);
    if (!layout.ok) return;
    expect(layout.ratio).toBe('1 : 2');
    expect(canMesh(layout.driverTeeth, layout.drivenTeeth, layout.distance)).toBe(true);
    expect(layout.distance).toBe(pitchRadius(12) + pitchRadius(24));
  });

  it('refuses a pair that would overflow the stage instead of overlapping unmeshed', () => {
    const overflow = layoutPair(24, 24, 80);
    expect(overflow).toEqual({
      ok: false,
      reason: 'Those tooth counts would push the pair off the stage. Pick a smaller pair.',
    });
  });

  it('flips the driven sign and scales by the tooth ratio', () => {
    expect(drivenOmega(2, 12, 24)).toBeCloseTo(-1);
    expect(drivenOmega(1, 16, 8)).toBeCloseTo(-2);
  });

  it('formats a reduced ratio', () => {
    expect(formatRatio(12, 24)).toBe('1 : 2');
    expect(formatRatio(8, 12)).toBe('2 : 3');
  });

  it('emits an evenodd path with a hub hole', () => {
    const d = gearPath(12);
    expect(d.startsWith('M ')).toBe(true);
    expect(d.includes('A ')).toBe(true);
    expect(meshDistance(8, 8)).toBe(pitchRadius(8) * 2);
  });

  it('offsets the driven gear by half a tooth so a tooth sits in the driver gap', () => {
    expect(meshPhase(24)).toBeCloseTo(Math.PI / 24);
    expect(drivenAngle(0, 12, 24)).toBeCloseTo(Math.PI / 24);
    // One driver tooth (2π/12) turns the driven by one of its teeth, plus the static mesh phase.
    expect(drivenAngle(Math.PI / 6, 12, 24)).toBeCloseTo(-Math.PI / 12 + Math.PI / 24);
  });

  it('keeps every offered pair meshed on the stage', () => {
    for (const a of TEETH_CHOICES) {
      for (const b of TEETH_CHOICES) {
        const next = layoutPair(a, b);
        expect(next.ok).toBe(true);
        if (next.ok) {
          expect(canMesh(next.driverTeeth, next.drivenTeeth, next.distance)).toBe(true);
        }
      }
    }
  });
});
