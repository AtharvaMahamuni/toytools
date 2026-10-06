import { describe, expect, it } from 'vitest';
import { parseColor } from './convert';
import { CVD_TYPES, closestCollapse, collapseNote, rgbDistance, simulateCvd } from './vision';
import type { RGB } from './types';

function rgb(input: string): RGB {
  const parsed = parseColor(input);
  if (!parsed.ok || !parsed.rgb) throw new Error(input);
  return parsed.rgb;
}

describe('simulateCvd', () => {
  it('leaves a neutral gray close to gray under every Machado type', () => {
    const gray = rgb('#808080');
    for (const type of CVD_TYPES) {
      const out = simulateCvd(gray, type.id);
      expect(Math.abs(out.r - out.g)).toBeLessThan(4);
      expect(Math.abs(out.g - out.b)).toBeLessThan(4);
      expect(out.r).toBeGreaterThan(110);
      expect(out.r).toBeLessThan(150);
    }
  });

  it('moves pure red a long way under protanopia and keeps the channels in range', () => {
    const red = rgb('#ff0000');
    const out = simulateCvd(red, 'protanopia');
    expect(rgbDistance(red, out)).toBeGreaterThan(80);
    expect(out.r).toBeGreaterThanOrEqual(0);
    expect(out.r).toBeLessThanOrEqual(255);
    expect(out.g).toBeGreaterThanOrEqual(0);
    expect(out.b).toBeGreaterThanOrEqual(0);
  });

  it('renders achromatopsia as equal channels', () => {
    const out = simulateCvd(rgb('#d32f2f'), 'achromatopsia');
    expect(out.r).toBe(out.g);
    expect(out.g).toBe(out.b);
  });

  it('simulates anomaly as a milder shift than dichromacy', () => {
    const red = rgb('#ff0000');
    const full = rgbDistance(red, simulateCvd(red, 'deuteranopia'));
    const mild = rgbDistance(red, simulateCvd(red, 'deuteranomaly'));
    expect(mild).toBeGreaterThan(10);
    expect(mild).toBeLessThan(full);
  });
});

describe('closestCollapse', () => {
  it('names deuteranopia when red and green collapse, and stays quiet for a blue and a yellow', () => {
    const colors = [rgb('#d32f2f'), rgb('#388e3c')];
    const hit = closestCollapse(colors, ['#d32f2f', '#388e3c']);
    expect(hit).not.toBeNull();
    expect(hit!.type).toBe('deuteranopia');
    expect(hit!.after).toBeLessThan(hit!.before);
    expect(collapseNote(hit)).toContain(hit!.label);
    expect(collapseNote(hit)).toContain('#d32f2f');

    const apart = closestCollapse([rgb('#1565c0'), rgb('#f9a825')], ['#1565c0', '#f9a825']);
    expect(apart).toBeNull();
    expect(collapseNote(apart)).toBe('');
  });

  it('stays silent for a single color and for two copies of the same color', () => {
    expect(closestCollapse([rgb('#d32f2f')], ['#d32f2f'])).toBeNull();
    expect(closestCollapse([rgb('#388e3c'), rgb('#388e3c')], ['#388e3c', '#388e3c'])).toBeNull();
    // Pure red and pure green differ in lightness, so Machado still separates them.
    expect(closestCollapse([rgb('#ff0000'), rgb('#00ff00')], ['#ff0000', '#00ff00'])).toBeNull();
  });
});
