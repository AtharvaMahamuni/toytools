// Color-vision simulation. Machado, Oliveira, and Fernandes (2009), Table 1,
// applied in linear sRGB. Severity 1.0 is dichromacy (protanopia, deuteranopia,
// tritanopia). Severity 0.6 is the anomalous-trichromacy step from that table
// (protanomaly, deuteranomaly, tritanomaly). Achromatopsia is not a Machado
// matrix: it is relative luminance (IEC 61966-2-1 coefficients) written back
// as gray. Blue cone monochromacy is not simulated.

import type { RGB } from './types';
import { rgbToHex } from './convert';
import { inkFor } from './shades';

export type CvdId =
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'protanomaly'
  | 'deuteranomaly'
  | 'tritanomaly'
  | 'achromatopsia';

export interface CvdType {
  id: CvdId;
  label: string;
  /** One short fact under the label. */
  note: string;
}

/** The seven simulations this page can draw, in the order the widget shows them. */
export const CVD_TYPES: readonly CvdType[] = [
  { id: 'protanopia', label: 'Protanopia', note: 'No L cones' },
  { id: 'deuteranopia', label: 'Deuteranopia', note: 'No M cones' },
  { id: 'tritanopia', label: 'Tritanopia', note: 'No S cones' },
  { id: 'protanomaly', label: 'Protanomaly', note: 'Shifted L cones' },
  { id: 'deuteranomaly', label: 'Deuteranomaly', note: 'Shifted M cones' },
  { id: 'tritanomaly', label: 'Tritanomaly', note: 'Shifted S cones' },
  { id: 'achromatopsia', label: 'Achromatopsia', note: 'Luminance only' },
];

// Row-major 3x3. Rows sum to about 1, so a neutral gray stays gray.
const MACHADO: Record<Exclude<CvdId, 'achromatopsia'>, readonly number[]> = {
  protanopia: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  deuteranopia: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881],
  tritanopia: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039],
  protanomaly: [0.38545, 0.769005, -0.154455, 0.100526, 0.829802, 0.069673, -0.007442, -0.02219, 1.029632],
  deuteranomaly: [0.498864, 0.674741, -0.173604, 0.205199, 0.754872, 0.039929, -0.011131, 0.030969, 0.980162],
  tritanomaly: [1.104996, -0.046633, -0.058363, -0.032137, 0.971635, 0.060503, 0.001336, 0.317922, 0.680742],
};

function toLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function fromLinear(x: number): number {
  const c = Math.min(1, Math.max(0, x));
  const s = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, s)) * 255);
}

function applyMatrix(rgb: RGB, m: readonly number[]): RGB {
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);
  return {
    r: fromLinear(m[0]! * r + m[1]! * g + m[2]! * b),
    g: fromLinear(m[3]! * r + m[4]! * g + m[5]! * b),
    b: fromLinear(m[6]! * r + m[7]! * g + m[8]! * b),
    a: rgb.a,
  };
}

/** Simulate one sRGB color. Never throws. Alpha is copied through. */
export function simulateCvd(rgb: RGB, type: CvdId): RGB {
  if (type === 'achromatopsia') {
    const y = 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
    const g = fromLinear(y);
    return { r: g, g, b: g, a: rgb.a };
  }
  return applyMatrix(rgb, MACHADO[type]);
}

/** Euclidean distance in 8-bit sRGB. 0 is the same pixel. */
export function rgbDistance(a: RGB, b: RGB): number {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** Two colors that already look different, then land this close, have collapsed. */
const DISTINCT = 40;
const COLLAPSED = 36;

export interface Collapse {
  type: CvdId;
  label: string;
  aHex: string;
  bHex: string;
  before: number;
  after: number;
}

export interface PaletteSwatch {
  input: string;
  rgb: RGB;
  hex: string;
}

export interface SimulatedStop {
  hex: string;
  ink: string;
}

export interface SimulatedRow {
  id: CvdId;
  label: string;
  note: string;
  stops: SimulatedStop[];
}

/**
 * The pair that collapses hardest across every simulated type.
 * Null when every pair that started distinct stays distinct, or when fewer
 * than two colors parsed. Achromatopsia is left out of this pick: it collapses
 * any pair of similar lightness, which would hide the cone type that failed.
 * That null is the silence case for the craft note.
 */
export function closestCollapse(colors: RGB[], hexes: string[]): Collapse | null {
  let best: Collapse | null = null;
  for (const type of CVD_TYPES) {
    if (type.id === 'achromatopsia') continue;
    const simulated = colors.map(c => simulateCvd(c, type.id));
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const before = rgbDistance(colors[i]!, colors[j]!);
        const after = rgbDistance(simulated[i]!, simulated[j]!);
        if (before < DISTINCT || after >= COLLAPSED) continue;
        if (best && after >= best.after) continue;
        best = {
          type: type.id,
          label: type.label,
          aHex: hexes[i]!,
          bHex: hexes[j]!,
          before: Math.round(before),
          after: Math.round(after),
        };
      }
    }
  }
  return best;
}

export function simulatePalette(colors: PaletteSwatch[]): { rows: SimulatedRow[]; collapse: Collapse | null } {
  const rgbs = colors.map(c => c.rgb);
  const hexes = colors.map(c => c.hex);
  const rows: SimulatedRow[] = CVD_TYPES.map(type => ({
    id: type.id,
    label: type.label,
    note: type.note,
    stops: rgbs.map(rgb => {
      const sim = simulateCvd(rgb, type.id);
      return { hex: rgbToHex(sim), ink: inkFor(sim) };
    }),
  }));
  return { rows, collapse: closestCollapse(rgbs, hexes) };
}

/** One sentence for the craft note, or '' when the palette does not collapse. */
export function collapseNote(collapse: Collapse | null): string {
  if (!collapse) return '';
  return `Under ${collapse.label}, ${collapse.aHex} and ${collapse.bHex} land ${collapse.after} apart. They were ${collapse.before} apart as typed.`;
}
