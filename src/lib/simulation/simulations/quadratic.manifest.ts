// Declarative manifest for the Quadratic Equation Explorer (Applied Math). Single source of truth
// for its config, knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in
// quadratic.ts. No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import quadratic from './quadratic';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Quadratic Equation Solver',
    slug: 'quadratic-equation-solver',
    processorId: 'quadratic',
    domain: 'math-lab',
    category: 'applied-math',
    family: 'algebra',
    difficulty: 'beginner',
    schoolLevel: 'high-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['linear equations', 'graphing basics'],
    nextTopics: ['polynomials', 'completing the square'],
    curriculumTags: ['algebra'],
    learningObjectives: [
      'Solve ax² + bx + c = 0 with the quadratic formula and read the roots off the parabola',
      'Use the discriminant b² - 4ac to predict two, one, or zero real roots before solving',
      'Connect the standard form coefficients to the vertex and the axis of symmetry',
    ],
    keyTakeaways: [
      'The discriminant Δ = b² - 4ac alone decides how many real roots exist',
      'The vertex sits at x = -b / 2a, on the axis of symmetry',
      'The sign of a decides whether the parabola opens upward or downward',
    ],
  },
  concepts: {
    primary: ['quadratic equation'],
    secondary: ['quadratic formula', 'discriminant', 'parabola', 'vertex form', 'axis of symmetry', 'roots'],
    aliases: ['quadratic formula calculator', 'quadratic equation solver', 'parabola grapher', 'quadratic explorer'],
  },
  equations: [
    {
      id: 'quadratic-formula',
      symbol: 'x',
      expression: 'x = (-b ± √Δ) / 2a where Δ = b² - 4ac',
      description: 'The quadratic formula gives both roots of ax² + bx + c = 0; the discriminant Δ under the square root decides how many are real.',
      variables: [
        { symbol: 'a', label: 'Coefficient a', unit: '', paramId: 'a' },
        { symbol: 'b', label: 'Coefficient b', unit: '', paramId: 'b' },
        { symbol: 'c', label: 'Coefficient c', unit: '', paramId: 'c' },
        { symbol: 'Δ', label: 'Discriminant', unit: '', measurementId: 'discriminant' },
      ],
    },
    {
      id: 'vertex',
      symbol: '(h, k)',
      expression: 'h = -b / 2a and k = c - b² / 4a',
      description: 'The vertex of the parabola, the point where it turns, sits on the axis of symmetry x = h.',
      variables: [
        { symbol: 'h', label: 'Vertex x', unit: '', measurementId: 'vertexX' },
        { symbol: 'k', label: 'Vertex y', unit: '', measurementId: 'vertexY' },
      ],
    },
  ],
  educational: {
    summary:
      'Slide a, b, and c or drag the vertex and watch the parabola, roots, discriminant, and axis of symmetry respond live.',
    intentGroups: {
      informational: ['What is the discriminant of a quadratic equation?', 'What does the vertex of a parabola tell you?', 'What is the axis of symmetry?'],
      howTo: ['How to solve a quadratic equation with the quadratic formula', 'How to find the vertex from standard form'],
      comparison: ['Standard form vs vertex form', 'Factoring vs the quadratic formula'],
      misconception: ['A negative discriminant does not mean the equation has no answer, only no real roots', 'The parabola is not a picture of the ball path for every equation'],
      troubleshooting: ['Why a quadratic has no real roots', 'Why the parabola opens downward'],
    },
    commonMistakes: [
      'Dropping the negative sign in -b when applying the quadratic formula',
      'Forgetting that a negative discriminant means no real roots, not no roots at all',
      'Reading the y-intercept as the vertex',
    ],
    realWorldUseCases: [
      'Checking quadratic homework by watching the roots move as coefficients change',
      'Teaching the discriminant visually: nudge c until the parabola lifts off the x-axis',
      'Seeing why projectile heights and profit curves are parabolas',
      'Building intuition for vertex form before completing the square',
    ],
    audience: ['students', 'teachers', 'math learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Quadratic Equation Solver: Roots & Parabola',
    description:
      'Find the roots of a quadratic equation visually. Slide the coefficients and watch the roots, discriminant, vertex and axis of symmetry move on a parabola.',
    tagline: 'Slide the coefficients and watch the roots move on a live parabola.',
    keywords: ['quadratic formula', 'quadratic equation solver', 'discriminant', 'parabola', 'vertex form', 'axis of symmetry'],
  },
  presentation: {
    tags: ['quadratic equation', 'quadratic formula', 'quadratic equation solver', 'discriminant', 'parabola', 'vertex form', 'axis of symmetry', 'roots of a quadratic'],
    updatedAt: '2026-07-16',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Two clean roots', body: 'The default x² - 2x - 3 factors as (x - 3)(x + 1): watch the parabola cross the x-axis exactly at x = 3 and x = -1.' },
    { title: 'Kissing the axis', body: 'Load the perfect square preset: Δ = 0 and the vertex touches the x-axis at the single repeated root x = 2.' },
    { title: 'Floating above', body: 'With x² + 4 the discriminant is negative: the parabola floats above the x-axis and there are no real roots to find.' },
    { title: 'Drag the vertex', body: 'Grab the vertex and move it anywhere: the explorer solves b and c from vertex form so the algebra follows your hand.' },
  ],
  faq: [
    {
      question: 'What is the quadratic formula?',
      answer:
        'For any equation ax² + bx + c = 0 with a not 0, the quadratic formula x = (-b ± √(b² - 4ac)) / 2a gives both solutions at once. It works even when factoring is ugly or impossible. For example, with a = 1, b = -2, c = -3 the formula gives (2 ± 4) / 2, so x = 3 and x = -1. The explorer runs this live: change any coefficient and the marked roots slide along the x-axis.',
    },
    {
      question: 'What does the discriminant tell you?',
      answer:
        'The discriminant is the part under the square root, Δ = b² - 4ac, and its sign alone answers "how many real roots?" before you solve anything. Positive Δ means two real roots, Δ = 0 means one repeated root where the vertex touches the x-axis, and negative Δ means no real roots. Watch the Δ readout as you raise c: the moment it crosses zero the parabola lifts off the axis.',
    },
    {
      question: 'How do I find the vertex of a parabola from standard form?',
      answer:
        'The x-coordinate of the vertex is always h = -b / 2a, and substituting h back in gives the y-coordinate k. The vertical line x = h is the axis of symmetry: the parabola is a mirror image across it. For example, x² - 2x - 3 has h = 1 and k = -4, so the vertex is (1, -4). In the explorer the dashed line and the vertex dot track this for you continuously.',
    },
    {
      question: 'What happens when a is negative or zero?',
      answer:
        'The sign of a sets the direction the parabola opens: positive a opens upward with the vertex as a minimum, negative a opens downward with the vertex as a maximum. At exactly a = 0 the x² term disappears and the equation is not quadratic any more, just the line y = bx + c. Slide a through zero and watch the parabola flatten into a line and flip over.',
    },
    {
      question: 'Can I type exact coefficients instead of using sliders?',
      answer:
        'Yes. The formula panel doubles as a quadratic equation solver: type your own a, b, and c into the number boxes and the parabola, roots, vertex, and discriminant all follow. The panel also shows the discriminant worked with your numbers, which is handy for checking each step of homework against the picture.',
    },
    {
      question: 'What is the axis of symmetry of a parabola?',
      answer:
        'It is the vertical line x = -b / 2a that cuts the parabola into two mirror halves, passing exactly through the vertex. Everything on the curve pairs up across it, which is why the two roots always sit at equal distances from it. For example, x² - 2x - 3 has axis x = 1, and its roots -1 and 3 are each two units away. The explorer draws the axis as a dashed line so the mirror symmetry is visible while you drag.',
    },
    {
      question: 'How do I convert standard form to vertex form?',
      answer:
        'Compute h = -b / 2a and k by substituting h back in, then write y = a(x - h)² + k. For example, x² - 2x - 3 gives h = 1 and k = -4, so the vertex form is y = (x - 1)² - 4. This is the same result completing the square produces, just reached through the vertex coordinates. Drag the vertex in the explorer and it performs the reverse conversion live, solving b and c from your chosen h and k.',
    },
    {
      question: 'Should I factor or use the quadratic formula?',
      answer:
        'Factor when the roots are small whole numbers you can spot quickly: x² - 2x - 3 factors as (x - 3)(x + 1) in one step. Reach for the quadratic formula when factoring is not obvious within a few seconds, because it works on every quadratic, including ones with fractional, irrational, or no real roots. A useful habit: check the discriminant first, since a perfect-square Δ (like 16) signals that a clean factoring exists.',
    },
  ],
  guide: {
    slug: 'how-the-quadratic-formula-works',
    title: 'How the Quadratic Formula Works, Visually',
    description:
      'What the quadratic formula and the discriminant really say, how the vertex and axis of symmetry come from a, b, and c, and how to read roots off a parabola.',
    readMinutes: 6,
    updatedAt: '2026-07-16',
    quickAnswer:
      'A quadratic equation ax² + bx + c = 0 is solved by the quadratic formula x = (-b ± √(b² - 4ac)) / 2a. The discriminant Δ = b² - 4ac decides everything before you finish: two real roots when Δ > 0, one repeated root when Δ = 0, none when Δ < 0. For example, x² - 2x - 3 has Δ = 16, so the parabola crosses the x-axis twice, at x = 3 and x = -1. Open the explorer, slide the coefficients, and watch the algebra and the picture move together.',
    sections: [
      {
        id: 'how-the-quadratic-formula-works',
        heading: 'How the Quadratic Formula Works',
        body:
          'The formula packs the whole solving procedure into one expression: x = (-b ± √Δ) / 2a with Δ = b² - 4ac. The -b / 2a part is the center of the parabola, and the ± √Δ / 2a part steps left and right from that center to where the curve crosses the x-axis. That is why the two roots always sit symmetrically around the axis of symmetry. For example, with x² - 2x - 3 the center is x = 1 and the step is 2, landing on x = -1 and x = 3, exactly where the explorer draws its root markers.',
        bullets: [
          'Δ > 0: two real roots, the parabola crosses the x-axis twice',
          'Δ = 0: one repeated root, the vertex touches the axis',
          'Δ < 0: no real roots, the parabola never reaches the axis',
        ],
      },
      {
        id: 'vertex-and-axis',
        heading: 'The Vertex and the Axis of Symmetry',
        body:
          'Every parabola turns exactly once, at its vertex. From standard form the vertex x-coordinate is h = -b / 2a, and the vertical line x = h is the axis of symmetry. Rewriting the equation as y = a(x - h)² + k is called vertex form, and it makes transformations obvious: h shifts the curve sideways, k lifts it, and a stretches it. In the explorer you can work this direction physically: drag the vertex anywhere and the tool solves b and c from vertex form so the sliders follow your hand.',
      },
      {
        id: 'reading-the-coefficients',
        heading: 'What a, b, and c Each Do',
        body:
          'The three coefficients have three distinct jobs. a sets the shape: bigger |a| makes a narrower parabola, and a negative a flips it to open downward. c is simply the y-intercept, the height where the curve crosses the y-axis at x = 0. b is the subtle one: it slides the vertex along a path, tilting the curve around its intercept. However, at exactly a = 0 the equation stops being quadratic altogether and collapses to the straight line y = bx + c, which is why the explorer flags that case instead of pretending a parabola exists.',
      },
      {
        id: 'discriminant-in-practice',
        heading: 'Using the Discriminant Before You Solve',
        body:
          'The fastest exam habit a quadratic equation solver can teach you is computing Δ = b² - 4ac first. It costs one line and tells you what kind of answer to expect, so a negative square root never ambushes you mid-formula. For example, 2x² + 3x + 4 has Δ = 9 - 32 = -23, so you can state "no real roots" immediately and move on. In this quadratic explorer, raise c slowly and watch the two root markers slide together, merge at Δ = 0, and vanish as Δ goes negative: that is the discriminant working in real time. The formula panel doubles as a quadratic formula calculator, so you can type exact coefficients and check the worked Δ line, and the live curve makes the page a quick parabola grapher too.',
      },
    ],
    mistakes: [
      {
        heading: 'Losing the minus sign on -b',
        body:
          'When b is already negative, -b turns positive, and dropping that flip is the single most common quadratic formula error. For x² - 2x - 3, the formula starts with -(-2) = +2, not -2. Type the coefficients into the formula panel and compare against the worked discriminant line to catch sign slips.',
      },
      {
        heading: 'Treating a negative discriminant as a dead end',
        body:
          'A negative discriminant does not mean the equation has no answer, only no real roots: Δ < 0 means the parabola never crosses the x-axis, and the equation still has two complex solutions in later courses. Do not force a real answer where the picture shows none: the curve floating clear of the axis is the honest result.',
      },
      {
        type: 'note',
        heading: 'Check answers against the picture',
        body:
          'Every algebraic claim has a visual twin: roots are crossings, the vertex is the turn, the axis of symmetry is the mirror line, and the y-intercept is where x = 0. Everything runs in your browser and works offline, so drag, slide, and let the parabola referee your algebra.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: quadratic.paramBehavior,
  aspect: quadratic.aspect,
  params: quadratic.params,
  presets: quadratic.presets,
  formula: quadratic.formula,
};
