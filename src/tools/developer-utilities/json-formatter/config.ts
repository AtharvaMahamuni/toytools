import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'json-formatter',
  name: 'JSON Formatter',
  seoTitle: 'JSON Formatter Online',
  description: 'Format and beautify JSON online with clear indentation. Pretty print or prettify for a readable layout. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Pretty-print JSON with proper indentation.',
  categorySlug: 'developer-utilities',
  tags: ['json formatter', 'json beautifier', 'format json', 'pretty print json', 'json pretty', 'json indent', 'beautify json', 'json online', 'developer'],
  isNew: true,
  updatedAt: '2026-09-24',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'json',
  processorId: 'json-formatter',
  toolGroup: 'json-tools',
  relatedTools: ['json-minifier', 'json-validator'],
  craft: {
    id: 'json-formatter-repair',
    kind: 'recovery',
    solves: 'JSON.parse names a character offset the user has to count to by hand, and the two commonest causes are not their mistake at all: a trailing comma that is legal in JavaScript, and the smart quotes a word processor inserts silently.',
  },
  citation: {
    problem: 'Use this JSON Formatter when someone needs to format or inspect JSON without uploading it.',
    nonGoal: 'call an AI model or interpret what the data means.',
  },
  guide: {
    slug: 'what-is-json-formatting',
    categorySlug: 'developer-utilities',
    title: 'What Is JSON Formatting?',
    description: 'What JSON formatting does, why pretty-print and minify keep the same data, and when to use each. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-09-24',
  },
};
