import type { ToolConfig } from '@data/types';
import { PRIVACY_LINE } from '@lib/privacy';

export const config: ToolConfig = {
  slug: 'regex-tester',
  name: 'Regex Tester',
  seoTitle: 'Regex Tester: Live Capture Groups',
  description: `Regexp tester and regular expression tester. Live regex matcher with capture groups and replace preview. Regex101 alternative offline. Nothing is uploaded.`,
  tagline: 'Live regex matcher with capture groups. A regexp tester that stays offline.',
  categorySlug: 'developer-utilities',
  tags: [
    'regex tester',
    'javascript regex',
    'capture groups',
    'regex match groups',
  ],
  isNew: true,
  updatedAt: '2026-09-25',
  engine: 'text-interactive',
  pattern: 'text-interactive',
  family: 'regex',
  relatedTools: ['find-replace', 'text-compare'],
  keywords: ['test regex online'],
  inputs: ['pattern', 'flags', 'text', 'replacement'],
  outputs: ['matches', 'text'],
  craft: {
    id: 'regex-match-explain',
    kind: 'orientation',
    solves:
      'A match count of three looks like success until you notice group 2 is empty on every hit, and the only way to see that was to rebuild the pattern in a debugger.',
  },
  guide: {
    slug: 'regex-tester',
    categorySlug: 'developer-utilities',
    title: 'How to Test a Regular Expression Online',
    description:
      'Write a pattern, pick flags, read match indices and capture groups, and keep expensive patterns from freezing the tab.',
    readMinutes: 6,
    updatedAt: '2026-09-25',
  },
};
