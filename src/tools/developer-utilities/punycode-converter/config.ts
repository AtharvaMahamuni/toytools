import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'punycode-converter',
  name: 'Punycode Converter',
  seoTitle: 'Punycode Converter — Unicode ⇄ Punycode (xn--) for IDNs',
  description: 'Convert internationalized domain names between Unicode and Punycode (xn--) form, in your browser.',
  categorySlug: 'developer-utilities',
  tags: ['punycode converter', 'punycode', 'idn converter', 'xn-- converter', 'unicode to punycode', 'punycode to unicode', 'internationalized domain name'],
  updatedAt: '2026-06-28',
  engine: 'encoding',
  pattern: 'encode-decode',
  family: 'web',
  processorId: 'punycode',
  toolGroup: 'encoders',
  guide: {
    slug: 'what-is-punycode',
    categorySlug: 'developer-utilities',
    title: 'What Is Punycode',
    description: 'Learn how Punycode lets internationalized domain names work with ASCII-only DNS, and how to convert them.',
    readMinutes: 4,
    updatedAt: 'Jun 2026',
  },
};
