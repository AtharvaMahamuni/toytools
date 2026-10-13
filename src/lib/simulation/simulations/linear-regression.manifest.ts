// Declarative manifest for the Linear Regression Playground (Applied Math). Single source of truth
// for its config, knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in
// linear-regression.ts. No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import linearRegression from './linear-regression';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Linear Regression Playground',
    slug: 'linear-regression-playground',
    processorId: 'linear-regression',
    domain: 'math-lab',
    category: 'applied-math',
    family: 'statistics',
    difficulty: 'intermediate',
    schoolLevel: 'high-school',
    estimatedLearningTime: '6 min',
    prerequisites: ['slope of a line', 'mean', 'scatter plots'],
    nextTopics: ['correlation', 'residual plots'],
    curriculumTags: ['statistics', 'linear regression'],
    learningObjectives: [
      'Fit a least squares line to points you place and read its slope and intercept',
      'Explain R squared as a score for the whole line, separate from any one residual',
      'See why two points always give R squared of 1 and why one outlier moves the slope',
    ],
    keyTakeaways: [
      'The least squares line minimizes the sum of squared vertical residuals',
      'R squared near 1 means the line tracks the points; a residual is one point gap',
      'Two points force R squared to 1, so a third point is what tests the fit',
    ],
  },
  concepts: {
    primary: ['linear regression calculator'],
    secondary: ['least squares', 'r squared', 'residual', 'scatter plot', 'line of best fit'],
    aliases: [
      'least squares calculator',
      'line of best fit calculator',
      'r squared calculator',
      'scatter plot line',
    ],
  },
  equations: [
    {
      id: 'least-squares-slope',
      symbol: 'm',
      expression: 'm = (n * Sxy - Sx * Sy) / (n * Sxx - Sx * Sx)',
      description:
        'Least squares slope from the sums of x, of y, of x times y, and of x squared.',
      variables: [
        { symbol: 'm', label: 'Slope', unit: '', measurementId: 'slope' },
        { symbol: 'n', label: 'Points', unit: '', measurementId: 'n' },
      ],
    },
    {
      id: 'r-squared',
      symbol: 'R²',
      expression: 'R² = 1 - SSres / SStot',
      description:
        'R squared is 1 minus leftover squared residuals over the squared distance from the mean of y. It is 1 when every point sits on the line.',
      variables: [
        { symbol: 'R²', label: 'R squared', unit: '', measurementId: 'r2' },
      ],
    },
  ],
  educational: {
    summary:
      'Drag points on a scatter plot and read the least squares line, its equation, and R squared.',
    intentGroups: {
      informational: ['What is a least squares line?', 'What does R squared measure on a scatter plot?'],
      howTo: ['How to fit a line of best fit by dragging points', 'How to read a residual on a scatter plot'],
      comparison: ['R squared vs the residual', 'What is the difference between R squared and a residual?'],
      misconception: [
        'Two points do not prove a strong linear pattern',
        'A high R squared does not make every residual small',
      ],
      troubleshooting: ['Why two points always show a perfect fit', 'Why one outlier can flatten the slope'],
    },
    commonMistakes: [
      'Reading R squared as the size of a residual',
      'Trusting a perfect fit from only two points',
      'Letting one outlier set the slope',
    ],
    realWorldUseCases: [
      'Checking a lab scatter plot before quoting a slope',
      'Showing a class why one outlier moves a line of best fit',
      'Comparing a hand-drawn line with the least squares line',
    ],
    audience: ['students', 'teachers', 'math learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Linear Regression Calculator: Least Squares Line',
    description:
      'Linear regression calculator: place points on a scatter plot and read the line of best fit, its equation, and R squared.',
    tagline: 'Drag points and read the least squares line and R squared.',
    keywords: [
      'linear regression calculator',
      'least squares',
      'r squared',
      'residual',
      'scatter plot',
      'line of best fit',
    ],
  },
  presentation: {
    tags: [
      'linear regression calculator',
      'least squares',
      'r squared',
      'residual',
      'scatter plot',
      'line of best fit',
    ],
    updatedAt: '2026-10-09',
    trustVariant: 'offline',
  },
  examples: [
    {
      title: 'Five point line',
      body: 'The default points give y = 0.91x + 1.11 and R² = 0.880. The largest gap is 0.85 at (4, 3.9).',
    },
    {
      title: 'A perfect line',
      body: 'Points (1, 1), (2, 2), (3, 3), and (4, 4) sit on y = x. The slope is 1, the intercept is 0, and R² is 1.',
    },
    {
      title: 'One outlier',
      body: 'The outlier preset adds (5, 1) as point 6. The slope drops to about 0.33 and R² drops to about 0.089.',
    },
    {
      title: 'Two points',
      body: 'Any two points report R² = 1, because one line passes through both. A third point is what can miss the line.',
    },
  ],
  faq: [
    {
      question: 'What is a least squares line?',
      answer:
        'A least squares line is the straight line with the smallest sum of squared residuals. The five default points are (1, 2.2), (2, 2.8), (3, 4.1), (4, 3.9), and (5, 6.2). Their line of best fit is y = 0.91x + 1.11. The slope is 0.91, the intercept is 1.11, and R² is 0.880.',
    },
    {
      question: 'What is the difference between R squared and a residual?',
      answer:
        'R squared scores the whole line, and a residual is the vertical miss at one point. On the default points R² is 0.880. Point 4, which is (4, 3.9), still has an absolute residual of 0.85. A high R squared does not make every residual small.',
    },
    {
      question: 'Why do two points always show a perfect fit?',
      answer:
        'Two points always show a perfect fit, since one line passes through both and R² becomes 1. The perfect preset uses (1, 1), (2, 2), (3, 3), and (4, 4), and R² is exactly 1. Add a third point before you trust the slope, because two points always lie on a line.',
    },
    {
      question: 'How does one outlier change this line?',
      answer:
        'The outlier preset keeps the five default points and adds (5, 1) as point 6. The slope falls from 0.91 to about 0.33, and the intercept rises from 1.11 to about 2.28. R² falls from 0.880 to about 0.089, and point 6 has an absolute residual near 2.91. Letting one outlier set the slope is why that preset exists.',
    },
    {
      question: 'What does the largest residual on the default points mean?',
      answer:
        'The largest absolute residual on the default points is 0.85, at point 4. At x = 4 the fitted line predicts about 4.75. The point is (4, 3.9), so it sits 0.85 below that prediction.',
    },
    {
      question: 'How do I add and move points?',
      answer:
        'Tap empty space to add a point, up to eight, and drag a point to move it. Both axes run from 0 to 10, and a drag keeps every point inside that square. Checking a lab scatter plot before quoting a slope is the same gesture. Move the doubtful point and read the new fitted slope.',
    },
    {
      question: 'Does this fit more than one input?',
      answer:
        'This page fits one line, y = mx + b, and does not run multiple or logistic regression. Each point is a single pair, and eight points is the maximum. Comparing a hand-drawn line with the least squares line takes one look at the canvas.',
    },
  ],
  guide: {
    slug: 'what-is-a-least-squares-line',
    title: 'What Is a Least Squares Line?',
    description:
      'What a least squares line is, how R squared differs from a residual, and why two points always look perfect.',
    readMinutes: 5,
    updatedAt: '2026-10-09',
    quickAnswer:
      'A least squares line is the straight line that minimizes the sum of squared vertical gaps. This linear regression calculator is a least squares calculator, and the same page is the line of best fit calculator. For the five default points the equation is y = 0.91x + 1.11, and R² is 0.880. Drag any point and both the slope and R² update on the canvas. Two points always report R² = 1, so add a third before you trust the fit.',
    sections: [
      {
        id: 'what-is-a-least-squares-line',
        heading: 'What is a least squares line?',
        body:
          'A least squares line is the straight line with the smallest sum of squared residuals. The default scatter plot uses (1, 2.2), (2, 2.8), (3, 4.1), (4, 3.9), and (5, 6.2). Their line of best fit is y = 0.91x + 1.11, and R² is 0.880.',
      },
      {
        id: 'read-slope-and-r-squared',
        heading: 'How do you read the slope and R squared?',
        body:
          'Slope is the y change per unit x, and R squared is the share of scatter explained. What R squared measures on a scatter plot is that share. On the default line that rise is 0.91, from an intercept of 1.11. Dragging points is how you fit the line of best fit, and the slope falls when you drag (5, 6.2) down while R² moves with it. For example, a small nudge at x = 5 changes both the slope and R² at once.',
        bullets: [
          'Slope 0.91 means y rises by 0.91 when x grows by 1.',
          'R² of 0.880 means the line accounts for most of the vertical scatter.',
          'The intercept 1.11 is the height of the line at x = 0.',
        ],
      },
      {
        id: 'r-squared-vs-residual',
        heading: 'What is the difference between R squared and a residual?',
        body:
          'R squared scores the whole line, while a residual is the vertical gap at a single point. The difference between them is scope: the line versus one point. The default line has R² = 0.880 and a largest absolute residual of 0.85 at (4, 3.9). Reading R squared as the size of a residual mixes those two facts.',
      },
      {
        id: 'two-points-perfect-fit',
        heading: 'Why do two points always show a perfect fit?',
        body:
          'Two points always show a perfect fit, and R² is 1, because one line passes through both. Two points do not prove a strong linear pattern. Trusting a perfect fit from only two points treats that geometry as evidence. The outlier preset is for showing a class why one outlier moves a line of best fit. Point 6 is (5, 1), and R² falls from 0.880 to about 0.089.',
      },
    ],
    mistakes: [
      {
        heading: 'Why is R squared not a residual?',
        body:
          'Reading R squared as the size of a residual is the mix-up this page is built to stop. The default fit shows both at once: R² is 0.880 and the largest residual is 0.85. Keep the two numbers apart when you write the result.',
      },
      {
        heading: 'Why does a two point fit look perfect?',
        body:
          'Trusting a perfect fit from only two points will report R² = 1 every time. That score is geometry, not a finding about your data. Place a third point and the line finally has a chance to miss.',
      },
      {
        type: 'note',
        heading: 'What should you do with one far point?',
        body:
          'Letting one outlier set the slope happens as soon as you drop in a far point. The outlier preset adds (5, 1) and the slope moves from 0.91 to about 0.33. Drag that point back toward the line and watch the slope recover.',
      },
    ],
  },
  citation: {
    problem:
      'Place and drag points on a scatter plot to read the least-squares line, its equation, and R squared.',
    nonGoal: 'run multiple regression or logistic regression.',
  },
  job: {
    intent: 'simulate',
    userJob: 'Place and drag points and read the least-squares line, its equation, and R squared.',
    repeatability: 'medium',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  relationships: {
    usedWith: [
      {
        slug: 'statistics-visualizer',
        reason: 'Mean and spread of the y values sit beside the line this page fits',
        strength: 0.8,
      },
    ],
  },
  paramBehavior: linearRegression.paramBehavior,
  aspect: linearRegression.aspect,
  params: linearRegression.params,
  presets: linearRegression.presets,
  formula: linearRegression.formula,
};
