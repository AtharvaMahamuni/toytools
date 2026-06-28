import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'remove-line-breaks',
  title: 'Remove Line Breaks',
  category: 'text-utilities',
  summary: 'Join hard-wrapped lines into one paragraph by replacing every run of line breaks with a single space.',
  primaryConcepts: ['remove line breaks'],
  secondaryConcepts: ['strip newlines', 'join lines', 'unwrap text', 'hard returns'],
  intentGroups: {
    informational: ['What is a hard line break?', 'Why does pasted text wrap mid-sentence?'],
    howTo: ['How to join broken lines into a paragraph', 'How to strip newlines from copied PDF text'],
    comparison: ['Removing line breaks vs removing blank lines', 'Joining lines vs normalizing all whitespace'],
    misconception: ['It replaces breaks with one space, not nothing', 'It joins lines rather than deleting empty ones'],
    troubleshooting: ['Words ran together with no space', 'Some intentional paragraph breaks were lost'],
  },
  realWorldUseCases: [
    'Cleaning text copied out of a PDF that wrapped every line',
    'Joining an email quote back into flowing sentences',
    'Unwrapping hard-wrapped code comments or notes',
    'Preparing pasted text before counting or reformatting it',
  ],
  commonMistakes: [
    'Expecting it to keep paragraph breaks (it joins everything into one block)',
    'Confusing it with Remove Blank Lines, which keeps lines separate',
  ],
  commonQuestions: [
    'Will it leave double spaces behind?',
    'How is this different from removing blank lines?',
    'Does it trim the start and end?',
  ],
  usedWith: [
    { slug: 'remove-extra-spaces', reason: 'Tidy any remaining internal spacing after joining', strength: 0.7 },
    { slug: 'remove-blank-lines', reason: 'Drop empty rows when you want lines kept separate instead', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'normalize-whitespace', reason: 'Collapse all whitespace and breaks at once' },
    { slug: 'remove-blank-lines', reason: 'Delete empty rows but keep lines separate' },
  ],
  nextSteps: [
    { slug: 'remove-extra-spaces', reason: 'Collapse leftover internal runs of spaces', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['remove line breaks', 'strip newlines', 'join lines', 'unwrap text', 'delete line breaks'],
  entityAliases: ['line breaks', 'newlines', 'hard returns'],
  inputs: ['text'],
  outputs: ['single-paragraph text'],
  difficulty: 'beginner',
  audience: ['writers', 'students', 'developers'],
};
