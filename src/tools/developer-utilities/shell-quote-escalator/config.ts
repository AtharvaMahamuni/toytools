import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'shell-quote-escalator',
  name: 'Shell Quote Escalator',
  seoTitle: 'Shell Quote Escalator - Nested Quotes for ssh and docker',
  description:
    'Escape quotes for an ssh command crossing shell quoting layers: sudo, bash -c, docker exec. See the string each layer gets, including paths with spaces.',
  tagline: 'Escape a command for every shell between you and the far end.',
  categorySlug: 'developer-utilities',
  tags: [
    'shell quoting',
    'escape quotes ssh',
    'nested quotes bash',
    'ssh command quoting',
    'sudo sh -c quoting',
    'docker exec quoting',
    'shlex quote online',
    'bash escape single quotes',
    'quote command remote shell',
    'shell escaping tool',
  ],
  isNew: true,
  updatedAt: '2026-08-16',
  engine: 'text-interactive',
  pattern: 'text-interactive',
  family: 'shell-quoting',
  relatedTools: ['json-escape', 'url-encoder-decoder', 'html-entity-encoder-decoder'],

  // The ladder shows what each layer receives, which answers "is my quoting deep enough". It cannot
  // answer the other question the same output raises, because both answers look identical on screen.
  craft: {
    id: 'shell-expansion-points',
    kind: 'orientation',
    solves:
      'Single quoting protects $HOME, globs and backticks instead of expanding them, so they resolve against the far end rather than this machine, and the quoted output looks exactly the same either way.',
  },

  guide: {
    slug: 'shell-quote-escalator',
    categorySlug: 'developer-utilities',
    title: 'How Shell Quoting Works Across ssh, sudo and docker',
    description:
      'Why each shell in the path eats one level of quoting, and how to work out how many levels a command needs.',
    readMinutes: 6,
    updatedAt: 'Aug 2026',
  },
};
