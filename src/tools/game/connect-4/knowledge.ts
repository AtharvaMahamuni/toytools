import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'connect-4',
  title: 'Connect 4',
  category: 'games',
  summary:
    'Two people play Connect 4 on one device. The column under the pointer lights up, and the disc drops on release.',
  primaryConcepts: ['connect 4 same device'],
  secondaryConcepts: ['hot seat', 'diagonal of four'],
  intentGroups: {
    informational: ['What is connect 4?', 'Four in a row rules'],
    howTo: ['How to play connect 4 on one phone', 'How the disc drops'],
    comparison: ['Connect 4 vs tic tac toe', 'Hot seat vs a network match'],
    misconception: ['The other color is not a computer', 'A diagonal counts as four'],
    troubleshooting: ['The disc landed in the next column', 'Undo put the score back'],
  },
  realWorldUseCases: [
    'Passing one phone across a table when nobody has paper',
    'Playing a full match without creating an account',
    'Taking back a tap that landed in the wrong column',
    'Checking a diagonal before calling the board a draw',
  ],
  commonMistakes: [
    'Dropping the disc in the column next to the one you aimed at',
    'Reading only the rows and missing a diagonal of four',
    'Refreshing mid-match and expecting the score to still be there',
    'Waiting for a computer to play the other color',
  ],
  commonQuestions: [
    'Can I play Connect 4 against the computer?',
    'How does the disc drop?',
    'Does undo remove the point as well as the disc?',
    'Does rematch wipe the score?',
    'What counts as four in a row?',
    'Why does the column light up before the disc drops?',
  ],
  usedWith: [
    { slug: 'tic-tac-toe', reason: 'Switch to a 3 by 3 board when four in a row is the wrong game', strength: 0.6 },
    { slug: 'coin-flipper', reason: 'Flip for who drops first before the match', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'tic-tac-toe', reason: 'When the win should be three in a row on a small grid' },
  ],
  nextSteps: [
    { slug: 'coin-flipper', reason: 'Flip for the next game after the score is settled', strength: 0.4 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'connect 4 online',
    'connect four two player',
    'play connect 4 same device',
    'connect 4 no download',
    'four in a row game',
  ],
  entityAliases: ['four in a row', 'connect four'],
  inputs: ['move'],
  outputs: ['board'],
  difficulty: 'beginner',
  audience: ['everyone', 'families'],
};
