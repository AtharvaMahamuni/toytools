import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'rot13-encoder-decoder',
  title: 'ROT13 Encoder / Decoder',
  category: 'developer-utilities',
  summary: 'Rotate Latin letters 13 places to encode or decode ROT13 text; the cipher is its own inverse, so one pass does both.',
  primaryConcepts: ['ROT13 cipher'],
  secondaryConcepts: ['caesar cipher', 'letter rotation', 'obfuscation', 'self-inverse'],
  intentGroups: {
    informational: ['What is ROT13?', 'How does the ROT13 cipher work?'],
    howTo: ['How to decode ROT13 text', 'How to hide a spoiler with ROT13'],
    comparison: ['ROT13 vs Caesar cipher', 'ROT13 vs Base64'],
    misconception: ['ROT13 is not encryption', 'Numbers are not rotated by ROT13'],
    troubleshooting: ['Decoded text still looks scrambled', 'Accented letters did not change'],
  },
  realWorldUseCases: [
    'Decoding a spoiler from a forum or newsgroup post',
    'Hiding puzzle hints and geocaching clues',
    'Obscuring quiz answers below the question',
    'Teaching substitution ciphers in a programming exercise',
  ],
  commonMistakes: [
    'Using ROT13 for anything that needs real secrecy',
    'Expecting digits and symbols to be scrambled too',
  ],
  commonQuestions: [
    'What is ROT13?',
    'Is ROT13 encryption?',
    'Why are encoding and decoding the same operation?',
  ],
  usedWith: [
    { slug: 'base64-encoder-decoder', reason: 'Stack casual obfuscation onto binary-safe transport encoding', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'reverse-text', reason: 'An even simpler way to hide text from a casual glance' },
    { slug: 'base64-encoder-decoder', reason: 'Obscures all characters, not just letters' },
  ],
  nextSteps: [
    { slug: 'binary-text-converter', reason: 'See how the same text looks as raw bits', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['rot13', 'rot13 decoder', 'rot13 encoder', 'caesar cipher', 'rot13 translator'],
  entityAliases: ['rot13', 'rot-13', 'rotate by 13'],
  inputs: ['plain text', 'rot13 text'],
  outputs: ['rotated text'],
  difficulty: 'beginner',
  audience: ['developers', 'puzzle solvers'],
};
