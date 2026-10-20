import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'chess-tac-toe',
  name: 'Chess Tac Toe',
  seoTitle: 'Chess Tac Toe: Two Player, Same Device',
  description:
    'Play chess tac toe, a hybrid chess tic tac toe board game. Place four pieces in a line. No account.',
  tagline: 'Legal moves only. Four in a line wins.',
  categorySlug: 'games',
  tags: [
    'hybrid chess piece tic tac toe board game',
    'play chess tac toe',
  ],
  addedOn: '2026-10-20',
  updatedAt: '2026-10-20',
  trustVariant: 'local',
  engine: 'board-game',
  pattern: 'board-play',
  family: 'hot-seat',
  processorId: 'chess-tac-toe',
  toolGroup: 'hot-seat',
  keywords: [
    'hybrid chess piece tic tac toe board game',
    'play chess tac toe',
  ],
  inputs: ['move'],
  outputs: ['board'],
  relatedTools: ['tic-tac-toe', 'connect-4'],
  craft: {
    id: 'illegal-reason',
    kind: 'guardrail',
    solves:
      'A tap on an occupied square or an illegal knight step used to look ignored, so the note names the rule and the board stays put.',
  },
  citation: {
    problem:
      'Play a two-player Chess Tac Toe match on this device, with legal moves enforced and four in a line as the win.',
    nonGoal: 'decide a game by checkmate.',
  },
  job: {
    intent: 'simulate',
    userJob:
      'Play a two-player Chess Tac Toe match on this device, with legal moves enforced and four in a line as the win.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  guide: {
    slug: 'chess-tac-toe-two-player',
    categorySlug: 'game',
    title: 'Chess Tac Toe for Two on One Device',
    description:
      'How two people play chess tac toe on one phone, which moves are legal, and why four in a line wins.',
    readMinutes: 6,
    updatedAt: '2026-10-20',
  },
};
