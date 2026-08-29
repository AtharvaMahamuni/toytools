// Newman Projection Simulator — conformational analysis of one carbon-carbon single bond, looking
// straight down it. The dihedral angle is the state; everything else is derived from a pairwise
// strain model that is fitted, not hand-waved.
//
// The strain curve is built the way a textbook builds it, out of two named contributions rather
// than one opaque Fourier fit, so the two measurement cards mean something:
//
//   TORSIONAL strain — the cost of eclipsing bonds, which appears only near an eclipsed angle. It
//     is a localized bump per eclipsed conformation, tall enough to reproduce the pairwise
//     eclipsing costs a course quotes: 4 kJ/mol per H/H pair, 6 per R/H pair, 11 per R/R pair.
//   STERIC strain — van der Waals repulsion between the two large groups, which depends only on how
//     close they are and so is present at every angle, peaking syn and vanishing anti.
//
// One parameter, substituent size, slides the molecule between the two conformational archetypes:
// size 0 is ethane (three identical H/H eclipsing pairs, no steric term, a 12 kJ/mol barrier and no
// gauche well), and size 25 is butane (19 kJ/mol syn, 16 kJ/mol anti-periplanar-eclipsed, 3.8
// kJ/mol gauche, 0 anti). Both of those are reproduced exactly by construction; see the tests.
//
// Pure model + config. All canvas work lives in newman-projection.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { snapshotGraph } from '../graphs';
import { degToRad, radToDeg } from '../render/angle';
import { GAS_CONSTANT_R } from '../render/units';
import { drawNewmanProjection } from './newman-projection.draw';

/** Gas constant in kJ/(mol K). Every energy on this page is kJ/mol. */
export const R_KJ = GAS_CONSTANT_R / 1000;

/** Eclipsing cost of one H/H pair (kJ/mol). Three of them are ethane's 12 kJ/mol barrier. */
export const E_HH = 4;

/** Substituent size at which the two large groups are methyls, i.e. the molecule is butane. */
export const METHYL_SIZE = 25;

/** Size slider (percent) as the fraction the pairwise fits are written in terms of. */
export const sizeFraction = (sizePercent: number): number => sizePercent / 100;

/** Eclipsing cost of one large-group / hydrogen pair. 6 kJ/mol at methyl, the textbook value. */
export const eclipseRH = (b: number): number => E_HH + 8 * b;

/** Eclipsing cost of the large-group / large-group pair. 11 kJ/mol at methyl. */
export const eclipseRR = (b: number): number => E_HH + 28 * b;

/** Gauche steric strain, the energy of the 60 degree conformer. 3.8 kJ/mol at methyl. */
export const gaucheStrain = (b: number): number => 15.2 * b;

/**
 * The steric term at its syn maximum. The steric term is written as peak x (1 + cos phi) / 2, which
 * is 0.75 x peak at 60 degrees, so anchoring it on the measured gauche strain fixes the peak.
 */
export const stericPeak = (b: number): number => gaucheStrain(b) / 0.75;

/** Fold an angle difference into (-180, 180]. */
export function wrapSigned(deg: number): number {
  let x = deg % 360;
  if (x > 180) x -= 360;
  if (x <= -180) x += 360;
  return x;
}

/** Fold an absolute angle into [0, 360). */
export function wrapAngle360(deg: number): number {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
}

/**
 * One eclipsed conformation's torsional bump: 1 exactly eclipsed, falling smoothly to 0 at the
 * staggered angles 60 degrees either side and staying 0 beyond them. Zero slope at the join, so the
 * assembled curve has no kink where two bumps meet.
 */
export function eclipseBump(deltaDeg: number): number {
  const x = wrapSigned(deltaDeg);
  if (Math.abs(x) >= 60) return 0;
  return (1 + Math.cos(3 * degToRad(x))) / 2;
}

/** Steric strain at a dihedral angle: present everywhere, largest syn, zero anti. */
export function stericAt(deg: number, b: number): number {
  return (stericPeak(b) * (1 + Math.cos(degToRad(deg)))) / 2;
}

/**
 * Torsional strain at a dihedral angle. Each bump is scaled so that bump + steric reproduces the
 * pairwise eclipsing total at its own eclipsed angle: R/R + 2 H/H at 0 degrees, 2 R/H + H/H at 120
 * and 240. Subtracting the steric term already present there is what stops the two from
 * double counting.
 */
