import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'regex-tester',
  title: 'Regex Tester',
  category: 'developer-utilities',
  summary:
    'Test a JavaScript regular expression against sample text, inspect every match with capture groups, and preview a replace without uploading anything.',
  primaryConcepts: ['regex tester', 'live capture groups', 'regex101 alternative offline'],
  secondaryConcepts: [
    'capture groups',
    'regex flags',
    'named groups',
    'regex replace',
    'catastrophic backtracking',
  ],
  intentGroups: {
    informational: [
      'What is a regex tester?',
      'Which regex flavour does an online tester use?',
      'What do match indices mean in JavaScript?',
    ],
    howTo: [
      'How to test a regular expression online',
      'How to inspect capture groups in a regex match',
      'How to preview a regex replace with named groups',
    ],
    comparison: [
      'Regex tester vs find and replace',
      'JavaScript regex vs PCRE',
    ],
    misconception: [
      'A match count means every group captured something',
      'Online regex tools must upload your text to a server',
    ],
    troubleshooting: [
      'Invalid regular expression syntax error',
      'Pattern blocked as expensive or timed out',
      'Zero-length matches looping in a global regex',
    ],
  },
  realWorldUseCases: [
    'Debugging a validation pattern before shipping it',
    'Checking that named groups capture the right slices of a log line',
    'Previewing a bulk replace before editing a document',
    'Learning how flags like m, s, and u change matching',
  ],
  commonMistakes: [
    'Reading a green match count and skipping empty capture groups',
    'Pasting a PCRE-only construct and expecting JavaScript to accept it',
    'Shipping a nested-quantifier pattern that hangs on crafted input',
  ],
  commonQuestions: [
    'How do I test a regular expression online?',
    'What do the match indices mean?',
    'Can I use named capture groups?',
    'Why was my pattern blocked as expensive?',
    'Is my text uploaded?',
  ],
  usedWith: [
    { slug: 'find-replace', reason: 'Apply the pattern to edit a full document once it looks right', strength: 0.8 },
    { slug: 'text-compare', reason: 'Diff original and replaced text to confirm the edit', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'find-replace', reason: 'Search and replace in a document with optional regex' },
  ],
  nextSteps: [
    { slug: 'find-replace', reason: 'Run the same pattern as a document-wide replace', priority: 1 },
    { slug: 'text-compare', reason: 'Compare before and after the replace preview', priority: 2 },
  ],
  workflowStage: ['analyze', 'transform'],
  keywords: [
    'regex tester',
    'regular expression tester',
    'test regex online',
    'regex match groups',
    'javascript regex',
    'regex replace preview',
  ],
  entityAliases: ['regexp tester', 'live regex matcher', 'regular expression tester'],
  inputs: ['pattern', 'flags', 'text'],
  outputs: ['matches', 'replaced text'],
  difficulty: 'intermediate',
  audience: ['developers', 'data engineers', 'qa'],
};
