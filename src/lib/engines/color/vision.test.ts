import { describe, expect, it } from 'vitest';
import { parseColor } from './convert';
import { CVD_TYPES, closestCollapse, collapseNote, rgbDistance, simulateCvd, splitColorList } from './vision';
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

describe('splitColorList (audit S1-1, S3-6)', () => {
  const ok = (items: string[]) => items.every(item => parseColor(item).ok);

  it('keeps rgb() whole, with or without spaces after the commas', () => {
    expect(splitColorList('rgb(255, 0, 0) #00ff00').items).toEqual(['rgb(255, 0, 0)', '#00ff00']);
    expect(splitColorList('rgb(255,0,0)').items).toEqual(['rgb(255,0,0)']);
    expect(ok(splitColorList('rgb(255, 0, 0) rgb(1,2,3)').items)).toBe(true);
  });

  it('keeps rgba() and hsl() and hsla() whole', () => {
    expect(splitColorList('rgba(0, 0, 255, 0.5)').items).toEqual(['rgba(0, 0, 255, 0.5)']);
    expect(splitColorList('hsl(120, 100%, 25%), hsl(0 100% 50%)').items).toEqual(['hsl(120, 100%, 25%)', 'hsl(0 100% 50%)']);
    expect(splitColorList('hsla(0, 100%, 50%, 1)').items).toEqual(['hsla(0, 100%, 50%, 1)']);
  });

  it('splits a mixed list on spaces and commas outside the parentheses', () => {
    const { items } = splitColorList('#d32f2f, rgb(56, 142, 60) red,hsl(210, 79%, 46%)  #abc');
    expect(items).toEqual(['#d32f2f', 'rgb(56, 142, 60)', 'red', 'hsl(210, 79%, 46%)', '#abc']);
    expect(ok(items)).toBe(true);
  });

  it('keeps the existing formats: hex lists split on spaces or commas, names', () => {
    expect(splitColorList('#d32f2f #388e3c #1976d2').items).toEqual(['#d32f2f', '#388e3c', '#1976d2']);
    expect(splitColorList('red,green , blue').items).toEqual(['red', 'green', 'blue']);
    expect(splitColorList('   ').items).toEqual([]);
  });

  it('an unclosed rgb( stays one token, so it fails as one color', () => {
    const { items } = splitColorList('rgb(255, 0 #00ff00');
    expect(items).toEqual(['rgb(255, 0 #00ff00']);
    expect(parseColor(items[0]!).ok).toBe(false);
  });

  it('caps at eight and reports how many were dropped', () => {
    const nine = Array.from({ length: 9 }, (_, i) => `rgb(${i}, 0, 0)`).join(' ');
    const r = splitColorList(nine);
    expect(r.items).toHaveLength(8);
    expect(r.dropped).toBe(1);
    expect(splitColorList('#000 #111').dropped).toBe(0);
  });
});
