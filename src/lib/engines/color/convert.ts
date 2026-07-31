// Color parsing + format conversion. Pure functions, never throw. Covers HEX, RGB, HSL, HSV,
// OKLCH (Björn Ottosson's OKLab), CMYK, and the CSS named colors. sRGB is the reference space;
// every "toX" reads an RGB and every parser returns RGB, so conversions compose through one hub.

import type { RGB, ParseResult, ColorFormat } from './types';

/** A small, common subset of CSS named colors — enough for real input without shipping all 148. */
export const NAMED_COLORS: Record<string, string> = {
  black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff',
  yellow: '#ffff00', cyan: '#00ffff', magenta: '#ff00ff', gray: '#808080', grey: '#808080',
  silver: '#c0c0c0', maroon: '#800000', olive: '#808000', lime: '#00ff00', aqua: '#00ffff',
  teal: '#008080', navy: '#000080', fuchsia: '#ff00ff', purple: '#800080', orange: '#ffa500',
  pink: '#ffc0cb', brown: '#a52a2a', gold: '#ffd700', indigo: '#4b0082', violet: '#ee82ee',
  coral: '#ff7f50', salmon: '#fa8072', khaki: '#f0e68c', crimson: '#dc143c', tomato: '#ff6347',
  turquoise: '#40e0d0', tan: '#d2b48c', beige: '#f5f5dc', ivory: '#fffff0', transparent: '#00000000',
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round = (n: number) => Math.round(n);

function normHex(hex: string): string | null {
  let h = hex.trim().replace(/^#/, '').toLowerCase();
  if (/^[0-9a-f]{3}$/.test(h)) h = h.split('').map(c => c + c).join('');
  if (/^[0-9a-f]{4}$/.test(h)) h = h.split('').map(c => c + c).join('');
  if (/^[0-9a-f]{6}$/.test(h)) h += 'ff';
  if (/^[0-9a-f]{8}$/.test(h)) return h;
  return null;
}

/** Parse any supported color string into RGB. Never throws. */
export function parseColor(input: string): ParseResult {
  if (input == null) return { ok: false, error: 'Enter a color.' };
  const raw = String(input).trim();
  if (raw === '') return { ok: false, error: 'Enter a color.' };
  const lower = raw.toLowerCase();

  // Named color
  if (NAMED_COLORS[lower]) return parseColor(NAMED_COLORS[lower]);

  // Hex (with or without #)
  if (/^#?[0-9a-f]{3,8}$/i.test(raw)) {
    const h = normHex(raw);
    if (h) {
      return { ok: true, rgb: {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        a: parseInt(h.slice(6, 8), 16) / 255,
      } };
    }
  }

  // Functional: rgb()/rgba()/hsl()/hsla()
  const fn = lower.match(/^(rgba?|hsla?)\s*\(([^)]+)\)$/);
  if (fn) {
    const kind = fn[1];
    const parts = fn[2].split(/[,\s/]+/).filter(Boolean);
    const num = (s: string) => parseFloat(s);
    const alpha = parts[3] != null ? clamp(parts[3].endsWith('%') ? num(parts[3]) / 100 : num(parts[3]), 0, 1) : 1;
    if (kind.startsWith('rgb')) {
      const ch = (s: string) => clamp(s.endsWith('%') ? (num(s) / 100) * 255 : num(s), 0, 255);
      if (parts.length < 3) return { ok: false, error: 'rgb() needs 3 values.' };
      return { ok: true, rgb: { r: round(ch(parts[0])), g: round(ch(parts[1])), b: round(ch(parts[2])), a: alpha } };
    } else {
      if (parts.length < 3) return { ok: false, error: 'hsl() needs 3 values.' };
      const h = ((num(parts[0]) % 360) + 360) % 360;
      const s = clamp(num(parts[1]) / 100, 0, 1);
      const l = clamp(num(parts[2]) / 100, 0, 1);
      return { ok: true, rgb: { ...hslToRgb(h, s, l), a: alpha } };
    }
  }

  return { ok: false, error: 'Unrecognized color. Try #3366ff, rgb(51,102,255), or a name.' };
}

// ---- RGB <-> HSL ----
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  if (s === 0) { const v = round(l * 255); return { r: v, g: v, b: v }; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;
  const t = [hk + 1 / 3, hk, hk - 1 / 3].map(x => (x < 0 ? x + 1 : x > 1 ? x - 1 : x));
  const conv = (tc: number) =>
    tc < 1 / 6 ? p + (q - p) * 6 * tc :
    tc < 1 / 2 ? q :
    tc < 2 / 3 ? p + (q - p) * (2 / 3 - tc) * 6 : p;
  return { r: round(conv(t[0]) * 255), g: round(conv(t[1]) * 255), b: round(conv(t[2]) * 255) };
}

export function rgbToHsl({ r, g, b }: RGB): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0));
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}

export function rgbToHsv({ r, g, b }: RGB): { h: number; s: number; v: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0));
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

export function rgbToCmyk({ r, g, b }: RGB): { c: number; m: number; y: number; k: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: round(((1 - rn - k) / (1 - k)) * 100),
    m: round(((1 - gn - k) / (1 - k)) * 100),
    y: round(((1 - bn - k) / (1 - k)) * 100),
    k: round(k * 100),
  };
}

// ---- OKLCH (via OKLab) ----
const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

export function rgbToOklch({ r, g, b }: RGB): { l: number; c: number; h: number } {
  const lr = srgbToLinear(r / 255), lg = srgbToLinear(g / 255), lb = srgbToLinear(b / 255);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: L, c: C, h: H };
}

// ---- Formatters ----
export function rgbToHex({ r, g, b, a }: RGB): string {
  const h = (n: number) => n.toString(16).padStart(2, '0');
  const base = `#${h(clamp(round(r), 0, 255))}${h(clamp(round(g), 0, 255))}${h(clamp(round(b), 0, 255))}`;
  return a < 1 ? base + h(round(a * 255)) : base;
}

/** Every canonical format for a color, ready to display + copy. */
export function toAllFormats(rgb: RGB): ColorFormat[] {
  const { h, s, l } = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);
  const ok = rgbToOklch(rgb);
  const a = rgb.a;
  const aSuffix = a < 1 ? ` / ${Number(a.toFixed(3))}` : '';
  const alphaComma = a < 1 ? `, ${Number(a.toFixed(3))}` : '';
  return [
    { id: 'hex', label: 'HEX', value: rgbToHex(rgb) },
    { id: 'rgb', label: 'RGB', value: `rgb(${round(rgb.r)}, ${round(rgb.g)}, ${round(rgb.b)}${alphaComma})` },
    { id: 'hsl', label: 'HSL', value: `hsl(${round(h)}, ${round(s * 100)}%, ${round(l * 100)}%${alphaComma})` },
    { id: 'hsv', label: 'HSV', value: `hsv(${round(hsv.h)}, ${round(hsv.s * 100)}%, ${round(hsv.v * 100)}%)` },
    { id: 'oklch', label: 'OKLCH', value: `oklch(${Number(ok.l.toFixed(4))} ${Number(ok.c.toFixed(4))} ${round(ok.h)}${aSuffix})` },
    { id: 'cmyk', label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];
}
