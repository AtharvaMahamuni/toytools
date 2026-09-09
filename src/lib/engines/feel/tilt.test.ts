import { describe, expect, it, vi } from 'vitest';

import {
  createTilt,
  readScreenAngle,
  tiltActive,
  tiltFromOrientation,
  type TiltHost,
} from './tilt';

describe('tiltFromOrientation', () => {
  it('maps portrait gamma to screen-right x, with a deadzone', () => {
    expect(tiltFromOrientation(10, 4, 0).x).toBe(0);
    expect(tiltFromOrientation(10, 35, 0).x).toBeCloseTo(1);
    expect(tiltFromOrientation(10, -35, 0).x).toBeCloseTo(-1);
    expect(tiltFromOrientation(10, 21.5, 0).x).toBeGreaterThan(0.4);
  });

  it('rotates axes in landscape', () => {
    expect(tiltFromOrientation(35, 0, 90).x).toBeCloseTo(1);
    expect(tiltFromOrientation(-35, 0, 270).x).toBeCloseTo(1);
  });

  it('treats missing axes as level', () => {
    expect(tiltFromOrientation(null, null, 0)).toEqual({ x: 0, y: 0 });
  });
});

describe('readScreenAngle', () => {
  it('normalises window.orientation negatives', () => {
    expect(readScreenAngle({ orientation: -90 })).toBe(270);
    expect(readScreenAngle({ screen: { orientation: { angle: 90 } } })).toBe(90);
  });
});

describe('createTilt', () => {
  it('stays silent without DeviceOrientationEvent', async () => {
    const host: TiltHost = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const tilt = createTilt(host);
    expect(await tilt.start()).toBe(false);
    expect(tilt.x()).toBe(0);
    expect(tiltActive({ x: 0, y: 0 })).toBe(false);
  });

  it('honours a denied iOS permission', async () => {
    const host: TiltHost = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      DeviceOrientationEvent: { requestPermission: async () => 'denied' },
    };
    const tilt = createTilt(host);
    expect(await tilt.start()).toBe(false);
    expect(host.addEventListener).not.toHaveBeenCalled();
  });

  it('updates x from a granted orientation event', async () => {
    let handler: ((ev: DeviceOrientationEvent) => void) | null = null;
    const host: TiltHost = {
      addEventListener: vi.fn((_type, fn) => {
        handler = fn;
      }),
      removeEventListener: vi.fn(),
      DeviceOrientationEvent: { requestPermission: async () => 'granted' },
      orientation: 0,
    };
    const tilt = createTilt(host);
    const seen: number[] = [];
    tilt.onChange((s) => seen.push(s.x));
    expect(await tilt.start()).toBe(true);
    handler?.({ beta: 12, gamma: 35 } as DeviceOrientationEvent);
    expect(tilt.x()).toBeCloseTo(1);
    expect(tilt.live()).toBe(true);
    expect(seen[0]).toBeCloseTo(1);
    expect(tiltActive({ x: tilt.x(), y: 0 })).toBe(true);
  });
});
