import { describe, expect, it } from 'vitest';
import nuclearReactorSim, {
  DECAY_CONSTANT,
  DELAYED_FRACTION,
  GEN_TIME,
  MAX_PERIOD,
  REFERENCE_TEMP,
  SHUTDOWN_MARGIN,
  TRIP_POWER,
  TRIP_TEMP,
  dominantRoot,
  effectiveRodPosition,
  initNuclearReactor,
  insertedDollars,
  reactivityDollars,
  reactorPeriod,
  rodDollars,
  rodReactivityDollars,
  steadyTemp,
  stepNuclearReactor,
} from './nuclear-reactor';
import { SUBSTEP } from '../loop';
import type { SimState } from '../types';

type Params = Record<'rodPosition' | 'rodWorth' | 'tempCoefficient' | 'coolingRate', number>;

const params = (over: Partial<Params> = {}): Params => ({
  rodPosition: 50,
  rodWorth: 0.9,
  tempCoefficient: -0.02,
  coolingRate: 0.08,
  ...over,
});

function makeState(over: Partial<Params> = {}): SimState {
  const p = params(over);
  return { t: 0, params: p, vars: initNuclearReactor(p) };
}

function run(s: SimState, seconds: number): void {
  const steps = Math.round(seconds / SUBSTEP);
  for (let i = 0; i < steps; i++) stepNuclearReactor(s, SUBSTEP);
}

/** Step until the trip fires or maxSeconds elapses; returns whether it tripped. */
function runUntilTripped(s: SimState, maxSeconds: number): boolean {
  const steps = Math.round(maxSeconds / SUBSTEP);
  for (let i = 0; i < steps; i++) {
    stepNuclearReactor(s, SUBSTEP);
    if (s.vars.tripped) return true;
  }
  return false;
}

