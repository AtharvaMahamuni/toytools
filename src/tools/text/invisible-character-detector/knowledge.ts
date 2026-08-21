import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'invisible-character-detector',
  title: 'Invisible Character Detector',
  category: 'text-utilities',
  summary: 'Find zero-width spaces, non-breaking spaces, smart quotes and lookalike letters, see where each one sits, and get the text back without them.',
  primaryConcepts: ['Invisible characters'],
  secondaryConcepts: ['zero-width space', 'homoglyph', 'non-breaking space', 'bidi override', 'unicode'],
  intentGroups: {
    informational: ['What is a zero-width space?', 'Why does my string not match?'],
    howTo: ['How to find invisible characters in text', 'How to remove a zero-width space'],
    comparison: ['Space vs non-breaking space', 'A typo vs a homoglyph'],
    misconception: ['Trim does not remove every kind of space', 'Identical-looking text is not identical text'],
    troubleshooting: ['Exact match fails on identical strings', 'CSS class stops matching after a paste', 'A lookalike letter passed review'],
  },
  realWorldUseCases: [
    'Finding why an exact-match lookup fails on text copied out of a PDF',
    'Tracking down a CSS class that stopped matching after a paste from a word processor',
    'Checking a domain or username for letters from another script before trusting it',
    'Cleaning smart quotes out of a snippet before pasting it into code',
  ],
  commonMistakes: [
    'Assuming trim() removes every kind of space, when a no-break space survives it',
    'Blaming database collation for a mismatch caused by a copied character',
    'Treating a lookalike letter as a typo when it is a deliberate substitution',
  ],
  commonQuestions: [
    'Why do two identical-looking strings not match?',
    'Why did trim() not remove it?',
    'What is a homoglyph, and why is it flagged as dangerous?',
  ],
  usedWith: [
    { slug: 'normalize-whitespace', reason: 'Collapse the spacing once the odd characters are gone', strength: 0.8 },
    { slug: 'text-compare', reason: 'Diff the two strings that would not match', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'normalize-whitespace', reason: 'Go straight there when the problem is only spacing' },
  ],
  nextSteps: [
    { slug: 'normalize-whitespace', reason: 'Tidy the spacing after removing hidden characters', strength: 0.8 },
    { slug: 'slugify-text', reason: 'Turn the cleaned text into a safe identifier', strength: 0.5 },
  ],
  workflowStage: ['validate', 'analyze'],
  keywords: [
    'invisible character detector',
    'find invisible characters',
    'zero width space',
    'why does my string not match',
    'non breaking space',
    'detect homoglyph',
    'hidden characters in text',
    'remove zero width space',
  ],
  entityAliases: ['homoglyph checker'],
  inputs: ['text'],
  outputs: ['character list', 'cleaned text'],
  difficulty: 'intermediate',
  audience: ['developers', 'writers'],
};
