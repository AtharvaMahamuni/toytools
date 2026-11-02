import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'punycode-converter',
  name: 'Punycode Converter',
  seoTitle: 'Punycode Converter — Unicode ⇄ Punycode (xn--) for IDNs',
  description: 'Convert internationalized domain names between Unicode and Punycode (xn--) form, in your browser.',
  tagline: 'Convert domain names between Unicode and Punycode form.',
  categorySlug: 'developer-utilities',
  tags: ['punycode converter', 'punycode', 'idn converter', 'xn-- converter', 'unicode to punycode', 'punycode to unicode', 'internationalized domain name'],
  updatedAt: '2026-07-09',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'web',
  relatedTools: ['slugify-text', 'url-encoder-decoder'],
  processorId: 'punycode',
  craft: {
    id: 'punycode-ace-prefix',
    kind: 'recovery',
    solves:
      'Raw Punycode DNS labels copied without the xn-- ACE prefix fail decoding, so the tool offers to prepend xn-- and decode the domain.',
  },
  toolGroup: 'encoders',
  guide: {
    slug: 'what-is-punycode',
    categorySlug: 'developer-utilities',
    title: 'What Is Punycode',
    description: 'Learn how Punycode lets internationalized domain names work with ASCII-only DNS, and how to convert them.',
    readMinutes: 4,
    updatedAt: '2026-06-28',
  },
};
