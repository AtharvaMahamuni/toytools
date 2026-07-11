// The physics domain plugin — the first subject to plug into the generic simulation engine.
// It bundles the physics SimulationDefs into a SimulationDomain. The engine core imports NOTHING
// from here; only simulations/registry.ts composes this (and future domain plugins) into the flat
// simulation map. In later phases this plugin also carries physics presentation (palette variable
// names, the quantity formatter, unit registry, and domain vocabulary).

import type { SimulationDomain } from '../../domain';
import waveSpeed from '../../simulations/wave-speed';
import frequencyPeriod from '../../simulations/frequency-period';
import pendulum from '../../simulations/pendulum';
import heatTransfer from '../../simulations/heat-transfer';
import projectileMotion from '../../simulations/projectile-motion';

export const physicsDomain: SimulationDomain = {
  id: 'physics',
  label: 'Physics',
  simulations: {
    'wave-speed': waveSpeed,
    'frequency-period': frequencyPeriod,
    pendulum,
    'heat-transfer': heatTransfer,
    'projectile-motion': projectileMotion,
  },
};
