import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'color-contrast-checker',
  name: 'WCAG Color Contrast Checker',
  description: 'Check text and background colors against WCAG AA and AAA contrast.',
  categorySlug: 'design-tools',
  tags: ['color contrast checker', 'wcag contrast checker', 'contrast ratio calculator', 'aa contrast', 'aaa contrast', 'accessible color contrast', 'text contrast checker', 'a11y contrast', 'wcag aa', 'wcag aaa'],
  updatedAt: '2026-07-31',
  engine: 'color',
  pattern: 'color-contrast',
  family: 'color',
  relatedTools: ['color-format-converter'],
  guide: {
    slug: 'color-contrast-checker',
    categorySlug: 'design',
    title: 'WCAG Contrast Explained: AA, AAA, and Readable Color',
    description: 'Learn how the WCAG contrast ratio is measured, what the AA and AAA thresholds mean for normal and large text, and how to fix a failing pair.',
    readMinutes: 5,
    updatedAt: '2026-07-31',
  },
};
