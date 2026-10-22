// Dominant colors from pixels the page already has. No network, no library.
//
// Median cut runs in OKLab so a flat wall does not become five nearly identical stops, and the
// cut is on sampled pixels, not on an average of a block. Averaging a logo into the wall is the
// failure this exists to avoid. A wide-gamut sample is converted to sRGB and marked when a
// channel had to be clamped. The hex is always the clamped value.

export interface PaletteSwatch {
  hex: string;
  /** Share of the counted pixels, from 0 to 1. */
  share: number;
  /** True when a pixel in this stop was outside sRGB before the hex was written. */
  clamped: boolean;
}

export type PaletteResult =
  | { ok: true; swatches: PaletteSwatch[]; clamped: boolean }
  | { ok: false; error: string };

export interface PaletteOptions {
  /** Pixel buffer color space. Display P3 is converted before the cut. */
  space?: 'srgb' | 'display-p3';
  /** Stops to return after near-duplicates are merged. */
  maxColors?: number;
  /** Longest edge after nearest-neighbor sampling. Larger images are not averaged down. */
  maxEdge?: number;
}

interface Sample {
  L: number;
  A: number;
  B: number;
  r: number;
  g: number;
  b: number;
  clamped: boolean;
}

interface Cluster {
  count: number;
  L: number;
  A: number;
  B: number;
  r: number;
  g: number;
  b: number;
  clamped: boolean;
}

const MERGE = 0.04;
const MAX_BOXES = 16;

function srgbToLinear(channel: number): number {
  const x = channel / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel: number): number {
  const x = channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, x)) * 255);
}

function oklab(r: number, g: number, b: number): { L: number; A: number; B: number } {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    A: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    B: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

// 8-bit display-p3 of an in-gamut sRGB color comes back as far as ~0.005 linear
// outside 0-1 (pure blue is about 1.003). One sRGB step near white is about
// 0.009 linear, so this stays inside that step. A real display-p3 primary is
// about 0.22 outside and still counts as clamped.
const GAMUT_SLOP = 0.01;

/** Display P3 (gamma-encoded 0-255) to sRGB. `clamped` is true when a linear channel left 0-1 by more than 8-bit quantization. */
function displayP3ToSrgb(r: number, g: number, b: number): { r: number; g: number; b: number; clamped: boolean } {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  const X = 0.4865709486482162 * R + 0.26566769316909306 * G + 0.1982172852343625 * B;
  const Y = 0.2289745640697488 * R + 0.6917385218365064 * G + 0.079286914093745 * B;
  const Z = 0.04511338185890264 * G + 1.043944368900976 * B;
  const lr = 3.2404542 * X - 1.5371385 * Y - 0.4985314 * Z;
  const lg = -0.969266 * X + 1.8760108 * Y + 0.041556 * Z;
  const lb = 0.0556434 * X - 0.2040259 * Y + 1.0572252 * Z;
  const clamped =
    lr < -GAMUT_SLOP || lg < -GAMUT_SLOP || lb < -GAMUT_SLOP ||
    lr > 1 + GAMUT_SLOP || lg > 1 + GAMUT_SLOP || lb > 1 + GAMUT_SLOP;
  return { r: linearToSrgb(lr), g: linearToSrgb(lg), b: linearToSrgb(lb), clamped };
}

function hexByte(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
}

function toHex(r: number, g: number, b: number): string {
  return `#${hexByte(r)}${hexByte(g)}${hexByte(b)}`;
}

function sampleGrid(
  data: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  maxEdge: number,
): { data: Uint8ClampedArray | Uint8Array; width: number; height: number } {
  const edge = Math.max(width, height);
  if (edge <= maxEdge) return { data, width, height };
  const nw = Math.max(1, Math.round((width * maxEdge) / edge));
  const nh = Math.max(1, Math.round((height * maxEdge) / edge));
  const out = new Uint8ClampedArray(nw * nh * 4);
  for (let y = 0; y < nh; y++) {
    const sy = nh === 1 ? 0 : Math.round((y * (height - 1)) / (nh - 1));
    for (let x = 0; x < nw; x++) {
      const sx = nw === 1 ? 0 : Math.round((x * (width - 1)) / (nw - 1));
      const si = (sy * width + sx) * 4;
      const di = (y * nw + x) * 4;
      out[di] = data[si]!;
      out[di + 1] = data[si + 1]!;
      out[di + 2] = data[si + 2]!;
      out[di + 3] = data[si + 3]!;
    }
  }
  return { data: out, width: nw, height: nh };
}

function channelRange(box: Sample[]): number {
  let minL = Infinity, maxL = -Infinity, minA = Infinity, maxA = -Infinity, minB = Infinity, maxB = -Infinity;
  for (const p of box) {
    if (p.L < minL) minL = p.L;
    if (p.L > maxL) maxL = p.L;
    if (p.A < minA) minA = p.A;
    if (p.A > maxA) maxA = p.A;
    if (p.B < minB) minB = p.B;
    if (p.B > maxB) maxB = p.B;
  }
  return Math.max(maxL - minL, maxA - minA, maxB - minB);
}

function widestAxis(box: Sample[]): 'L' | 'A' | 'B' {
  let minL = Infinity, maxL = -Infinity, minA = Infinity, maxA = -Infinity, minB = Infinity, maxB = -Infinity;
  for (const p of box) {
    if (p.L < minL) minL = p.L;
    if (p.L > maxL) maxL = p.L;
    if (p.A < minA) minA = p.A;
    if (p.A > maxA) maxA = p.A;
    if (p.B < minB) minB = p.B;
    if (p.B > maxB) maxB = p.B;
  }
  const l = maxL - minL;
  const a = maxA - minA;
  const b = maxB - minB;
  if (a >= l && a >= b) return 'A';
  if (b >= l && b >= a) return 'B';
  return 'L';
}

function medianCut(pixels: Sample[]): Sample[][] {
  const boxes: Sample[][] = [pixels];
  while (boxes.length < MAX_BOXES) {
    let best = -1;
    let bestRange = 0;
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]!;
      if (box.length < 2) continue;
      const range = channelRange(box);
      if (range > bestRange) {
        bestRange = range;
        best = i;
      }
    }
    if (best < 0 || bestRange < 0.008) break;
    const box = boxes[best]!;
    const axis = widestAxis(box);
    box.sort((p, q) => p[axis] - q[axis]);
    const mid = Math.floor(box.length / 2);
    if (mid < 1 || mid >= box.length) break;
    boxes.splice(best, 1, box.slice(0, mid), box.slice(mid));
  }
  return boxes;
}

