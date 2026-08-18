import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'color-format-converter',
  name: 'Color Format Converter',
  description: 'Convert colors between HEX, RGB, HSL, HSV, OKLCH, and CMYK instantly.',
  categorySlug: 'design-tools',
  tags: ['color format converter', 'hex to rgb', 'rgb to hex', 'hex to hsl', 'hex to oklch', 'rgb to cmyk', 'color converter', 'css color converter', 'hsl to hex', 'oklch converter'],
  updatedAt: '2026-07-31',
  engine: 'color',
  pattern: 'color-convert',
  family: 'color',
  craft: {
    id: 'cfc-byte-order',
    kind: 'orientation',
    solves: 'An eight-digit hex is RRGGBBAA in CSS and AARRGGBB on Android, so the identical string is two different colours and both readings parse without error. Someone pasting a value out of an Android theme gets a confidently wrong swatch and nothing anywhere says why.',
  },
  relatedTools: ['color-contrast-checker'],
  guide: {
    slug: 'color-format-converter',
    categorySlug: 'design',
    title: 'How Color Formats Work: HEX, RGB, HSL, and OKLCH',
    description: 'Understand what each color format encodes, when to reach for HSL or OKLCH, and how to convert between them without losing accuracy.',
    readMinutes: 5,
    updatedAt: '2026-07-31',
  },
};
