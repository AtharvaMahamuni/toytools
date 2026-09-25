import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'context-fit-checker',
  name: 'Context Fit Checker',
  seoTitle: 'Estimate Prompt Context Usage',
  description:
    'Estimate context use as characters divided by 4 against a published window. Not a tokenizer count. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'An estimate of context use. Not a tokenizer.',
  categorySlug: 'prep',
  tags: ['context window', 'token estimate', 'prompt length', 'context fit'],
  updatedAt: '2026-09-25',
  isNew: true,
  trustVariant: 'private',
  engine: 'text-processor',
  pattern: 'text-assemble',
  family: 'prep-assemble',
  keywords: ['context window checker', 'prompt tokens'],
  inputs: ['text'],
  outputs: ['metric'],
  relatedTools: ['word-counter', 'character-counter', 'prompt-packer'],
  guide: {
    slug: 'what-is-a-context-window',
    categorySlug: 'prep',
    title: 'What Is a Context Window?',
    description: 'A context window is a published token capacity. This page estimates it as characters divided by 4. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-09-25',
  },
  methodology: {
    name: 'Characters divided by 4',
    detail: 'Estimated tokens are the character count divided by 4, rounded up. The context window is the number on the vendor page cited for that model.',
  },
  citation: {
    problem: 'Use Context Fit Checker when someone needs a rough sense of whether a draft fits a published context window.',
    nonGoal: 'count official tokens or recommend a model.',
  },
  craft: {
    id: 'context-estimate-only',
    kind: 'guardrail',
    solves: 'A percent next to a context window reads like a tokenizer result, and characters divided by 4 is not one.',
  },
};
