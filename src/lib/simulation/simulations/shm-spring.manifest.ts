// Declarative manifest for the Mass on a Spring (SHM) Simulator. Single source of truth for its
// config, knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in shm-spring.ts.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import shmSpring from './shm-spring';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Mass on a Spring Simulator',
    slug: 'shm-spring-simulator',
    processorId: 'shm-spring',
    domain: 'physics',
    category: 'physics',
    family: 'oscillations',
    difficulty: 'intermediate',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['Hooke\'s law', 'oscillation'],
    nextTopics: ['damped oscillation', 'resonance'],
    curriculumTags: ['oscillations'],
    learningObjectives: [
      'State the SHM period T = 2 pi times the square root of m / k',
      'Explain why a stiffer spring or a lighter mass raises the frequency',
      'Describe how energy trades between spring potential and kinetic energy',
    ],
    keyTakeaways: [
      'A mass on a spring performs simple harmonic motion',
      'The period is T = 2 pi times the square root of m / k',
      'Amplitude does not change the period, only the energy and peak speed',
    ],
  },
  concepts: {
    primary: ['simple harmonic motion'],
    secondary: ['spring constant', 'period', 'angular frequency', 'restoring force', 'energy conservation'],
    aliases: ['simple harmonic motion', 'mass on a spring', 'SHM', 'mass spring system'],
  },
  equations: [
    {
      id: 'shm-period',
      symbol: 'T',
      expression: 'T = 2 pi times the square root of m / k',
      description: 'The period of a mass on a spring depends on mass and spring constant.',
      variables: [
        { symbol: 'T', label: 'Period', unit: 's', measurementId: 'period' },
        { symbol: 'm', label: 'Mass', unit: 'kg', paramId: 'mass' },
        { symbol: 'k', label: 'Spring constant', unit: 'N/m', paramId: 'springConstant' },
      ],
    },
    {
      id: 'restoring-force',
      symbol: 'F',
      expression: 'F = -k x',
      description: "Hooke's law: the restoring force is proportional to displacement.",
      variables: [
        { symbol: 'F', label: 'Restoring force', unit: 'N' },
        { symbol: 'k', label: 'Spring constant', unit: 'N/m', paramId: 'springConstant' },
        { symbol: 'x', label: 'Displacement', unit: 'm', paramId: 'amplitude' },
      ],
    },
  ],
  educational: {
    summary:
      'Watch a mass on a spring perform simple harmonic motion, and see how mass and spring constant set the period through T = 2 pi times the square root of m / k.',
    intentGroups: {
      informational: ['What is simple harmonic motion?', 'What is the period of a mass on a spring?', 'What is a restoring force?'],
      howTo: ['How to calculate the period of a mass on a spring', 'How to find the angular frequency'],
      comparison: ['Stiff vs soft spring', 'Potential vs kinetic energy'],
      misconception: ['Amplitude does not change the period', 'A heavier mass oscillates more slowly, not faster'],
      troubleshooting: ['Why a stiffer spring speeds up the oscillation', 'Why the period does not depend on amplitude'],
    },
    commonMistakes: [
      'Thinking a larger amplitude gives a longer period',
      'Expecting a heavier mass to oscillate faster',
      'Confusing the spring constant with the force',
    ],
    realWorldUseCases: [
      'Understanding a car suspension bouncing on its springs',
      'Seeing why a stiffer diving board vibrates at a higher pitch',
      'Visualizing energy conservation in an oscillator',
      'Introducing simple harmonic motion before waves and resonance',
    ],
    audience: ['students', 'teachers', 'physics learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Mass on a Spring Simulator: Simple Harmonic Motion',
    description:
      'Watch simple harmonic motion live. Set the mass, spring constant, and amplitude and see the period, speed, and energy of a mass on a spring update instantly.',
    keywords: ['simple harmonic motion', 'mass on a spring', 'spring constant', 'period of oscillation', 'shm', 'angular frequency'],
  },
  presentation: {
    tags: ['simple harmonic motion', 'mass on a spring', 'spring constant', 'oscillation', 'period', 'SHM simulator', 'Hooke\'s law', 'physics'],
    updatedAt: '2026-07-12',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Car suspension', body: 'A heavy car body on stiff springs bounces at a low frequency you can feel over a bump.' },
    { title: 'Stiff vs soft', body: 'A stiff, light spring buzzes quickly; a soft spring under a heavy mass sways with a long, slow period.' },
    { title: 'Energy trade', body: 'At the ends all the energy is spring potential energy; through the middle it is all kinetic energy.' },
    { title: 'Amplitude test', body: 'Drag the mass out further and the period stays the same, only the peak speed and energy grow.' },
  ],
  faq: [
    {
      question: 'What is simple harmonic motion?',
      answer:
        'Simple harmonic motion is the back-and-forth oscillation you get when the restoring force is proportional to displacement, F = -k x, as it is for a mass on a spring. The mass traces a smooth cosine curve in time. The defining feature is that the period does not depend on how far you pull the mass, only on the mass and the spring constant.',
    },
    {
      question: 'What is the period of a mass on a spring?',
      answer:
        'The period is T = 2 pi times the square root of m / k, where m is the mass and k is the spring constant. To calculate the period of a mass on a spring, divide the mass by the spring constant, take the square root, and multiply by 2 pi. A heavier mass gives a longer period; a stiffer spring gives a shorter one. The simulator shows the period updating as you drag either slider.',
    },
    {
      question: 'Does the amplitude change the period?',
      answer:
        'No. Amplitude does not change the period of simple harmonic motion. Pulling the mass out further stores more energy and produces a higher peak speed, but each full oscillation still takes the same time T = 2 pi times the square root of m / k. Drag the mass wider in the simulator and watch the period reading stay put while the energy grows.',
    },
    {
      question: 'How do I find the angular frequency?',
      answer:
        'The angular frequency is omega = the square root of k / m, in radians per second, and it relates to the period by omega = 2 pi / T. To find the angular frequency, divide the spring constant by the mass and take the square root. A stiff spring or a light mass makes omega large, so the mass oscillates quickly. The simulator reports omega alongside the period.',
    },
    {
      question: 'How does energy move during the oscillation?',
      answer:
        'Energy trades between spring potential energy and kinetic energy while the total stays constant at half k times amplitude squared. At the turning points the mass is momentarily still, so all the energy is potential; through the equilibrium point it moves fastest, so the energy is all kinetic. The PE and KE bars in the simulator rise and fall in opposite step.',
    },
    {
      question: 'Does the simulator send my data anywhere?',
      answer:
        'No. Everything runs in your browser with a canvas and simple maths. Nothing is uploaded or stored remotely, and the simulator keeps working offline after the page loads.',
    },
  ],
  guide: {
    slug: 'how-a-mass-on-a-spring-oscillates',
    title: 'How a Mass on a Spring Oscillates',
    description:
      'How a mass on a spring performs simple harmonic motion, why its period is T = 2 pi times the square root of m / k, and why amplitude does not change it.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
    quickAnswer:
      'A mass on a spring performs simple harmonic motion: the spring pulls it back with a force proportional to how far it is displaced, F = -k x, so it oscillates smoothly. The period is T = 2 pi times the square root of m / k, set only by the mass m and the spring constant k. For example, a 1 kg mass on a 20 N/m spring oscillates with a period near 1.4 seconds. The amplitude does not change the period. Open this simulator, drag the mass, and watch the period, speed, and energy update live.',
    sections: [
      {
        id: 'how-it-works',
        heading: 'How the Spring Oscillator Works',
        body:
          'The canvas draws a mass on a spring anchored to a wall. When you pull the mass aside, the spring stores energy and pulls it back with a restoring force F = -k x, always pointing toward the equilibrium line. For example, that is why the motion is simple harmonic motion: the further the mass strays, the harder it is pulled back, which produces a smooth cosine oscillation rather than a jerky one. Release it and it sweeps through the centre, overshoots, and returns.',
      },
      {
        id: 'the-period',
        heading: 'What Sets the Period',
        body: 'Two things fix the period, and amplitude is not one of them.',
        bullets: [
          'Mass (m), in kilograms: more mass means more inertia, so the oscillation is slower and the period longer.',
          'Spring constant (k), in newtons per metre: a stiffer spring pulls back harder, so the oscillation is faster and the period shorter.',
          'Amplitude (A), in metres: how far you pull the mass. It changes the energy and peak speed but not the period.',
        ],
      },
      {
        id: 'calculate',
        heading: 'Calculating Period and Angular Frequency',
        body:
          'To calculate the period of a mass on a spring, divide the mass by the spring constant, take the square root, and multiply by 2 pi: that is T = 2 pi times the square root of m / k. To find the angular frequency, instead divide the spring constant by the mass and take the square root, giving omega = the square root of k / m. For example, a stiff 45 N/m spring on a light 0.4 kg mass has a much higher angular frequency than a soft spring under a heavy mass, so it buzzes quickly.',
      },
      {
        id: 'energy',
        heading: 'Potential vs Kinetic Energy',
        body:
          'A spring oscillator constantly trades spring potential energy for kinetic energy. At the turning points the mass stops, so the energy is all potential, stored in the stretched or compressed spring. Through the equilibrium point the mass moves fastest, so it is all kinetic. For example, watch the PE and KE bars in the simulator swap heights every quarter cycle while their total, half k times amplitude squared, never changes. This is energy conservation in a simple harmonic motion setting.',
      },
    ],
    mistakes: [
      {
        heading: 'Thinking a larger amplitude gives a longer period',
        body:
          'Amplitude does not change the period. Unlike a swing you might imagine, pulling the mass out further does not slow it down: it stores more energy and reaches a higher speed, but each cycle still takes T = 2 pi times the square root of m / k. Drag the mass wider in the simulator and the period reading holds steady.',
      },
      {
        heading: 'Expecting a heavier mass to oscillate faster',
        body:
          'A heavier mass oscillates more slowly, not faster, because mass sits in the numerator of the period. Compare a stiff vs soft spring the other way too: stiffer springs speed the motion up while heavier masses slow it down. The simulator lets you change each one and see the period respond.',
      },
      {
        type: 'note',
        heading: 'Try it yourself',
        body:
          'Load the Stiff and light preset for a fast buzz, then switch to Soft and heavy for a slow sway and compare their periods. Drag the mass to change the amplitude and confirm the period does not move. Everything runs in your browser and works offline. To see a related oscillator, carry on to the pendulum simulator.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: shmSpring.paramBehavior,
  aspect: shmSpring.aspect,
  params: shmSpring.params,
  presets: shmSpring.presets,
  formula: shmSpring.formula,
};
