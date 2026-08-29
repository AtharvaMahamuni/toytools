// The Chemistry domain plugin — the third subject to plug into the generic simulation engine
// (physics was the first, applied math the second). Its id doubles as the tools' engine id
// ('chemistry-lab' in src/data/engines.ts), since generate.ts derives ToolConfig.engine from
// metadata.domain.
//
// One domain covers organic, inorganic and physical chemistry rather than three. The plugin seam is
// the RUNTIME, and all three run the same canvas simulation contract; the branch of chemistry is a
// family on each manifest, which is what the knowledge graph and the category sections group by.
// The engine core imports nothing from here; simulations/registry.ts composes it into the flat
// simulation map.

import type { SimulationDomain } from '../../domain';
import newmanProjection from '../../simulations/newman-projection';
import crystalField from '../../simulations/crystal-field';
import reactionKinetics from '../../simulations/reaction-kinetics';

export const chemistryDomain: SimulationDomain = {
  id: 'chemistry-lab',
  label: 'Chemistry',
  simulations: {
    'newman-projection': newmanProjection,
    'crystal-field': crystalField,
    'reaction-kinetics': reactionKinetics,
  },
};