export function torsionalAt(deg: number, b: number): number {
  const syn = eclipseRR(b) + 2 * E_HH - stericPeak(b);
  const anti = 2 * eclipseRH(b) + E_HH - stericPeak(b) * 0.25;
  return syn * eclipseBump(deg) + anti * eclipseBump(deg - 120) + anti * eclipseBump(deg - 240);
}

/** Total strain energy at a dihedral angle, measured from the anti conformer at 0 kJ/mol. */
export function strainAt(deg: number, b: number): number {
  return stericAt(deg, b) + torsionalAt(deg, b);
}

/** The tallest barrier on the curve, always the syn-eclipsed one once the groups differ in size. */
export function highestBarrier(b: number): number {
  return Math.max(strainAt(0, b), strainAt(120, b));
}

/** Angular step of the Boltzmann sum. Two degrees is well inside the width of every feature here. */
const BASIN_STEP = 2;

/**
 * Boltzmann populations of the three staggered basins, split at the eclipsed maxima that separate
 * them: gauche+ over [0, 120), anti over [120, 240), gauche- over [240, 360). Returns fractions.
 */
export function populations(s: SimState): { anti: number; gauche: number } {
  const b = sizeFraction(s.params.size);
  const rt = R_KJ * s.params.temperature;
  let antiSum = 0;
  let gaucheSum = 0;
  for (let deg = 0; deg < 360; deg += BASIN_STEP) {
    const w = Math.exp(-strainAt(deg, b) / rt);
    if (deg >= 120 && deg < 240) antiSum += w;
    else gaucheSum += w;
  }
  const total = antiSum + gaucheSum;
  if (!(total > 0)) return { anti: 1, gauche: 0 };
  return { anti: antiSum / total, gauche: gaucheSum / total };
}

/**
 * Curvature of the strain curve at the set angle, in kJ/mol per radian squared, by central
 * difference. Numeric rather than analytic on purpose: the analytic second derivative is
 * discontinuous where a torsional bump switches off, exactly at the staggered minima this is most
 * often asked about, and a five degree stencil steps across that seam.
 */
export function curvature(s: SimState): number {
  const b = sizeFraction(s.params.size);
  const d = s.params.dihedral;
  const h = degToRad(5);
  return (strainAt(d + 5, b) - 2 * strainAt(d, b) + strainAt(d - 5, b)) / (h * h);
}

/**
 * RMS thermal libration about the set angle, in degrees, from equipartition: half k <dphi^2> = half
 * RT, so the RMS excursion is sqrt(RT / k). At a maximum (k <= 0) there is no well to sit in, and
 * the cap stands in for "this conformer does not survive long enough to have an amplitude".
 */
export function librationRms(s: SimState): number {
  const k = curvature(s);
  const rt = R_KJ * s.params.temperature;
  if (!(k > 0.05)) return 60;
  return Math.min(60, radToDeg(Math.sqrt(rt / k)));
}

/** On-screen frequency of the libration. Real torsional oscillation is around 10^12 Hz, so any
 *  visible wobble is a slowdown; this one is chosen to read as a shimmer rather than a flicker. */
export const LIBRATION_HZ = 1.6;

/** The angle actually drawn: the set dihedral plus this instant's thermal libration. */
export function displayAngle(s: SimState): number {
  return wrapAngle360(s.params.dihedral + s.vars.wobble);
}

/**
 * Attempt frequency for a bond rotation, per second. A torsional vibration is around 10^13 Hz, and
 * the fraction of those attempts carrying enough energy to clear the barrier is the Arrhenius
 * factor. Used only to word the explanation, which is why it returns a phrase rather than a number:
 * the honest answer spans twenty orders of magnitude across the sliders.
 */
export function rotationsPerSecond(barrierKj: number, temperature: number): number {
  return 1e13 * Math.exp(-barrierKj / (R_KJ * temperature));
}

/**
 * The rotation rate in words, including the case where the barrier finally wins. Bucketed on the
 * ROUNDED exponent rather than on the raw value, so 9.7 x 10^5 reads as millions instead of being
 * floored three decades down to thousands.
 */
