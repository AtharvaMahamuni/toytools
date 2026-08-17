// Declarative manifest for the Heat Transfer Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in heat-transfer.ts. No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import heatTransfer from './heat-transfer';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Heat Transfer Calculator',
    slug: 'heat-transfer-calculator',
    processorId: 'heat-transfer',
    domain: 'physics',
    category: 'physics',
    family: 'thermodynamics',
    difficulty: 'beginner',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['temperature', 'energy'],
    nextTopics: ['the second law of thermodynamics', 'specific heat capacity'],
    curriculumTags: ['thermodynamics'],
    learningObjectives: [
      'State that heat flows from hot to cold until thermal equilibrium',
      'Explain why the heat flow slows as the temperature gap closes',
      'Distinguish thermal conductance (speed) from the final equilibrium temperature',
    ],
    keyTakeaways: [
      'Heat flows from hot to cold until both reach the same temperature',
      'The flow rate is proportional to the temperature difference',
      'Conductance changes the speed, not the final temperature',
    ],
  },
  concepts: {
    primary: ['heat transfer'],
    secondary: ['thermal equilibrium', 'conduction', 'temperature', 'energy conservation', 'exponential cooling'],
    aliases: ['heat transfer', 'heat flow', 'thermal equilibrium', 'conduction'],
  },
  equations: [
    {
      id: 'heat-flow-rate',
      symbol: 'Q',
      expression: 'heat flow is proportional to the temperature difference',
      description: 'The rate heat moves is set by the gap between the two blocks and their thermal conductance.',
      variables: [
        { symbol: 'T_A', label: 'Block A temperature', unit: 'C', paramId: 'tempA' },
        { symbol: 'T_B', label: 'Block B temperature', unit: 'C', paramId: 'tempB' },
        { symbol: 'k', label: 'Thermal conductance', unit: '', paramId: 'conductance' },
      ],
    },
  ],
  educational: {
    summary:
      'Watch heat flow from a hot block to a cold one until they reach thermal equilibrium, with drag-to-set temperatures.',
    intentGroups: {
      informational: ['Which way does heat flow?', 'What is thermal equilibrium?', 'What is conduction?'],
      howTo: ['How to reach thermal equilibrium', 'How to set a block temperature'],
      comparison: ['High vs low thermal conductance', 'Heat vs temperature'],
      misconception: ['Heat does not flow from cold to hot on its own', 'Conductance changes the speed, not the final temperature'],
      troubleshooting: ['Why the heat flow slows down over time', 'Why both blocks settle at the average temperature'],
    },
    commonMistakes: [
      'Believing heat can flow from a cold object to a hot one unaided',
      'Thinking better insulation changes the final equilibrium temperature',
      'Confusing temperature with the total heat energy',
    ],
    realWorldUseCases: [
      'Understanding why a hot drink cools quickly at first and then slowly',
      'Seeing how ice and a warm drink reach a shared temperature',
      'Explaining why insulation slows heat loss without changing the end state',
      'Introducing the second law of thermodynamics visually',
    ],
    audience: ['students', 'teachers', 'physics learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Heat Transfer Calculator: Watch Blocks Reach Equilibrium',
    description:
      'Watch heat flow from a hot block to a cold one until they reach the same temperature. Drag a block to set its heat and see equilibrium happen live.',
    tagline: 'Watch heat flow between two blocks until they reach equilibrium.',
    keywords: ['heat transfer', 'thermal equilibrium', 'conduction', 'heat flow', 'temperature', 'thermodynamics'],
  },
  presentation: {
    tags: ['heat transfer calculator', 'heat transfer', 'thermal equilibrium', 'conduction', 'heat flow', 'temperature', 'thermodynamics', 'newton cooling', 'heat simulator'],
    updatedAt: '2026-07-09',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Hot drink cooling', body: 'A hot drink cools quickly in its first minutes and then far more slowly as it nears room temperature.' },
    { title: 'Ice in a warm drink', body: 'Heat flows from the drink into the ice until the two meet at a shared temperature.' },
    { title: 'Insulation', body: 'Wrapping a drink in a flask slows the cooling but does not change the temperature it eventually reaches.' },
    { title: 'Second law of thermodynamics', body: 'The arrow of heat flow always points from warmer to cooler, never the reverse on its own.' },
  ],
  faq: [
    {
      question: 'Which way does heat flow?',
      answer:
        'Heat always flows from the hotter object to the colder one, never the other way on its own. That direction is the essence of the second law of thermodynamics. In the simulator the arrow and flow particles always point from the warmer block toward the cooler one, and the flow only stops once both blocks share the same temperature.',
    },
    {
      question: 'What is thermal equilibrium?',
      answer:
        'Thermal equilibrium is the state where two objects in contact reach the same temperature and no net heat flows between them. Because the two blocks here are identical, they settle at the average of their starting temperatures. The simulator marks equilibrium once the difference between the blocks drops below half a degree.',
    },
    {
      question: 'Why does the heat flow slow down over time?',
      answer:
        'The rate of heat flow is proportional to the temperature difference between the blocks. When the gap is large the flow is fast; as the blocks approach each other the gap shrinks and the flow fades. This gives the familiar exponential cooling curve, fast at first and gradually levelling off, which you can see in the graph.',
    },
    {
      question: 'What does the thermal conductance slider do?',
      answer:
        'Conductance sets how easily heat crosses between the blocks, like the quality of the thermal contact. High conductance behaves like metal pressed against metal and reaches equilibrium in seconds. Low conductance behaves like insulation and takes far longer. Importantly, the final equilibrium temperature is the same either way; only the speed changes.',
    },
    {
      question: 'Is energy conserved in the simulation?',
      answer:
        'Yes. Every unit of heat that leaves the hot block enters the cold block, so the total energy is constant. That is why the equilibrium temperature is exactly the average of the two starting temperatures for identical blocks. The heat-moved reading tracks how much energy has crossed between them.',
    },
    {
      question: 'Does this simulator send data anywhere?',
      answer:
        'No. The calculation runs in your browser on the canvas, with nothing uploaded or stored remotely. It continues to work offline once the page has loaded.',
    },
  ],
  guide: {
    slug: 'how-heat-transfer-reaches-equilibrium',
    title: 'How Heat Transfer Reaches Equilibrium',
    description:
      'Which way heat flows, what thermal equilibrium means, why the flow slows over time, and why conductance changes the speed but not the final temperature.',
    readMinutes: 5,
    updatedAt: '2026-07-09',
    quickAnswer:
      "Heat transfer always moves energy from the hotter object to the colder one until both reach the same temperature, a state called thermal equilibrium. For example, drop an ice cube into a warm drink and heat flows from the drink into the ice until they meet in the middle. In the simulator, two blocks exchange heat by conduction: set each block's temperature, press play, and watch the heat flow shrink as the gap closes. Nothing you do leaves your browser.",
    sections: [
      {
        id: 'which-way',
        heading: 'Which Way Does Heat Flow?',
        body:
          'Heat flows from hot to cold, never the other way on its own. This one-way direction is the second law of thermodynamics in everyday form. Heat does not flow from cold to hot unaided: a fridge can move heat that way, but only by spending energy to do it. In the simulator the arrow of heat flow always points from the warmer block toward the cooler one. Swap which block is hotter and the flow reverses direction to match.',
      },
      {
        id: 'equilibrium',
        heading: 'What Is Thermal Equilibrium?',
        body:
          'Thermal equilibrium is the state where two objects sit at the same temperature and no net heat flows between them. To reach thermal equilibrium, leave the blocks in contact and let conduction do its work. When the two blocks have equal heat capacity, they settle at the average of their starting temperatures, because energy is conserved: the heat one block loses is exactly the heat the other gains. For example, a block at 80 degrees beside a block at 20 degrees settles near 50 degrees. Set a block temperature by dragging it or typing a value, then watch both readings converge.',
      },
      {
        id: 'why-it-slows',
        heading: 'Why the Heat Flow Slows Over Time',
        body:
          'The rate of heat flow depends on the temperature difference between the blocks. Early on the gap is large, so heat moves fast; as the blocks approach each other the gap shrinks and the flow eases off. That is why the heat flow slows down over time and the temperature curve flattens into exponential cooling. For example, a hot drink cools quickly in its first minutes and then far more slowly as it nears room temperature. The blocks technically only reach equilibrium in the limit, but they get close fast.',
      },
      {
        id: 'conductance',
        heading: 'High vs Low Thermal Conductance',
        body:
          'Thermal conductance sets how quickly heat crosses between the blocks. High conductance is like a metal bridge: heat rushes across and equilibrium arrives sooner. Low conductance is like insulation: the same heat still moves, just slowly. The key point is that conductance changes the speed, not the final temperature. For example, wrapping a drink in a flask slows the cooling but does not change the temperature it eventually reaches. This is also the difference between heat and temperature: heat is the energy in transit, while temperature is how hot each block reads.',
      },
    ],
    mistakes: [
      {
        heading: 'Thinking better insulation changes the end temperature',
        body:
          'Conductance changes the speed, not the final temperature. Insulation slows heat loss so equilibrium takes longer, but the two blocks still settle at the same shared value. If you expect a well-insulated pair to level off warmer, that is the misconception the simulator corrects.',
      },
      {
        heading: 'Confusing temperature with total heat',
        body:
          'A large cool object can hold more heat energy than a small hot one, so temperature and total heat are not the same thing. Temperature tells you which way heat flows; the amount of energy moved depends on how much material there is at each temperature.',
      },
      {
        type: 'note',
        heading: 'Everything runs on your device',
        body:
          'The simulation runs entirely in your browser: nothing is uploaded, logged, or shared, and it works offline once loaded. To explore energy conservation in a mechanical setting instead, try the pendulum simulator.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: heatTransfer.paramBehavior,
  aspect: heatTransfer.aspect,
  params: heatTransfer.params,
  presets: heatTransfer.presets,
  formula: heatTransfer.formula,
};
