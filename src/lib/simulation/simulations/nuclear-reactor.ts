// Nuclear Reactor Simulator — one-delayed-group point kinetics with temperature feedback and an
// automatic protection trip. The neutron population n and precursor concentration c obey the
// classic point-kinetics pair:
//   dn/dt = ((rho - beta) / Lambda) n + lambda c
//   dc/dt = (beta / Lambda) n - lambda c
// Treating reactivity as constant across one fixed substep (it changes only through the slow-moving
// core temperature) makes this a LINEAR system, so each substep is solved EXACTLY via its two real
// eigenvalues rather than integrated numerically — exact regardless of how large or small Lambda
// makes the system, so a hard prompt-critical excursion never destabilizes the integrator itself.
// The discriminant (a + lambda)^2 + 4 lambda b is a sum of squares plus a positive term (b = beta /
// Lambda > 0 always), so it is always positive and the two roots are always real and distinct: no
// degenerate case to guard against.
// Core temperature follows its own exact exponential relaxation toward the instantaneous steady
// state, the same technique heat-transfer.ts uses for its two blocks. Reactivity in turn depends on
// temperature (the feedback coefficient), so the two systems are coupled through the state each
// keeps from the previous substep, not simultaneously solved. Pure model + config; all canvas work
// lives in nuclear-reactor.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { singleStream } from '../graphs';
import { drawNuclearReactor } from './nuclear-reactor.draw';

/** Delayed neutron fraction beta — a typical thermal-reactor value, one delayed group lumped. */
export const DELAYED_FRACTION = 0.0065;
/** Prompt neutron generation time Lambda (s) — typical for a thermal reactor. */
export const GEN_TIME = 0.0005;
/** Effective one-group precursor decay constant lambda (/s). */
export const DECAY_CONSTANT = 0.1;
/** Heat sink reference (deg C) the coolant ultimately rejects heat to. */
export const AMBIENT_TEMP = 20;
/** Design operating temperature (deg C) at rated power with the default cooling rate — the
 *  feedback reference point, so the reactor sits exactly critical at the default parameters. */
export const REFERENCE_TEMP = 40;
/** Core heating per unit relative power (deg C/s), calibrated so default cooling (0.08 /s) settles
 *  exactly at REFERENCE_TEMP: AMBIENT_TEMP + HEAT_GAIN / 0.08 = 40. */
export const HEAT_GAIN = 1.6;
/** Automatic trip setpoints — a real reactor protection system, simplified to two limits. */
export const TRIP_POWER = 2.0; // 200% of rated power
export const TRIP_TEMP = 80; // deg C

/** Reactivity the control rod alone contributes, in dollars: 0 $ at 50% (the critical position),
 *  +rodWorth fully withdrawn, -rodWorth fully inserted. */
export function rodReactivityDollars(rodPositionPercent: number, rodWorth: number): number {
  return (rodPositionPercent / 100 - 0.5) * 2 * rodWorth;
}

/** The rod position actually driving the physics: forced fully in once tripped, regardless of what
 *  the slider still shows, until Reset clears the trip. */
export function effectiveRodPosition(s: SimState): number {
  return s.vars.tripped ? 0 : s.params.rodPosition;
}

/** Net reactivity in dollars: rod contribution plus temperature feedback around REFERENCE_TEMP.
 *  A negative tempCoefficient is the self-stabilizing case (real light-water reactors); a positive
 *  one models a dangerous positive-feedback design (a low-power positive void coefficient). */
export function reactivityDollars(s: SimState): number {
  const rod = rodReactivityDollars(effectiveRodPosition(s), s.params.rodWorth);
  const feedback = s.params.tempCoefficient * (s.vars.temp - REFERENCE_TEMP);
  return rod + feedback;
}

/** The dominant (asymptotic) root of the point-kinetics matrix for a given reactivity in dollars —
 *  what a real reactor's period meter reads. Depends only on reactivity, not on the current state. */
export function dominantRoot(rhoDollars: number): number {
  const rho = rhoDollars * DELAYED_FRACTION;
  const a = (rho - DELAYED_FRACTION) / GEN_TIME;
  const b = DELAYED_FRACTION / GEN_TIME;
  const disc = Math.sqrt((a + DECAY_CONSTANT) ** 2 + 4 * DECAY_CONSTANT * b);
  return (a - DECAY_CONSTANT + disc) / 2;
}

/** The period display ceiling (s): every measurement must stay finite, so "essentially critical"
 *  reads as a very long, capped period rather than an infinite one. */
