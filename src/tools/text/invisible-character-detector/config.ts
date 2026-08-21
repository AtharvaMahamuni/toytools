import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'invisible-character-detector',
  name: 'Invisible Character Detector',
  seoTitle: 'Invisible Character Detector: Find Zero-Width Spaces',
  description: 'Why does my string not match? Find the invisible character breaking your text: zero-width spaces, non-breaking spaces, smart quotes and homoglyphs. Remove them.',
  tagline: 'Find the character you cannot see that is breaking your text.',
  categorySlug: 'text-utilities',
  tags: ['invisible character detector', 'zero width space', 'find invisible characters', 'why does my string not match', 'non breaking space', 'detect homoglyph', 'hidden characters in text', 'remove zero width space'],
  updatedAt: '2026-08-21',
  isNew: true,
  trustVariant: 'private',
  engine: 'text-processor',
  pattern: 'text-inspect',
  family: 'detect',
  craft: {
    id: 'ic-spoof',
    kind: 'guardrail',
    solves:
      'A Cyrillic letter that renders identically to its ASCII twin passes every visual review, which is how lookalike domains and Trojan Source commits get approved. Pointing at the character is not enough when it is wearing another letter’s face: the reader needs to be told that the text mixes scripts, and that mixing scripts this way is a technique rather than a typo.',
  },
  relatedTools: ['normalize-whitespace', 'text-compare', 'remove-line-breaks'],
  guide: {
    slug: 'find-invisible-characters',
    categorySlug: 'text',
    title: 'How to Find Invisible Characters in Text',
    description: 'Why two identical-looking strings fail an exact-match comparison, which invisible characters cause it, and how to spot a lookalike letter before you approve it.',
    readMinutes: 5,
    updatedAt: '2026-08-21',
  },
};
