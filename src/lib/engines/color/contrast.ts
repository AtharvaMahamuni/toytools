// WCAG 2.x contrast math. Relative luminance + contrast ratio, the four pass/fail levels, and a
// nearest-accessible-color search (nudges lightness until a target ratio is met). Pure, no throw.

import type { RGB, WcagLevels } from './types';
import { parseColor, rgbToHex, rgbToHsl, hslToRgb } from './convert';

const srgbToLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

/** WCAG relative luminance (0 = black, 1 = white). */
export function luminance({ r, g, b }: RGB): number {
  return 0.2126 * srgbToLinear(r / 255) + 0.7152 * srgbToLinear(g / 255) + 0.0722 * srgbToLinear(b / 255);
}

/** Contrast ratio between two colors, 1..21. Alpha is ignored (WCAG assumes opaque). */
export function contrastRatio(fg: RGB, bg: RGB): number {
  const l1 = luminance(fg), l2 = luminance(bg);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function wcagLevels(fg: RGB, bg: RGB): WcagLevels {
  const ratio = contrastRatio(fg, bg);
  return {
    ratio,
    ratioLabel: ratio.toFixed(2),
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}

/**
 * Nudge the foreground toward the nearest color (by lightness) that meets `target` contrast on the
 * given background, keeping hue + saturation. Returns a hex string, or the original if unreachable.
 */
export function suggestAccessible(fgHex: string, bgHex: string, target = 4.5): string {
  const fgP = parseColor(fgHex), bgP = parseColor(bgHex);
  if (!fgP.ok || !bgP.ok || !fgP.rgb || !bgP.rgb) return fgHex;
  const bg = bgP.rgb;
  const { h, s } = rgbToHsl(fgP.rgb);
  if (contrastRatio(fgP.rgb, bg) >= target) return rgbToHex(fgP.rgb);

  let best: { hex: string; ratio: number } | null = null;
  // Sweep lightness in both directions; pick the closest passing color to the original lightness.
  const orig = rgbToHsl(fgP.rgb).l;
  for (let i = 0; i <= 100; i++) {
    const l = i / 100;
    const cand = { ...hslToRgb(h, s, l), a: 1 };
    const ratio = contrastRatio(cand, bg);
    if (ratio >= target) {
      const dist = Math.abs(l - orig);
      if (!best || dist < Math.abs((rgbToHsl(parseColor(best.hex).rgb!).l) - orig)) {
        best = { hex: rgbToHex(cand), ratio };
      }
    }
  }
  return best ? best.hex : fgHex;
}
