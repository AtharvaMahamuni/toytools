import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'password-generator',
  title: 'Password Generator',
  category: 'generate',
  summary:
    'Build strong random passwords in the browser: choose length and character sets, read a live entropy and strength estimate, then copy.',
  primaryConcepts: ['password generation', 'password strength'],
  secondaryConcepts: ['entropy', 'character sets', 'random number generation', 'password managers'],
  intentGroups: {
    informational: [
      'what makes a password strong',
      'how password entropy is measured',
      'why length matters more than complexity',
    ],
    howTo: [
      'generate a strong password',
      'choose a good password length',
      'exclude ambiguous characters',
    ],
    comparison: ['random password vs passphrase', 'length vs complexity'],
    misconception: [
      'symbols always make a password stronger',
      'a short complex password beats a long simple one',
    ],
    troubleshooting: ['password rejected by a site', 'which characters a site allows'],
  },
  realWorldUseCases: [
    'Creating a unique password for a new account',
    'Rotating an old or reused password',
    'Generating a master password for a password manager',
    'Producing a one-off credential for a shared service',
  ],
  commonMistakes: [
    'Reusing the same password across multiple sites',
    'Choosing a short password because it has symbols',
    'Storing generated passwords in a plain text file',
    'Turning off every character set until the pool is tiny',
  ],
  commonQuestions: [
    'How long should a password be?',
    'Is this password generator safe to use?',
    'Does it work offline?',
    'What is entropy and why does it matter?',
    'Should I include symbols?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['transform'],
  keywords: [
    'password generator',
    'random password',
    'strong password',
    'secure password',
    'password entropy',
    'password strength',
  ],
  entityAliases: ['password maker', 'random password generator', 'strong password generator'],
  inputs: ['options'],
  outputs: ['password'],
  difficulty: 'beginner',
  audience: ['everyone', 'developers'],
};
