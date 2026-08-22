import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'text-repeater',
  title: 'Text Repeater',
  category: 'text-utilities',
  summary: 'Repeat any text a set number of times with a separator you choose, optionally numbered, and get told the size before it becomes a problem.',
  primaryConcepts: ['Repeating text'],
  secondaryConcepts: ['separator', 'numbered list', 'test data', 'padding', 'character limit'],
  intentGroups: {
    informational: ['What is a text repeater for?', 'What separator should I pick?'],
    howTo: ['How to repeat a word many times', 'How to make numbered test data'],
    comparison: ['Repeating text vs generating placeholder text', 'A separator vs no separator'],
    misconception: ['A repeat count is not free', 'Repeated text is not random test data'],
    troubleshooting: ['The output was too large to paste', 'Every copy ran together on one line'],
  },
  realWorldUseCases: [
    'Filling a form field to a known character length while testing a limit',
    'Building a numbered list of placeholder rows for a table mockup',
    'Making a long string to check how a layout handles overflow',
    'Repeating a line of markup or CSV before editing each copy by hand',
  ],
  commonMistakes: [
    'Typing an extra zero into the count and freezing the tab with a multi-megabyte string',
    'Leaving the separator on nothing and getting every copy run together',
    'Using repeated text where the test actually needs varied content',
  ],
  commonQuestions: [
    'How do I repeat a word a hundred times?',
    'How do I number each repeated copy?',
    'Why was my output too big to paste?',
  ],
  usedWith: [
    { slug: 'character-counter', reason: 'Check the repeated text against a character limit', strength: 0.8 },
    { slug: 'find-replace', reason: 'Edit the repeated copies in one pass', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'lorem-ipsum-generator', reason: 'When you want varied filler rather than one line repeated' },
  ],
  nextSteps: [
    { slug: 'character-counter', reason: 'Measure the result against the limit you are testing', strength: 0.7 },
    { slug: 'remove-duplicate-lines', reason: 'Collapse the copies again once you are done', strength: 0.5 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'text repeater',
    'repeat text',
    'repeat a word',
    'duplicate text',
    'repeat a line',
  ],
  entityAliases: ['text multiplier', 'repeat a line'],
  inputs: ['text'],
  outputs: ['text'],
  difficulty: 'beginner',
  audience: ['developers', 'testers', 'writers'],
};
