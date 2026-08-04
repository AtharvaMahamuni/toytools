// Declarative manifest for the Probability Lab (Applied Math). Single source of truth for its
// config, knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in probability.ts.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import probability from './probability';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Probability Calculator',
    slug: 'probability-calculator',
    processorId: 'probability',
    domain: 'math-lab',
    category: 'applied-math',
    family: 'probability',
    difficulty: 'beginner',
    schoolLevel: 'middle-school',
    estimatedLearningTime: '5 min',
    prerequisites: ['fractions', 'percentages'],
    nextTopics: ['expected value', 'binomial distribution'],
    curriculumTags: ['probability'],
    learningObjectives: [
      'Distinguish theoretical probability (1/n) from the empirical frequency an experiment produces',
      'Explain what the law of large numbers does and does not promise',
      'Predict how sample size changes how wildly results swing',
    ],
    keyTakeaways: [
      'Theoretical probability is a ratio of outcomes; empirical frequency is measured by running trials',
      'Small samples swing wildly; large samples settle near the theoretical value',
      'The law of large numbers works by dilution, not correction: coins have no memory',
    ],
  },
  concepts: {
    primary: ['probability'],
    secondary: ['law of large numbers', 'empirical probability', 'theoretical probability', 'coin flip', 'dice roll', 'sample size'],
    aliases: ['coin flip simulator', 'dice roll simulator', 'probability experiment', 'probability lab'],
  },
  equations: [
    {
      id: 'theoretical-probability',
      symbol: 'P',
      expression: 'P(face) = 1 / n',
      description: 'For a fair object with n equally likely faces, each face has probability 1/n.',
      variables: [
        { symbol: 'P', label: 'Theoretical P', unit: '', measurementId: 'theoretical' },
        { symbol: 'n', label: 'Sides', unit: '', paramId: 'sides' },
      ],
    },
    {
      id: 'empirical-frequency',
      symbol: 'f',
      expression: 'f = successes / trials',
      description: 'The empirical frequency is what the experiment actually measures; it approaches P as trials grow.',
      variables: [
        { symbol: 'f', label: 'Empirical frequency', unit: '', measurementId: 'empirical' },
      ],
    },
  ],
  educational: {
    summary:
      'Flip a coin or roll a die at up to 60 trials a second and watch the empirical frequency converge on the theoretical probability.',
    intentGroups: {
      informational: ['What is the law of large numbers?', 'What is the difference between empirical and theoretical probability?'],
      howTo: ['How to run a coin flip experiment', 'How to estimate a probability from trials'],
      comparison: ['Empirical vs theoretical probability', 'Small samples vs large samples'],
      misconception: ['A run of heads does not make tails more likely', 'The law of large numbers does not correct past streaks'],
      troubleshooting: ['Why results swing so much early on', 'Why the empirical frequency never settles exactly on the theoretical value'],
    },
    commonMistakes: [
      'Expecting tails to be "due" after a streak of heads (the gambler\'s fallacy)',
      'Trusting a probability estimated from a handful of trials',
      'Expecting the empirical frequency to land exactly on the theoretical value',
    ],
    realWorldUseCases: [
      'Projecting a live coin flip experiment in a classroom instead of flipping by hand',
      'Showing why polls and quality checks need large samples',
      'Building intuition for streaks before studying expected value',
      'Demonstrating the gambler\'s fallacy with data instead of words',
    ],
    audience: ['students', 'teachers', 'math learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Probability Calculator: Coin Flips & Law of Large Numbers',
    description:
      'Flip a coin or roll a die thousands of times and watch the empirical frequency converge on the theoretical probability. The law of large numbers, animated.',
    keywords: ['coin flip simulator', 'dice roll simulator', 'law of large numbers', 'empirical probability', 'theoretical probability', 'probability experiment'],
  },
  presentation: {
    tags: ['probability calculator', 'probability', 'coin flip simulator', 'dice roll simulator', 'law of large numbers', 'empirical probability', 'theoretical probability', 'probability experiment', 'sample size'],
    updatedAt: '2026-07-16',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'The wild start', body: 'Run 10 flips: frequencies like 0.7 or 0.3 are completely normal. Streaks dominate small samples.' },
    { title: 'The long settle', body: 'Leave it at 60 trials a second for a minute and watch the green line hug the dashed theoretical line.' },
    { title: 'Loaded question', body: 'Switch to a 6-sided die: face 1 now converges to 1/6, about 0.167, one sixth of the coin value.' },
    { title: 'One tap at a time', body: 'Pause and tap the canvas to run single trials, exactly like flipping by hand but with the tally kept for you.' },
  ],
  faq: [
    {
      question: 'What is the law of large numbers?',
      answer:
        'It is the theorem that the empirical frequency of an outcome approaches its theoretical probability as the number of independent trials grows. Flip a fair coin forever and the fraction of heads heads to 0.5. Crucially it says nothing about any single flip and nothing about short runs: it is a statement about long-run averages, which the convergence graph in this lab shows happening in real time.',
    },
    {
      question: 'What is the difference between empirical and theoretical probability?',
      answer:
        'Theoretical probability comes from counting outcomes: a fair coin has 2 equally likely faces, so P(heads) = 1/2. Empirical probability comes from experiments: flip 100 times, count 47 heads, and the empirical frequency is 0.47. The theoretical value is fixed; the empirical value wobbles around it and settles closer as trials accumulate. The lab shows both at once so the difference is visible rather than abstract.',
    },
    {
      question: 'After five heads in a row, is tails more likely?',
      answer:
        'No. Each flip is independent: the coin has no memory, so the probability of tails stays exactly 1/2. Expecting a correction is the gambler\'s fallacy. What the law of large numbers actually does is dilute streaks under thousands of newer flips, not cancel them. Run the lab after a visible streak and watch the frequency drift back without any compensating streak of tails.',
    },
    {
      question: 'How many trials do I need before the estimate is trustworthy?',
      answer:
        'More than intuition suggests. The wobble of an empirical frequency shrinks roughly with the square root of the trial count, so to halve the noise you need four times the trials. Ten flips can show 0.7 without anything being wrong; a thousand flips lands within a few hundredths of 0.5 in the vast majority of runs. Watch the gap readout: it falls fast at first, then grinds slowly, which is exactly the square-root behavior.',
    },
    {
      question: 'Is the randomness in this lab real?',
      answer:
        'It uses a seeded pseudo-random generator, the same kind games and simulations use. The sequence is statistically fair (every face equally likely, no usable pattern) but reproducible: press Reset and the identical sequence replays, which is deliberate so an experiment can be repeated exactly while still behaving like chance.',
    },
    {
      question: 'What is the probability of rolling a specific number on a die?',
      answer:
        'For a fair six-sided die, each face has probability 1/6, about 0.167, because six outcomes are equally likely and exactly one counts. The same logic gives 1/n for any fair n-sided object, which is the theoretical line the lab draws. Switch the sides slider to 6, let it run, and watch face 1 settle toward 0.167 while every short stretch of rolls still looks streaky.',
    },
    {
      question: 'What is the difference between probability and odds?',
      answer:
        'Probability compares successes to ALL outcomes; odds compare successes to failures. A fair coin has probability 1/2 of heads but odds of 1 to 1; rolling a 6 has probability 1/6 but odds of 1 to 5. The two encode the same information, so convert with odds = p / (1 - p). Casinos and bookmakers quote odds, textbooks quote probability, and mixing the two is a classic source of wrong answers.',
    },
    {
      question: 'What is the probability of getting heads twice in a row?',
      answer:
        'One half times one half: 1/4. Independent events multiply, so a run of k heads has probability (1/2)^k, which is why five in a row (1/32) feels rare but shows up regularly in a few hundred flips. The multiplication rule is also why streaks in the lab are normal rather than evidence of a broken coin: with thousands of trials, improbable runs get plenty of chances to happen.',
    },
    {
      question: 'Does the lab upload anything or need an account?',
      answer:
        'No. Every trial runs in your browser on the HTML canvas. Nothing is sent anywhere, there is no account, and the lab keeps working offline once loaded.',
    },
  ],
  guide: {
    slug: 'how-the-law-of-large-numbers-works',
    title: 'How the Law of Large Numbers Works',
    description:
      'Empirical vs theoretical probability, why small samples swing wildly, what the law of large numbers really promises, and why coins have no memory.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
    quickAnswer:
      'Theoretical probability counts outcomes: a fair coin gives heads with P = 1/2. Empirical probability measures experiments: the fraction of heads you actually saw. The law of large numbers connects them: as independent trials pile up, the empirical frequency converges on the theoretical value. For example, 10 flips can easily show 70 percent heads, but 10,000 flips will almost surely sit near 50 percent. Open the lab, run trials at up to 60 per second, and watch the convergence happen on the graph.',
    sections: [
      {
        id: 'how-the-law-of-large-numbers-works',
        heading: 'How the Law of Large Numbers Works',
        body:
          'Every trial adds one data point, and the empirical frequency is the running average of them all. Early on, each new flip moves that average a lot: one streak of heads can push 10 flips to 0.8. But by trial 1,000 a single flip shifts the average by at most 0.001, so old streaks matter less and less. That dilution is the whole mechanism. Therefore the law promises convergence of the AVERAGE over the long run; it never promises the next flip, and it never balances the books after a streak.',
        bullets: [
          'Theoretical: P(face) = 1/n from counting equally likely outcomes',
          'Empirical: successes divided by trials, measured by experiment',
          'Convergence comes from dilution, not correction',
        ],
      },
      {
        id: 'small-samples',
        heading: 'Why Small Samples Swing Wildly',
        body:
          'The noise in an empirical frequency shrinks roughly with the square root of the sample size, so precision is expensive: four times the trials buys only half the wobble. For example, at 100 flips a range like 0.4 to 0.6 is routine, while at 10,000 flips the frequency rarely strays past 0.51. This square-root law is why polls quote margins of error, why quality control samples in bulk, and why a probability estimated from a handful of trials deserves no trust. The gap readout in the lab makes the slow grind visible.',
      },
      {
        id: 'gamblers-fallacy',
        heading: 'Streaks and the Gambler\'s Fallacy',
        body:
          'After five heads in a row, tails feels "due", but each flip is independent and the coin has no memory: P(tails) is still exactly 1/2. The law of large numbers gets misread as a promise of correction; really it is a promise of dilution. The five extra heads never get cancelled, they just become invisible inside ten thousand later flips. For example, run the lab past a streak and watch the graph drift back to the line without any answering streak in the other direction.',
      },
      {
        id: 'empirical-in-practice',
        heading: 'Using Empirical Probability in Practice',
        body:
          'When outcomes are not equally likely (a bent coin, a real-world process), theory cannot hand you P, so measurement is all there is: run trials, count successes, divide. That is exactly what insurers, pollsters, and scientists do, with the square-root law dictating their sample sizes. In a classroom, project the lab as a coin flip simulator or a dice roll simulator and run a live probability experiment: every coin flip and dice roll lands in the tally with nobody flipping by hand. However, the lab uses fair objects on purpose: because you KNOW the true value is 1/n, you can watch how fast, and how reluctantly, an honest experiment reveals it.',
      },
    ],
    mistakes: [
      {
        heading: 'Believing an outcome is "due"',
        body:
          'A run of heads does not make tails more likely; independence means every flip is a fresh 1/2. If a streak changed the odds, the lab\'s graph would show compensating streaks, and it never does. The average drifts home by dilution alone.',
      },
      {
        heading: 'Trusting tiny samples',
        body:
          'An empirical frequency from 10 or 20 trials is nearly worthless: swings of 0.2 are routine. Before quoting a probability from data, check the sample size against the square-root rule, or simply run more trials, which the lab does at up to 60 per second.',
      },
      {
        type: 'note',
        heading: 'Exact equality never arrives',
        body:
          'The empirical frequency gets arbitrarily close to the theoretical probability but keeps jittering forever; landing exactly on it is a coincidence, not the goal. Everything runs in your browser and works offline, so let it run as long as you like.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: probability.paramBehavior,
  aspect: probability.aspect,
  params: probability.params,
  presets: probability.presets,
  formula: probability.formula,
};
