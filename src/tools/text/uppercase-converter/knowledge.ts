import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'uppercase-converter',
  title: 'Uppercase Converter',
  category: 'text-utilities',
  summary: 'Convert any text to ALL UPPERCASE, for headings, acronyms, constants, and emphasis.',
  primaryConcepts: ['uppercase'],
  secondaryConcepts: ['all caps', 'capitalization', 'letter case', 'text-transform'],
  intentGroups: {
    informational: ['What is uppercase text?', 'When should text be all caps?'],
    howTo: ['How to make text all uppercase', 'How to convert a heading to caps without retyping'],
    comparison: ['Uppercase vs title case', 'CSS text-transform vs converting the actual text'],
    misconception: ['All caps can hurt readability for long passages', 'Uppercasing is locale-sensitive in some languages'],
    troubleshooting: ['Accented letters did not uppercase as expected', 'CSS made it look caps but the text was unchanged'],
  },
  realWorldUseCases: [
    'Formatting headings or labels that must be all caps',
    'Writing constant names like MAX_SIZE in code',
    'Standardizing acronyms pasted in mixed case',
    'Adding emphasis to a short call-to-action',
  ],
  commonMistakes: [
    'Using all caps for long paragraphs, which slows reading',
    'Relying on CSS text-transform when the stored value must actually be uppercase',
  ],
  commonQuestions: [
    'Should I use CSS text-transform: uppercase or convert the text itself?',
    'Is converting text to uppercase the same in every language?',
    'Why did accented letters not uppercase as I expected?',
  ],
  usedWith: [
    { slug: 'lowercase-converter', reason: 'Flip back to lowercase when needed', strength: 0.6 },
    { slug: 'trim-text', reason: 'Trim stray edges before forcing case', strength: 0.4 },
  ],
  alternatives: [
    { slug: 'lowercase-converter', reason: 'Convert to lowercase instead' },
    { slug: 'title-case-converter', reason: 'Capitalize each word rather than every letter' },
  ],
  nextSteps: [
    { slug: 'remove-extra-spaces', reason: 'Tidy spacing after combining or pasting caps text', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['uppercase converter', 'all caps', 'capitalize all letters', 'text to uppercase', 'caps lock text'],
  entityAliases: ['uppercase', 'all caps', 'capitals'],
  inputs: ['text'],
  outputs: ['uppercase text'],
  difficulty: 'beginner',
  audience: ['writers', 'developers', 'designers'],
};
