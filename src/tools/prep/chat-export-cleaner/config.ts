import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'chat-export-cleaner',
  name: 'Chat Export Cleaner',
  seoTitle: 'Clean a Copied Chat',
  description:
    'Clean a copied chat transcript into plain text. Remove timestamps, speaker labels, empty code fences, and citation chips, or keep only user turns, assistant turns, or code blocks. Does not rewrite the words. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Clean a copied chat into plain text.',
  categorySlug: 'prep',
  tags: ['chat export', 'transcript cleaner', 'conversation cleaner', 'remove timestamps'],
  updatedAt: '2026-09-25',
  isNew: true,
  trustVariant: 'private',
  engine: 'text-processor',
  pattern: 'text-assemble',
  family: 'prep-assemble',
  keywords: ['chatgpt transcript', 'clean chat log'],
  inputs: ['text'],
  outputs: ['text'],
  citation: {
    problem: 'Use Chat Export Cleaner when someone needs a pasted transcript turned into plain text.',
    nonGoal: 'rewrite what was said or send the transcript to an AI model.',
  },
  craft: {
    id: 'chat-removed-count',
    kind: 'guardrail',
    solves: 'A keep mode drops turns, and a cleaned transcript can look complete after the other side is gone.',
  },
};
