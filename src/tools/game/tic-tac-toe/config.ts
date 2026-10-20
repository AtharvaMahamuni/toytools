import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'tic-tac-toe',
  name: 'Tic Tac Toe',
  seoTitle: 'Tic Tac Toe Online: Two Player, Same Device',
  description:
    'Play tic tac toe online, two player, same device. No download and no account. Noughts and crosses, with undo and rematch.',
  tagline: 'Two players, one phone. Undo a mis-tap.',
  categorySlug: 'games',
  tags: [
    'tic tac toe online',
    'tic tac toe two player',
    'noughts and crosses',
    'play tic tac toe same device',
    'tic tac toe no download',
  ],
  addedOn: '2026-10-20',
  updatedAt: '2026-10-20',
  trustVariant: 'local',
  engine: 'board-game',
  pattern: 'board-play',
  family: 'hot-seat',
  processorId: 'tic-tac-toe',
  keywords: [
    'tic tac toe two player online no account',
    'tic tac toe online',
    'tic tac toe two player',
    'noughts and crosses',
    'play tic tac toe same device',
    'tic tac toe no download',
  ],
  inputs: ['move'],
  outputs: ['board'],
  relatedTools: ['coin-flipper', 'dice-roller'],
  craft: {
    id: 'marks-by-shape',
    kind: 'orientation',
    solves:
      'Color-only X and O marks fail for a colorblind player sharing the phone, so each mark is a cross or a ring plus its letter.',
  },
  citation: {
    problem:
      'Play a two-player tic-tac-toe match on this device, with undo and a rematch that keeps the score.',
    nonGoal: 'play against a computer opponent.',
  },
  job: {
    intent: 'simulate',
    userJob:
      'Play a two-player tic-tac-toe match on this device, with undo and a rematch that keeps the score.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  guide: {
    slug: 'tic-tac-toe-two-player',
    categorySlug: 'game',
    title: 'Tic Tac Toe for Two on One Device',
    description:
      'How two people play tic tac toe on one phone, what undo does to the score, and why there is no computer opponent.',
    readMinutes: 5,
    updatedAt: '2026-10-20',
  },
};
