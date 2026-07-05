import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'lorem-ipsum-generator',
  title: 'Lorem Ipsum Generator',
  category: 'generate',
  summary:
    'Generate lorem ipsum placeholder text in the browser: choose paragraphs, sentences, or words, set the count, and copy plain text.',
  primaryConcepts: ['lorem ipsum', 'placeholder text'],
  secondaryConcepts: ['dummy text', 'filler text', 'typesetting', 'mockups', 'design comps'],
  intentGroups: {
    informational: [
      'what lorem ipsum is',
      'where lorem ipsum comes from',
      'why designers use placeholder text',
    ],
    howTo: [
      'generate lorem ipsum',
      'generate a set number of paragraphs',
      'generate words instead of paragraphs',
    ],
    comparison: ['lorem ipsum vs real copy', 'lorem ipsum vs random words'],
    misconception: ['lorem ipsum has a hidden meaning', 'placeholder text is production ready'],
    troubleshooting: ['placeholder text shipped to production', 'need a specific word count'],
  },
  realWorldUseCases: [
    'Filling a design mockup before the real copy exists',
    'Testing how a layout handles long and short text',
    'Demonstrating a template or theme',
    'Checking typography and line length in a comp',
  ],
  commonMistakes: [
    'Leaving placeholder text in a shipped page',
    'Using lorem ipsum when real content would reveal layout problems',
    'Assuming the Latin words carry a message',
    'Generating far more text than the layout needs',
  ],
  commonQuestions: [
    'What is lorem ipsum?',
    'Where does it come from?',
    'Why use placeholder text at all?',
    'Can I generate words instead of paragraphs?',
    'Does it work offline?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['transform'],
  keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text', 'filler text'],
  entityAliases: ['dummy text generator', 'placeholder text generator', 'filler text generator'],
  inputs: ['options'],
  outputs: ['placeholder text'],
  difficulty: 'beginner',
  audience: ['designers', 'developers', 'writers'],
};
