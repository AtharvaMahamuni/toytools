import { describe, it, expect } from 'vitest';
import { pxToCss, cssToPx, dpToPxBuckets, pxToDp, ptToPxIos, simplifyRatio, solveAspect } from './convert';
import { units } from './registry';

describe('CSS units', () => {
  it('16px = 1rem = 12pt = 100% at base 16', () => {
    const u = pxToCss(16, 16);
    expect(u.rem).toBe(1);
    expect(u.em).toBe(1);
    expect(u.pt).toBe(12);
    expect(u.percent).toBe(100);
  });
  it('honors a custom root font size', () => {
    expect(pxToCss(20, 10).rem).toBe(2);
  });
  it('round-trips px <-> rem', () => {
    expect(cssToPx(1.5, 'rem', 16)).toBe(24);
    expect(pxToCss(24, 16).rem).toBe(1.5);
  });
  it('converts pt back to px', () => {
    expect(cssToPx(12, 'pt')).toBe(16);
  });
});

describe('Android density', () => {
  it('8dp = 16px at xhdpi (2x)', () => {
    const buckets = dpToPxBuckets(8);
    const xhdpi = buckets.find(b => b.id === 'xhdpi')!;
    expect(xhdpi.px).toBe(16);
    expect(buckets.find(b => b.id === 'mdpi')!.px).toBe(8);
    expect(buckets.find(b => b.id === 'xxxhdpi')!.px).toBe(32);
  });
  it('px -> dp inverts the scale', () => {
    expect(pxToDp(16, 2)).toBe(8);
  });
  it('iOS pt scales @1x/@2x/@3x', () => {
    expect(ptToPxIos(10)).toEqual({ scale1: 10, scale2: 20, scale3: 30 });
  });
});

describe('aspect ratio', () => {
  it('simplifies 1920x1080 to 16:9', () => {
    expect(simplifyRatio(1920, 1080).ratio).toBe('16:9');
  });
  it('solves height from width at 16:9', () => {
    const r = solveAspect({ width: 1600, ratioW: 16, ratioH: 9 });
    expect('height' in r && r.height).toBe(900);
  });
  it('solves width from height at 4:3', () => {
    const r = solveAspect({ height: 600, ratioW: 4, ratioH: 3 });
    expect('width' in r && r.width).toBe(800);
  });
  it('errors on missing dimension or bad ratio', () => {
    expect('error' in solveAspect({ ratioW: 16, ratioH: 9 })).toBe(true);
    expect('error' in solveAspect({ width: 100, ratioW: 0, ratioH: 9 })).toBe(true);
  });
});

describe('units runtime namespace', () => {
  it('exposes the helpers', () => {
    expect(units.pxToCss(16, 16).rem).toBe(1);
    expect(units.buckets.length).toBeGreaterThan(3);
  });
});
