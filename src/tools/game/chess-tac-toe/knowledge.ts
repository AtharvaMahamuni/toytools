import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'chess-tac-toe',
  title: 'Chess Tac Toe',
  category: 'games',
  summary:
    'Two people play Chess Tac Toe on one device. Place four pieces, then move them. Four in a line wins.',
  primaryConcepts: ['chess tac toe'],
  secondaryConcepts: ['legal move', 'four in a line'],
  intentGroups: {
    informational: ['What is chess tac toe?', 'Chess piece movement on a small board'],
    howTo: ['How to play chess tac toe on one phone', 'How a knight moves'],
    comparison: ['Chess tac toe vs checkmate', 'Placement vs a chess move'],
    misconception: ['Checkmate does not win', 'You cannot capture by placing'],
    troubleshooting: ['The note named an illegal move', 'A capture returned a piece to the hand'],
  },
  realWorldUseCases: [
    'Passing one phone across a table when nobody has a chess set',
    'Playing a full match without creating an account',
    'Learning which square a knight can reach from a corner',
    'Taking back a placement that landed on the wrong square',
  ],
  commonMistakes: [
    'Placing a piece on a square the other player already occupies',
    'Expecting checkmate to end the match',
    'Moving a rook through another piece',
    'Waiting to move until the other player has placed all four',
  ],
  commonQuestions: [
    'Does checkmate win the game?',
    'Can I capture by placing a piece?',
    'When do the pieces start moving?',
    'What happens to a captured piece?',
    'How does a knight move?',
    'Does undo remove a winning line?',
  ],
  usedWith: [
    { slug: 'tic-tac-toe', reason: 'Drop back to plain marks when piece rules are the wrong game', strength: 0.6 },
    { slug: 'connect-4', reason: 'Switch to dropping discs when you want four in a column', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'tic-tac-toe', reason: 'When every empty square is a legal placement' },
  ],
  nextSteps: [
    { slug: 'connect-4', reason: 'Play a gravity board after the piece match', strength: 0.4 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'chess tac toe',
    'chess tic tac toe',
    'hybrid chess tic tac toe',
    'chess piece tic tac toe',
    'play chess tac toe',
    'hybrid board game',
  ],
  entityAliases: ['chess tic tac toe', 'four in a line'],
  inputs: ['move'],
  outputs: ['board'],
  difficulty: 'intermediate',
  audience: ['everyone', 'families'],
};
