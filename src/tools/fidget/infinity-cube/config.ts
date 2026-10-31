import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'infinity-cube',
  name: 'Infinity Cube',
  seoTitle: 'Infinity Cube: Fold a Hinged Fidget',
  description:
    'Fold an infinity cube fidget online. A virtual hinged cube toy. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Fold the open hinge. It closes back into one cube.',
  categorySlug: 'fidgets',
  tags: [
    'virtual infinity cube',
    'fold infinity cube',
    'hinged cube fidget',
  ],
  updatedAt: '2026-10-31',
  addedOn: '2026-10-31',
  trustVariant: 'private',
  engine: 'feel',
  pattern: 'fidget-interact',
  family: 'fidget',
  craft: {
    id: 'infinity-cube-hinge',
    kind: 'guardrail',
    solves:
      'A second swipe during a fold queues another turn, so the chain skips a hinge and a block passes through its neighbour.',
  },
  citation: {
    problem: 'Fold the open hinge of an infinity cube until the chain closes back into one cube.',
    nonGoal: "diagnose restlessness, or replace a physical cube's weight.",
  },
  job: {
    intent: 'simulate',
    userJob:
      'Fold an infinity cube through its hinges on this device, and keep folding without the blocks passing through each other.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  relatedTools: ['spinner', 'pop-it', 'gears'],
  keywords: [],
  inputs: [],
  outputs: [],
  guide: {
    slug: 'how-an-infinity-cube-folds',
    categorySlug: 'fidget',
    title: 'How an Infinity Cube Folds',
    description:
      'How eight hinged cubes fold a quarter turn and return to one cube, and why a clip is refused.',
    readMinutes: 5,
    updatedAt: '2026-10-31',
  },
};
