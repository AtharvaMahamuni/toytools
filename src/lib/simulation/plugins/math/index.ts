// The Applied Math domain plugin — the second subject to plug into the generic simulation engine
// (physics was the first). Its id doubles as the tools' engine id ('math-lab' in
// src/data/engines.ts), since generate.ts derives ToolConfig.engine from metadata.domain.
// The engine core imports nothing from here; simulations/registry.ts composes it into the flat
// simulation map.

import type { SimulationDomain } from '../../domain';
import unitCircle from '../../simulations/unit-circle';
import quadratic from '../../simulations/quadratic';
import probability from '../../simulations/probability';

export const mathDomain: SimulationDomain = {
  id: 'math-lab',
  label: 'Applied Math',
  simulations: {
    'unit-circle': unitCircle,
    quadratic,
    probability,
  },
};
