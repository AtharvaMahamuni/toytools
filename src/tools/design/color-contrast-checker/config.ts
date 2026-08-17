import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'color-contrast-checker',
  name: 'WCAG Color Contrast Checker',
  description: 'Check the contrast ratio of text and background colors against WCAG AA and AAA, and find accessible colors that pass.',
  tagline: 'Check text and background against WCAG AA and AAA contrast.',
  categorySlug: 'design-tools',
  tags: ['color contrast checker', 'wcag contrast checker', 'contrast ratio calculator', 'aa contrast', 'aaa contrast', 'accessible color contrast', 'text contrast checker', 'a11y contrast', 'wcag aa', 'wcag aaa'],
  updatedAt: '2026-07-31',
  engine: 'color',
  pattern: 'color-contrast',
  family: 'color',
  relatedTools: ['color-format-converter'],
  methodology: {
    name: 'WCAG 2.x relative luminance',
    detail: 'Contrast is the WCAG ratio built from relative luminance, checked against the 4.5:1 and 7:1 thresholds rather than eyeballed.',
  },
  craft: {
    id: 'ccc-suggest',
    kind: 'continuation',
    solves: 'A contrast checker that says "fails AA" and stops leaves the only question that matters unanswered, which is what colour would pass; picking one by hand means nudging a hex value and re-checking.',
  },
  guide: {
    slug: 'color-contrast-checker',
    categorySlug: 'design',
    title: 'WCAG Contrast Explained: AA, AAA, and Readable Color',
    description: 'Learn how the WCAG contrast ratio is measured, what the AA and AAA thresholds mean for normal and large text, and how to fix a failing pair.',
    readMinutes: 5,
    updatedAt: '2026-07-31',
  },
};
