import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'tic-tac-toe',
  title: 'Tic Tac Toe',
  category: 'games',
  summary:
    'Two people play tic tac toe on one device. Undo takes back one move, and rematch keeps the session score.',
  primaryConcepts: ['Tic tac toe two player'],
  secondaryConcepts: ['noughts and crosses', 'same device', 'hot seat', 'three in a row'],
  intentGroups: {
    informational: ['What is tic tac toe?', 'Noughts and crosses rules'],
    howTo: ['How to play tic tac toe on one phone', 'How to undo a tic tac toe move'],
    comparison: ['Tic tac toe vs noughts and crosses', 'Hot seat vs online matchmaking'],
    misconception: ['The empty seat is not a computer opponent', 'A diagonal counts as three in a row'],
    troubleshooting: ['A second tap did not place a mark', 'Undo put the score back'],
  },
  realWorldUseCases: [
    'Passing one phone across a table when nobody has paper',
    'Settling a turn order before a longer game',
    'Playing a full match without creating an account',
    'Taking back a tap that landed in the wrong square',
  ],
  commonMistakes: [
    'Expecting the other seat to move by itself',
    'Tapping a filled square again and thinking the game ignored you',
    'Refreshing to start over and assuming the session score will vanish',
    'Missing a diagonal and calling a finished line a draw',
  ],
  commonQuestions: [
    'Can I play against the computer?',
    'What happens if I tap the same square twice?',
    'Does undo remove the point as well as the mark?',
    'Does rematch wipe the score?',
    'Is this the same game as noughts and crosses?',
    'How do we tell X from O without the colors?',
  ],
  usedWith: [
    { slug: 'coin-flipper', reason: 'Flip for who is X before the first game', strength: 0.6 },
    { slug: 'dice-roller', reason: 'Roll for who starts when a coin is the wrong call', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'coin-flipper', reason: 'When the decision is one toss, not a board' },
  ],
  nextSteps: [
    { slug: 'dice-roller', reason: 'Move on to a numbered draw after the match', strength: 0.4 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'tic tac toe online',
    'tic tac toe two player',
    'noughts and crosses',
    'play tic tac toe same device',
    'tic tac toe no download',
    'tic tac toe two player online no account',
  ],
  entityAliases: ['noughts and crosses', 'Xs and Os'],
  inputs: ['move'],
  outputs: ['board'],
  difficulty: 'beginner',
  audience: ['everyone', 'families'],
};
