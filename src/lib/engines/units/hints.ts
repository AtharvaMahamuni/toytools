// The craft seam for the three bespoke unit converters on the `units` engine.
//
// All three convert correctly and then stop, and all three have a documented mistake that lives one
// step past the conversion, in what the number is about to be used for:
//
//   aspect-ratio-calculator  the pair is exact, and then an encoder rejects it. H.264 requires even
//                            dimensions in both axes, so 16:9 at width 1000 gives 562.5, and the
//                            usable answer is a nearby pair that divides cleanly.
//   px-to-dp-converter       "Treating dp as a fixed pixel count instead of scaling by density" —
//                            it does not stay a whole number at every bucket, and a half pixel is
//                            not an asset anyone can export. This is the reason the 8dp grid exists.
//   px-to-rem-converter      "Using em for global spacing and getting compounding from nested
//                            elements" — the conversion assumes the parent's font size is the root,
//                            which is true only at the top level.
//
// Each is silent whenever the input does not exhibit the failure, which for the first two means
// silent on every value that already divides cleanly. That is most of the values a designer types,
// and it is the point: a line that appears every time is a tip strip.
//
// See docs/analysis/2026-08-11-tool-craft.md.

import { DENSITY_BUCKETS } from './convert';

export type UnitHintId = 'aspect-ratio-calculator' | 'px-to-dp-converter' | 'px-to-rem-converter';

export interface UnitHintInput {
  /** aspect-ratio-calculator */
  width?: number;
  height?: number;
  ratioW?: number;
  ratioH?: number;
  /** px-to-dp-converter */
  mode?: string;
  dp?: number;
  /** px-to-rem-converter */
  unit?: string;
  base?: number;
}

const isInt = (n: number): boolean => Number.isInteger(Math.round(n * 1e6) / 1e6);

/**
 * Nearest pair on the same ratio with both dimensions even, searching outward from the requested
 * width. Returns null when the ratio admits no such pair within a sensible distance, which is the
 * honest answer for something like 1000:333.
 */
export function nearestEvenPair(width: number, ratioW: number, ratioH: number): { width: number; height: number } | null {
  const start = Math.round(width);
  for (let delta = 0; delta <= 64; delta++) {
    // Down before up, at equal distance: cropping two pixels is safe, inventing two is not.
    for (const w of delta === 0 ? [start] : [start - delta, start + delta]) {
      if (w <= 0 || w % 2 !== 0) continue;
      const h = (w * ratioH) / ratioW;
      if (isInt(h) && Math.round(h) % 2 === 0) return { width: w, height: Math.round(h) };
    }
  }
  return null;
}

/** One line about what the converted number is about to run into, or null. */
export function unitHint(id: UnitHintId, input: UnitHintInput): string | null {
  switch (id) {
    case 'aspect-ratio-calculator': {
      const { width, height, ratioW, ratioH } = input;
      if (![width, height, ratioW, ratioH].every(n => typeof n === 'number' && Number.isFinite(n))) return null;
      if (width! <= 0 || height! <= 0 || ratioW! <= 0 || ratioH! <= 0) return null;
      const wOk = isInt(width!) && Math.round(width!) % 2 === 0;
      const hOk = isInt(height!) && Math.round(height!) % 2 === 0;
      if (wOk && hOk) return null;
      const fix = nearestEvenPair(width!, ratioW!, ratioH!);
      const problem = !isInt(width!) || !isInt(height!)
        ? 'These are not whole pixels'
        : 'H.264 needs both dimensions even';
      return fix
        ? `${problem}, so most video encoders will refuse this pair. ${fix.width} by ${fix.height} is the nearest that keeps the ratio exactly.`
        : `${problem}, so most video encoders will refuse this pair, and this ratio has no nearby pair that fixes it.`;
    }

    case 'px-to-dp-converter': {
      // Only the dp-to-px direction produces the per-bucket values that can land on a half pixel.
      if (input.mode !== 'dp2px') return null;
      const { dp } = input;
      if (typeof dp !== 'number' || !Number.isFinite(dp) || dp <= 0) return null;
      const bad = DENSITY_BUCKETS.filter(b => !isInt(dp * b.scale));
      if (bad.length === 0) return null;
      // Multiples of 4 divide cleanly at every bucket, which is the whole reason for the 8dp grid.
      const clean = Math.max(4, Math.round(dp / 4) * 4);
      return `${bad.map(b => b.id).join(' and ')} land on a fraction of a pixel, which is not an exportable asset. ${clean}dp is whole at every density.`;
    }

    case 'px-to-rem-converter': {
      // em is relative to the PARENT, and this tool has only one font size to work from.
      if (input.unit !== 'em') return null;
      const base = typeof input.base === 'number' && Number.isFinite(input.base) && input.base > 0 ? input.base : 16;
      return `em is relative to the parent element, and this converts against the ${base}px root. Inside anything that sets its own font size, the same value renders differently, and nesting compounds it.`;
    }

    default:
      return null;
  }
}
