import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'slime',
  name: 'Slime',
  seoTitle: 'Slime Online: Virtual Slime Fidget',
  description:
    'Stretch and poke virtual slime. Slime simulator you play with in the browser. No download. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Poke and pull. Release if it sticks.',
  categorySlug: 'fidgets',
  tags: ['virtual slime', 'slime fidget', 'stretch slime', 'slime toy', 'goo fidget'],
  updatedAt: '2026-09-24',
  trustVariant: 'private',
  engine: 'feel',
  pattern: 'fidget-interact',
  family: 'fidget',
  craft: {
    id: 'slime-release',
    kind: 'recovery',
    solves:
      'Slime sticks permanently to a finger event that never received pointerup after leaving the canvas, so the blob follows nothing and the session is stuck.',
  },
  citation: {
    problem: 'Use Slime when someone wants to poke and stretch a virtual blob, and release it if a pointer sticks.',
    nonGoal: 'model real slime chemistry or leave a stuck pointer with no release, or send the session to an AI model.',
  },
  relatedTools: ['kinetic-sand', 'pop-it', 'spinner'],
  keywords: [],
  inputs: [],
  outputs: [],
  guide: {
    slug: 'virtual-slime',
    categorySlug: 'fidget',
    title: 'Virtual Slime: Grab, Stretch and Release',
    description:
      'How browser slime stays attached to a finger, why a missed pointerup needs Release, and how stiffness follows Feel intensity.',
    readMinutes: 6,
    updatedAt: '2026-09-09',
  },
};