describe('nuclear reactor model', () => {
  it('starts exactly critical at the default parameters: power holds steady', () => {
    const s = makeState();
    expect(reactivityDollars(s)).toBeCloseTo(0, 6);
    run(s, 10);
    expect(s.vars.n).toBeCloseTo(1, 3);
    expect(s.vars.temp).toBeCloseTo(REFERENCE_TEMP, 2);
    expect(s.vars.tripped).toBe(0);
  });

  it('rises when the rod is withdrawn past the critical position', () => {
    const s = makeState({ rodPosition: 70 });
    expect(reactivityDollars(s)).toBeGreaterThan(0);
    let prev = s.vars.n;
    for (let i = 0; i < 5; i++) {
      run(s, 0.5);
      expect(s.vars.n).toBeGreaterThan(prev);
      prev = s.vars.n;
    }
  });

  it('falls when the rod is inserted past the critical position', () => {
    const s = makeState({ rodPosition: 30 });
    expect(reactivityDollars(s)).toBeLessThan(0);
    run(s, 5);
    expect(s.vars.n).toBeLessThan(1);
  });

  it('rodReactivityDollars is zero at 50%, +worth fully withdrawn, -worth fully inserted', () => {
    expect(rodReactivityDollars(50, 1.2)).toBeCloseTo(0, 10);
    expect(rodReactivityDollars(100, 1.2)).toBeCloseTo(1.2, 10);
    expect(rodReactivityDollars(0, 1.2)).toBeCloseTo(-1.2, 10);
  });

  it('the dominant root is ~0 at criticality and matches the analytic inhour relation', () => {
    expect(dominantRoot(0)).toBeCloseTo(0, 6);
    // At rho($) = 1 (prompt critical), a = 0, so the inhour quadratic reduces to a known form.
    const s1 = dominantRoot(1);
    const beta = DELAYED_FRACTION;
    const b = beta / GEN_TIME;
    const expected = (-DECAY_CONSTANT + Math.sqrt(DECAY_CONSTANT ** 2 + 4 * DECAY_CONSTANT * b)) / 2;
    expect(s1).toBeCloseTo(expected, 6);
    expect(s1).toBeGreaterThan(0);
  });

  it('reactorPeriod stays finite, capping a near-critical root at MAX_PERIOD', () => {
    expect(reactorPeriod(1e-7)).toBe(MAX_PERIOD);
    expect(Number.isFinite(reactorPeriod(1e-7))).toBe(true);
    expect(reactorPeriod(0.5)).toBeCloseTo(2, 6);
    expect(reactorPeriod(-0.5)).toBeCloseTo(-2, 6);
    // Clamped so a near-zero-but-significant root never produces an unreadable number.
    expect(Math.abs(reactorPeriod(1e-4))).toBeLessThanOrEqual(MAX_PERIOD);
  });

  it('a negative temperature coefficient pulls reactivity back down as the core warms', () => {
    const s = makeState({ rodPosition: 70, tempCoefficient: -0.03 });
    const rodOnly = rodDollars(s);
    run(s, 3);
    expect(reactivityDollars(s)).toBeLessThan(rodOnly);
  });

  it('a positive temperature coefficient adds reactivity as the core warms (destabilizing)', () => {
    const s = makeState({ rodPosition: 65, tempCoefficient: 0.02 });
    const rodOnly = rodDollars(s);
    run(s, 2);
    expect(reactivityDollars(s)).toBeGreaterThan(rodOnly);
  });

  it('trips automatically once power exceeds the safety limit and forces the rod fully in', () => {
    const s = makeState({ rodPosition: 100, rodWorth: 1.6 });
    expect(runUntilTripped(s, 2)).toBe(true);
    expect(s.vars.n).toBeGreaterThanOrEqual(TRIP_POWER * 0.99); // tripped right at the setpoint
    expect(effectiveRodPosition(s)).toBe(0);
    // Reactivity is now forced negative by the fully-inserted rod, even though the slider param
    // still reads 100 (the trip overrides the physics, not the UI control).
    expect(s.params.rodPosition).toBe(100);
    expect(reactivityDollars(s)).toBeLessThan(0);
    // And power now decays away as the trip holds the rod in.
    const atTrip = s.vars.n;
    run(s, 5);
    expect(s.vars.n).toBeLessThan(atTrip);
  });

  it('trips on temperature even when power stays modest, under poor cooling', () => {
    // No temperature feedback here, isolating the thermal trip path: a small positive rod
    // reactivity grows power slowly (period ~100 s) while poor cooling lets the core outrun it.
    const s = makeState({ rodPosition: 55, tempCoefficient: 0, coolingRate: 0.03 });
    expect(runUntilTripped(s, 300)).toBe(true);
    expect(s.vars.temp).toBeGreaterThanOrEqual(TRIP_TEMP * 0.99);
    expect(s.vars.n).toBeLessThan(TRIP_POWER); // tripped on temperature, not a power excursion
  });

  it('once tripped, power decays toward shutdown regardless of further rod slider changes', () => {
    const s = makeState({ rodPosition: 100, rodWorth: 1.6 });
    run(s, 2);
    expect(s.vars.tripped).toBe(1);
    const afterTrip = s.vars.n;
    s.params.rodPosition = 100; // operator hasn't touched Reset; slider still reads full withdrawal
    run(s, 5);
    expect(s.vars.n).toBeLessThan(afterTrip);
  });

  it('a scram always wins over a strong positive feedback loop', () => {
    // The regression this guards: modelling a trip as merely "rod driven to 0%" leaves net
    // reactivity at feedback − rodWorth, so the weakest rod against the strongest positive
    // coefficient stayed SUPERCRITICAL after a scram and climbed forever. The shutdown margin is
    // what makes a trip mean shutdown.
    const s = makeState({ rodPosition: 100, rodWorth: 0.3, tempCoefficient: 0.02, coolingRate: 0.03 });
    expect(runUntilTripped(s, 300)).toBe(true);
    expect(reactivityDollars(s)).toBeLessThan(-1);
    const atTrip = s.vars.n;
    run(s, 10);
    expect(s.vars.n).toBeLessThan(atTrip * 0.5);
  });

  it('insertedDollars swaps the slider for the shutdown margin exactly on the trip', () => {
    const s = makeState({ rodPosition: 100, rodWorth: 1.2 });
    expect(insertedDollars(s)).toBeCloseTo(1.2, 10);
    s.vars.tripped = 1;
    expect(insertedDollars(s)).toBe(-SHUTDOWN_MARGIN);
  });

  it('tapping a tripped reactor restarts it without disturbing the slider setup', () => {
    const s = makeState({ rodPosition: 100, rodWorth: 1.6, coolingRate: 0.12 });
    expect(runUntilTripped(s, 3)).toBe(true);

    const setup = { ...s.params };
    nuclearReactorSim.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0.5, t: 0 });

    expect(s.vars.tripped).toBe(0);
    expect(s.vars.n).toBeCloseTo(1, 10); // back at rated power
    expect(s.vars.temp).toBeCloseTo(steadyTemp(s.params.coolingRate), 10);
    expect(s.params).toEqual(setup); // every slider untouched
    // The rod is still fully withdrawn, so the same excursion runs again: restart is a retry,
    // not a rescue.
    expect(runUntilTripped(s, 3)).toBe(true);
  });

  it('lets you drag the rod on the canvas to set its position directly', () => {
    const s = makeState();
    const near100 = nuclearReactorSim.pointer!.handle(s, { type: 'move', x: 0.5, y: 0.1, t: 0 });
    expect(near100!.rodPosition).toBeCloseTo(100, 0);
    const near0 = nuclearReactorSim.pointer!.handle(s, { type: 'move', x: 0.5, y: 0.8, t: 0 });
    expect(near0!.rodPosition).toBeCloseTo(0, 0);
  });

  it('tapping the canvas scrams a running reactor, leaving the slider where it was', () => {
    const s = makeState({ rodPosition: 90 });
    const result = nuclearReactorSim.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0.5, t: 0 });
    expect(result).toBeNull(); // a scram is a var change, not a parameter change
    expect(s.vars.tripped).toBe(1);
    expect(s.params.rodPosition).toBe(90);
    expect(insertedDollars(s)).toBe(-SHUTDOWN_MARGIN);
  });

  it('ignores the pointer-up event', () => {
    const s = makeState();
    expect(nuclearReactorSim.pointer!.handle(s, { type: 'up', x: 0.5, y: 0.5, t: 0 })).toBeNull();
  });

  it('reports the trip and critical-state narrative', () => {
    const critical = makeState();
    const texts = nuclearReactorSim.observations.map((rule) => rule(critical)).filter(Boolean) as string[];
    expect(texts.join(' ')).toMatch(/critical/i);
    expect(nuclearReactorSim.explanation(critical)).toMatch(/critical/i);

    const tripped = makeState({ rodPosition: 100, rodWorth: 1.6 });
    run(tripped, 2);
    expect(nuclearReactorSim.observations[0](tripped)).toMatch(/trip/i);
    expect(nuclearReactorSim.explanation(tripped)).toMatch(/protection system/i);
  });

  it('wires the formula panel up as a calculator whose worked line equals its own answer', () => {
    const formula = nuclearReactorSim.formula!;
    // A formula only becomes an editable calculator when a term names a real param
    // (SimulationWidget renders those as number boxes); the rest is a static caption.
    const inputs = formula.terms.filter((t) => t.paramId);
    expect(inputs.length).toBeGreaterThan(0);
    for (const term of inputs) {
      expect(nuclearReactorSim.params.some((p) => p.id === term.paramId)).toBe(true);
    }
    // The substitution template may only interpolate params, or the worked line renders "?".
    const placeholders = [...formula.substitution!.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
    expect(placeholders.length).toBeGreaterThan(0);
    for (const id of placeholders) {
      expect(nuclearReactorSim.params.some((p) => p.id === id), `{${id}} is a param`).toBe(true);
    }
    // The output term resolves to a measurement, and that measurement is what the worked line
    // computes: 70% at 0.9 $ worth => (0.7 - 0.5) x 2 x 0.9 = 0.36 $.
    const out = formula.terms.find((t) => t.measurementId)!;
    const measurement = nuclearReactorSim.measurements.find((m) => m.id === out.measurementId)!;
    const s = makeState({ rodPosition: 70, rodWorth: 0.9 });
    expect(measurement.compute(s)).toBeCloseTo(0.36, 10);
    expect(rodDollars(s)).toBeCloseTo(0.36, 10);
  });

  it('exposes finite measurements for every preset', () => {
    for (const preset of nuclearReactorSim.presets) {
      const p = params(preset.values as Partial<Params>);
      const s: SimState = { t: 0, params: p, vars: nuclearReactorSim.init(p) };
      run(s, 3);
      for (const m of nuclearReactorSim.measurements) {
        expect(Number.isFinite(m.compute(s)), `${m.id} for ${preset.id}`).toBe(true);
      }
    }
  });
});
