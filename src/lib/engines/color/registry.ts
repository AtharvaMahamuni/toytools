// Color engine runtime namespace. Attached to ToyTools.color in ToyToolsRuntime; bespoke color
// widgets call these pure helpers. Every function is safe under Node (no browser globals at module
// top-level) so the colocated test file and SSR both import it cleanly.

import { parseColor, toAllFormats, rgbToHex } from './convert';
import { contrastRatio, wcagLevels, luminance, suggestAccessible } from './contrast';
import type { RGB } from './types';

export const color = {
  parse: parseColor,
  formats: (input: string) => {
    const p = parseColor(input);
    return p.ok && p.rgb ? { ok: true as const, rgb: p.rgb, formats: toAllFormats(p.rgb) } : { ok: false as const, error: p.error };
  },
  hex: (rgb: RGB) => rgbToHex(rgb),
  contrast: contrastRatio,
  wcag: wcagLevels,
  luminance,
  suggest: suggestAccessible,
  /** Parse two colors and return the full WCAG verdict, or an error. */
  check: (fg: string, bg: string) => {
    const f = parseColor(fg), b = parseColor(bg);
    if (!f.ok || !f.rgb) return { ok: false as const, error: `Foreground: ${f.error}` };
    if (!b.ok || !b.rgb) return { ok: false as const, error: `Background: ${b.error}` };
    return { ok: true as const, fg: f.rgb, bg: b.rgb, levels: wcagLevels(f.rgb, b.rgb) };
  },
};

export type ColorRuntime = typeof color;
