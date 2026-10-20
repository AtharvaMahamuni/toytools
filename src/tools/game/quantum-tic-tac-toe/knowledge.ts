import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'quantum-tic-tac-toe',
  title: 'Quantum Tic Tac Toe',
  category: 'games',
  summary:
    'Two people play quantum tic tac toe on one device. Each move marks two squares, and the other player chooses the collapse.',
  primaryConcepts: ['quantum tic tac toe'],
  secondaryConcepts: ['entanglement', 'classical mark'],
  intentGroups: {
    informational: ['What is quantum tic tac toe?', 'Entanglement on a 3 by 3 board'],
    howTo: ['How to play quantum tic tac toe on one phone', 'How a cycle collapses'],
    comparison: ['Quantum tic tac toe vs classical tic tac toe', 'A spooky line vs a classical line'],
    misconception: ['A spooky three in a row does not win', 'The page does not teach the mathematics'],
    troubleshooting: ['The note refused a classical square', 'Undo restored the entanglement'],
  },
  realWorldUseCases: [
    'Passing one phone across a table when the rules are easy to argue',
    'Playing a full match without creating an account',
    'Seeing which squares a move linked before anyone calls a win',
    'Taking back a collapse that the other player wants to reconsider',
  ],
  commonMistakes: [
    'Marking one square and expecting a classical X or O',
    'Treating a spooky three in a row as a win',
    'Closing a cycle and then choosing the collapse yourself',
    'Refreshing mid-match and expecting the score to still be there',
  ],
  commonQuestions: [
    'What is a move in quantum tic tac toe?',
    'Who chooses the collapse?',
    'Does a spooky three in a row win?',
    'What if both players get a line from one collapse?',
    'Can I mark a square that already collapsed?',
    'Does undo restore the links?',
  ],
  usedWith: [
    { slug: 'tic-tac-toe', reason: 'Play the classical board when one mark per square is enough', strength: 0.7 },
    { slug: 'coin-flipper', reason: 'Flip for who is X before the first pair of squares', strength: 0.4 },
  ],
  alternatives: [
    { slug: 'tic-tac-toe', reason: 'When a move should mark one square and stay there' },
  ],
  nextSteps: [
    { slug: 'coin-flipper', reason: 'Flip for the next game after the score is settled', strength: 0.3 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'quantum tic tac toe',
    'quantum tic-tac-toe play',
    'entanglement tic tac toe',
    'quantum noughts and crosses',
    'play quantum tic tac toe',
  ],
  entityAliases: ['quantum noughts and crosses', 'entanglement'],
  inputs: ['move'],
  outputs: ['board'],
  difficulty: 'intermediate',
  audience: ['everyone', 'students'],
};
