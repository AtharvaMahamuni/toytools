import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'quantum-tic-tac-toe',
  name: 'Quantum Tic Tac Toe',
  seoTitle: 'Quantum Tic Tac Toe: Two Player, Same Device',
  description:
    'Play quantum tic tac toe on one phone. Entanglement noughts and crosses. The other player chooses the collapse. No account.',
  tagline: 'Two squares a move. The other player collapses.',
  categorySlug: 'games',
  tags: [
    'play entanglement noughts and crosses',
  ],
  addedOn: '2026-10-20',
  updatedAt: '2026-10-20',
  trustVariant: 'local',
  engine: 'board-game',
  pattern: 'board-play',
  family: 'hot-seat',
  processorId: 'quantum-tic-tac-toe',
  toolGroup: 'hot-seat',
  keywords: [
    'play entanglement noughts and crosses',
  ],
  inputs: ['move'],
  outputs: ['board'],
  relatedTools: ['tic-tac-toe', 'coin-flipper'],
  craft: {
    id: 'entanglement-graph',
    kind: 'orientation',
    solves:
      'Players argue which spooky marks are linked, so the board draws each entanglement until the other player collapses the cycle.',
  },
  citation: {
    problem:
      'Play a two-player quantum tic-tac-toe match on this device, with entanglement shown and collapse chosen by the other player.',
    nonGoal: 'teach the mathematics of quantum mechanics.',
  },
  job: {
    intent: 'simulate',
    userJob:
      'Play a two-player quantum tic-tac-toe match on this device, with entanglement shown and collapse chosen by the other player.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  guide: {
    slug: 'quantum-tic-tac-toe-two-player',
    categorySlug: 'game',
    title: 'Quantum Tic Tac Toe for Two on One Device',
    description:
      'How two people play quantum tic tac toe on one phone, how entanglement collapses, and who chooses.',
    readMinutes: 6,
    updatedAt: '2026-10-20',
  },
};
