import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'px-to-dp-converter',
  name: 'PX to DP Converter',
  description: 'Convert px to dp and sp across Android density buckets and iOS points.',
  categorySlug: 'design-tools',
  tags: ['px to dp', 'dp to px', 'px to sp', 'android density', 'density independent pixels', 'dp converter', 'sp to px', 'px to pt ios', 'mdpi hdpi xhdpi', 'android units'],
  updatedAt: '2026-07-31',
  engine: 'units',
  pattern: 'unit-convert',
  family: 'css-unit',
};