export const MAX_PERIOD = 999;

/** Reactor period (s): time to change by a factor of e, capped at +-MAX_PERIOD so a near-zero root
 *  (critical, no measurable drift) still renders as a large but finite, readable number. */
export function reactorPeriod(s1: number): number {
  if (Math.abs(s1) < 1e-5) return MAX_PERIOD;
  const t = 1 / s1;
  return Math.sign(t) * Math.min(Math.abs(t), MAX_PERIOD);
}

export function initNuclearReactor(params: Record<string, number>): Record<string, number> {
  const n = 1;
  // Precursor steady state for n = 1 does not depend on reactivity, only on the universal constants.
  const c = DELAYED_FRACTION / (GEN_TIME * DECAY_CONSTANT);
  const temp = AMBIENT_TEMP + HEAT_GAIN * n / params.coolingRate;
  return { n, c, temp, tripped: 0 };
}

/** Exact point-kinetics + thermal step, freezing reactivity across dt (see file header). */
export function stepNuclearReactor(s: SimState, dt: number): void {
  const rhoDollars = reactivityDollars(s);
  const rho = rhoDollars * DELAYED_FRACTION;
  const a = (rho - DELAYED_FRACTION) / GEN_TIME;
  const b = DELAYED_FRACTION / GEN_TIME;

  const disc = Math.sqrt((a + DECAY_CONSTANT) ** 2 + 4 * DECAY_CONSTANT * b);
  const s1 = (a - DECAY_CONSTANT + disc) / 2;
  const s2 = (a - DECAY_CONSTANT - disc) / 2;

  const n0 = s.vars.n;
  const c0 = s.vars.c;
  const A1 = (DECAY_CONSTANT * c0 - n0 * (s2 - a)) / (s1 - s2);
  const A2 = n0 - A1;
  const e1 = Math.exp(s1 * dt);
  const e2 = Math.exp(s2 * dt);

  s.vars.n = A1 * e1 + A2 * e2;
  s.vars.c = (A1 * (s1 - a) * e1 + A2 * (s2 - a) * e2) / DECAY_CONSTANT;

  // Core temperature relaxes exactly toward the instantaneous steady state for the power level this
  // substep started at (heat-transfer.ts uses the same exact-exponential technique for its blocks).
  const tSteady = AMBIENT_TEMP + HEAT_GAIN * n0 / s.params.coolingRate;
  s.vars.temp = tSteady + (s.vars.temp - tSteady) * Math.exp(-s.params.coolingRate * dt);

  s.t += dt;

  if (!s.vars.tripped && (s.vars.n > TRIP_POWER || s.vars.temp > TRIP_TEMP)) {
    s.vars.tripped = 1;
  }
}

