import type { Tool } from './types';

export const tools: Tool[] = [
  {
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in any text.',
    categorySlug: 'text-utilities',
    tags: ['text', 'count', 'words', 'characters'],
    isNew: true,
    updatedAt: '2026-06-02',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, and more.',
    categorySlug: 'text-utilities',
    tags: ['text', 'case', 'transform'],
    updatedAt: '2026-06-02',
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages, percentage change, and percentage of totals.',
    categorySlug: 'number-utilities',
    tags: ['numbers', 'percentage', 'math', 'calculate'],
    updatedAt: '2026-06-02',
  },
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder & Decoder',
    seoTitle: 'Base64 Encoder & Decoder — Free Online Tool',
    description: 'Encode and decode Base64 strings instantly in your browser. Fast, private, and free.',
    categorySlug: 'developer-tools',
    tags: ['base64', 'encode', 'decode', 'developer', 'base64 encoder', 'base64 decoder', 'base64 converter', 'online base64'],
    isNew: true,
    updatedAt: '2026-06-02',
  },
];
