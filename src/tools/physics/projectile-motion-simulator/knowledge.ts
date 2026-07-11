import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'projectile-motion-simulator',
  title: 'Projectile Motion Simulator',
  category: 'physics',
  summary: 'Drag to aim a launch and watch the parabola fly while range, peak height, and time of flight update as you change speed, angle, and gravity.',
  primaryConcepts: ['projectile motion'],
  secondaryConcepts: ['range', 'launch angle', 'trajectory', 'time of flight', 'gravity', 'kinematics', 'parabola'],
  intentGroups: {
    informational: ['What is projectile motion?', 'What angle gives the maximum range?'],
    howTo: ['How to calculate the range of a projectile', 'How to aim a launch by dragging'],
    comparison: ['Complementary launch angles compared', 'Steep lob vs flat shot'],
    misconception: ['Horizontal velocity stays constant during flight', 'Ideal projectile motion ignores air resistance'],
    troubleshooting: ['Why a steep launch travels a short distance', 'Why weaker gravity increases the range'],
  },
  realWorldUseCases: [
    'Understanding why a football is kicked near 45 degrees for maximum distance',
    'Seeing how gravity on the Moon lengthens a projectile flight',
    'Visualizing that horizontal and vertical motion are independent',
    'Exploring kinematics before studying forces and energy',
  ],
  commonMistakes: [
    'Assuming a steeper launch always travels further',
    'Thinking gravity changes the horizontal velocity',
    'Expecting ideal projectile motion to match a real, drag-affected path',
  ],
  commonQuestions: [
    'What angle gives the maximum range?',
    'How do I calculate the range of a projectile?',
    'Why does the horizontal velocity stay constant?',
  ],
  usedWith: [
    { slug: 'pendulum-simulator', reason: 'Contrast projectile motion with an oscillating system under gravity', strength: 0.7 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'pendulum-simulator', reason: 'See gravity shape a different kind of motion', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['projectile motion', 'range of a projectile', 'launch angle', 'trajectory', 'time of flight', 'kinematics'],
  entityAliases: ['projectile motion', 'projectile', 'trajectory', 'projectile range', 'launch angle'],
  inputs: ['launch speed', 'launch angle', 'gravity'],
  outputs: ['range', 'peak height', 'time of flight', 'horizontal velocity'],
  difficulty: 'intermediate',
  audience: ['students', 'teachers', 'physics learners'],
};