export function describeRotationRate(barrierKj: number, temperature: number): string {
  const rate = rotationsPerSecond(barrierKj, temperature);
  if (rate < 1 / 3600) return 'so rarely that these conformers could be separated and bottled';
  if (rate < 1) return 'only a few times an hour';
  const exponent = Math.round(Math.log10(rate));
  if (exponent >= 9) return 'billions of times a second';
  if (exponent >= 6) return 'millions of times a second';
  if (exponent >= 3) return 'thousands of times a second';
  return 'a few times a second';
}

/** How far the set angle sits from the nearest exactly eclipsed conformation, in degrees. */
export function offsetFromEclipsed(deg: number): number {
  return Math.min(Math.abs(wrapSigned(deg)), Math.abs(wrapSigned(deg - 120)), Math.abs(wrapSigned(deg - 240)));
}

const newmanProjectionSim: SimulationDef = {
  id: 'newman-projection',
  aspect: 16 / 9,
  // Continuous: the dihedral IS the state, so a slider move is a rotation of the same molecule and
  // nothing is restarted. Only the libration phase rides on t, and it is periodic.
  paramBehavior: 'continuous',
  params: [
    { id: 'dihedral', label: 'Dihedral angle', unit: '°', min: 0, max: 360, step: 1, default: 60, decimals: 0 },
    { id: 'size', label: 'Substituent size', unit: '%', min: 0, max: 100, step: 5, default: 25, decimals: 0 },
    { id: 'temperature', label: 'Temperature', unit: 'K', min: 100, max: 600, step: 5, default: 298, decimals: 0 },
  ],
  presets: [
    { id: 'ethane', label: 'Ethane, eclipsed', values: { dihedral: 0, size: 0, temperature: 298 } },
    { id: 'anti', label: 'Butane, anti', values: { dihedral: 180, size: METHYL_SIZE, temperature: 298 } },
    { id: 'gauche', label: 'Butane, gauche', values: { dihedral: 60, size: METHYL_SIZE, temperature: 298 } },
    { id: 'syn', label: 'Butane, fully eclipsed', values: { dihedral: 0, size: METHYL_SIZE, temperature: 298 } },
    { id: 'bulky', label: 'Bulky groups', values: { dihedral: 180, size: 100, temperature: 298 } },
  ],
  init: (params) => ({ wobble: 0, grabX: 0, grabAngle: params.dihedral }),
  step(s: SimState, dt: number) {
    s.t += dt;
    const amplitude = Math.min(30, librationRms(s) * Math.SQRT2);
    s.vars.wobble = amplitude * Math.sin(2 * Math.PI * LIBRATION_HZ * s.t);
  },
  measurements: [
    {
      id: 'strain',
      label: 'Strain energy',
      unit: 'kJ/mol',
      decimals: 1,
      compute: (s) => strainAt(s.params.dihedral, sizeFraction(s.params.size)),
    },
    {
      id: 'torsional',
      label: 'Torsional strain',
      unit: 'kJ/mol',
      decimals: 1,
      compute: (s) => torsionalAt(s.params.dihedral, sizeFraction(s.params.size)),
    },
    {
      id: 'steric',
      label: 'Steric strain',
      unit: 'kJ/mol',
      decimals: 1,
      compute: (s) => stericAt(s.params.dihedral, sizeFraction(s.params.size)),
    },
    { id: 'antiPopulation', label: 'Anti population', unit: '%', decimals: 1, compute: (s) => populations(s).anti * 100 },
    {
      id: 'gauchePopulation',
      label: 'Gauche population',
      unit: '%',
      decimals: 1,
      compute: (s) => populations(s).gauche * 100,
    },
  ],
  formula: {
    expression: 'E(φ) = E torsional + E steric',
    terms: [
      { symbol: 'E', label: 'Strain energy', measurementId: 'strain' },
      { symbol: 'E tors', label: 'Torsional strain', measurementId: 'torsional' },
      { symbol: 'E ster', label: 'Steric strain', measurementId: 'steric' },
      { symbol: 'φ', label: 'Dihedral angle', paramId: 'dihedral' },
    ],
  },
  graph: snapshotGraph({
    xLabel: 'Dihedral angle (degrees)',
    yLabel: 'Strain energy (kJ/mol)',
    xRange: () => [0, 360],
    yRange: (s) => [0, highestBarrier(sizeFraction(s.params.size)) * 1.15 + 1],
    series: [
      {
        id: 'total',
        label: 'Total strain',
        color: 'accent',
        sample: (s, x) => strainAt(x, sizeFraction(s.params.size)),
      },
      {
        id: 'steric',
        label: 'Steric only',
        color: 'muted',
        sample: (s, x) => stericAt(x, sizeFraction(s.params.size)),
      },
    ],
  }),
  pointer: {
    hint: 'Drag across the molecule to rotate the back carbon',
    handle(s: SimState, ev) {
      if (ev.type === 'down' || ev.type === 'tap') {
        s.vars.grabX = ev.x;
        s.vars.grabAngle = s.params.dihedral;
        return null;
      }
      if (ev.type !== 'move') return null;
      // Relative drag: one full canvas width is one full turn, so a grab never snaps the molecule
      // to wherever the finger happened to land.
      const delta = (ev.x - s.vars.grabX) * 360;
      return { dihedral: wrapAngle360(s.vars.grabAngle + delta) };
    },
  },
  observations: [
    (s) => {
      const off = offsetFromEclipsed(s.params.dihedral);
      if (off <= 8) {
        const syn = Math.abs(wrapSigned(s.params.dihedral)) <= 8;
        return syn
          ? 'Fully eclipsed (syn): the two large groups are directly behind one another, the highest point on the curve.'
          : 'Eclipsed: every front bond lines up with a back bond, so this is a maximum, not a conformer anything sits in.';
      }
      if (Math.abs(off - 60) <= 8) {
        const anti = Math.abs(wrapSigned(s.params.dihedral - 180)) <= 12;
        return anti
          ? 'Anti (180 degrees): staggered with the two large groups as far apart as they get. This is the global minimum.'
          : 'Gauche (about 60 degrees): staggered, but the two large groups are still only 60 degrees apart, which costs steric strain.';
      }
      return null;
    },
    (s) => {
      const b = sizeFraction(s.params.size);
      if (b === 0) return 'With both large groups shrunk to hydrogen this is ethane: no steric term at all, and the whole curve is torsional.';
      if (Math.abs(s.params.size - METHYL_SIZE) <= 5) return 'At this size the two large groups are methyls, so the molecule is butane and the curve is butane\'s.';
      if (b >= 0.8) return 'These groups are large enough that steric strain, not bond eclipsing, sets the shape of the curve.';
      return null;
    },
    (s) => {
      const p = populations(s);
      if (sizeFraction(s.params.size) === 0) return 'All three staggered conformers are identical, so each holds a third of the molecules at any temperature.';
      return `At ${s.params.temperature.toFixed(0)} K, ${(p.anti * 100).toFixed(0)}% of molecules sit in the anti basin and ${(p.gauche * 100).toFixed(0)}% in the two gauche basins combined.`;
    },
    (s) => {
      const rms = librationRms(s);
      if (rms >= 60) return 'There is no well here, so nothing to oscillate in: a real molecule slides off this angle immediately.';
      return `Thermal energy keeps the bond librating about plus or minus ${rms.toFixed(0)} degrees around this angle rather than holding it still.`;
    },
  ],
  explanation(s: SimState) {
    const b = sizeFraction(s.params.size);
    const strain = strainAt(s.params.dihedral, b);
    const barrier = highestBarrier(b);
    const p = populations(s);
    if (b === 0) {
      return `This is ethane looking down the C1-C2 bond. There are no large groups, so every eclipsing interaction is a hydrogen against a hydrogen at ${E_HH} kJ/mol, and the barrier is three of them: ${barrier.toFixed(1)} kJ/mol. At ${s.params.dihedral.toFixed(0)} degrees the strain is ${strain.toFixed(1)} kJ/mol. Because all three staggered conformers are identical, no angle is preferred over the other two and the populations are flat.`;
    }
    return `Looking down the central bond, the two large groups are ${s.params.dihedral.toFixed(0)} degrees apart and the conformer costs ${strain.toFixed(1)} kJ/mol relative to anti. Torsional strain contributes ${torsionalAt(s.params.dihedral, b).toFixed(1)} kJ/mol and steric repulsion ${stericAt(s.params.dihedral, b).toFixed(1)} kJ/mol. Rotating past the worst eclipsed conformation costs ${barrier.toFixed(1)} kJ/mol, which at ${s.params.temperature.toFixed(0)} K the bond crosses ${describeRotationRate(barrier, s.params.temperature)}. That is why conformers are a population (${(p.anti * 100).toFixed(0)}% anti here) rather than compounds you could separate.`;
  },
  draw: drawNewmanProjection,
};

export default newmanProjectionSim;
