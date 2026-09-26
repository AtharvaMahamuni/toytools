import { describe, it, expect } from 'vitest';
import { tools } from '@data/registry';
import { GLYPHS } from './glyphs';
import { toolIconSvg, resolveGlyphId, iconColors, toolAccent } from './tool-icon';
import { ICON_PNG_SIZES, APPLE_TOUCH_SIZE } from './sizes';

const HEX = /^#[0-9a-fA-F]{6}$/;

describe('tool install icons', () => {
  it('maps every registry tool to a real, meaningful glyph (no spark fallback)', () => {
    const unmapped = tools
      .filter(t => resolveGlyphId(t) === 'spark')
      .map(t => `${t.slug} (family: ${t.family ?? '—'})`);
    expect(unmapped).toEqual([]);
  });

  it('resolves every tool to an id that exists in the glyph library', () => {
    for (const t of tools) {
      const id = resolveGlyphId(t);
      expect(GLYPHS[id], `${t.slug} → ${id}`).toBeTruthy();
    }
  });

  it('composes a well-formed, non-empty SVG for every tool', () => {
    for (const t of tools) {
      const svg = toolIconSvg(t);
      expect(svg.startsWith('<svg'), t.slug).toBe(true);
      expect(svg).toContain('viewBox="0 0 96 96"');
      expect(svg.trim().endsWith('</svg>'), t.slug).toBe(true);
      expect(svg.length).toBeGreaterThan(200);
    }
  });

  it('honours a requested render size', () => {
    const svg = toolIconSvg(tools[0], 192);
    expect(svg).toContain('width="192"');
    expect(svg).toContain('height="192"');
  });

  it('is fully deterministic', () => {
    for (const t of tools) {
      expect(toolIconSvg(t)).toBe(toolIconSvg(t));
    }
  });

  it('assigns every registry tool a unique glyph id', () => {
    const ids = tools.map(t => resolveGlyphId(t));
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes, `shared glyph ids: ${[...new Set(dupes)].join(', ')}`).toEqual([]);
    expect(new Set(ids).size).toBe(tools.length);
  });

  it('still seeds distinct gradients per slug (hue-shift is secondary polish)', () => {
    // Same category accent, different slug → different background even when glyphs differ.
    const sha = iconColors({ slug: 'sha256-hash-generator', categorySlug: 'developer-utilities' });
    const md5 = iconColors({ slug: 'md5-hash-generator', categorySlug: 'developer-utilities' });
    expect(sha.accent).toBe(md5.accent);
    expect(sha.background).not.toBe(md5.background);
    expect(resolveGlyphId({ slug: 'sha256-hash-generator', family: 'cryptographic' })).toBe('hash');
    expect(resolveGlyphId({ slug: 'md5-hash-generator', family: 'cryptographic' })).toBe('hashMd5');
  });

  it('emits opaque hex theme + background colours for every tool', () => {
    for (const t of tools) {
      const { accent, background } = iconColors(t);
      expect(accent, t.slug).toMatch(HEX);
      expect(background, t.slug).toMatch(HEX);
    }
  });

  it('prefers a per-slug override over the family default', () => {
    // pomodoro-timer is family "timer" (default → tomato) AND has a bespoke override (tomato).
    expect(resolveGlyphId({ slug: 'pomodoro-timer', family: 'timer' })).toBe('tomato');
    // json-validator overrides the shared "json" family braces with a checked variant.
    expect(resolveGlyphId({ slug: 'json-validator', family: 'json' })).toBe('bracesCheck');
  });

  it('gives every fidget tool its own glyph, not the family dots default', () => {
    const fidget = tools.filter(t => t.family === 'fidget');
    expect(fidget.length).toBeGreaterThan(2);
    const ids = fidget.map(t => resolveGlyphId(t));
    expect(new Set(ids).size, `shared glyphs: ${ids.join(', ')}`).toBe(fidget.length);
    expect(resolveGlyphId({ slug: 'pop-it', family: 'fidget' })).toBe('dots');
    expect(resolveGlyphId({ slug: 'switch-board', family: 'fidget' })).toBe('toggle');
    expect(resolveGlyphId({ slug: 'spinner', family: 'fidget' })).toBe('spinner');
    expect(resolveGlyphId({ slug: 'gears', family: 'fidget' })).toBe('gears');
    expect(resolveGlyphId({ slug: 'kinetic-sand', family: 'fidget' })).toBe('sand');
    expect(resolveGlyphId({ slug: 'slime', family: 'fidget' })).toBe('slime');
    expect(resolveGlyphId({ slug: 'breathing-circle', family: 'fidget' })).toBe('breath');
  });

  it('falls back to the spark glyph for an unknown family', () => {
    expect(resolveGlyphId({ slug: 'totally-unknown', family: 'no-such-family' })).toBe('spark');
    expect(resolveGlyphId({ slug: 'totally-unknown' })).toBe('spark');
  });

  it('uses a fallback accent for an unknown category', () => {
    expect(toolAccent({ categorySlug: 'no-such-category' })).toMatch(HEX);
  });

  it('declares the raster sizes the manifest + apple-touch icon depend on', () => {
    expect(ICON_PNG_SIZES).toContain(512);
    expect(ICON_PNG_SIZES).toContain(APPLE_TOUCH_SIZE);
    expect(ICON_PNG_SIZES.every(s => Number.isInteger(s) && s > 0)).toBe(true);
  });
});
