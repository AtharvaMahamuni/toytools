import { describe, expect, it } from 'vitest';
import { loadSimulation, simulationModuleIds } from './loader';
import { SIMULATIONS } from './simulations/registry';

describe('lazy simulation loader', () => {
  it('exposes the same ids as the static registry', () => {
    expect(simulationModuleIds).toEqual(Object.keys(SIMULATIONS).sort());
  });

  it('dynamically loads each registered simulation and returns its def', async () => {
    for (const id of simulationModuleIds) {
      const def = await loadSimulation(id);
      expect(def.id).toBe(id);
      expect(typeof def.step).toBe('function');
      expect(typeof def.draw).toBe('function');
    }
  });

  it('rejects an unknown simulation id', async () => {
    await expect(loadSimulation('not-a-real-sim')).rejects.toThrow(/Unknown simulation/);
  });
});