function clusterOf(box: Sample[]): Cluster {
  let L = 0, A = 0, B = 0, r = 0, g = 0, b = 0, clamped = false;
  for (const p of box) {
    L += p.L;
    A += p.A;
    B += p.B;
    r += p.r;
    g += p.g;
    b += p.b;
    if (p.clamped) clamped = true;
  }
  const n = box.length;
  return { count: n, L: L / n, A: A / n, B: B / n, r: r / n, g: g / n, b: b / n, clamped };
}

function distance(a: Cluster, b: Cluster): number {
  const dL = a.L - b.L;
  const dA = a.A - b.A;
  const dB = a.B - b.B;
  return Math.sqrt(dL * dL + dA * dA + dB * dB);
}

function mergeClose(clusters: Cluster[]): Cluster[] {
  const pending = clusters.slice().sort((a, b) => b.count - a.count);
  const out: Cluster[] = [];
  for (const cluster of pending) {
    const hit = out.find((kept) => distance(kept, cluster) < MERGE);
    if (!hit) {
      out.push({ ...cluster });
      continue;
    }
    const n = hit.count + cluster.count;
    hit.L = (hit.L * hit.count + cluster.L * cluster.count) / n;
    hit.A = (hit.A * hit.count + cluster.A * cluster.count) / n;
    hit.B = (hit.B * hit.count + cluster.B * cluster.count) / n;
    hit.r = (hit.r * hit.count + cluster.r * cluster.count) / n;
    hit.g = (hit.g * hit.count + cluster.g * cluster.count) / n;
    hit.b = (hit.b * hit.count + cluster.b * cluster.count) / n;
    hit.count = n;
    hit.clamped = hit.clamped || cluster.clamped;
  }
  return out;
}

export function extractPalette(
  data: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  options: PaletteOptions = {},
): PaletteResult {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1 || data.length < width * height * 4) {
    return { ok: false, error: 'This image could not be read.' };
  }
  const space = options.space ?? 'srgb';
  const maxColors = options.maxColors ?? 6;
  const maxEdge = options.maxEdge ?? 160;
  const grid = sampleGrid(data, width, height, maxEdge);
  const pixels: Sample[] = [];
  for (let i = 0; i < grid.width * grid.height; i++) {
    const o = i * 4;
    const alpha = grid.data[o + 3] ?? 0;
    if (alpha < 128) continue;
    const rawR = grid.data[o] ?? 0;
    const rawG = grid.data[o + 1] ?? 0;
    const rawB = grid.data[o + 2] ?? 0;
    const rgb = space === 'display-p3' ? displayP3ToSrgb(rawR, rawG, rawB) : { r: rawR, g: rawG, b: rawB, clamped: false };
    const lab = oklab(rgb.r, rgb.g, rgb.b);
    pixels.push({ ...lab, r: rgb.r, g: rgb.g, b: rgb.b, clamped: rgb.clamped });
  }
  if (pixels.length === 0) return { ok: false, error: 'This image has no visible pixels.' };

  const clusters = mergeClose(medianCut(pixels).map(clusterOf))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxColors);
  const total = pixels.length;
  const swatches = clusters.map((cluster) => ({
    hex: toHex(cluster.r, cluster.g, cluster.b),
    share: cluster.count / total,
    clamped: cluster.clamped,
  }));
  return { ok: true, swatches, clamped: swatches.some((swatch) => swatch.clamped) };
}
