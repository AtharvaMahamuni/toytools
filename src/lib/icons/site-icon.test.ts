import { describe, it, expect } from 'vitest';
import { categories } from '@data/categories';
import { siteIconSvg, SITE_ICON_SIZES, siteIconPath, contrastRatio, colorDistance, FIELD_DARK, GOLD_EDGE } from './site-icon';

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

  it('draws the board behind the letter, never over it', () => {
    const svg = siteIconSvg();
    // Every dimmed element (module or rail) is emitted before the solid letter group.
    expect(svg.lastIndexOf('fill-opacity')).toBeLessThan(svg.indexOf('<g fill="url(#mark)">'));
  });

  it('mirrors the two channels, so the letter sits on a symmetric board', () => {
    const dimmed = [...siteIconSvg().matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" [^/]*fill-opacity/g)];
    // 3 rows x 2 columns of modules per channel, plus one rail, on each side.
    expect(dimmed.length).toBe(14);
    // Every element has a partner mirrored about the icon's vertical centre.
    const spans = dimmed.map(([, x, y, w]) => `${Number(y)}:${Number(w)}:${96 - Number(x) - Number(w)}`);
    const partners = dimmed.map(([, x, y, w]) => `${Number(y)}:${Number(w)}:${Number(x)}`);
    for (const span of spans) expect(partners).toContain(span);
  });

  it('keeps the modules quieter than the rails they rest on', () => {
    const opacities = [...siteIconSvg().matchAll(/fill-opacity="([\d.]+)"/g)]
      .map(m => Number(m[1]))
      .filter(o => o > 0);
    // Two distinct levels, and the brighter one (the engines) is used least.
    const levels = [...new Set(opacities)].sort((a, b) => a - b);
    expect(levels).toHaveLength(2);
    expect(opacities.filter(o => o === levels[1])).toHaveLength(2);
  });

  it('keeps the mark above the 3:1 non-text contrast floor against its own field', () => {
    // The favicon is the most demanding non-text case there is: 16px, antialiased,
    // rescaled by the browser. Measured against the darker end of the field, which
    // is the worst case. Shipped at 2.85:1 until it was measured (2026-08-14).
    expect(contrastRatio(GOLD_EDGE, FIELD_DARK)).toBeGreaterThanOrEqual(3);
  });

  it('computes contrast the way WCAG does', () => {
    // Anchors the helper against two ratios anyone can verify by hand.
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    expect(contrastRatio(FIELD_DARK, GOLD_EDGE)).toBeCloseTo(contrastRatio(GOLD_EDGE, FIELD_DARK), 10);
  });

  it('stays visibly distinct from every category accent, so the parent is not one of its children', () => {
    // Tool icons are coloured by category accent. The site mark shipped 8.2 from
    // the Productivity accent and 11.5 from Money & Finance, which read as the
    // same colour on a home screen. The collision appeared silently when the
    // category palette was retoned (2026-08-09), so this measures on every build
    // rather than trusting whoever edits categories.ts next to remember.
    const tooClose = categories
      .map(c => ({ name: c.name, distance: colorDistance(FIELD_DARK, c.accent) }))
      .filter(c => c.distance < 20)
      .map(c => `${c.name} (${c.distance.toFixed(1)})`);
    expect(tooClose).toEqual([]);
  });

  it('measures perceptual distance, not hex equality', () => {
    expect(colorDistance('#000000', '#000000')).toBe(0);
    // Two greens a hex diff would call different and an eye would not.
    expect(colorDistance('#2F6B4F', '#3E7B55')).toBeLessThan(15);
    // Black against white is the far end of the scale.
    expect(colorDistance('#000000', '#FFFFFF')).toBeGreaterThan(99);
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
