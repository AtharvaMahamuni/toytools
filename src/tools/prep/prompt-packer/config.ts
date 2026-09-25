import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'prompt-packer',
  name: 'Prompt Packer',
  seoTitle: 'Assemble a Structured Prompt',
  description:
    'A prompt builder for role, task, context, and constraints. Does not write the prompt. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Assembles a prompt from fields. Does not write it.',
  categorySlug: 'prep',
  tags: ['prompt', 'prompt packer', 'structured prompt', 'prompt template', 'prompt fields'],
  updatedAt: '2026-09-25',
  isNew: true,
  trustVariant: 'private',
  engine: 'text-processor',
  pattern: 'text-assemble',
  family: 'prep-assemble',
  keywords: ['prompt builder', 'prompt template', 'structured prompt'],
  inputs: ['text'],
  outputs: ['text'],
  relatedTools: ['context-fit-checker', 'word-counter', 'character-counter'],
  guide: {
    slug: 'how-to-structure-a-prompt',
    categorySlug: 'prep',
    title: 'How to Structure a Prompt',
    description: 'Join role, task, context, and constraints into one prompt. The page does not write it. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-09-25',
  },
  citation: {
    problem: 'Use Prompt Packer when someone needs separate prompt fields joined into one block, without a model writing the text.',
    nonGoal: 'write, score, or rewrite the prompt, and it does not send the text to an AI model.',
  },
  craft: {
    id: 'prompt-omit-empty',
    kind: 'guardrail',
    solves: 'An empty field printed as a heading reads like an instruction the person forgot to fill in.',
  },
};
