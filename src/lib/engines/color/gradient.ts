// A two-stop CSS gradient interpolated in OKLCH, with the sRGB midpoint kept around for the
// craft note. Hex samples are the strip and the fallback. The copied declaration stays in OKLCH.

import { parseColor, rgbToHex, rgbToOklch } from './convert';
import { oklchToRgb } from './shades';
import type { RGB } from './types';

export interface GradientSample {
  t: number;
  hex: string;
  inGamut: boolean;
  /** Label colour for a chip on this sample: white on a dark sample (OKLCH L < 0.6), else black. */
  ink: '#000000' | '#ffffff';
}

/** OKLCH lightness below which a chip label is white. */
export const INK_FLIP_L = 0.6;

export function chipInk(rgb: RGB): '#000000' | '#ffffff' {
  return rgbToOklch(rgb).l < INK_FLIP_L ? '#ffffff' : '#000000';
}

export interface PerceptualGradient {
  ok: true;
  css: string;
  fallbackCss: string;
  fromHex: string;
  toHex: string;
  samples: GradientSample[];
  midpoint: { l: number; c: number; h: number };
  srgbMidpointChroma: number;
  chromaDrop: number;
  note: string | null;
}

const SAMPLE_STEPS = 8;
const MUDDY_DROP = 0.04;
/** CSS Color 4 powerless-hue epsilon for oklch(): C <= 0.000004. */
const POWERLESS_CHROMA = 0.000004;

interface Ok {
  l: number;
  c: number;
  h: number;
}

/**
 * A converted gray has a junk hue. CSS treats that hue as missing and carries the other stop's
 * hue. Both ends gray leaves the hue unused, because chroma is zero.
 */
function carryPowerlessHue(from: Ok, to: Ok): [Ok, Ok] {
  const fromMissing = from.c <= POWERLESS_CHROMA;
  const toMissing = to.c <= POWERLESS_CHROMA;
  if (fromMissing && toMissing) return [{ ...from, c: 0, h: 0 }, { ...to, c: 0, h: 0 }];
  if (fromMissing) return [{ ...from, c: 0, h: to.h }, to];
  if (toMissing) return [from, { ...to, c: 0, h: from.h }];
  return [from, to];
}

function opaqueHex(rgb: RGB): string {
  return rgbToHex({ r: rgb.r, g: rgb.g, b: rgb.b, a: 1 });
}

/**
 * Hue at t along CSS Color 4 "shorter hue": a difference above 180 or below -180 wraps, and a
 * difference of exactly 180 or -180 is left alone, so the preview turns the same way as the CSS.
 */
export function lerpHue(a: number, b: number, t: number): number {
  const from = ((a % 360) + 360) % 360;
  const to = ((b % 360) + 360) % 360;
  let delta = to - from;
  if (delta > 180) delta -= 360;
  else if (delta < -180) delta += 360;
  return (((from + delta * t) % 360) + 360) % 360;
}

/**
 * The note names a gray sRGB middle, or a clamped sample when the middle is not muddy.
 * A drop under 0.04 stays quiet, including two near-gray stops.
 */
export function gradientNote(okChroma: number, srgbChroma: number, anyClamped: boolean): string | null {
  const drop = okChroma - srgbChroma;
  if (drop >= MUDDY_DROP) {
    return `The sRGB midpoint is grayer. OKLCH chroma at the middle is ${okChroma.toFixed(3)}, and an sRGB blend drops it by ${drop.toFixed(3)}.`;
  }
  if (anyClamped) {
    return 'Some colors between the two stops fall outside sRGB, so those hex samples are clamped. The copied CSS still blends in OKLCH.';
  }
  return null;
}

export const ALPHA_DROPPED = 'Transparency is dropped. The gradient uses the opaque colors.';

function withAlphaNote(note: string | null, alphaDropped: boolean): string | null {
  if (!alphaDropped) return note;
  return note ? `${note} ${ALPHA_DROPPED}` : ALPHA_DROPPED;
}

export function perceptualGradient(from: string, to: string): PerceptualGradient | { ok: false; error: string } {
  const a = parseColor(from);
  const b = parseColor(to);
  if (!a.ok || !a.rgb) return { ok: false, error: a.error || 'Enter a start color like #0000ff.' };
  if (!b.ok || !b.rgb) return { ok: false, error: b.error || 'Enter an end color like #ffff00.' };

  const fromHex = opaqueHex(a.rgb);
  const toHex = opaqueHex(b.rgb);
  const [fromOk, toOk] = carryPowerlessHue(rgbToOklch(a.rgb), rgbToOklch(b.rgb));

  const samples: GradientSample[] = [];
  for (let i = 0; i <= SAMPLE_STEPS; i++) {
    const t = i / SAMPLE_STEPS;
    const l = fromOk.l + (toOk.l - fromOk.l) * t;
    const c = fromOk.c + (toOk.c - fromOk.c) * t;
    const h = lerpHue(fromOk.h, toOk.h, t);
    const converted = oklchToRgb(l, c, h);
    samples.push({ t, hex: opaqueHex(converted.rgb), inGamut: converted.inGamut, ink: chipInk(converted.rgb) });
  }

  const midpoint = {
    l: fromOk.l + (toOk.l - fromOk.l) * 0.5,
    c: fromOk.c + (toOk.c - fromOk.c) * 0.5,
    h: lerpHue(fromOk.h, toOk.h, 0.5),
  };
  const srgbMid: RGB = {
    r: a.rgb.r + (b.rgb.r - a.rgb.r) * 0.5,
    g: a.rgb.g + (b.rgb.g - a.rgb.g) * 0.5,
    b: a.rgb.b + (b.rgb.b - a.rgb.b) * 0.5,
    a: 1,
  };
  const srgbMidpointChroma = rgbToOklch(srgbMid).c;
  const chromaDrop = midpoint.c - srgbMidpointChroma;
  const anyClamped = samples.some((s) => !s.inGamut);

  const stops = samples.map((s) => `${s.hex} ${(s.t * 100).toFixed(1)}%`).join(', ');
  return {
    ok: true,
    css: `linear-gradient(to right in oklch, ${fromHex}, ${toHex})`,
    fallbackCss: `linear-gradient(to right, ${stops})`,
    fromHex,
    toHex,
    samples,
    midpoint,
    srgbMidpointChroma,
    chromaDrop,
    note: withAlphaNote(gradientNote(midpoint.c, srgbMidpointChroma, anyClamped), a.rgb.a < 1 || b.rgb.a < 1),
  };
}
