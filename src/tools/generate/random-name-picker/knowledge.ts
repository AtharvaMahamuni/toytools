import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'random-name-picker',
  title: 'Random Name Picker',
  category: 'generate',
  summary: 'Paste a list of names and draw one or several at random without repeats.',
  primaryConcepts: ['random name picker'],
  secondaryConcepts: ['raffle', 'without replacement', 'duplicate entry', 'classroom draw', 'fair draw'],
  intentGroups: {
    informational: ['What is a fair random draw?', 'Drawing without replacement'],
    howTo: ['How to pick a random name from a list', 'How to draw several winners at once'],
    comparison: ['Picking with repeats vs picking without', 'A name picker vs a spinning wheel'],
    misconception: ['Shuffling twice does not make a draw fairer', 'A repeated name is not a harmless typo'],
    troubleshooting: ['The same person keeps winning', 'My pasted list came out as one entry'],
  },
  realWorldUseCases: [
    'Calling on a student without falling into the same three names every lesson',
    'Drawing three raffle winners from a signup sheet in front of the room',
    'Setting the order for a standup so nobody always goes last',
    'Assigning a rota where each person appears exactly once',
  ],
  commonMistakes: [
    'Leaving a duplicated name in the list, which doubles that person\'s chance',
    'Drawing several winners with repeats allowed and getting the same person twice',
    'Pasting names separated by commas on one line, which reads as a single entry',
  ],
  commonQuestions: [
    'How do I pick a random name from a list?',
    'Can I draw several names without repeats?',
    'Do duplicate names in my list change the odds?',
    'Is my list of names uploaded?',
  ],
  usedWith: [
    { slug: 'remove-duplicate-lines', reason: 'Clean a longer list before drawing from it', strength: 0.8 },
    { slug: 'random-choice-picker', reason: 'Pick between options rather than people', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'random-choice-picker', reason: 'When the list holds options rather than names' },
  ],
  nextSteps: [
    { slug: 'coin-flipper', reason: 'Settle a two-way tiebreak after the draw', strength: 0.4 },
    { slug: 'dice-roller', reason: 'Roll for order once the names are chosen', strength: 0.4 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'random name picker',
    'name picker',
    'pick a random name',
    'raffle picker',
    'classroom name picker',
    'draw names from a list',
  ],
  entityAliases: ['name draw', 'raffle picker'],
  inputs: ['list'],
  outputs: ['name'],
  difficulty: 'beginner',
  audience: ['teachers', 'event organisers', 'team leads'],
};
