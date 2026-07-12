// Runs the shared simulation contract (contract.ts) over every registered simulation. Adding a
// simulation needs no new file here: it is covered automatically. Per-sim numeric assertions live
// in each simulation's own <id>.test.ts.

import { describe } from 'vitest';
import { SIMULATIONS } from './simulations/registry';
import { expectSimulation } from './contract';

describe.each(Object.values(SIMULATIONS).map((def) => [def.id, def] as const))(
  'simulation contract: %s',
  (_id, def) => {
    expectSimulation(def);
  },
);
