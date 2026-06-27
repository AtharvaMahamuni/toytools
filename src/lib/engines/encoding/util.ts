// Small pure helpers shared by the encoders' detect/validate/meta implementations.
// Kept side-effect-free (TextEncoder is global in browsers and Node 18+; constructed
// inside the function so importing this module stays safe under tsx/vitest).

/** UTF-8 byte length of a string. */
export function byteLength(s: string): number {
  return new TextEncoder().encode(s).length;
}

/** Format a count with its unit, pluralizing the unit. */
export function count(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? '' : 's'}`;
}
