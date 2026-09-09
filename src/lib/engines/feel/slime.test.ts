import { describe, expect, it } from 'vitest';

import { createBlob, grab, isGrabbed, moveGrab, release, step } from './slime';

describe('slime blob', () => {
  it('grabs a vertex and release detaches it', () => {
    const blob = createBlob(80, 80, 40, 16);
    const idx = grab(blob, 80, 40);
    expect(isGrabbed(blob)).toBe(true);
    moveGrab(blob, 120, 20);
    expect(blob.verts[idx].x).toBe(120);
    release(blob);
    expect(isGrabbed(blob)).toBe(false);
    const x = blob.verts[idx].x;
    moveGrab(blob, 0, 0);
    expect(blob.verts[idx].x).toBe(x);
  });

  it('a step with no grab stays on the stage', () => {
    const blob = createBlob(80, 80, 40, 16);
    step(blob, 160, 160, 0.32, 1);
    for (const v of blob.verts) {
      expect(v.x).toBeGreaterThan(0);
      expect(v.x).toBeLessThan(160);
      expect(v.y).toBeGreaterThan(0);
      expect(v.y).toBeLessThan(160);
    }
  });
});
