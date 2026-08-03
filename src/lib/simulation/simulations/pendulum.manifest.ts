// Declarative manifest for the Pendulum Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in pendulum.ts. No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import pendulum from './pendulum';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Pendulum Period Calculator',
    slug: 'pendulum-period-calculator',
    processorId: 'pendulum',
    domain: 'physics',
    category: 'physics',
    family: 'oscillations',
    difficulty: 'intermediate',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['gravity', 'oscillation'],
    nextTopics: ['simple harmonic motion', 'energy conservation'],
    curriculumTags: ['oscillations'],
    learningObjectives: [
      'State the small-angle period T = 2 pi times the square root of L / g',
      'Explain why the pendulum period does not depend on mass',
      'Describe how energy trades between potential and kinetic during a swing',
    ],
    keyTakeaways: [
      'The pendulum period depends on length and gravity, not mass',
      'The small-angle formula is only an approximation for wide swings',
      'Energy trades between potential at the top and kinetic at the bottom',
    ],
  },
  concepts: {
    primary: ['pendulum motion'],
    secondary: ['period', 'simple harmonic motion', 'potential energy', 'kinetic energy', 'gravity', 'energy conservation'],
    aliases: ['pendulum', 'simple pendulum', 'pendulum period', 'swinging pendulum'],
  },
  equations: [
    {
      id: 'pendulum-period',
      symbol: 'T',
      expression: 'T = 2 pi times the square root of L / g',
      description: 'The small-angle period depends only on length and gravity.',
      variables: [
        { symbol: 'T', label: 'Period', unit: 's', measurementId: 'period' },
        { symbol: 'L', label: 'Length', unit: 'm', paramId: 'length' },
        { symbol: 'g', label: 'Gravity', unit: 'm/s^2', paramId: 'gravity' },
      ],
    },
  ],
  educational: {
    summary:
      'Drag a pendulum and watch its period, speed, and potential-to-kinetic energy trade as you change length, angle, and gravity.',
    intentGroups: {
      informational: ['What determines the period of a pendulum?', 'What is simple harmonic motion?', 'What is a simple pendulum?'],
      howTo: ['How to calculate a pendulum period', 'How to change the release angle'],
      comparison: ['Small-angle period vs true period', 'Potential vs kinetic energy'],
      misconception: ['Mass does not affect the pendulum period', 'The small-angle formula is only an approximation'],
      troubleshooting: ['Why a wide swing is slower than the formula predicts', 'Why a heavier bob swings at the same rate'],
    },
    commonMistakes: [
      'Assuming a heavier bob swings faster or slower',
      'Trusting the small-angle formula at large release angles',
      'Thinking the bob moves fastest at the top of the swing',
    ],
    realWorldUseCases: [
      'Understanding why a grandfather clock pendulum is about one metre long',
      'Seeing how gravity on the Moon changes a pendulum period',
      'Visualizing energy conservation for a physics course',
      'Exploring simple harmonic motion before studying waves',
    ],
    audience: ['students', 'teachers', 'physics learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Pendulum Period Calculator: Length, Gravity & Energy',
    description:
      'Drag the bob and let it swing. Change length, angle, and gravity and watch the period, velocity, and potential-to-kinetic energy trade update live.',
    keywords: ['pendulum', 'pendulum period', 'simple harmonic motion', 'potential energy', 'kinetic energy', 'gravity'],
  },
  presentation: {
    tags: ['pendulum period calculator', 'pendulum', 'pendulum simulator', 'pendulum period', 'simple harmonic motion', 'potential and kinetic energy', 'gravity', 'oscillation', 'T = 2 pi sqrt L over g'],
    updatedAt: '2026-07-09',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Grandfather clock', body: 'A clock pendulum near one metre long swings with a period close to 2 seconds, which is why long-case clocks are the height they are.' },
    { title: 'Gravity on the Moon', body: 'Moon gravity is about one sixth of Earth, so the same pendulum swings roughly 2.4 times slower.' },
    { title: 'Energy conservation', body: 'Watch the potential and kinetic energy bars trade in opposite step while the total stays fixed.' },
    { title: 'Wide swings', body: 'Release from a large angle and the true period runs longer than the small-angle formula predicts.' },
  ],
  faq: [
    {
      question: 'What determines the period of a pendulum?',
      answer:
        'For small swings the period is T is about 2 pi times the square root of L / g: it depends only on the length L and the gravitational field g. A longer pendulum swings more slowly, and stronger gravity speeds it up. Strikingly, the mass of the bob does not appear, so a heavy and a light bob of the same length swing at the same rate. The simulator shows the period updating as you change length and gravity.',
    },
    {
      question: 'Why does the mass not affect the period?',
      answer:
        'Gravity pulls harder on a heavier bob, but a heavier bob also resists changes in motion more, and the two effects cancel exactly. This is the same reason all objects fall at the same rate in a vacuum. In the formula T is about 2 pi times the square root of L / g there is simply no mass term. The simulator keeps mass fixed at one kilogram and display-only for this reason.',
    },
    {
      question: 'How does energy change during a swing?',
      answer:
        'Energy trades between two forms. At the top of a swing the bob is momentarily still, so all the energy is potential (stored in its height). At the bottom it moves fastest, so the energy is all kinetic. In between it is a mix, and the total stays constant. The PE and KE bars in the simulator rise and fall in opposite step to show this conservation.',
    },
    {
      question: 'Is the small-angle formula always accurate?',
      answer:
        'No. T is about 2 pi times the square root of L / g is an approximation that is excellent for small swings but drifts for large ones. At a 60 degree release the true period is around 7 percent longer than the formula predicts. This simulator integrates the full nonlinear equation, so releasing the bob from a wide angle makes it visibly swing slower than the small-angle reading suggests.',
    },
    {
      question: 'How do I set the starting angle?',
      answer:
        'Drag the bob to wherever you want and let go: it swings from rest at that angle. You can also use the initial-angle slider, or load a preset such as the grandfather clock. Dragging is the most direct way to feel how a wider release stores more potential energy and produces a faster bottom-of-swing speed.',
    },
    {
      question: 'Does the simulator upload anything?',
      answer:
        'No. It runs entirely in your browser on the HTML canvas, computing the motion locally. Nothing is sent anywhere and it works offline once loaded.',
    },
  ],
  guide: {
    slug: 'how-a-pendulum-period-works',
    title: 'What Determines a Pendulum Period',
    description:
      'Why a pendulum period depends on length and gravity but not mass, how the small-angle formula works, and how energy trades between potential and kinetic.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
    quickAnswer:
      "A simple pendulum's period depends on just two things: its length and the local gravity. The small-angle formula is T = 2 pi times the square root of L / g. For example, a one-metre pendulum on Earth swings with a period near 2 seconds. What determines the period of a pendulum is length and gravity alone: the mass of the bob and, for small swings, the release angle do not change it. Open the simulator, drag the bob, and watch the pendulum period and the energy readouts update live.",
    sections: [
      {
        id: 'what-determines-period',
        heading: 'What Determines the Period',
        body:
          "Length sets the period most strongly. Because the period grows with the square root of length, making a simple pendulum four times longer only doubles its period. Gravity works the other way: stronger gravity pulls the bob back faster, so a shorter period. For example, on the Moon gravity is about one sixth of Earth's, so the same pendulum swings roughly 2.4 times slower. To calculate a pendulum period by hand, divide the length by g, take the square root, and multiply by 2 pi.",
      },
      {
        id: 'why-mass-does-not-matter',
        heading: 'Why Mass Does Not Affect the Period',
        body:
          'Mass does not affect the pendulum period, and the reason is the same one Galileo found for falling objects. A heavier bob is pulled harder by gravity, but it also resists changes in motion more, and the two effects cancel exactly. So a heavier bob swings at the same rate as a light one of the same length. Drag the mass control in the simulator and the period reading does not move, even though the energy values scale up.',
      },
      {
        id: 'energy',
        heading: 'Potential vs Kinetic Energy',
        body:
          'A swing is a constant trade between potential energy and kinetic energy. At the top of the arc the bob is momentarily still, so it holds all potential energy and no kinetic energy. At the bottom it moves fastest, so potential energy has become kinetic energy. For example, release the bob from the left: watch potential energy fall to zero as it reaches the bottom, then rebuild on the right. The total stays constant, which is energy conservation in action, the same idea behind simple harmonic motion.',
      },
      {
        id: 'small-angle',
        heading: 'Small-Angle Period vs True Period',
        body:
          'The tidy formula is an approximation. The small-angle formula is only an approximation that holds when the swing stays under about 15 degrees, where the motion is close to true simple harmonic motion. Push the release angle wider and the real period grows longer than the formula predicts, which is why a wide swing is slower than the formula says. For example, at 90 degrees the true period runs roughly 18 percent longer than T = 2 pi times the square root of L / g. The simulator uses the full physics, so you can compare the small-angle period against the true period by widening the angle.',
      },
    ],
    mistakes: [
      {
        heading: 'Expecting a heavier bob to swing faster or slower',
        body:
          "A heavier bob swings at the same rate as a light one of equal length, because gravity's extra pull and the extra inertia cancel. If two pendulums of the same length swing in step regardless of their weights, that is the physics working, not a fault.",
      },
      {
        heading: 'Trusting the small-angle formula at large angles',
        body:
          'T = 2 pi times the square root of L / g assumes a small swing. Use it past roughly 15 degrees and it underestimates the period. For a wide release, rely on the simulator\'s full calculation rather than the formula.',
      },
      {
        type: 'note',
        heading: 'How to change the release angle',
        body:
          'Drag the bob to the side and let go: the point where you release it sets the starting angle, or use the angle control for an exact value. Everything runs in your browser, nothing is uploaded, and it works offline. To relate the pendulum period to frequency, carry it into the frequency and period simulator.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: pendulum.paramBehavior,
  aspect: pendulum.aspect,
  params: pendulum.params,
  presets: pendulum.presets,
  formula: pendulum.formula,
};
