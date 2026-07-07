import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'heat-transfer-simulator',
  title: 'Heat Transfer Simulator',
  category: 'physics',
  summary: 'Watch heat flow from a hot block to a cold one until they reach thermal equilibrium, with drag-to-set temperatures.',
  primaryConcepts: ['heat transfer'],
  secondaryConcepts: ['thermal equilibrium', 'conduction', 'temperature', 'energy conservation', 'exponential cooling'],
  intentGroups: {
    informational: ['Which way does heat flow?', 'What is thermal equilibrium?'],
    howTo: ['How to reach thermal equilibrium', 'How to set a block temperature'],
    comparison: ['High vs low thermal conductance', 'Heat vs temperature'],
    misconception: ['Heat does not flow from cold to hot on its own', 'Conductance changes the speed, not the final temperature'],
    troubleshooting: ['Why the heat flow slows down over time', 'Why both blocks settle at the average temperature'],
  },
  realWorldUseCases: [
    'Understanding why a hot drink cools quickly at first and then slowly',
    'Seeing how ice and a warm drink reach a shared temperature',
    'Explaining why insulation slows heat loss without changing the end state',
    'Introducing the second law of thermodynamics visually',
  ],
  commonMistakes: [
    'Believing heat can flow from a cold object to a hot one unaided',
    'Thinking better insulation changes the final equilibrium temperature',
    'Confusing temperature with the total heat energy',
  ],
  commonQuestions: [
    'Which way does heat flow?',
    'What is thermal equilibrium?',
    'Why does the heat flow slow down over time?',
  ],
  usedWith: [
    { slug: 'pendulum-simulator', reason: 'Compare energy conservation in mechanics and heat', strength: 0.6 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'wave-speed-simulator', reason: 'Explore another everyday physics phenomenon interactively', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['heat transfer', 'thermal equilibrium', 'conduction', 'heat flow', 'temperature', 'thermodynamics'],
  entityAliases: ['heat transfer', 'heat flow', 'thermal equilibrium', 'conduction'],
  inputs: ['block A temperature', 'block B temperature', 'thermal conductance'],
  outputs: ['block temperatures', 'equilibrium temperature', 'heat moved'],
  difficulty: 'beginner',
  audience: ['students', 'teachers', 'physics learners'],
};
