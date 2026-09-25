// Molecular Geometry Simulator — VSEPR shapes from bonding pairs and lone pairs.
//
// The point of the tool is the split students miss. Electron geometry is the arrangement of ALL
// electron groups around the central atom (bonding pairs plus lone pairs). Molecular shape is the
// arrangement of the bonded atoms only. They are the same molecule when there are no lone pairs
// (CO2, CH4, SF6) and different the moment a lone pair occupies a site (H2O, NH3, XeF4).
//
// A lookup chart reports one name. This tool reports both, and only speaks when they disagree.
// Lone pairs also take more room than bonding pairs, so the tetrahedral angle compresses from
// 109.5° to 107° (ammonia, one lone pair) and 104.5° (water, two). That is a fitted teaching
// model, not a quantum calculation: 2.5° per lone pair on a tetrahedral electron geometry, and
// 1° on a trigonal-planar one, which is how SO2 sits just under 120°.
//
// Pure model + config. All canvas work lives in molecular-geometry.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { snapshotGraph } from '../graphs';
import { drawMolecularGeometry } from './molecular-geometry.draw';

export type Vec3 = { x: number; y: number; z: number };

export type ElectronGeometry =
  | 'linear'
  | 'trigonal planar'
  | 'tetrahedral'
  | 'trigonal bipyramidal'
  | 'octahedral'
  | 'none';

export type MolecularShape =
  | 'linear'
  | 'bent'
  | 'trigonal planar'
  | 'trigonal pyramidal'
  | 'tetrahedral'
  | 'see-saw'
  | 'T-shaped'
  | 'trigonal bipyramidal'
  | 'square planar'
  | 'square pyramidal'
  | 'octahedral'
  | 'none';

export interface Site {
  kind: 'bond' | 'lone';
  pos: Vec3;
}

/** Degrees knocked off a tetrahedral angle by each lone pair. 1 LP → 107°, 2 LP → 104.5°. */
export const TETRAHEDRAL_COMPRESSION = 2.5;

/** Degrees knocked off a trigonal-planar angle by one lone pair (SO2 sits near 119°). */
export const TRIGONAL_COMPRESSION = 1;

export const TETRAHEDRAL_IDEAL = 109.5;
export const TRIGONAL_IDEAL = 120;
export const LINEAR_IDEAL = 180;
export const RIGHT_ANGLE = 90;

/** Slow idle spin, radians per second, so the 3D arrangement is visible without a drag. */
export const SPIN_HZ = 0.04;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const bondingPairs = (s: SimState): number => Math.round(s.params.bondingPairs);
export const lonePairs = (s: SimState): number => Math.round(s.params.lonePairs);

/** Steric number: electron groups around the central atom. */
export const stericNumber = (s: SimState): number => bondingPairs(s) + lonePairs(s);

/**
 * VSEPR in a first course covers steric numbers 2 through 6. A single pair is a bond, not a
 * shape, and seven or more groups leave the table this tool teaches.
 */
export function isValid(s: SimState): boolean {
  const sn = stericNumber(s);
  return bondingPairs(s) >= 1 && sn >= 2 && sn <= 6;
}

export function electronGeometry(s: SimState): ElectronGeometry {
  if (!isValid(s)) return 'none';
  switch (stericNumber(s)) {
    case 2: return 'linear';
    case 3: return 'trigonal planar';
    case 4: return 'tetrahedral';
    case 5: return 'trigonal bipyramidal';
    case 6: return 'octahedral';
    default: return 'none';
  }
}

/** AXE notation, e.g. "AX2E2". Lone-pair-free cases drop the E term: "AX4", not "AX4E0". */
export function axeNotation(s: SimState): string {
  const x = bondingPairs(s);
  const e = lonePairs(s);
  return `A${x > 0 ? `X${x}` : ''}${e > 0 ? `E${e}` : ''}`;
}

