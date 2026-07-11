// Declarative manifest for the Projectile Motion Simulator — the single source of truth for its
// tool config, knowledge overlay, FAQ, guide, SEO, and relationships. Runtime behavior lives in the
// sibling projectile-motion.ts model. Authored prose is written ONCE here and expanded by the
// generator (src/lib/simulation/generate.ts) into every surface. No em-dashes anywhere.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import projectileMotion from './projectile-motion';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Projectile Motion Simulator',
    slug: 'projectile-motion-simulator',
    processorId: 'projectile-motion',
    domain: 'physics',
    category: 'physics',
    family: 'mechanics',
    difficulty: 'intermediate',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['velocity', 'acceleration'],
    nextTopics: ['forces', 'energy'],
    curriculumTags: ['kinematics', 'mechanics'],
    learningObjectives: [
      'Explain why horizontal and vertical motion are independent',
      'Predict how launch angle and speed change range, height, and flight time',
      'Explain why 45 degrees gives the maximum range',
    ],
    keyTakeaways: [
      'Range is R = v squared times sin(2 theta) divided by g',
      'Horizontal velocity is constant; only the vertical part changes',
      'Complementary angles give the same range',
    ],
  },
  concepts: {
    primary: ['projectile motion'],
    secondary: ['range', 'launch angle', 'trajectory', 'time of flight', 'gravity', 'kinematics', 'parabola'],
    aliases: ['projectile motion', 'projectile', 'trajectory', 'projectile range', 'launch angle'],
  },
  equations: [
    {
      id: 'range',
      symbol: 'R',
      expression: 'R = v squared times sin(2 theta) / g',
      description: 'Horizontal range for a launch from ground level with no air resistance.',
      variables: [
        { symbol: 'R', label: 'Range', unit: 'm', measurementId: 'range' },
        { symbol: 'v', label: 'Launch speed', unit: 'm/s', paramId: 'speed' },
        { symbol: 'theta', label: 'Launch angle', unit: 'degrees', paramId: 'angle' },
        { symbol: 'g', label: 'Gravity', unit: 'm/s squared', paramId: 'gravity' },
      ],
    },
  ],
  educational: {
    summary:
      'Drag to aim a launch and watch the parabola fly while range, peak height, and time of flight update as you change speed, angle, and gravity.',
    intentGroups: {
      informational: ['What is projectile motion?', 'What angle gives the maximum range?'],
      howTo: ['How to calculate the range of a projectile', 'How to aim a launch by dragging'],
      comparison: ['Complementary launch angles compared', 'Steep lob vs flat shot'],
      misconception: ['Horizontal velocity stays constant during flight', 'Ideal projectile motion ignores air resistance'],
      troubleshooting: ['Why a steep launch travels a short distance', 'Why weaker gravity increases the range'],
    },
    commonMistakes: [
      'Assuming a steeper launch always travels further',
      'Thinking gravity changes the horizontal velocity',
      'Expecting ideal projectile motion to match a real, drag-affected path',
    ],
    realWorldUseCases: [
      'Understanding why a football is kicked near 45 degrees for maximum distance',
      'Seeing how gravity on the Moon lengthens a projectile flight',
      'Visualizing that horizontal and vertical motion are independent',
      'Exploring kinematics before studying forces and energy',
    ],
    audience: ['students', 'teachers', 'physics learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Projectile Motion Simulator: Range, Height & Angle',
    description:
      'Drag to aim a launch, then watch the arc fly. Change speed, angle, and gravity and see range, peak height, and time of flight update live.',
    keywords: ['projectile motion', 'range of a projectile', 'launch angle', 'trajectory', 'time of flight', 'kinematics'],
  },
  presentation: {
    tags: ['projectile motion simulator', 'projectile motion calculator', 'trajectory calculator', 'range of a projectile', 'launch angle', 'projectile physics', 'kinematics', 'interactive projectile'],
    updatedAt: '2026-07-11',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Kicked football', body: 'A ball kicked near 45 degrees travels the furthest, because that angle splits the launch speed evenly between forward reach and time in the air.' },
    { title: 'Basketball shot', body: 'A high, arcing shot leaves the hand steeply so it drops almost straight down into the hoop, trading distance for a soft, near-vertical landing.' },
    { title: 'Water from a hose', body: 'Angle the nozzle higher and the stream arcs up and lands closer; flatten it and the water shoots far but stays low.' },
    { title: 'A shot on the Moon', body: 'Load the Moon preset and the same launch flies several times further, because weaker gravity lets it hang in the air far longer.' },
  ],
  faq: [
    {
      question: 'What angle gives the maximum range?',
      answer:
        'For a launch from ground level with no air resistance, 45 degrees gives the maximum range. Range depends on sin(2 theta), which is largest when 2 theta is 90 degrees, so theta is 45. For example, launch at 25 m/s and the 45 degree shot lands further than the same speed at 30 or 60 degrees. The simulator marks the landing point so you can sweep the angle slider and watch the range peak right at 45.',
    },
    {
      question: 'How do I calculate the range of a projectile?',
      answer:
        'Use R = v squared times sin(2 theta) divided by g, where v is the launch speed, theta is the launch angle, and g is gravity. Square the speed, multiply by the sine of twice the angle, then divide by g. For example, 20 m/s at 30 degrees on Earth gives about 35 metres. The simulator shows this range value updating live as you drag any control.',
    },
    {
      question: 'Why does the horizontal velocity stay constant?',
      answer:
        'Gravity only pulls downward, so it changes the vertical velocity but never the horizontal one. With no air resistance, nothing pushes the projectile forward or backward once it leaves the launcher, so its horizontal speed is fixed for the whole flight. The vertical part slows on the way up, stops at the peak, then speeds up on the way down. The velocity arrow in the simulator shows the horizontal length holding steady while the vertical part changes.',
    },
    {
      question: 'Do complementary angles give the same range?',
      answer:
        'Yes. Two angles that add up to 90 degrees, such as 30 and 60, produce the same range for the same launch speed, because sin(2 theta) is the same for both. The steeper one flies higher and stays in the air longer, while the shallower one is faster and lower, and they land in the same spot. For example, set 30 degrees, note the range, then set 60 degrees and watch it match.',
    },
    {
      question: 'How does gravity change the flight?',
      answer:
        'Weaker gravity means the projectile falls back more slowly, so it hangs in the air longer and travels much further from the same launch. For example, load the Moon preset, where gravity is about one sixth of Earth, and the same speed and angle send the projectile several times as far. Range and flight time both scale with 1 divided by g, so halving gravity doubles the range.',
    },
    {
      question: 'Does the simulator include air resistance?',
      answer:
        'No. This is ideal projectile motion, which ignores air resistance so the path is a clean, symmetric parabola. Real projectiles feel drag, which shortens the range and tilts the path so the descent is steeper than the climb. The ideal model is the standard starting point in physics courses because it isolates the roles of speed, angle, and gravity.',
    },
    {
      question: 'Does the simulator upload anything?',
      answer:
        'No. It runs entirely in your browser on the HTML canvas, computing the trajectory locally. Nothing is sent anywhere and it works offline once the page has loaded.',
    },
  ],
  guide: {
    slug: 'how-projectile-motion-works',
    title: 'How Projectile Motion Works: Range, Height, and Angle',
    description:
      'A visual guide to projectile motion: why 45 degrees gives the maximum range, how launch angle trades distance for height, and what gravity changes.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
    quickAnswer:
      'Projectile motion is the curved path of an object thrown or launched under gravity alone. Three inputs set that path: the launch speed, the launch angle, and gravity. The range is R = v squared times sin(2 theta) divided by g. For example, a launch at 25 m/s and 45 degrees on Earth lands about 64 metres away. What angle gives the maximum range is always 45 degrees, because that splits the launch speed evenly between forward reach and time in the air. Open the simulator, drag from the launcher to aim, and watch the range, peak height, and time of flight update live.',
    sections: [
      {
        id: 'how-it-works',
        heading: 'How Projectile Motion Works',
        body:
          'The key idea is that horizontal and vertical motion are independent. Gravity only pulls downward, so it changes the vertical velocity while leaving the horizontal velocity untouched. The projectile therefore drifts sideways at a steady rate while it rises, slows, stops at the peak, and falls. Combine the two and the path is a symmetric parabola. For example, watch the velocity arrow in the simulator: its horizontal length never changes, but its vertical part shrinks to zero at the top and grows again on the way down.',
      },
      {
        id: 'maximum-range',
        heading: 'Why 45 Degrees Gives the Maximum Range',
        body:
          'Range depends on sin(2 theta), and the sine function is largest at 90 degrees, so the range peaks when twice the angle is 90, meaning the angle is 45 degrees. Steeper than that and the projectile spends too much of its speed climbing; shallower and it runs out of airtime before it covers ground. For example, set the speed to 25 m/s and sweep the angle slider: the landing marker reaches furthest exactly at 45 degrees and falls off on either side. To calculate the range of a projectile by hand, square the speed, multiply by the sine of twice the angle, then divide by gravity.',
      },
      {
        id: 'angle-tradeoff',
        heading: 'How Launch Angle Trades Distance for Height',
        body:
          'Two angles that add up to 90 degrees, such as 30 and 60, give the same range but very different flights. The steeper launch reaches a higher peak and stays airborne longer, while the shallower one is faster and lower. For example, set 60 degrees and note the tall, slow arc, then set 30 degrees and watch a flat, quick shot land in the same spot. This is why a lofted pass and a driven pass can cover the same distance while looking nothing alike.',
      },
      {
        id: 'gravity',
        heading: 'What Gravity Changes',
        body:
          'Gravity sets how quickly the projectile is pulled back down, so it controls both the peak height and the flight time. Weaker gravity lets the projectile hang longer and travel much further from the same launch, because range scales with 1 divided by g. For example, load the Moon preset, where gravity is about one sixth of Earth, and the same speed and angle send the projectile several times as far. Gravity never touches the horizontal velocity, only the vertical part of the motion.',
      },
    ],
    mistakes: [
      {
        heading: 'Assuming a steeper launch always goes further',
        body:
          'Past 45 degrees, extra steepness costs distance. A steep launch buys height and hang-time but sacrifices forward reach, so a 75 degree shot lands closer than a 45 degree one at the same speed. If your goal is distance, aim near 45 degrees rather than as high as possible.',
      },
      {
        heading: 'Thinking gravity slows the sideways motion',
        body:
          'Gravity acts straight down, so it changes only the vertical velocity. With no air resistance the horizontal velocity is constant for the whole flight. If the sideways speed seems to drop in a real throw, that is air resistance, which this ideal model leaves out.',
      },
      {
        type: 'note',
        heading: 'How to aim the launch',
        body:
          'Drag from the launcher in the bottom-left of the canvas: the direction sets the angle and the length sets the speed, like pulling back a slingshot. You can also use the sliders for exact values. Everything runs in your browser, nothing is uploaded, and it works offline. To see gravity shape a different kind of motion, carry on to the pendulum simulator.',
      },
    ],
  },
  relationships: {
    usedWith: [
      { slug: 'pendulum-simulator', reason: 'Contrast projectile motion with an oscillating system under gravity', strength: 0.7 },
    ],
    nextSteps: [
      { slug: 'pendulum-simulator', reason: 'See gravity shape a different kind of motion', priority: 1 },
    ],
  },
  paramBehavior: projectileMotion.paramBehavior,
  aspect: projectileMotion.aspect,
  params: projectileMotion.params,
  presets: projectileMotion.presets,
  formula: projectileMotion.formula,
};
