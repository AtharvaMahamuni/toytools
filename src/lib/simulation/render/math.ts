// Pure numeric helpers shared by simulation models and renderers (Problem 16: no copy-pasted
// helpers). Deterministic, DOM-free, unit-tested.

/** Clamp v into [min, max]. */
export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

/** Linear interpolation from a to b at t in [0, 1] (unclamped). */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Fraction of v along [min, max]; 0 at min, 1 at max. Guards a zero-width range. */
export function normalize(v: number, min: number, max: number): number {
  return max === min ? 0 : (v - min) / (max - min);
}

/** Remap v from [inMin, inMax] onto [outMin, outMax]. */
export function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return lerp(outMin, outMax, normalize(v, inMin, inMax));
}
