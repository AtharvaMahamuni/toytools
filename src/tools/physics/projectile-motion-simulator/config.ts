import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'projectile-motion-simulator',
  name: 'Projectile Motion Simulator',
  seoTitle: 'Projectile Motion Simulator: Range, Height & Angle',
  description: 'Drag to aim a launch, then watch the arc fly. Change speed, angle, and gravity and see range, peak height, and time of flight update live.',
  categorySlug: 'physics',
  tags: ['projectile motion simulator', 'projectile motion calculator', 'trajectory calculator', 'range of a projectile', 'launch angle', 'projectile physics', 'kinematics', 'interactive projectile'],
  updatedAt: '2026-07-11',
  isNew: true,
  trustVariant: 'offline',
  engine: 'physics',
  pattern: 'simulate',
  family: 'mechanics',
  processorId: 'projectile-motion',
  relatedTools: ['pendulum-simulator', 'frequency-period-simulator'],
  guide: {
    slug: 'how-projectile-motion-works',
    categorySlug: 'physics',
    title: 'How Projectile Motion Works: Range, Height, and Angle',
    description: 'A visual guide to projectile motion: why 45 degrees gives the maximum range, how launch angle trades distance for height, and what gravity changes.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
