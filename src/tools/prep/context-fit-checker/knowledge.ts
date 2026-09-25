import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'context-fit-checker',
  title: 'Context Fit Checker',
  category: 'prep',
  summary: 'Estimate context use as characters divided by 4 against a context window copied from a vendor page.',
  primaryConcepts: ['context window'],
  secondaryConcepts: ['token estimate', 'characters per token', 'prompt length'],
  intentGroups: {
    informational: ['What is a context window?', 'Why is characters divided by 4 only an estimate?'],
    howTo: ['How to estimate whether a prompt fits', 'How to read the source note on a model row'],
    comparison: ['An estimate vs an official tokenizer', 'Character count vs token count'],
    misconception: ['The percent is not an official token count', 'The page does not recommend a model'],
    troubleshooting: ['The estimate says it fits but the model rejects the prompt', 'A model I want is not in the list'],
  },
  realWorldUseCases: [
    'Checking a long draft before pasting it into a model with a published window',
    'Seeing that a character count and a token estimate are different numbers',
    'Reading which vendor page a window was copied from',
  ],
  commonMistakes: [
    'Treating the estimate as the model\'s own tokenizer',
    'Ignoring the date on the source note after a model update',
    'Expecting a price',
  ],
  commonQuestions: [
    'Is the token count exact?',
    'Where do the context windows come from?',
    'Is my text uploaded?',
  ],
  usedWith: [
    { slug: 'character-counter', reason: 'See the character count the estimate starts from', strength: 0.6 },
    { slug: 'word-counter', reason: 'Count words in the same draft', strength: 0.4 },
    { slug: 'prompt-packer', reason: 'Assemble the draft this estimate is about', strength: 0.5 },
  ],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['analyze'],
  keywords: ['context window', 'token estimate'],
  entityAliases: ['context window checker'],
  inputs: ['text'],
  outputs: ['metric'],
  difficulty: 'beginner',
  audience: ['anyone pasting a long prompt'],
};