export function molecularShape(s: SimState): MolecularShape {
  if (!isValid(s)) return 'none';
  const x = bondingPairs(s);
  const e = lonePairs(s);
  const key = `${x}:${e}`;
  const table: Record<string, MolecularShape> = {
    '2:0': 'linear',
    '1:1': 'linear',
    '3:0': 'trigonal planar',
    '2:1': 'bent',
    '4:0': 'tetrahedral',
    '3:1': 'trigonal pyramidal',
    '2:2': 'bent',
    '1:3': 'linear',
    '5:0': 'trigonal bipyramidal',
    '4:1': 'see-saw',
    '3:2': 'T-shaped',
    '2:3': 'linear',
    '1:4': 'linear',
    '6:0': 'octahedral',
    '5:1': 'square pyramidal',
    '4:2': 'square planar',
    '3:3': 'T-shaped',
    '2:4': 'linear',
  };
  return table[key] ?? 'none';
}

/** True when lone pairs have made the two names come apart. Silent when they match. */
export function geometriesDiffer(s: SimState): boolean {
  if (!isValid(s)) return false;
  return electronGeometry(s) !== molecularShape(s);
}

/** Characteristic ideal angle of the electron geometry, in degrees. */
export function idealAngle(s: SimState): number {
  switch (electronGeometry(s)) {
    case 'linear': return LINEAR_IDEAL;
    case 'trigonal planar': return TRIGONAL_IDEAL;
    case 'tetrahedral': return TETRAHEDRAL_IDEAL;
    case 'trigonal bipyramidal': return RIGHT_ANGLE;
    case 'octahedral': return RIGHT_ANGLE;
    default: return 0;
  }
}

/** Ideal electron-geometry angle at a steric number, for the graph. */
export function idealAngleAtSteric(sn: number): number {
  const n = Math.round(sn);
  switch (n) {
    case 2: return LINEAR_IDEAL;
    case 3: return TRIGONAL_IDEAL;
    case 4: return TETRAHEDRAL_IDEAL;
    case 5: return RIGHT_ANGLE;
    case 6: return RIGHT_ANGLE;
    default: return 0;
  }
}

/**
 * Bond angle after lone-pair compression. Tetrahedral: 2.5° per lone pair. Trigonal planar: 1°
 * for the one-lone-pair case. Other geometries keep the ideal in this teaching model.
 */
export function compressedAngle(s: SimState): number {
  if (!isValid(s)) return 0;
  const e = lonePairs(s);
  const geom = electronGeometry(s);
  if (geom === 'tetrahedral' && e > 0) return TETRAHEDRAL_IDEAL - TETRAHEDRAL_COMPRESSION * e;
  if (geom === 'trigonal planar' && e > 0) return TRIGONAL_IDEAL - TRIGONAL_COMPRESSION * e;
  return idealAngle(s);
}

export function anglesCompressed(s: SimState): boolean {
  if (!isValid(s)) return false;
  return Math.abs(compressedAngle(s) - idealAngle(s)) >= 0.2;
}

function hypot3(p: Vec3): number {
  return Math.hypot(p.x, p.y, p.z);
}

export function normalize(p: Vec3): Vec3 {
  const len = hypot3(p) || 1;
  return { x: p.x / len, y: p.y / len, z: p.z / len };
}

