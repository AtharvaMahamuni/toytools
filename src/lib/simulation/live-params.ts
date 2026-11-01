// Live param bounds (audit C-1, D-2 and F-1, 1 Nov 2026). One place decides the range, step and
// unit a param has right now, so the slider, the number box and the model always agree.
import type { LiveBounds, ParamDef, SimulationDef } from './types';

export interface Bounds {
  min: number;
  max: number;
  step: number;
  unit: string;
}

/** The param's current bounds: the static ParamDef, narrowed by def.liveParam. */
export function boundsOf(def: Pick<SimulationDef, 'liveParam'>, p: ParamDef, params: Record<string, number>): Bounds {
  const live: LiveBounds = def.liveParam?.(p.id, params) ?? {};
  const min = Math.max(p.min, live.min ?? p.min);
  const max = Math.max(min, Math.min(p.max, live.max ?? p.max));
  return { min, max, step: live.step ?? p.step, unit: live.unit ?? p.unit };
}

/** Clamp a value into bounds. A non-finite value (an empty or garbled box) falls back to `fallback`. */
export function clampTo(b: Pick<Bounds, 'min' | 'max'>, value: number, fallback: number): number {
  const v = Number.isFinite(value) ? value : fallback;
  return Math.min(Math.max(v, b.min), b.max);
}

/**
 * Re-clamp every param to its live bounds, in declaration order (so a denominator settles before
 * the numerator that depends on it). Mutates params; returns the ids whose value changed.
 */
export function reclampAll(def: Pick<SimulationDef, 'liveParam' | 'params'>, params: Record<string, number>): string[] {
  const changed: string[] = [];
  for (const p of def.params) {
    const v = clampTo(boundsOf(def, p, params), params[p.id], p.default);
    if (v !== params[p.id]) {
      params[p.id] = v;
      changed.push(p.id);
    }
  }
  return changed;
}

/** The unit a measurement shows right now. */
export function unitOf(def: Pick<SimulationDef, 'liveUnit'>, m: { id: string; unit: string }, params: Record<string, number>): string {
  return def.liveUnit?.(m.id, params) ?? m.unit;
}

/**
 * Read a typed number box. Returns the value the model will use and whether the text differs from it
 * (empty, not a number, or out of range), so the box can be marked invalid and written back.
 */
export function readBox(text: string, b: Pick<Bounds, 'min' | 'max'>, current: number): { value: number; invalid: boolean } {
  const trimmed = text.trim();
  const n = trimmed === '' ? NaN : Number(trimmed);
  if (!Number.isFinite(n)) return { value: current, invalid: true };
  const value = clampTo(b, n, current);
  return { value, invalid: value !== n };
}

/** A round step near span/100: 1, 2 or 5 times a power of ten. */
export function niceStep(span: number): number {
  if (!(span > 0)) return 1;
  const raw = span / 100;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const m = raw / pow;
  const k = m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10;
  return Number((k * pow).toPrecision(6));
}
