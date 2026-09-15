import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'word-counter',
  name: 'Word Counter',
  seoTitle: 'Word Counter Online',
  // Covers the two intents people actually arrive with ("how many words", "essay length"), which
  // the old one-clause version reached in body copy only and therefore scored 0 on targeting. It
  // is also simply more accurate now: the tool has a word goal, so saying so is description, not
  // keyword stuffing. See docs/analysis/2026-08-04-query-to-tool-matching-audit.md.
  description: 'Count how many words, characters, sentences, and paragraphs; check an essay length as you type. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Count words as you type, and set a goal to write to.',
  categorySlug: 'text-utilities',
  tags: ['text', 'count', 'words', 'characters', 'count words online', 'word count checker', 'character counter', 'words in text', 'online word counter free', 'word count tool', 'word counter online', 'reading time calculator'],
  isNew: true,
  updatedAt: '2026-06-02',
  engine: 'text-analysis',
  pattern: 'text-metric',
  toolGroup: 'text-counters',
  family: 'text-counting',
  primaryMetric: {
    metric: 'words',
    label: 'Words',
    formatter: 'integer',
  },
  relatedTools: ['character-counter', 'reading-time-calculator', 'sentence-counter'],
  craft: {
    id: 'wc-goal',
    kind: 'verification',
    solves: 'Nobody counts words for the number itself: they are writing to a limit, and without a target on screen the count has to be checked against a figure held in the head.',
  },
  guide: {
    slug: 'how-to-count-words-in-your-writing',
    categorySlug: 'text',
    title: 'How to Count Words in Your Writing',
    description: 'How word count works, why tools disagree, and how to write to a limit. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-06-02',
  },};
