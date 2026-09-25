import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'context-fit-checker',
  name: 'Context Fit Checker',
  seoTitle: 'Estimate Prompt Context Usage',
  description:
    'Estimate whether text fits a model context window. Tokens are characters divided by 4, rounded up, compared with a window copied from the vendor page named on this tool. This is an estimate, not an official tokenizer count. Runs entirely on your device. Nothing is uploaded.',
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
