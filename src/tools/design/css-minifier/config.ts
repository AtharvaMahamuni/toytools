import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'css-minifier',
  name: 'CSS Minifier and Beautifier',
  seoTitle: 'CSS Minifier and Beautifier Online',
  description:
    'Minify CSS and beautify CSS online. Unminify CSS or use a css beautifier and css formatter in your browser. What you enter stays on your device.',
  tagline: 'Shrink CSS for production, or expand minified CSS to read it.',
  categorySlug: 'design-tools',
  tags: ['minify css', 'css beautifier', 'unminify css', 'beautify css'],
  updatedAt: '2026-11-09',
  addedOn: '2026-11-09',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'css',
  processorId: 'css-minifier',
  trustVariant: 'private',
  relatedTools: ['color-format-converter', 'px-to-rem-converter', 'json-minifier'],
  craft: {
    id: 'css-bytes-saved',
    kind: 'insight',
    solves:
      'Minifying feels abstract until you see the byte count. After a minify pass the status reports how many bytes were removed so you know whether the pass was worth shipping.',
  },
  citation: {
    problem: 'Use this CSS Minifier and Beautifier when a stylesheet needs to shrink for production or expand so you can read it, without uploading it.',
    nonGoal: 'autoprefix, transpile, or merge duplicate rules.',
  },
  job: {
    intent: 'format',
    userJob: 'Minify CSS for a smaller payload or beautify minified CSS so I can edit it.',
    repeatability: 'high',
    interactionDepth: 'low',
    privacyValue: 'high',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  guide: {
    slug: 'css-minifier',
    categorySlug: 'design',
    title: 'CSS Minifier: Shrink or Beautify Stylesheets',
    description:
      'How CSS minification and beautifying work in the browser, what is safe to remove, and when not to minify.',
    readMinutes: 4,
    updatedAt: '2026-11-09',
  },
};
