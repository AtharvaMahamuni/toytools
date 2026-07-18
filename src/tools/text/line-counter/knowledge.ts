import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'line-counter',
  title: 'Line Counter',
  category: 'text-utilities',
  summary: 'Count the lines in text, including or excluding blank lines, handy for code, CSV, and log files.',
  primaryConcepts: ['line count'],
  secondaryConcepts: ['newline', 'blank line', 'lines of code', 'row count'],
  intentGroups: {
    informational: ['What counts as a line?', 'Are blank lines included?'],
    howTo: ['How to count lines of code', 'How to estimate rows in a CSV paste'],
    comparison: ['Line count vs paragraph count', 'Hard line breaks vs wrapped lines'],
    misconception: ['A trailing newline can add or remove a line', 'Wrapped text is not extra lines'],
    troubleshooting: ['My last line was not counted', 'Blank lines changed the total unexpectedly'],
  },
  realWorldUseCases: [
    'Counting lines of code in a snippet',
    'Estimating the number of rows in pasted CSV data',
    'Checking a log excerpt against a line budget',
    'Respecting a field that limits the number of lines',
  ],
  commonMistakes: [
    'Confusing visually wrapped lines with actual newlines',
    'Forgetting a trailing blank line shifts the count by one',
  ],
  commonQuestions: [
    'Do blank lines count?',
    'How do I count rows in CSV data?',
    'Do wrapped lines count as separate lines?',
  ],
  usedWith: [
    { slug: 'paragraph-counter', reason: 'Compare raw lines against paragraph blocks', strength: 0.6 },
    { slug: 'word-counter', reason: 'Pair line count with overall length', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'paragraph-counter', reason: 'Count blocks separated by blank lines instead' },
    { slug: 'character-counter', reason: 'Measure raw size by character' },
  ],
  nextSteps: [
    { slug: 'remove-blank-lines', reason: 'Drop empty lines to get a clean code or data line count', priority: 1 },
    { slug: 'remove-duplicate-lines', reason: 'Deduplicate rows before counting', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['line counter', 'count lines', 'lines of code', 'number of lines', 'csv row count'],
  entityAliases: ['line count', 'lines', 'loc'],
  inputs: ['text'],
  outputs: ['line count'],
  difficulty: 'beginner',
  audience: ['developers', 'data analysts', 'writers'],
};
