import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'reverse-text',
  title: 'Reverse Text',
  category: 'text-utilities',
  summary: 'Flip text backwards character by character, reversing the order of every letter while keeping emoji and accents intact.',
  primaryConcepts: ['reverse text'],
  secondaryConcepts: ['backwards text', 'string reversal', 'mirror text', 'character order'],
  intentGroups: {
    informational: ['What does reversing text mean?', 'What is backwards text used for?'],
    howTo: ['How to flip a string backwards', 'How to reverse a word for a puzzle'],
    comparison: ['Reversing the whole text vs reversing each line', 'Reversing characters vs reversing word order'],
    misconception: ['Reversing flips character order, it does not encrypt', 'Whole-text reversal also moves line breaks'],
    troubleshooting: ['Line order changed unexpectedly', 'Emoji stayed intact rather than breaking'],
  },
  realWorldUseCases: [
    'Creating backwards text for puzzles, games, or art',
    'Checking whether a phrase is a palindrome',
    'Producing mirror-style captions for social posts',
    'Quickly inspecting a string from the other end',
  ],
  commonMistakes: [
    'Expecting only the words to reorder instead of every character',
    'Forgetting that reversing the whole block also moves line breaks',
  ],
  commonQuestions: [
    'Does it reverse line order as well?',
    'Will emoji break when reversed?',
    'Is the text sent to a server?',
  ],
  usedWith: [
    { slug: 'uppercase-converter', reason: 'Restyle the flipped text after reversing', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'find-replace', reason: 'Rearrange specific characters instead of reversing all' },
  ],
  nextSteps: [
    { slug: 'kebab-case-converter', reason: 'Reformat the result into another style', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['reverse text', 'backwards text', 'flip text', 'reverse string', 'mirror text'],
  entityAliases: ['text reverser', 'backwards', 'flip text'],
  inputs: ['text'],
  outputs: ['reversed text'],
  difficulty: 'beginner',
  audience: ['writers', 'students', 'social media users'],
};
