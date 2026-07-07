import { describe, expect, it } from 'vitest';
import heatTransferSim, {
  BLOCK_HEAT_CAPACITY,
  equilibriumTemp,
  heatMoved,
  initHeatTransfer,
  isAtEquilibrium,
  stepHeatTransfer,
} from './heat-transfer';
import { SUBSTEP } from '../loop';
import type { SimState } from '../types';

const params = (over: Partial<Record<'tempA' | 'tempB' | 'conductance', number>> = {}) => ({
  tempA: 90,
  tempB: 10,
  conductance: 0.25,
  ...over,
});

function makeState(over: Partial<Record<'tempA' | 'tempB' | 'conductance', number>> = {}): SimState {
  const p = params(over);
  return { t: 0, params: p, vars: initHeatTransfer(p) };
}

function run(s: SimState, seconds: number): void {
  const steps = Math.round(seconds / SUBSTEP);
  for (let i = 0; i < steps; i++) stepHeatTransfer(s, SUBSTEP);
}

describe('heat-transfer model', () => {
  it('flows heat from the hotter block to the colder one, monotonically', () => {
    const s = makeState();
    let prevA = s.vars.ta;
    let prevB = s.vars.tb;
    for (let i = 0; i < 10; i++) {
      run(s, 0.5);
      expect(s.vars.ta).toBeLessThan(prevA);
      expect(s.vars.tb).toBeGreaterThan(prevB);
      prevA = s.vars.ta;
      prevB = s.vars.tb;
    }
  });

  it('conserves energy exactly: the temperature sum never changes', () => {
    const s = makeState({ tempA: 73, tempB: 22 });
    const sum0 = s.vars.ta + s.vars.tb;
    run(s, 25);
    expect(s.vars.ta + s.vars.tb).toBeCloseTo(sum0, 10);
  });

  it('settles at the mean of the starting temperatures', () => {
    const s = makeState();
    run(s, 40);
    expect(s.vars.ta).toBeCloseTo(equilibriumTemp(s.params), 3);
    expect(s.vars.tb).toBeCloseTo(equilibriumTemp(s.params), 3);
    expect(isAtEquilibrium(s)).toBe(true);
  });

  it('decays the temperature difference as ΔT₀·e^(−2kt)', () => {
    const s = makeState({ conductance: 0.4 });
    const d0 = s.vars.ta - s.vars.tb;
    run(s, 3);
    expect(s.vars.ta - s.vars.tb).toBeCloseTo(d0 * Math.exp(-2 * 0.4 * 3), 6);
  });

  it('reaches equilibrium faster at higher conductance', () => {
    const fast = makeState({ conductance: 0.9 });
    const slow = makeState({ conductance: 0.05 });
    run(fast, 4);
    run(slow, 4);
    expect(Math.abs(fast.vars.ta - fast.vars.tb)).toBeLessThan(Math.abs(slow.vars.ta - slow.vars.tb));
  });

  it('accounts the heat moved as Q = m·c·(T_A0 − T_A)', () => {
    const s = makeState();
    run(s, 5);
    expect(heatMoved(s)).toBeCloseTo(BLOCK_HEAT_CAPACITY * (90 - s.vars.ta), 10);
    // In the limit, half of the initial 80° gap has left block A: Q → 40 kJ.
    run(s, 60);
    expect(heatMoved(s)).toBeCloseTo(40, 2);
  });

  it('handles a cold A / hot B start symmetrically', () => {
    const s = makeState({ tempA: 5, tempB: 95 });
    run(s, 2);
    expect(s.vars.ta).toBeGreaterThan(5);
    expect(s.vars.tb).toBeLessThan(95);
  });

  it('reports equilibrium narrative once the gap closes', () => {
    const s = makeState();
    run(s, 40);
    const texts = heatTransferSim.observations.map((rule) => rule(s)).filter(Boolean) as string[];
    expect(texts.join(' ')).toMatch(/equilibrium/i);
    expect(heatTransferSim.explanation(s)).toMatch(/equilibrium|average/i);
  });

  it('lets you drag a block to set its temperature directly', () => {
    const s = makeState();
    // Drag near the top of the left half → block A close to 100 °C.
    const hotA = heatTransferSim.pointer!.handle(s, { type: 'move', x: 0.2, y: 0.05, t: 0 });
    expect(hotA!.tempA).toBeGreaterThan(90);
    expect(s.vars.ta).toBeGreaterThan(90);
    expect(s.vars.ta0).toBeCloseTo(s.vars.ta); // heat-moved reference follows the drag
    // Drag near the bottom of the right half → block B close to 0 °C.
    const coldB = heatTransferSim.pointer!.handle(s, { type: 'move', x: 0.8, y: 0.95, t: 0 });
    expect(coldB!.tempB).toBeLessThan(10);
  });

  it('bumps a block by 5 °C on tap and wraps at the top', () => {
    const s = makeState({ tempA: 98 });
    const bumped = heatTransferSim.pointer!.handle(s, { type: 'tap', x: 0.2, y: 0.5, t: 0 });
    expect(bumped!.tempA).toBe(0); // 98 + 5 > 100 → wraps to 0
  });

  it('fires each observation and explanation branch for the right state', () => {
    // Fresh, large gap → hotter-to-colder observation + non-equilibrium explanation.
    const start = makeState({ tempA: 90, tempB: 10 });
    expect(heatTransferSim.observations[0](start)).toMatch(/hotter block A/i);
    expect(heatTransferSim.explanation(start)).toMatch(/drives the heat flow/i);
    // Small remaining gap → the "flow is slowing down" observation.
    const nearlyDone = makeState({ tempA: 55, tempB: 48 });
    expect(heatTransferSim.observations[1](nearlyDone)).toMatch(/slowing down/i);
    // High conductance preset → the good-thermal-contact observation.
    const fast = makeState({ conductance: 0.9 });
    expect(heatTransferSim.observations[2](fast)).toMatch(/high conductance/i);
    // Low conductance preset → the insulation observation.
    const slow = makeState({ conductance: 0.05 });
    expect(heatTransferSim.observations[3](slow)).toMatch(/insulation/i);
    // Cold A / hot B still flows from the hotter block.
    expect(heatTransferSim.observations[0](makeState({ tempA: 10, tempB: 90 }))).toMatch(/hotter block B/i);
  });

  it('exposes finite measurements for every preset', () => {
    for (const preset of heatTransferSim.presets) {
      const p = params(preset.values as Partial<Record<'tempA' | 'tempB' | 'conductance', number>>);
      const s: SimState = { t: 0, params: p, vars: heatTransferSim.init(p) };
      run(s, 1);
      for (const m of heatTransferSim.measurements) {
        expect(Number.isFinite(m.compute(s)), `${m.id} for ${preset.id}`).toBe(true);
      }
    }
  });
});
