// A 50–950 tint and shade scale in OKLCH. Hue stays put. Lightness walks a fixed ramp.
// Chroma is the source chroma, or less when that chroma would leave sRGB. The stop whose
// lightness is nearest the source is the brand stop. It carries the typed color itself, so the
// scale contains the user's color, and the contrast note is about the typed color, not a neighbour.

import { parseColor, rgbToHex, rgbToOklch } from './convert';
import { contrastRatio } from './contrast';
import type { RGB } from './types';

export interface ShadeStop {
  stop: number;
  /** Target OKLCH lightness, 0–1. */
  l: number;
  c: number;
  h: number;
  hex: string;
  /** Contrast of this stop as text on white. */
  onWhite: number;
  /** Label color for text on this swatch: whichever of near-black or white has more contrast. */
  ink: string;
}

export interface ShadeScale {
  stops: ShadeStop[];
  /** The stop nearest the source lightness. */
  brandStop: number;
  /** Set when the typed color fails WCAG 4.5 as text on white. Null when it passes. */
  onWhiteNote: string | null;
  css: string;
}

const RAMP: { stop: number; l: number }[] = [
  { stop: 50, l: 0.97 },
  { stop: 100, l: 0.93 },
  { stop: 200, l: 0.86 },
  { stop: 300, l: 0.77 },
  { stop: 400, l: 0.68 },
  { stop: 500, l: 0.60 },
  { stop: 600, l: 0.52 },
  { stop: 700, l: 0.44 },
  { stop: 800, l: 0.37 },
  { stop: 900, l: 0.30 },
  { stop: 950, l: 0.23 },
];

const WHITE: RGB = { r: 255, g: 255, b: 255, a: 1 };
const INK_DARK: RGB = { r: 26, g: 26, b: 26, a: 1 };

const BLACK: RGB = { r: 0, g: 0, b: 0, a: 1 };

/**
 * The swatch label color, chosen by WCAG contrast rather than a brightness guess. Near-black or
 * white, whichever is higher, when one of them clears 4.5:1. A mid-tone such as #a17a00 clears
 * neither (4.39:1 at best), so it falls back to pure black or white, one of which always reaches
 * at least 4.58:1.
 */
export function inkFor(bg: RGB): string {
  const dark = contrastRatio(INK_DARK, bg);
  const white = contrastRatio(WHITE, bg);
  if (Math.max(dark, white) >= 4.5) return dark >= white ? '#1a1a1a' : '#ffffff';
  return contrastRatio(BLACK, bg) >= white ? '#000000' : '#ffffff';
}

function linearToSrgb(c: number): number {
  const clamped = Math.min(1, Math.max(0, c));
  return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
}

/** OKLCH (L 0–1, C, H degrees) to sRGB. `inGamut` is false when a linear channel falls outside 0–1. */
export function oklchToRgb(L: number, C: number, H: number): { rgb: RGB; inGamut: boolean } {
  const rad = (H * Math.PI) / 180;
  const a = C * Math.cos(rad);
  const b = C * Math.sin(rad);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  const inGamut = [lr, lg, lb].every((ch) => ch >= -1e-4 && ch <= 1 + 1e-4);
  const rgb: RGB = {
    r: Math.round(linearToSrgb(lr) * 255),
    g: Math.round(linearToSrgb(lg) * 255),
    b: Math.round(linearToSrgb(lb) * 255),
    a: 1,
  };
  return { rgb, inGamut };
}

function maxChroma(L: number, H: number, cap: number): number {
  if (cap <= 0) return 0;
  if (oklchToRgb(L, cap, H).inGamut) return cap;
  let lo = 0;
  let hi = cap;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (oklchToRgb(L, mid, H).inGamut) lo = mid;
    else hi = mid;
  }
  return lo;
}

export function shadeScale(input: string): { ok: true; scale: ShadeScale } | { ok: false; error: string } {
  const parsed = parseColor(input);
  if (!parsed.ok || !parsed.rgb) return { ok: false, error: parsed.error || 'Enter a color like #3b82f6.' };
  const src = rgbToOklch(parsed.rgb);
  const stops: ShadeStop[] = RAMP.map((step) => {
    const c = maxChroma(step.l, src.h, src.c);
    const { rgb } = oklchToRgb(step.l, c, src.h);
    return {
      stop: step.stop,
      l: step.l,
      c,
      h: src.h,
      hex: rgbToHex(rgb),
      onWhite: contrastRatio(rgb, WHITE),
      ink: inkFor(rgb),
    };
  });
  const brand = stops.reduce((best, stop) =>
    Math.abs(stop.l - src.l) < Math.abs(best.l - src.l) ? stop : best,
  );
  // The brand stop is the typed color itself (opaque), so the note and the swatch agree with it.
  const srcRgb: RGB = { ...parsed.rgb, a: 1 };
  const srcHex = rgbToHex(srcRgb);
  const srcOnWhite = contrastRatio(srcRgb, WHITE);
  brand.hex = srcHex;
  brand.onWhite = srcOnWhite;
  brand.ink = inkFor(srcRgb);
  const onWhiteNote = srcOnWhite + 1e-9 < 4.5
    ? `${srcHex} (stop ${brand.stop}) on white is ${srcOnWhite.toFixed(2)}:1. Body text needs 4.5.`
    : null;
  const css = `:root {\n${stops.map((s) => `  --shade-${s.stop}: ${s.hex};`).join('\n')}\n}`;
  return { ok: true, scale: { stops, brandStop: brand.stop, onWhiteNote, css } };
}
