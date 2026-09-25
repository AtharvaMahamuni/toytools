import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'llms-txt-generator',
  name: 'llms.txt Generator',
  seoTitle: 'Generate an llms.txt File',
  description:
    'Generate a concise machine-readable site description. Site name, purpose, and optional links, contact, usage, and crawler notes. Same H1 and blockquote layout ToyTools publishes. Empty sections are left out. This is not a claim that the layout is an official standard. Runs entirely on your device. Nothing is uploaded.',
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
