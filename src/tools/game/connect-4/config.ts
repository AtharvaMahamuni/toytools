import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'connect-4',
  name: 'Connect 4',
  seoTitle: 'Connect 4 Online: Two Player, Same Device',
  description:
    'Play connect 4 online, two player, same device. Four in a row game. No download and no account.',
  tagline: 'The column lights up before the disc drops.',
  categorySlug: 'games',
  tags: [
    'play connect four two player same device',
    'four in a row game no download',
  ],
  addedOn: '2026-10-20',
  updatedAt: '2026-10-20',
  trustVariant: 'local',
  engine: 'board-game',
  pattern: 'board-play',
  family: 'hot-seat',
  processorId: 'connect-4',
  toolGroup: 'hot-seat',
  keywords: [
    'play connect four two player same device',
    'four in a row game no download',
  ],
  inputs: ['move'],
  outputs: ['board'],
  relatedTools: ['tic-tac-toe', 'coin-flipper'],
  craft: {
    id: 'column-preview',
    kind: 'orientation',
    solves:
      'A disc lands in the next column when the highlight lags behind the finger, so the column under the pointer lights up before the drop.',
  },
  citation: {
    problem:
      'Play a two-player Connect 4 match on this device, dropping discs into columns until four connect.',
    nonGoal: 'match two players over the network.',
  },
  job: {
    intent: 'simulate',
    userJob:
      'Play a two-player Connect 4 match on this device, dropping discs into columns until four connect.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  guide: {
    slug: 'connect-4-two-player',
    categorySlug: 'game',
    title: 'Connect 4 for Two on One Device',
    description:
      'How two people play connect 4 on one phone, how a disc drops, and why undo takes the point back.',
    readMinutes: 6,
    updatedAt: '2026-10-20',
  },
};
