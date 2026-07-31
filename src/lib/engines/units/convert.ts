// CSS + native unit math. All exact ratios: 1in = 96px = 72pt, so 1px = 0.75pt. rem/em are px
// over a configurable root font size (default 16). Android dp uses the mdpi 160dpi baseline; iOS
// pt uses integer @Nx scale factors. Pure, deterministic, never throws.

import type { CssUnits, DensityBucket, AspectResult } from './types';

const r4 = (n: number) => Math.round(n * 10000) / 10000;

/** CSS unit family for a pixel value against a root font size. */
export function pxToCss(px: number, base = 16): CssUnits {
  const b = base || 16;
  return { px, rem: r4(px / b), em: r4(px / b), pt: r4(px * 0.75), percent: r4((px / b) * 100) };
}

/** Convert any CSS length unit back to px (rem/em share the base). */
export function cssToPx(value: number, unit: 'px' | 'rem' | 'em' | 'pt' | 'percent', base = 16): number {
  const b = base || 16;
  switch (unit) {
    case 'px': return r4(value);
    case 'rem':
    case 'em': return r4(value * b);
    case 'pt': return r4(value / 0.75);
    case 'percent': return r4((value / 100) * b);
    default: return r4(value);
  }
}

/** Android density buckets. dp is density-independent; px = dp * (dpi / 160). */
export const DENSITY_BUCKETS: Array<{ id: string; label: string; dpi: number; scale: number }> = [
  { id: 'ldpi', label: 'ldpi', dpi: 120, scale: 0.75 },
  { id: 'mdpi', label: 'mdpi (baseline)', dpi: 160, scale: 1 },
  { id: 'hdpi', label: 'hdpi', dpi: 240, scale: 1.5 },
  { id: 'xhdpi', label: 'xhdpi', dpi: 320, scale: 2 },
  { id: 'xxhdpi', label: 'xxhdpi', dpi: 480, scale: 3 },
  { id: 'xxxhdpi', label: 'xxxhdpi', dpi: 640, scale: 4 },
];

/** Given a dp (or sp) value, the px at every Android density bucket. */
export function dpToPxBuckets(dp: number): DensityBucket[] {
  return DENSITY_BUCKETS.map(b => ({ ...b, px: r4(dp * b.scale) }));
}

/** Given a px value measured at one bucket, the equivalent dp. */
export function pxToDp(px: number, scale: number): number {
  return r4(px / (scale || 1));
}

/** iOS points → px at @1x/@2x/@3x. */
export function ptToPxIos(pt: number): { scale1: number; scale2: number; scale3: number } {
  return { scale1: r4(pt), scale2: r4(pt * 2), scale3: r4(pt * 3) };
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** Simplify a width:height pair to its lowest integer ratio. */
export function simplifyRatio(w: number, h: number): { ratioW: number; ratioH: number; ratio: string } {
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return { ratioW: 0, ratioH: 0, ratio: '0:0' };
  // Work in integers where possible; scale small decimals up before reducing.
  const scale = 1000;
  const wi = Math.round(w * scale), hi = Math.round(h * scale);
  const g = gcd(wi, hi) || 1;
  const ratioW = wi / g, ratioH = hi / g;
  return { ratioW, ratioH, ratio: `${ratioW}:${ratioH}` };
}

/**
 * Solve the missing dimension from a locked aspect ratio. Provide exactly one of width/height plus
 * ratioW:ratioH. Returns both dimensions and the simplified ratio.
 */
export function solveAspect(opts: { width?: number; height?: number; ratioW: number; ratioH: number }): AspectResult | { error: string } {
  const { width, height, ratioW, ratioH } = opts;
  if (!ratioW || !ratioH || ratioW <= 0 || ratioH <= 0) return { error: 'Enter a valid ratio like 16:9.' };
  const simp = simplifyRatio(ratioW, ratioH);
  if (width != null && Number.isFinite(width)) {
    return { width: r4(width), height: r4((width * ratioH) / ratioW), ratio: simp.ratio, ratioW: simp.ratioW, ratioH: simp.ratioH };
  }
  if (height != null && Number.isFinite(height)) {
    return { width: r4((height * ratioW) / ratioH), height: r4(height), ratio: simp.ratio, ratioW: simp.ratioW, ratioH: simp.ratioH };
  }
  return { error: 'Enter a width or a height.' };
}
