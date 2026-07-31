import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'px-to-rem-converter',
  name: 'PX to REM Converter',
  description: 'Convert px to rem, em, and pt against a configurable root font size.',
  categorySlug: 'design-tools',
  tags: ['px to rem', 'rem to px', 'px to em', 'px to pt', 'css unit converter', 'pixels to rem', 'rem calculator', 'px rem em converter', 'root font size', 'css units'],
  updatedAt: '2026-07-31',
  engine: 'units',
  pattern: 'unit-convert',
  family: 'css-unit',
  guide: {
    slug: 'px-to-rem-converter',
    categorySlug: 'design',
    title: 'PX, REM, and EM: How CSS Units Relate and Convert',
    description: 'Understand how px, rem, em, and pt relate, why the root font size matters, and how to convert between them for accessible, scalable CSS.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
