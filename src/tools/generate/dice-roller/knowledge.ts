import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'dice-roller',
  title: 'Dice Roller',
  category: 'generate',
  summary: 'Roll any dice pool by standard notation, see every die and the total, and read how likely that result was against the pool it came from.',
  primaryConcepts: ['Dice notation'],
  secondaryConcepts: ['d20', '2d6', 'modifier', 'dice pool', 'probability distribution'],
  intentGroups: {
    informational: ['What does 2d6 mean?', 'What is dice notation?'],
    howTo: ['How to roll a d20 online', 'How to roll dice with a modifier'],
    comparison: ['2d6 vs 1d12', 'One big die vs several small ones'],
    misconception: ['Dice are not due for a high roll', 'A wider range does not mean a better average'],
    troubleshooting: ['My rolls do not feel random', 'The notation was rejected'],
  },
  realWorldUseCases: [
    'Rolling for a tabletop session when the dice bag is at home',
    'Checking whether a plus two beats a bigger die before committing to a character build',
    'Settling a board game turn on a phone with no dice in the box',
    'Rolling a stat line of 3d6 six times without hunting for a pencil',
  ],
  commonMistakes: [
    'Reading a range as the whole story, when 2d6 and 1d12 share one and behave nothing alike',
    'Believing a run of low rolls makes a high one more likely on the next throw',
    'Writing 2d6+3 as three separate rolls and adding the bonus once per die',
  ],
  commonQuestions: [
    'What does 4d6+2 mean?',
    'Is an online dice roller actually random?',
    'What are the odds of rolling 15 or higher on 2d6+3?',
  ],
  usedWith: [
    { slug: 'coin-flipper', reason: 'The two-outcome version of the same question', strength: 0.7 },
    { slug: 'random-choice-picker', reason: 'Decide between named options rather than numbers', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'random-string-generator', reason: 'When you want random characters rather than a die roll' },
  ],
  nextSteps: [
    { slug: 'probability-calculator', reason: 'Work the odds of a combination rather than one pool', strength: 0.7 },
    { slug: 'random-name-picker', reason: 'Decide who rolls first', strength: 0.4 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'dice roller',
    'roll a dice',
    'd20 roller',
    'roll 2d6',
    'dice notation',
    'virtual dice',
    'online dice roller',
    'dnd dice roller',
  ],
  entityAliases: ['virtual dice', 'online dice'],
  inputs: ['notation'],
  outputs: ['roll total', 'individual dice'],
  difficulty: 'beginner',
  audience: ['tabletop players', 'board gamers', 'teachers'],
};
