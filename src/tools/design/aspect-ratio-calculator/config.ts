import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'aspect-ratio-calculator',
  name: 'Aspect Ratio Calculator',
  description: 'Lock an aspect ratio like 16:9 and solve the missing width or height in pixels. Resize image dimensions or a screen ratio and keep the proportions exact.',
  tagline: 'Lock a ratio like 16:9 and solve the missing width or height.',
  categorySlug: 'design-tools',
  tags: ['aspect ratio calculator', '16:9 calculator', 'ratio calculator', 'resize keep aspect ratio', 'image dimension calculator', 'pixel ratio', 'screen ratio', 'width height ratio', 'aspect ratio', 'resolution calculator'],
  updatedAt: '2026-07-31',
  engine: 'units',
  pattern: 'aspect-ratio',
  family: 'aspect',
  relatedTools: ['px-to-rem-converter', 'px-to-dp-converter'],
  guide: {
    slug: 'aspect-ratio-calculator',
    categorySlug: 'design',
    title: 'Aspect Ratios Explained: 16:9, Resizing, and Math',
    description: 'Understand what an aspect ratio is, how to solve a missing width or height, and how to resize images and video without distortion.',
    readMinutes: 5,
    updatedAt: '2026-07-31',
  },
};
