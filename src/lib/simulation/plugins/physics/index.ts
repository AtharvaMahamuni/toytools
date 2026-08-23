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
import ohmsLaw from '../../simulations/ohms-law';
import shmSpring from '../../simulations/shm-spring';
import idealGasLaw from '../../simulations/ideal-gas-law';
import momentumCollision from '../../simulations/momentum-collision';
import inclinedPlane from '../../simulations/inclined-plane';
import dopplerEffect from '../../simulations/doppler-effect';
import nuclearReactor from '../../simulations/nuclear-reactor';

export const physicsDomain: SimulationDomain = {
  id: 'physics',
  label: 'Physics',
  simulations: {
    'wave-speed': waveSpeed,
    'frequency-period': frequencyPeriod,
    pendulum,
    'heat-transfer': heatTransfer,
    'projectile-motion': projectileMotion,
    'ohms-law': ohmsLaw,
    'shm-spring': shmSpring,
    'ideal-gas-law': idealGasLaw,
    'momentum-collision': momentumCollision,
    'inclined-plane': inclinedPlane,
    'doppler-effect': dopplerEffect,
    'nuclear-reactor': nuclearReactor,
  },
};