const nuclearReactorSim: SimulationDef = {
  id: 'nuclear-reactor',
  aspect: 4 / 3,
  // The chain reaction keeps running with the new value; nothing to re-initialise on a change.
  paramBehavior: 'continuous',
  params: [
    { id: 'rodPosition', label: 'Control rod position', unit: '%', min: 0, max: 100, step: 1, default: 50, decimals: 0 },
    { id: 'rodWorth', label: 'Rod worth', unit: '$', min: 0.3, max: 1.6, step: 0.1, default: 0.9, decimals: 1 },
    { id: 'tempCoefficient', label: 'Temperature coefficient', unit: '$/°C', min: -0.05, max: 0.02, step: 0.005, default: -0.02, decimals: 3 },
    { id: 'coolingRate', label: 'Cooling rate', unit: '/s', min: 0.03, max: 0.25, step: 0.01, default: 0.08, decimals: 2 },
  ],
  presets: [
    { id: 'steady', label: 'Steady state', values: { rodPosition: 50, rodWorth: 0.9, tempCoefficient: -0.02, coolingRate: 0.08 } },
    { id: 'startup', label: 'Slow reactor startup', values: { rodPosition: 70, rodWorth: 0.9, tempCoefficient: -0.02, coolingRate: 0.08 } },
    { id: 'prompt', label: 'Approaching prompt critical', values: { rodPosition: 98, rodWorth: 1.5, tempCoefficient: -0.015, coolingRate: 0.06 } },
    { id: 'void', label: 'Positive void coefficient', values: { rodPosition: 65, rodWorth: 0.9, tempCoefficient: 0.015, coolingRate: 0.05 } },
  ],
  init: initNuclearReactor,
  step: stepNuclearReactor,
  measurements: [
    { id: 'power', label: 'Reactor power', unit: '%', decimals: 1, compute: (s) => s.vars.n * 100 },
    { id: 'reactivity', label: 'Reactivity', unit: '$', decimals: 2, compute: reactivityDollars },
    { id: 'period', label: 'Reactor period', unit: 's', decimals: 2, compute: (s) => reactorPeriod(dominantRoot(reactivityDollars(s))) },
    { id: 'temperature', label: 'Core temperature', unit: '°C', decimals: 1, compute: (s) => s.vars.temp },
  ],
  formula: {
    expression: 'prompt critical at ρ = 1 $',
    terms: [
      { symbol: 'ρ', label: 'Reactivity', measurementId: 'reactivity' },
      { symbol: 'P', label: 'Reactor power', measurementId: 'power' },
    ],
  },
  graph: singleStream({
    yLabel: 'Reactor power (%)',
    window: 15,
    yRange: () => [0, 300],
    id: 'power',
    label: 'Power',
    color: 'danger',
    sample: (s) => s.vars.n * 100,
  }),
  observations: [
    (s) =>
      s.vars.tripped
        ? 'Reactor trip: power or temperature crossed a safety limit, so the protection system drove the rod fully in. Press Reset to clear the trip.'
        : null,
    (s) => {
      if (s.vars.tripped) return null;
      const rho = reactivityDollars(s);
      if (rho >= 1) return `Reactivity is ${rho.toFixed(2)} $, past prompt critical: the chain reaction sustains itself on prompt neutrons alone, so power rises in a fraction of a second, far too fast for a control rod to catch.`;
      if (Math.abs(rho) < 0.02) return 'The reactor is critical: reactivity is essentially zero, so power holds steady.';
      return rho > 0
        ? `Reactivity is positive (${rho.toFixed(2)} $): the reactor is supercritical and power is rising.`
        : `Reactivity is negative (${rho.toFixed(2)} $): the reactor is subcritical and power is falling.`;
    },
    (s) =>
      !s.vars.tripped && s.params.tempCoefficient > 0
        ? 'A positive temperature coefficient means a hotter core adds reactivity instead of removing it, a self-reinforcing loop with no natural stopping point until the protection system trips.'
        : null,
    (s) =>
      !s.vars.tripped && s.params.tempCoefficient < 0 && Math.abs(reactivityDollars(s) - rodReactivityDollars(effectiveRodPosition(s), s.params.rodWorth)) > 0.05
        ? 'The negative temperature coefficient is already pulling reactivity back down as the core warms, the main reason real power reactors self-stabilize.'
        : null,
    (s) => (s.vars.temp >= TRIP_TEMP * 0.8 && !s.vars.tripped ? 'Core temperature is approaching the trip limit.' : null),
  ],
  pointer: {
    hint: 'Drag the rod, or tap it for an emergency shutdown',
    handle(s, ev) {
      if (ev.type === 'up') return null;
      if (ev.type === 'tap') {
        s.vars.tripped = 1;
        return { rodPosition: 0 };
      }
      // The rod sits in the top ~70% of the canvas; dragging near the top withdraws it, near the
      // bottom of its travel inserts it fully.
      const frac = 1 - Math.min(Math.max((ev.y - 0.1) / 0.7, 0), 1);
      return { rodPosition: frac * 100 };
    },
  },
  explanation(s: SimState) {
    if (s.vars.tripped) {
      return `The automatic protection system inserted the control rod after power or core temperature crossed its safety limit. Reactivity is now strongly negative, so the chain reaction is dying away regardless of where the rod slider sits. Press Reset to start over.`;
    }
    const rho = reactivityDollars(s);
    const period = reactorPeriod(dominantRoot(rho));
    const power = (s.vars.n * 100).toFixed(1);
    if (Math.abs(rho) < 0.02) {
      return `At ${rho.toFixed(2)} $ reactivity the reactor is critical: each fission produces, on average, exactly one more fission, so power holds at ${power}% indefinitely. This is the balance point every control-rod move disturbs and every feedback effect tries to restore.`;
    }
    const trend = rho > 0 ? 'rising' : 'falling';
    const periodText = Math.abs(period) >= MAX_PERIOD ? 'a very long time' : `about ${Math.abs(period).toFixed(1)} s`;
    return `At ${rho.toFixed(2)} $ reactivity, power is ${trend} with a period of ${periodText}, currently ${power}% of rated power. Below 1 $ the delayed neutrons from fission-product decay still set the pace, which is what makes the reactor controllable at all; a shorter period means less time to react.`;
  },
  draw: drawNuclearReactor,
};

export default nuclearReactorSim;
