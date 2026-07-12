// Declarative manifest for the Momentum Collision Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in momentum-collision.ts.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import momentumCollision from './momentum-collision';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Momentum Collision Simulator',
    slug: 'momentum-collision-simulator',
    processorId: 'momentum-collision',
    domain: 'physics',
    category: 'physics',
    family: 'mechanics',
    difficulty: 'intermediate',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['velocity', 'mass'],
    nextTopics: ['impulse', 'centre of mass'],
    curriculumTags: ['mechanics'],
    learningObjectives: [
      'State that momentum is conserved in every collision',
      'Distinguish elastic from inelastic collisions by kinetic energy',
      'Predict the outcome of a collision from the masses and restitution',
    ],
    keyTakeaways: [
      'Momentum p = m1 v1 + m2 v2 is conserved in every collision',
      'Kinetic energy is conserved only in an elastic collision (e = 1)',
      'A perfectly inelastic collision (e = 0) makes the carts stick together',
    ],
  },
  concepts: {
    primary: ['conservation of momentum'],
    secondary: ['elastic collision', 'inelastic collision', 'kinetic energy', 'restitution', 'impulse'],
    aliases: ['conservation of momentum', 'collision', 'elastic collision', 'inelastic collision'],
  },
  equations: [
    {
      id: 'momentum-conservation',
      symbol: 'p',
      expression: 'p = m1 v1 + m2 v2',
      description: 'Total momentum is the sum of each cart mass times its velocity, and it is conserved.',
      variables: [
        { symbol: 'p', label: 'Total momentum', unit: 'kg m/s', measurementId: 'momentum' },
        { symbol: 'm1', label: 'Mass of cart 1', unit: 'kg', paramId: 'mass1' },
        { symbol: 'v1', label: 'Cart 1 velocity', unit: 'm/s', measurementId: 'v1' },
        { symbol: 'm2', label: 'Mass of cart 2', unit: 'kg', paramId: 'mass2' },
        { symbol: 'v2', label: 'Cart 2 velocity', unit: 'm/s', measurementId: 'v2' },
      ],
    },
  ],
  educational: {
    summary:
      'Send one cart into another and watch momentum stay conserved while kinetic energy is lost or kept, depending on how elastic the collision is.',
    intentGroups: {
      informational: ['What is conservation of momentum?', 'What is an elastic collision?', 'What is an inelastic collision?'],
      howTo: ['How to calculate momentum after a collision', 'How to find the final velocity in a collision'],
      comparison: ['Elastic vs inelastic collision', 'Momentum vs kinetic energy'],
      misconception: ['Momentum is conserved even when kinetic energy is not', 'A heavier cart does not simply push through unchanged'],
      troubleshooting: ['Why kinetic energy drops in an inelastic collision', 'Why the carts stick together when e is zero'],
    },
    commonMistakes: [
      'Assuming kinetic energy is always conserved in a collision',
      'Forgetting that momentum is a vector with direction',
      'Confusing momentum with kinetic energy',
    ],
    realWorldUseCases: [
      'Understanding what happens in a car crash test',
      'Seeing why a Newton\'s cradle passes its swing along',
      'Explaining recoil when a gun or rocket fires',
      'Introducing conservation laws before impulse and collisions in 2D',
    ],
    audience: ['students', 'teachers', 'physics learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Momentum Collision Simulator: Conservation of Momentum',
    description:
      'Collide two carts and watch conservation of momentum in action. Set the masses, speed, and restitution and compare elastic vs inelastic collisions live.',
    keywords: ['conservation of momentum', 'elastic collision', 'inelastic collision', 'momentum', 'collision simulator', 'coefficient of restitution'],
  },
  presentation: {
    tags: ['conservation of momentum', 'elastic collision', 'inelastic collision', 'momentum', 'kinetic energy', 'restitution', 'collision simulator', 'mechanics'],
    updatedAt: '2026-07-12',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Newton\'s cradle', body: 'An elastic collision passes the incoming velocity along, just as one ball sets the far ball swinging.' },
    { title: 'Car crash test', body: 'A perfectly inelastic collision crumples the cars together, turning kinetic energy into deformation and heat.' },
    { title: 'Heavy hits light', body: 'A heavy cart barely slows down while it launches a light cart forward at nearly twice its speed.' },
    { title: 'Equal masses, elastic', body: 'Two equal carts swap velocities cleanly: the mover stops and the target takes off.' },
  ],
  faq: [
    {
      question: 'What is conservation of momentum?',
      answer:
        'Conservation of momentum says the total momentum of an isolated system stays the same before and after a collision. Momentum is mass times velocity, p = m1 v1 + m2 v2 for two carts, and it is a vector, so direction matters. No matter how elastic or inelastic the collision is, the total momentum after equals the total before. The simulator shows the momentum reading holding steady through every impact.',
    },
    {
      question: 'What is the difference between an elastic and inelastic collision?',
      answer:
        'The difference is what happens to kinetic energy. In an elastic collision (restitution e = 1) both momentum and kinetic energy are conserved, so the carts bounce apart cleanly. In an inelastic collision (e below 1) momentum is still conserved but some kinetic energy is lost to heat, sound, and deformation. A perfectly inelastic collision (e = 0) is the extreme case where the carts stick together and move as one.',
    },
    {
      question: 'How do I calculate the velocities after a collision?',
      answer:
        'You solve two equations at once: conservation of momentum, m1 u1 + m2 u2 = m1 v1 + m2 v2, together with the restitution relation that sets how fast the carts separate. For a perfectly elastic head-on collision this gives tidy formulas; for other cases the simulator uses the general restitution result. To find the final velocity, set the masses, the speed, and e, and read the outcome off the cart labels.',
    },
    {
      question: 'Why does kinetic energy drop in an inelastic collision?',
      answer:
        'Because energy is transferred out of motion and into other forms. When carts crumple, stick, or make a sound, that energy comes from their kinetic energy, so the total kinetic energy after the collision is less than before. Momentum has no such loss because there is no way for the system to shed momentum internally. Set e below 1 in the simulator and watch the kinetic energy reading fall while the momentum holds.',
    },
    {
      question: 'What happens when a heavy cart hits a light one?',
      answer:
        'The heavy cart barely slows while the light cart shoots forward. In the elastic limit a very heavy cart hitting a stationary light one sends the light cart off at close to twice the incoming speed, while the heavy cart continues almost unchanged. Load the Heavy hits light preset in the simulator to see this, then swap to Light hits heavy for the mirror case where the light cart bounces back.',
    },
    {
      question: 'Does the simulator send my data anywhere?',
      answer:
        'No. Everything runs in your browser with a canvas and simple arithmetic. Nothing is uploaded or stored remotely, and the simulator keeps working offline after the page loads.',
    },
  ],
  guide: {
    slug: 'how-momentum-is-conserved-in-collisions',
    title: 'How Momentum Is Conserved in Collisions',
    description:
      'Why momentum is conserved in every collision, how elastic and inelastic collisions differ in kinetic energy, and how the masses and restitution set the outcome.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
    quickAnswer:
      'In every collision the total momentum is conserved: the sum p = m1 v1 + m2 v2 is the same before and after the impact. Kinetic energy, though, is only conserved in an elastic collision. For example, two equal carts in an elastic collision swap velocities, while in a perfectly inelastic collision they stick together and lose some kinetic energy to heat. The masses and the coefficient of restitution set the outcome. Open this simulator, pick the masses and speed, and watch momentum hold steady while the carts collide.',
    sections: [
      {
        id: 'how-it-works',
        heading: 'How a Collision Works',
        body:
          'The canvas shows two carts on a frictionless track. Cart 1 rolls in and strikes cart 2, and their velocities change in an instant according to conservation of momentum and the restitution you set. For example, that is why momentum is conserved: the push cart 1 gives cart 2 is exactly equal and opposite to the push it feels back, so the total momentum p = m1 v1 + m2 v2 cannot change. The velocity graph shows both carts trading speed at the moment of impact.',
      },
      {
        id: 'momentum-vs-energy',
        heading: 'Momentum vs Kinetic Energy',
        body: 'Two quantities describe the collision, and they behave differently.',
        bullets: [
          'Momentum (p = m v): always conserved. The total before the collision equals the total after, whatever the restitution.',
          'Kinetic energy (half m v squared): conserved only in an elastic collision. An inelastic collision loses some to heat and sound.',
          'Restitution (e): sets how bouncy the impact is, from e = 1 (perfectly elastic) down to e = 0 (perfectly inelastic, carts stick).',
        ],
      },
      {
        id: 'calculate',
        heading: 'Calculating the Outcome',
        body:
          'To calculate the momentum after a collision, add up mass times velocity for both carts; it equals the value from before, so nothing new is needed. To find the final velocity of each cart, combine conservation of momentum with the restitution relation and solve for the two unknowns. For example, a 5 kg cart at 4 m/s striking a 1 kg cart elastically sends the light cart off near 6.7 m/s while the heavy cart slows only slightly, and the simulator reads both velocities straight off the carts.',
      },
      {
        id: 'elastic-vs-inelastic',
        heading: 'Elastic vs Inelastic Collisions',
        body:
          'An elastic collision, e = 1, conserves kinetic energy as well as momentum, so the carts rebound cleanly like a Newton\'s cradle. An inelastic collision loses kinetic energy: at e = 0 the carts stick together and move as one, as in a car crash test where the metal crumples. For example, comparing elastic vs inelastic in the simulator shows the momentum reading unchanged in both cases while the kinetic energy reading drops only when e is below 1.',
      },
    ],
    mistakes: [
      {
        heading: 'Assuming kinetic energy is always conserved',
        body:
          'Momentum is conserved in every collision, but kinetic energy is not. Unlike momentum, kinetic energy can be turned into heat, sound, and deformation, so an inelastic collision ends with less of it. Set e below 1 in the simulator and watch the kinetic energy reading fall while the momentum stays put.',
      },
      {
        heading: 'Forgetting that momentum has direction',
        body:
          'Momentum is a vector, so a cart moving left carries negative momentum that partly cancels a cart moving right. Adding speeds without their signs gives the wrong total. The simulator tracks the sign, which is why a light cart bouncing back reduces the running total rather than adding to it.',
      },
      {
        type: 'note',
        heading: 'Try it yourself',
        body:
          'Load the Elastic preset and watch equal carts swap velocities, then switch to Perfectly inelastic to see them stick and lose energy. Try Heavy hits light and Light hits heavy to compare the mass cases. Everything runs in your browser and works offline. To revisit straight-line motion, try the projectile motion simulator.',
      },
    ],
  },
  relationships: {
    usedWith: [
      { slug: 'projectile-motion-simulator', reason: 'Both apply Newtonian mechanics to moving bodies', strength: 0.6 },
    ],
    nextSteps: [
      { slug: 'projectile-motion-simulator', reason: 'Explore motion under gravity next', priority: 1 },
    ],
  },
  paramBehavior: momentumCollision.paramBehavior,
  aspect: momentumCollision.aspect,
  params: momentumCollision.params,
  presets: momentumCollision.presets,
  formula: momentumCollision.formula,
};
