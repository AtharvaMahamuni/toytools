import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'chat-export-cleaner',
  name: 'Chat Export Cleaner',
  seoTitle: 'Clean a Copied Chat',
  description:
    'A conversation cleaner for a copied chat. Strips timestamps and labels. Does not rewrite the words. Runs entirely on your device. Nothing is uploaded.',
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
  relatedTools: ['prompt-packer', 'context-fit-checker', 'find-replace'],
  guide: {
    slug: 'how-to-clean-a-chat-export',
    categorySlug: 'prep',
    title: 'How to Clean a Chat Export',
    description: 'Strip timestamps and speaker labels from a copied chat. The page does not rewrite it. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-09-25',
  },
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
