// A two-stop CSS gradient interpolated in OKLCH, with the sRGB midpoint kept around for the
// craft note. Hex samples are the strip and the fallback. The copied declaration stays in OKLCH.

import { parseColor, rgbToHex, rgbToOklch } from './convert';
import { oklchToRgb } from './shades';
import type { RGB } from './types';

export interface GradientSample {
  t: number;
  hex: string;
  inGamut: boolean;
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

/** Shortest-path hue, in degrees. */
export function lerpHue(a: number, b: number, t: number): number {
  const delta = ((b - a + 540) % 360) - 180;
  return (a + delta * t + 360) % 360;
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
    return 'A stop leaves the sRGB gamut, so the hex sample is clamped. The copied CSS keeps the OKLCH stop.';
  }
  return null;
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
    samples.push({ t, hex: opaqueHex(converted.rgb), inGamut: converted.inGamut });
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
    note: gradientNote(midpoint.c, srgbMidpointChroma, anyClamped),
  };
}
