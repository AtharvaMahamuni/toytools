import { describe, it, expect } from 'vitest';
import { siteIconSvg, SITE_ICON_SIZES, siteIconPath } from './site-icon';

describe('site mark', () => {
  it('composes a well-formed SVG on the shared 96-unit grid', () => {
    const svg = siteIconSvg();
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.trim().endsWith('</svg>')).toBe(true);
    expect(svg).toContain('viewBox="0 0 96 96"');
    expect(svg).toContain('aria-label="ToyTools"');
  });

  it('honours a requested render size', () => {
    const svg = siteIconSvg(192);
    expect(svg).toContain('width="192"');
    expect(svg).toContain('height="192"');
  });

  it('is fully deterministic, so the generated favicon is stable across builds', () => {
    expect(siteIconSvg()).toBe(siteIconSvg());
  });

  it('draws the subject as paths, never as text (an SVG favicon uses the viewer’s fonts)', () => {
    expect(siteIconSvg()).not.toContain('<text');
  });

  it('is not a green field with one centred disc (the flag reading the monogram replaced)', () => {
    expect(siteIconSvg()).not.toContain('<circle');
  });

  it('keeps the whole subject inside the maskable safe zone (the centre 24..72)', () => {
    const svg = siteIconSvg();
    // Every rect that is not one of the three full-bleed 96x96 field layers.
    const subject = [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)];
    expect(subject.length).toBeGreaterThan(0);
    for (const [, x, y, w, h] of subject) {
      expect(Number(x)).toBeGreaterThanOrEqual(24);
      expect(Number(y)).toBeGreaterThanOrEqual(24);
      expect(Number(x) + Number(w)).toBeLessThanOrEqual(72);
      expect(Number(y) + Number(h)).toBeLessThanOrEqual(72);
    }
  });

  it('shares one user-space gradient across the bars, so the join has no seam', () => {
    expect(siteIconSvg()).toContain('gradientUnits="userSpaceOnUse"');
  });

  it('maps every declared raster size to a public path', () => {
    expect(SITE_ICON_SIZES).toContain(48);
    expect(SITE_ICON_SIZES).toContain(96);
    expect(siteIconPath(180)).toBe('/apple-touch-icon.png');
    for (const size of SITE_ICON_SIZES) {
      expect(siteIconPath(size).startsWith('/')).toBe(true);
    }
  });
});
