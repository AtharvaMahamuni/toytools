import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'binary-text-converter',
  title: 'Binary Text Converter',
  category: 'developer-utilities',
  summary: 'Convert text to 8-bit binary and back. A readable view of how characters are stored as bytes.',
  primaryConcepts: ['binary encoding'],
  secondaryConcepts: ['bits and bytes', 'utf-8', 'ascii', 'base-2', 'character codes'],
  intentGroups: {
    informational: ['What is binary?', 'Why is each character eight bits?'],
    howTo: ['How to convert text to binary', 'How to decode binary back to text'],
    comparison: ['Binary vs hexadecimal', 'Binary vs Base64'],
    misconception: ['Binary is a representation, not encryption', 'A "character" can be more than one byte'],
    troubleshooting: ['Bit count is not a multiple of 8', 'Non-ASCII characters produce extra bytes'],
  },
  realWorldUseCases: [
    'Teaching or learning how computers store text',
    'Inspecting the exact byte layout of a string',
    'Solving puzzles or CTF challenges that hide text in binary',
    'Sanity-checking how a character is encoded in UTF-8',
  ],
  commonMistakes: [
    'Pasting a bit count that is not a multiple of eight',
    'Assuming one character is always one byte (UTF-8 uses more for accents and emoji)',
  ],
  commonQuestions: [
    'Why does each character become eight digits?',
    'Why do accented letters and emoji produce more bytes?',
    'Is binary a form of encryption?',
  ],
  usedWith: [
    { slug: 'hex-encoder-decoder', reason: 'See the same bytes in base-16 instead of base-2', strength: 0.7 },
    { slug: 'base64-encoder-decoder', reason: 'Encode the same data for transport', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'hex-encoder-decoder', reason: 'A more compact byte view (two digits per byte)' },
    { slug: 'base64-encoder-decoder', reason: 'Encode bytes as ASCII text for transport' },
  ],
  nextSteps: [
    { slug: 'hex-encoder-decoder', reason: 'Switch to hex for a shorter byte dump', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['text to binary', 'binary to text', 'binary translator', 'ascii to binary', '8-bit binary'],
  entityAliases: ['binary', 'binary code', 'base 2'],
  inputs: ['text'],
  outputs: ['binary (0s and 1s)'],
  difficulty: 'beginner',
  audience: ['students', 'developers', 'puzzle solvers'],
};
