import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'scientific-calculator',
  name: 'Scientific Calculator',
  seoTitle: 'Scientific Calculator — Trig, Logs, Powers, Roots',
  description: 'Scientific calculator for students: order of operations, trigonometry, logarithms, powers, roots, factorials, constants and history. Runs in your browser.',
  tagline: 'Trigonometry, logarithms, powers and roots, with a visible history.',
  categorySlug: 'number-utilities',
  tags: [
    'scientific calculator',
    'online calculator',
    'student calculator',
    'trigonometry calculator',
    'log calculator',
    'exponent calculator',
    'square root calculator',
    'order of operations calculator',
  ],
  updatedAt: '2026-07-09',
  isNew: true,
  engine: 'calculator',
  pattern: 'calculate',
  family: 'arithmetic',
  relatedTools: ['percentage-calculator', 'tip-calculator', 'discount-calculator'],
  guide: {
    slug: 'how-to-use-a-scientific-calculator',
    categorySlug: 'number',
    title: 'How to Use a Scientific Calculator',
    description: 'Order of operations, degrees vs radians, functions and constants, memory keys, and worked examples so your scientific results always come out right.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
