import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'llms-txt-generator',
  name: 'llms.txt Generator',
  seoTitle: 'Generate an llms.txt File',
  description:
    'Write a short llms.txt site description. Empty sections are left out. Not an official standard. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'A short site description. Empty sections left out.',
  categorySlug: 'prep',
  tags: ['llms.txt', 'llms txt', 'site description', 'crawler file'],
  updatedAt: '2026-09-25',
  isNew: true,
  trustVariant: 'private',
  engine: 'text-processor',
  pattern: 'text-assemble',
  family: 'prep-assemble',
  keywords: ['llms.txt generator', 'llmstxt'],
  inputs: ['text'],
  outputs: ['text'],
  relatedTools: ['prompt-packer'],
  guide: {
    slug: 'what-is-llms-txt',
    categorySlug: 'prep',
    title: 'What Is llms.txt?',
    description: 'A short site description in the layout ToyTools publishes. Not an official standard. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-09-25',
  },
  citation: {
    problem: 'Use the llms.txt Generator when someone needs a short site description file for crawlers and assistants.',
    nonGoal: 'publish the file for you or claim the layout is an official standard.',
  },
  craft: {
    id: 'llms-omit-empty',
    kind: 'guardrail',
    solves: 'An empty Contact or Tools heading in the file reads like a section the author forgot to fill in.',
  },
};
