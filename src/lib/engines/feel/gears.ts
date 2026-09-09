// Pure gear layout: tooth count owns radius, so a pair cannot overlap without meshing.

export const GEAR_MODULE = 6;
export const TEETH_CHOICES = [8, 12, 16, 24] as const;
export const DEFAULT_DRIVER_TEETH = 12;
export const DEFAULT_DRIVEN_TEETH = 24;
export const GEAR_PAD = 12;

export type TeethChoice = (typeof TEETH_CHOICES)[number];

export function pitchRadius(teeth: number, module = GEAR_MODULE): number {
  const n = Math.max(1, Math.floor(Number.isFinite(teeth) ? teeth : 1));
  return (n * module) / 2;
}

export function meshDistance(teethA: number, teethB: number, module = GEAR_MODULE): number {
  return pitchRadius(teethA, module) + pitchRadius(teethB, module);
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.floor(a));
  let y = Math.abs(Math.floor(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function ratioTerms(driverTeeth: number, drivenTeeth: number): { a: number; b: number } {
  const d = gcd(driverTeeth, drivenTeeth);
  return { a: Math.floor(driverTeeth / d), b: Math.floor(drivenTeeth / d) };
}

export function formatRatio(driverTeeth: number, drivenTeeth: number): string {
  const { a, b } = ratioTerms(driverTeeth, drivenTeeth);
  return `${a} : ${b}`;
}

/** Driven angular velocity for a meshed pair. Sign flips (external mesh). */
export function drivenOmega(driverOmega: number, driverTeeth: number, drivenTeeth: number): number {
  if (!(drivenTeeth > 0)) return 0;
  return -driverOmega * (driverTeeth / drivenTeeth);
}

export function canMesh(
  teethA: number,
  teethB: number,
  centerDist: number,
  module = GEAR_MODULE,
  epsilon = 0.6,
): boolean {
  if (!(centerDist > 0)) return false;
  return Math.abs(centerDist - meshDistance(teethA, teethB, module)) <= epsilon;
}

export interface GearLayout {
  ok: true;
  driverTeeth: number;
  drivenTeeth: number;
  driverR: number;
  drivenR: number;
  distance: number;
  width: number;
  height: number;
  driver: { cx: number; cy: number };
  driven: { cx: number; cy: number };
  ratio: string;
}

export interface GearLayoutFail {
  ok: false;
  reason: string;
}

export function layoutPair(
  driverTeeth: number,
  drivenTeeth: number,
  maxSpan = 320,
  module = GEAR_MODULE,
): GearLayout | GearLayoutFail {
  if (!Number.isFinite(driverTeeth) || !Number.isFinite(drivenTeeth)) {
    return { ok: false, reason: 'Tooth counts have to be numbers.' };
  }
  const n1 = Math.floor(driverTeeth);
  const n2 = Math.floor(drivenTeeth);
  if (n1 < 6 || n2 < 6) {
    return { ok: false, reason: 'Each gear needs at least 6 teeth to mesh.' };
  }
  const r1 = pitchRadius(n1, module);
  const r2 = pitchRadius(n2, module);
  const distance = r1 + r2;
  const width = distance + r1 + r2 + GEAR_PAD * 2;
  const height = Math.max(r1, r2) * 2 + GEAR_PAD * 2;
  if (width > maxSpan || height > maxSpan) {
    return {
      ok: false,
      reason: 'Those tooth counts would push the pair off the stage. Pick a smaller pair.',
    };
  }
  const cy = Math.max(r1, r2) + GEAR_PAD;
  return {
    ok: true,
    driverTeeth: n1,
    drivenTeeth: n2,
    driverR: r1,
    drivenR: r2,
    distance,
    width,
    height,
    driver: { cx: r1 + GEAR_PAD, cy },
    driven: { cx: r1 + GEAR_PAD + distance, cy },
    ratio: formatRatio(n1, n2),
  };
}

/** SVG path at the origin. Apply a translate to place it. fill-rule=evenodd for the hub. */
export function gearPath(teeth: number, module = GEAR_MODULE): string {
  const n = Math.max(6, Math.floor(teeth));
  const rp = pitchRadius(n, module);
  const addendum = module * 0.85;
  const rOuter = rp + addendum;
  const rInner = Math.max(rp - addendum, rp * 0.52);
  const step = (Math.PI * 2) / n;
  const toothFrac = 0.42;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = i * step - Math.PI / 2;
    const a1 = a0 + (step * (1 - toothFrac)) / 2;
    const a2 = a0 + (step * (1 + toothFrac)) / 2;
    const a3 = a0 + step;
    const xy = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(3)},${(Math.sin(a) * r).toFixed(3)}`;
    if (i === 0) pts.push(`M ${xy(rInner, a0)}`);
    pts.push(`L ${xy(rInner, a1)} L ${xy(rOuter, a1)} L ${xy(rOuter, a2)} L ${xy(rInner, a2)} L ${xy(rInner, a3)}`);
  }
  pts.push('Z');
  const hub = rp * 0.22;
  pts.push(`M ${hub.toFixed(3)},0 A ${hub.toFixed(3)} ${hub.toFixed(3)} 0 1 0 ${(-hub).toFixed(3)},0 A ${hub.toFixed(3)} ${hub.toFixed(3)} 0 1 0 ${hub.toFixed(3)},0 Z`);
  return pts.join(' ');
}

export const gearsApi = {
  pitchRadius,
  meshDistance,
  canMesh,
  formatRatio,
  drivenOmega,
  layoutPair,
  gearPath,
  TEETH_CHOICES,
  DEFAULT_DRIVER_TEETH,
  DEFAULT_DRIVEN_TEETH,
};
