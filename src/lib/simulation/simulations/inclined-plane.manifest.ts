// Declarative manifest for the Inclined Plane Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in inclined-plane.ts.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import inclinedPlane from './inclined-plane';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Inclined Plane Calculator',
    slug: 'inclined-plane-calculator',
    processorId: 'inclined-plane',
    domain: 'physics',
    category: 'physics',
    family: 'mechanics',
    difficulty: 'intermediate',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['forces', 'friction'],
    nextTopics: ['Newton\'s second law', 'free body diagrams'],
    curriculumTags: ['mechanics'],
    learningObjectives: [
      'Resolve gravity into components along and perpendicular to a ramp',
      'State the acceleration a = g(sinθ - μcosθ)',
      'Explain why the block stays static when tanθ is less than μ',
    ],
    keyTakeaways: [
      'The weight component along the incline is mg sinθ',
      'The block accelerates at a = g(sinθ - μcosθ)',
      'The acceleration does not depend on the mass',
    ],
  },
  concepts: {
    primary: ['inclined plane'],
    secondary: ['friction', 'normal force', 'components of gravity', 'acceleration', 'Newton\'s second law'],
    aliases: ['inclined plane', 'ramp', 'block on a ramp', 'friction on a slope'],
  },
  equations: [
    {
      id: 'incline-acceleration',
      symbol: 'a',
      expression: 'a = g(sinθ - μcosθ)',
      description: 'Acceleration down the ramp from the weight component minus friction.',
      variables: [
        { symbol: 'a', label: 'Acceleration', unit: 'm/s²', measurementId: 'acceleration' },
        { symbol: 'θ', label: 'Ramp angle', unit: '°', paramId: 'angle' },
        { symbol: 'μ', label: 'Friction coefficient', unit: '', paramId: 'friction' },
      ],
    },
  ],
  educational: {
    summary:
      'Set the ramp angle, block mass, and friction and watch a block slide or stay put, with live force components and the acceleration a = g(sinθ - μcosθ).',
    intentGroups: {
      informational: ['What is an inclined plane?', 'What is the normal force on a ramp?', 'What is friction?'],
      howTo: ['How to calculate the acceleration on an inclined plane', 'How to find the normal force on a ramp'],
      comparison: ['Steep vs shallow ramp', 'With vs without friction'],
      misconception: ['A heavier block does not slide faster', 'The normal force is not equal to the full weight on a slope'],
      troubleshooting: ['Why the block stays static at a small angle', 'Why the acceleration does not depend on mass'],
    },
    commonMistakes: [
      'Using the full weight instead of mg cosθ for the normal force',
      'Expecting a heavier block to accelerate faster',
      'Forgetting that friction can hold the block completely still',
    ],
    realWorldUseCases: [
      'Understanding why a wheelchair ramp has a shallow angle',
      'Seeing why cargo needs strapping on a truck ramp',
      'Explaining how a ski slope steepness changes speed',
      'Introducing force resolution before free body diagrams',
    ],
    audience: ['students', 'teachers', 'physics learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Inclined Plane Calculator: Forces on a Ramp',
    description:
      'Watch a block on a ramp slide or hold still. Set the angle, mass, and friction and see the force components and acceleration a = g(sinθ - μcosθ) live.',
    tagline: 'Set angle, mass and friction, and see whether the block slides.',
    keywords: ['inclined plane', 'ramp physics', 'friction', 'normal force', 'components of gravity', 'inclined plane calculator'],
  },
  presentation: {
    tags: ['inclined plane', 'ramp', 'friction', 'normal force', 'components of gravity', 'forces', 'mechanics', 'physics simulator'],
    updatedAt: '2026-07-12',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Frictionless slope', body: 'With no friction the block accelerates at g sinθ, the same for any mass.' },
    { title: 'Friction holds it', body: 'On a shallow ramp with grippy contact the block stays static because tanθ is less than μ.' },
    { title: 'Steep and slippery', body: 'A steep, low-friction ramp lets the block accelerate quickly down the slope.' },
    { title: 'Wheelchair ramp', body: 'A gentle angle keeps the driving force small, which is why accessibility ramps are long and shallow.' },
  ],
  faq: [
    {
      question: 'What is the acceleration of a block on an inclined plane?',
      answer:
        'For a block sliding down a ramp, the acceleration is a = g(sinθ - μcosθ), where θ is the ramp angle, μ is the coefficient of friction, and g is gravity. The weight component along the incline, g sinθ, drives it down while friction, μg cosθ, resists. Notice the mass cancels out, so a heavy and a light block slide with the same acceleration. The simulator shows this value updating as you change the angle or friction.',
    },
    {
      question: 'How do I find the normal force on a ramp?',
      answer:
        'The normal force is N = mg cosθ, not the full weight mg. On a slope the surface only has to support the component of gravity perpendicular to it, which shrinks as the ramp gets steeper. To find the normal force, multiply the weight by the cosine of the ramp angle. Friction is then μN = μmg cosθ, which is why steeper ramps have less friction to fight.',
    },
    {
      question: 'Why does the block sometimes stay still?',
      answer:
        'When the ramp is shallow enough, the maximum friction force μmg cosθ is larger than the weight component mg sinθ trying to pull the block down, so it stays static. This happens whenever tanθ is less than μ. Raise the angle past that point in the simulator and the block breaks free and begins to slide. The status label tells you which regime you are in.',
    },
    {
      question: 'Does a heavier block slide faster?',
      answer:
        'No. The acceleration a = g(sinθ - μcosθ) has no mass in it, because both the driving force and the friction force scale with the mass and cancel. A heavier block feels a bigger pull but also a bigger friction force, so it slides with exactly the same acceleration as a light one. Change the mass slider in the simulator and the acceleration reading does not move.',
    },
    {
      question: 'How does the ramp angle change the motion?',
      answer:
        'A steeper ramp increases the weight component along the incline (mg sinθ) and reduces the normal force and friction (mg cosθ), so the block accelerates faster. A shallower ramp does the reverse and may let friction hold the block still. Comparing a steep vs shallow ramp in the simulator shows the acceleration and force arrows change together.',
    },
    {
      question: 'Does the simulator send my data anywhere?',
      answer:
        'No. Everything runs in your browser with a canvas and simple arithmetic. Nothing is uploaded or stored remotely, and the simulator keeps working offline after the page loads.',
    },
  ],
  guide: {
    slug: 'how-forces-work-on-an-inclined-plane',
    title: 'How Forces Work on an Inclined Plane',
    description:
      'How to resolve gravity on a ramp, why the acceleration is a = g(sinθ - μcosθ), how the normal force becomes mg cosθ, and when friction holds a block still.',
    readMinutes: 5,
    updatedAt: '2026-07-12',
    quickAnswer:
      'On an inclined plane, gravity splits into a component along the ramp, mg sinθ, that pulls the block down and a component into the ramp, mg cosθ, that sets the normal force. The block accelerates at a = g(sinθ - μcosθ) once the slope beats friction. For example, a frictionless 30 degree ramp gives about 4.9 m/s squared, the same for any mass. If tanθ is less than μ, friction holds the block still. Open this simulator, drag the ramp steeper or add friction, and watch the forces and acceleration respond.',
    sections: [
      {
        id: 'how-it-works',
        heading: 'How the Inclined Plane Works',
        body:
          'The canvas draws a ramp with a block on it and arrows for the forces. Gravity always points straight down, but on a slope it is easier to split it into a part along the ramp and a part pressing into it. For example, that is why the block accelerates at a = g(sinθ - μcosθ): only the along-ramp component drives the motion, and friction, set by the into-ramp component, resists it. Drag the ramp steeper and the driving arrow grows while the friction arrow shrinks.',
      },
      {
        id: 'resolving-forces',
        heading: 'Resolving Gravity Into Components',
        body: 'Two force components come from splitting gravity on the slope.',
        bullets: [
          'Along the incline: mg sinθ pulls the block down the ramp. This is the driving force.',
          'Into the incline: mg cosθ presses the block onto the surface and sets the normal force N.',
          'Friction: μN = μmg cosθ acts up the ramp, opposing the slide, up to its maximum value.',
        ],
      },
      {
        id: 'calculate',
        heading: 'Calculating Acceleration and Normal Force',
        body:
          'To calculate the acceleration on an inclined plane, use a = g(sinθ - μcosθ): the along-ramp pull minus the friction, all over the mass, which cancels. To find the normal force on a ramp, use N = mg cosθ, the weight times the cosine of the angle. For example, a 2 kg block on a 30 degree frictionless ramp has a normal force near 17 N and an acceleration of about 4.9 m/s squared, and the simulator reads both off the force arrows.',
      },
      {
        id: 'friction-and-angle',
        heading: 'Steep vs Shallow, With vs Without Friction',
        body:
          'A steep ramp raises mg sinθ and lowers the friction, so the block accelerates faster. A shallow, grippy ramp can hold it static whenever tanθ is less than μ. For example, comparing with vs without friction in the simulator shows a frictionless slope always sliding while a high-friction slope may not move at all. The mass never changes the acceleration, only the size of the force arrows.',
      },
    ],
    mistakes: [
      {
        heading: 'Using the full weight for the normal force',
        body:
          'On a slope the normal force is mg cosθ, not the full weight mg. Unlike flat ground, the surface only supports the part of gravity pressing into it, which shrinks as the ramp steepens. Getting this wrong inflates the friction. The simulator shows the normal force falling as you raise the angle.',
      },
      {
        heading: 'Expecting a heavier block to slide faster',
        body:
          'The acceleration does not depend on mass. Because both the driving force and the friction scale with the mass, it cancels out of a = g(sinθ - μcosθ). A heavy block and a light block slide together. Change the mass in the simulator and the acceleration reading stays fixed.',
      },
      {
        type: 'note',
        heading: 'Try it yourself',
        body:
          'Load the Frictionless slope preset to see pure g sinθ acceleration, then switch to Friction holds it to watch the block stay static. Drag the ramp angle up and down to find the point where it breaks free. Everything runs in your browser and works offline. To explore motion after the block leaves the ramp, try the projectile motion simulator.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: inclinedPlane.paramBehavior,
  aspect: inclinedPlane.aspect,
  params: inclinedPlane.params,
  presets: inclinedPlane.presets,
  formula: inclinedPlane.formula,
};
