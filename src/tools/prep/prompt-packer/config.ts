import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'prompt-packer',
  name: 'Prompt Packer',
  seoTitle: 'Assemble a Structured Prompt',
  description:
    'Assemble a structured prompt from role, task, context, constraints, and output format. Markdown sections or XML-style tags. Empty fields are left out. Assembles the prompt. Does not write it. Runs entirely on your device. Nothing is uploaded.',
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
