import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'coin-flipper',
  title: 'Coin Flipper',
  category: 'generate',
  summary: 'Flip a fair coin once or hundreds of times, tally heads against tails, and read how ordinary a lopsided run actually is.',
  primaryConcepts: ['Coin flip'],
  secondaryConcepts: ['heads or tails', 'coin toss', 'streak', 'fair coin', 'sample size'],
  intentGroups: {
    informational: ['What is a fair coin flip?', 'Heads or tails odds'],
    howTo: ['How to flip a coin online', 'How to flip a coin many times'],
    comparison: ['Digital coin toss vs a real coin', 'Coin flip vs a dice roll'],
    misconception: ['A streak does not mean the coin is broken', 'Tails is not due after four heads'],
    troubleshooting: ['The results look lopsided', 'Every flip returns the same side'],
  },
  realWorldUseCases: [
    'Settling who goes first when nobody has a coin in their pocket',
    'Turning a stuck decision into a yes or no answer you can react to',
    'Showing a class what a hundred flips look like against what they expected',
    'Running a fair tiebreak in a meeting where everybody can watch the screen',
  ],
  commonMistakes: [
    'Reading a run of heads as proof the generator is broken',
    'Believing tails becomes more likely after several heads in a row',
    'Judging fairness from ten flips, which is far too small a sample to show it',
  ],
  commonQuestions: [
    'Is a digital coin flip really fifty fifty?',
    'Why did I get eight heads out of ten?',
    'How many flips do I need before the split looks even?',
  ],
  usedWith: [
    { slug: 'dice-roller', reason: 'The many-outcome version of the same question', strength: 0.7 },
    { slug: 'random-choice-picker', reason: 'When there are more than two options on the table', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'random-choice-picker', reason: 'Pick between named options rather than two sides' },
  ],
  nextSteps: [
    { slug: 'probability-calculator', reason: 'Work out the odds of a longer sequence', strength: 0.6 },
    { slug: 'random-name-picker', reason: 'Decide which person, not which side', strength: 0.5 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'coin flip',
    'flip a coin',
    'heads or tails',
    'coin toss',
    'random yes or no',
    'virtual coin',
    'online coin flip',
  ],
  entityAliases: ['coin toss', 'heads or tails'],
  inputs: ['count'],
  outputs: ['side', 'tally'],
  difficulty: 'beginner',
  audience: ['everyone', 'teachers', 'board gamers'],
};