export function rotateY(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

export function rotateX(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

/** Vertices in lone-pair preference order (Bent's rule: equatorial in TBP, trans-axial in octahedral). */
function verticesFor(sn: number): Vec3[] {
  const tet = [
    normalize({ x: 1, y: 1, z: 1 }),
    normalize({ x: 1, y: -1, z: -1 }),
    normalize({ x: -1, y: 1, z: -1 }),
    normalize({ x: -1, y: -1, z: 1 }),
  ];
  switch (sn) {
    case 2:
      return [{ x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 }];
    case 3:
      return [
        { x: 1, y: 0, z: 0 },
        { x: -0.5, y: 0, z: Math.sqrt(3) / 2 },
        { x: -0.5, y: 0, z: -Math.sqrt(3) / 2 },
      ];
    case 4:
      return tet;
    case 5:
      return [
        { x: 1, y: 0, z: 0 },
        { x: -0.5, y: 0, z: Math.sqrt(3) / 2 },
        { x: -0.5, y: 0, z: -Math.sqrt(3) / 2 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: -1, z: 0 },
      ];
    case 6:
      return [
        { x: 0, y: 1, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: -1 },
      ];
    default:
      return [];
  }
}

/** Bonding atoms and lone-pair sites around the central atom, or empty when VSEPR does not apply. */
export function sitesFor(s: SimState): Site[] {
  if (!isValid(s)) return [];
  const verts = verticesFor(stericNumber(s));
  const e = lonePairs(s);
  const x = bondingPairs(s);
  const sites: Site[] = [];
  for (let i = 0; i < e && i < verts.length; i++) sites.push({ kind: 'lone', pos: verts[i]! });
  for (let i = e; i < e + x && i < verts.length; i++) sites.push({ kind: 'bond', pos: verts[i]! });
  return sites;
}

export function wrapAngle(angle: number): number {
  const tau = Math.PI * 2;
  let x = angle % tau;
  if (x < 0) x += tau;
  return x;
}

const molecularGeometrySim: SimulationDef = {
  id: 'molecular-geometry',
  aspect: 16 / 9,
  // Continuous: pair counts are the identity of the molecule, not initial conditions.
  paramBehavior: 'continuous',
  params: [
    { id: 'bondingPairs', label: 'Bonding pairs (X)', unit: '', min: 1, max: 6, step: 1, default: 2, decimals: 0 },
    { id: 'lonePairs', label: 'Lone pairs (E)', unit: '', min: 0, max: 4, step: 1, default: 2, decimals: 0 },
  ],
  presets: [
    { id: 'co2', label: 'CO2, linear', values: { bondingPairs: 2, lonePairs: 0 } },
    { id: 'water', label: 'Water, bent', values: { bondingPairs: 2, lonePairs: 2 } },
    { id: 'ammonia', label: 'Ammonia, pyramidal', values: { bondingPairs: 3, lonePairs: 1 } },
    { id: 'methane', label: 'Methane, tetrahedral', values: { bondingPairs: 4, lonePairs: 0 } },
    { id: 'sf4', label: 'SF4, see-saw', values: { bondingPairs: 4, lonePairs: 1 } },
    { id: 'xef4', label: 'XeF4, square planar', values: { bondingPairs: 4, lonePairs: 2 } },
    { id: 'sf6', label: 'SF6, octahedral', values: { bondingPairs: 6, lonePairs: 0 } },
  ],
  init: () => ({
    yaw: 0.55,
    pitch: 0.35,
    grabbing: 0,
    grabX: 0,
    grabY: 0,
    grabYaw: 0.55,
    grabPitch: 0.35,
  }),
  step(s: SimState, dt: number) {
    s.t += dt;
    s.vars.yaw = wrapAngle(s.vars.yaw + dt * SPIN_HZ * Math.PI * 2);
  },
  measurements: [
    { id: 'stericNumber', label: 'Steric number', unit: '', decimals: 0, compute: stericNumber },
    { id: 'idealAngle', label: 'Ideal angle', unit: '°', decimals: 1, compute: idealAngle },
    { id: 'compressedAngle', label: 'Bond angle', unit: '°', decimals: 1, compute: compressedAngle },
  ],
  formula: {
    expression: 'SN = X + E',
    substitution: '{bondingPairs} + {lonePairs}',
    terms: [
      { symbol: 'SN', label: 'Steric number', measurementId: 'stericNumber' },
      { symbol: 'X', label: 'Bonding pairs', paramId: 'bondingPairs' },
      { symbol: 'E', label: 'Lone pairs', paramId: 'lonePairs' },
    ],
  },
  graph: snapshotGraph({
    xLabel: 'Steric number',
    yLabel: 'Ideal angle (°)',
    xRange: () => [1.5, 6.5],
    yRange: () => [70, 200],
    series: [
      {
        id: 'ideal',
        label: 'Ideal electron-geometry angle',
        color: 'accent',
        sample: (_s, x) => idealAngleAtSteric(x),
      },
      {
        id: 'current',
        label: 'This molecule',
        color: 'danger',
        sample: (s) => compressedAngle(s),
      },
    ],
  }),
  pointer: {
    hint: 'Drag to turn the molecule',
    handle(s: SimState, ev) {
      if (ev.type === 'down' || ev.type === 'tap') {
        s.vars.grabbing = 1;
        s.vars.grabX = ev.x;
        s.vars.grabY = ev.y;
        s.vars.grabYaw = s.vars.yaw;
        s.vars.grabPitch = s.vars.pitch;
        return null;
      }
      if (ev.type === 'up') {
        s.vars.grabbing = 0;
        return null;
      }
      if (ev.type !== 'move' || s.vars.grabbing < 0.5) return null;
      s.vars.yaw = wrapAngle(s.vars.grabYaw + (ev.x - s.vars.grabX) * Math.PI * 2);
      s.vars.pitch = clamp(s.vars.grabPitch + (ev.y - s.vars.grabY) * Math.PI, -1.15, 1.15);
      return null;
    },
    isHolding: (s) => s.vars.grabbing >= 0.5,
  },
  observations: [
    (s) => {
      if (isValid(s)) return null;
      if (stericNumber(s) < 2) {
        return 'A single pair is a bond, not a shape. VSEPR starts once two electron groups sit around the central atom.';
      }
      return 'Steric numbers above 6 leave the five electron geometries a first course covers. Drop a pair to come back to the table.';
    },
    (s) => {
      if (!geometriesDiffer(s)) return null;
      return `Electron geometry is ${electronGeometry(s)} because the steric number is ${stericNumber(s)}. The molecular shape is ${molecularShape(s)}, because lone pairs occupy sites but do not count as bonded atoms.`;
    },
    (s) => {
      if (!anglesCompressed(s)) return null;
      return `Lone pairs take more room than bonding pairs, so the angle is ${compressedAngle(s).toFixed(1)}° rather than the ideal ${idealAngle(s).toFixed(1)}°.`;
    },
    (s) => {
      if (!isValid(s) || geometriesDiffer(s) || lonePairs(s) > 0) return null;
      return `${axeNotation(s)} has no lone pairs occupying extra sites, so electron geometry and molecular shape are both ${molecularShape(s)}.`;
    },
  ],
  explanation(s: SimState) {
    if (!isValid(s)) {
      const sn = stericNumber(s);
      if (sn < 2) {
        return 'VSEPR assigns a shape from the number of electron groups around a central atom. One bonding pair is just a diatomic fragment: there is nothing to arrange, so there is no electron geometry and no molecular shape to report.';
      }
      return `Steric number ${sn} is past octahedral. The five electron geometries this page draws stop at six groups: linear, trigonal planar, tetrahedral, trigonal bipyramidal, and octahedral.`;
    }
    const geom = electronGeometry(s);
    const shape = molecularShape(s);
    const sn = stericNumber(s);
    const angle = compressedAngle(s);
    if (geometriesDiffer(s)) {
      return `${axeNotation(s)} has steric number ${sn}, so the electron groups sit ${geom}. The bonded atoms alone make the molecular shape ${shape}, with a bond angle of ${angle.toFixed(1)}°. The two names come apart because ${lonePairs(s)} lone pair${lonePairs(s) === 1 ? '' : 's'} occupy ${lonePairs(s) === 1 ? 'a site' : 'sites'} without counting as an atom.`;
    }
    return `${axeNotation(s)} has steric number ${sn}. Every electron group is a bonding pair, so electron geometry and molecular shape are both ${shape}, and the angle is the ideal ${angle.toFixed(1)}°.`;
  },
  draw: drawMolecularGeometry,
};

export default molecularGeometrySim;
