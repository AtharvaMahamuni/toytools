// Declarative manifest for the Unit Circle Explorer, the first Applied Math simulation. Single
// source of truth for its config, knowledge, FAQ, guide, SEO, and relationships. Runtime behavior
// is in unit-circle.ts. No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import unitCircle from './unit-circle';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Unit Circle Explorer',
    slug: 'unit-circle-explorer',
    processorId: 'unit-circle',
    domain: 'math-lab',
    category: 'applied-math',
    family: 'trigonometry',
    difficulty: 'beginner',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['right triangles', 'angles'],
    nextTopics: ['sine wave', 'trigonometric identities'],
    curriculumTags: ['trigonometry'],
    learningObjectives: [
      'Read sin, cos, and tan for any angle directly off the unit circle',
      'Convert between radians and degrees and explain why radians are natural',
      'Recall the special angles 30, 45, and 60 degrees and their exact values',
    ],
    keyTakeaways: [
      'On the unit circle the coordinates of the point are exactly (cos θ, sin θ)',
      'sin and cos never leave the range -1 to 1; tan is undefined at 90 and 270 degrees',
      'A point moving steadily around the circle traces the sine wave',
    ],
  },
  concepts: {
    primary: ['unit circle'],
    secondary: ['sine', 'cosine', 'tangent', 'radians', 'reference angle', 'special angles', 'Pythagorean identity'],
    aliases: ['unit circle chart', 'unit circle calculator', 'sin cos tan', 'trig circle', 'unit circle explorer'],
  },
  equations: [
    {
      id: 'unit-circle-coordinates',
      symbol: '(x, y)',
      expression: 'x = cos θ and y = sin θ',
      description: 'The point at angle θ on the unit circle has coordinates (cos θ, sin θ).',
      variables: [
        { symbol: 'θ', label: 'Angle θ', unit: '°', paramId: 'angle' },
        { symbol: 'x', label: 'cos θ', unit: '', measurementId: 'cos' },
        { symbol: 'y', label: 'sin θ', unit: '', measurementId: 'sin' },
      ],
    },
    {
      id: 'pythagorean-identity',
      symbol: '1',
      expression: 'sin² θ + cos² θ = 1',
      description: 'The Pythagorean identity: the point never leaves the circle of radius 1.',
      variables: [
        { symbol: 'sin θ', label: 'sin θ', unit: '', measurementId: 'sin' },
        { symbol: 'cos θ', label: 'cos θ', unit: '', measurementId: 'cos' },
      ],
    },
    {
      id: 'tangent-ratio',
      symbol: 'tan θ',
      expression: 'tan θ = sin θ / cos θ',
      description: 'Tangent is the ratio of the legs, so it is undefined where cos θ = 0.',
      variables: [
        { symbol: 'tan θ', label: 'tan θ', unit: '', measurementId: 'tan' },
        { symbol: 'sin θ', label: 'sin θ', unit: '', measurementId: 'sin' },
        { symbol: 'cos θ', label: 'cos θ', unit: '', measurementId: 'cos' },
      ],
    },
  ],
  educational: {
    summary:
      'Drag an angle around the unit circle and watch sin, cos, tan, radians, and the traced sine wave update live.',
    intentGroups: {
      informational: ['What is the unit circle?', 'Where does the sine wave come from?', 'What is a reference angle?'],
      howTo: ['How to read sin cos tan values on the unit circle', 'How to convert radians and degrees'],
      comparison: ['Radians vs degrees', 'Sine vs cosine on the unit circle'],
      misconception: ['tan θ is not a coordinate on the circle', 'sin and cos never leave the range -1 to 1'],
      troubleshooting: ['Why sin and cos go negative in some quadrants', 'Why tan θ blows up near 90 degrees'],
    },
    commonMistakes: [
      'Forgetting that cos θ turns negative in quadrants II and III',
      'Mixing radians and degrees in the same calculation',
      'Reading tan θ as a coordinate of the point instead of a ratio',
    ],
    realWorldUseCases: [
      'Learning or teaching trigonometry with a live picture instead of a static chart',
      'Memorizing the special angles before an exam by dragging to each one',
      'Understanding rotations when programming games or graphics',
      'Seeing where the sine wave in physics and audio actually comes from',
    ],
    audience: ['students', 'teachers', 'math learners', 'programmers'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Unit Circle Explorer: Interactive Sin, Cos & Tan',
    description:
      'Drag a point around an interactive unit circle. Watch sin, cos, and tan update live, see the reference triangle, and trace the sine wave in your browser.',
    keywords: ['unit circle', 'sin cos tan', 'unit circle calculator', 'radians and degrees', 'reference angle', 'special angles'],
  },
  presentation: {
    tags: ['unit circle', 'unit circle calculator', 'sin cos tan', 'sine cosine tangent', 'radians and degrees', 'reference angle', 'special angles', 'trigonometry'],
    updatedAt: '2026-07-14',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'The 45° triangle', body: 'Drag to 45° and the two legs become equal: sin θ and cos θ are both √2/2, about 0.707, and tan θ = 1.' },
    { title: 'Crossing 90°', body: 'Approach 90° and watch cos θ shrink to 0 while tan θ explodes: division by a vanishing cosine has no answer.' },
    { title: 'Quadrant signs', body: 'Tour the four quadrants and watch the signs flip: sin θ is positive in the top half, cos θ in the right half.' },
    { title: 'The sine wave', body: 'Set a rotation speed and the point traces a perfect sine wave on the right: circular motion seen edge-on.' },
  ],
  faq: [
    {
      question: 'What is the unit circle?',
      answer:
        'The unit circle is a circle of radius 1 centered at the origin. Its power is that the point at angle θ sits at coordinates (cos θ, sin θ), so one picture defines sine and cosine for every angle, not just the acute angles of a right triangle. The explorer draws the angle, the reference triangle, and the live values as you drag, so the definition becomes something you can feel rather than memorize.',
    },
    {
      question: 'How do I read sin cos tan values on the unit circle?',
      answer:
        'Read the coordinates of the point: the horizontal coordinate is cos θ and the vertical coordinate is sin θ. For example, drag the point to 30° and the readouts show cos θ = 0.866 and sin θ = 0.5, which are the exact values √3/2 and 1/2. Tangent is not a coordinate: it is the ratio sin θ / cos θ, shown as its own live measurement. The reference triangle drawn inside the circle makes the two legs visible.',
    },
    {
      question: 'Why is tan θ undefined at 90 degrees?',
      answer:
        'Because tan θ = sin θ / cos θ, and at 90° the cosine is exactly 0, so the division has no value. Drag the point toward 90° and watch tan θ grow without bound while cos θ shrinks: that runaway growth is the vertical asymptote of the tangent function. The same thing happens at 270°, the other angle where the point crosses the y-axis.',
    },
    {
      question: 'What is the difference between radians and degrees?',
      answer:
        'Degrees split a full turn into 360 steps by convention; radians measure the same turn by arc length, so a full circle is 2π radians because the circumference of a unit circle is 2π. The explorer shows both readouts at once. Radians look odd at first but make the math natural: a 1 radian angle cuts an arc of length exactly 1 on the unit circle, and calculus formulas for sine and cosine only take their clean form in radians.',
    },
    {
      question: 'What are the special angles I should memorize?',
      answer:
        'The classic set is 30°, 45°, and 60°, whose sine and cosine values are 1/2, √2/2, and √3/2 in different orders, plus the axis angles 0°, 90°, 180°, and 270°. Every other named angle on the standard unit circle chart is one of these reflected into another quadrant using a reference angle. Use the presets to jump straight to each special angle and watch which leg of the triangle carries which value.',
    },
    {
      question: 'What is a reference angle and how do I find it?',
      answer:
        'The reference angle is the acute angle between the radius arm and the x-axis, always between 0° and 90°. To find it: subtract from 180° in quadrant II, subtract 180° in quadrant III, and subtract from 360° in quadrant IV. For example, 150° has reference angle 30°, so its sine and cosine have the same magnitudes as at 30° with only the signs changed. Drag through the quadrants and watch the triangle repeat itself in mirror image.',
    },
    {
      question: 'How do I convert radians to degrees?',
      answer:
        'Multiply by 180/π. So π/3 radians × 180/π = 60°, and going the other way, degrees convert to radians by multiplying by π/180. The conversion works because a full turn is both 360° and 2π radians, so the two units are locked in that ratio. The explorer shows both readouts side by side, which makes the common conversions (π/6 = 30°, π/4 = 45°, π/2 = 90°) automatic with repetition.',
    },
    {
      question: 'Why can sin and cos never be greater than 1?',
      answer:
        'Because they are coordinates of a point stuck on a circle of radius 1. The point can never be further than 1 unit from either axis, so both coordinates live in the range -1 to 1 forever. Tangent has no such cage: it is the ratio sin θ / cos θ, and as cos θ shrinks near 90° the ratio grows without limit. If a calculation hands you sin θ = 1.4, something upstream is wrong.',
    },
    {
      question: 'Does the explorer upload anything or need an account?',
      answer:
        'No. It is a static page that runs entirely in your browser: the circle, the trig values, and the traced wave are all computed locally on the HTML canvas. Nothing is sent anywhere, there is no account, and it keeps working offline once loaded.',
    },
  ],
  guide: {
    slug: 'how-the-unit-circle-works',
    title: 'How the Unit Circle Works: Sin, Cos and Tan',
    description:
      'How the unit circle gives sin, cos, and tan for any angle, why radians make sense, the special angles worth memorizing, and where the sine wave comes from.',
    readMinutes: 6,
    updatedAt: 'Jul 2026',
    quickAnswer:
      'The unit circle is a circle of radius 1 centered at the origin, and the point at angle θ has coordinates exactly (cos θ, sin θ). That single fact defines sine and cosine for every angle. For example, at 45° the point sits at (0.707, 0.707), so sin and cos are both √2/2. Tangent is the ratio tan θ = sin θ / cos θ. Open the explorer, drag the point, and read sin cos tan values live as the reference triangle follows your angle.',
    sections: [
      {
        id: 'how-the-unit-circle-works',
        heading: 'How the Unit Circle Works',
        body:
          'Draw a circle of radius 1 and put an angle θ at the center, measured counter-clockwise from the positive x-axis. Some textbooks simply call it the trig circle. The radius arm meets the circle at one point, and that point\'s coordinates are the whole story: x = cos θ and y = sin θ. Drop a vertical line to the x-axis and you get the reference triangle, whose horizontal leg is the cosine and vertical leg is the sine. Because the hypotenuse is 1, the Pythagorean theorem becomes the identity sin² θ + cos² θ = 1, which is why sin and cos can never leave the range -1 to 1.',
        bullets: [
          'The horizontal coordinate of the point is cos θ',
          'The vertical coordinate of the point is sin θ',
          'tan θ = sin θ / cos θ, the slope of the radius arm',
        ],
      },
      {
        id: 'radians-and-degrees',
        heading: 'Radians and Degrees',
        body:
          'Degrees chop a full turn into 360 equal parts because the Babylonians liked the number; radians measure the angle by the arc it cuts on the unit circle. A full turn is an arc of 2π (the circumference), a half turn is π, and a right angle is π/2. For example, 60° is π/3 radians, an arc exactly one third of π long. To convert radians and degrees by hand, multiply radians by 180/π or degrees by π/180. However, the explorer shows radians and degrees side by side while you drag, which is the fastest way to build the mental conversion table without formulas.',
      },
      {
        id: 'special-angles',
        heading: 'Special Angles and Reference Angles',
        body:
          'Three acute angles carry exact values worth memorizing: at 30° the values are sin θ = 1/2 and cos θ = √3/2, at 45° both equal √2/2, and at 60° they swap to sin θ = √3/2 and cos θ = 1/2. Every other angle on the classic chart reduces to one of these special angles through its reference angle, the acute angle between the radius arm and the x-axis. For example, 150° has reference angle 30°, so its sine is still 1/2 while its cosine flips sign to -√3/2 because the point is now left of the y-axis. Quadrants only change signs, never magnitudes.',
      },
      {
        id: 'where-the-sine-wave-comes-from',
        heading: 'Where the Sine Wave Comes From',
        body:
          'Set a rotation speed and watch the right side of the canvas: as the point circles at a steady rate, its height traced against the angle draws a perfect sine wave. This is the deep link between circular motion and oscillation. A wheel turning, an alternating current, and a speaker cone all move in circles or cycles, and therefore their graphs are sine waves. Programmers lean on the same picture when rotating sprites in games or graphics: every rotation is a walk around this circle. The dashed line from the point to the wave shows the projection happening in real time, and you can also treat the page as a unit circle calculator: pause, type or drag an exact angle, and read the values.',
      },
    ],
    mistakes: [
      {
        heading: 'Forgetting the sign flips outside quadrant I',
        body:
          'The magnitudes repeat in every quadrant; only the signs change. In quadrant II the cosine is negative, in quadrant III both sine and cosine are negative, and in quadrant IV the sine is negative. If your answer has the right size but the wrong sign, check which side of each axis the point is on.',
      },
      {
        heading: 'Mixing radians and degrees in one calculation',
        body:
          'A calculator set to radians treats 45 as 45 radians, about 7 full turns, not the 45° you meant. Keep every angle in one unit for the whole calculation. The explorer always shows both readouts, so use it to sanity-check which unit a value is in.',
      },
      {
        type: 'note',
        heading: 'Reading tangent off the circle',
        body:
          'tan θ is not a coordinate of the point; it is the ratio of the two legs, sin θ / cos θ, and equals the slope of the radius arm. That is why it is undefined at 90° and 270°, where the arm is vertical. Everything runs in your browser and works offline, so drag through those angles freely and watch the readout blow up and flip sign.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: unitCircle.paramBehavior,
  aspect: unitCircle.aspect,
  params: unitCircle.params,
  presets: unitCircle.presets,
  formula: unitCircle.formula,
};
