import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'px-to-dp-converter',
  name: 'PX to DP Converter',
  description: 'Convert pixels to dp and sp, the density independent units, across Android density buckets and to pt for iOS.',
  tagline: 'Convert px to dp and sp across Android buckets and iOS points.',
  categorySlug: 'design-tools',
  tags: ['px to dp', 'dp to px', 'px to sp', 'android density', 'density independent pixels', 'dp converter', 'sp to px', 'px to pt ios', 'mdpi hdpi xhdpi', 'android units'],
  updatedAt: '2026-07-31',
  engine: 'units',
  pattern: 'unit-convert',
  family: 'css-unit',
  craft: {
    id: 'ptd-fractional',
    kind: 'orientation',
    solves: 'A dp value that is not on the four-point grid lands on a fraction of a pixel at ldpi and hdpi, and half a pixel is not an asset anyone can export. The table prints 3.75px next to 8px with nothing to say which of those is usable.',
  },
  relatedTools: ['px-to-rem-converter', 'aspect-ratio-calculator'],
  guide: {
    slug: 'px-to-dp-converter',
    categorySlug: 'design',
    title: 'DP, SP, and PX: Android and iOS Density Units',
    description: 'Understand density-independent pixels, how dp and sp convert to px across Android buckets, and how iOS points compare.',
    readMinutes: 5,
    updatedAt: '2026-07-31',
  },
};
