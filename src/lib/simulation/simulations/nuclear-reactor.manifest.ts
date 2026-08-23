// Declarative manifest for the Nuclear Reactor Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in nuclear-reactor.ts.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import nuclearReactor from './nuclear-reactor';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Nuclear Reactor Calculator',
    slug: 'nuclear-reactor-calculator',
    processorId: 'nuclear-reactor',
    domain: 'physics',
    category: 'physics',
    family: 'nuclear-physics',
    difficulty: 'advanced',
    schoolLevel: 'introductory-college',
    estimatedLearningTime: '8 min',
    prerequisites: ['exponential growth and decay', 'feedback loops'],
    nextTopics: ['nuclear fission', 'reactor safety systems'],
    curriculumTags: ['nuclear physics'],
    learningObjectives: [
      'Explain how delayed neutrons make a fission chain reaction controllable',
      'State what reactivity and the dollar unit mean, including the prompt-critical threshold at 1 $',
      'Describe how a temperature feedback coefficient can stabilize or destabilize a reactor',
    ],
    keyTakeaways: [
      'A reactor is critical when reactivity is zero: power neither rises nor falls',
      'Delayed neutrons give operators seconds to react; crossing 1 $ reactivity removes that margin',
      'A negative temperature coefficient is what makes most power reactors self-stabilizing',
    ],
  },
  concepts: {
    primary: ['nuclear reactor', 'reactivity'],
    secondary: ['point kinetics', 'delayed neutrons', 'prompt critical', 'temperature coefficient', 'control rod', 'reactor trip'],
    aliases: ['nuclear reactor', 'reactor kinetics', 'chain reaction', 'control rod', 'prompt critical', 'reactor scram'],
  },
  equations: [
    {
      id: 'point-kinetics',
      symbol: 'dn/dt',
      expression: 'dn/dt = ((rho minus beta) / Lambda) n + lambda c',
      description: 'The point-kinetics equation: how fast the neutron population n changes, driven by reactivity rho and fed by delayed neutrons from precursor concentration c.',
      variables: [
        { symbol: 'ρ', label: 'Reactivity', unit: '$', measurementId: 'reactivity' },
        { symbol: 'n', label: 'Reactor power', unit: '%', measurementId: 'power' },
      ],
    },
  ],
  educational: {
    summary:
      'Drag a control rod and watch a fission chain reaction respond: power rising, falling, or holding critical, with temperature feedback and a safety trip.',
    intentGroups: {
      informational: ['What is reactivity in a nuclear reactor?', 'What does prompt critical mean?', 'What is a reactor trip or scram?'],
      howTo: ['How to keep a reactor critical', 'How control rods control a chain reaction'],
      comparison: ['Prompt critical vs delayed critical', 'Positive vs negative temperature coefficient'],
      misconception: ['A reactor cannot explode like a bomb', 'More reactivity does not mean more power right away'],
      troubleshooting: ['Why the reactor tripped', 'Why power keeps rising even after the rod stops moving'],
    },
    commonMistakes: [
      'Confusing reactivity with power: reactivity is what makes power change, not the power level itself',
      'Assuming a control rod acts instantly on power rather than on the rate of change',
      'Thinking every reactor design is automatically self-stabilizing',
    ],
    realWorldUseCases: [
      'Understanding why nuclear reactors take seconds, not milliseconds, to change power safely',
      'Seeing why reactor operators watch the period, not just the power level',
      'Explaining why a negative temperature coefficient is a core safety feature',
      'Introducing why the Chernobyl accident involved a positive void coefficient at low power',
    ],
    audience: ['students', 'teachers', 'engineering learners'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Nuclear Reactor Calculator: Reactivity & Chain Reactions',
    description:
      'Drag a control rod and watch a fission chain reaction respond live: reactivity, delayed neutrons, temperature feedback, and an automatic safety trip.',
    tagline: 'Drag a control rod and watch a chain reaction respond in real time.',
    keywords: ['nuclear reactor simulator', 'reactivity', 'point kinetics', 'control rod', 'prompt critical', 'reactor trip', 'chain reaction'],
  },
  presentation: {
    tags: ['nuclear reactor calculator', 'nuclear reactor', 'reactivity', 'point kinetics', 'control rod', 'prompt critical', 'chain reaction', 'reactor trip', 'nuclear physics'],
    updatedAt: '2026-08-23',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Slow startup', body: 'Withdrawing the rod a little adds a small positive reactivity, and power climbs on a period of many seconds, plenty of time for an operator to react.' },
    { title: 'Prompt critical', body: 'Push reactivity past 1 $ and the chain reaction can sustain itself on prompt neutrons alone, so power rises in a fraction of a second, the line no reactor operator is meant to cross.' },
    { title: 'Negative feedback', body: 'As the core warms, a negative temperature coefficient quietly removes reactivity, the main reason most power reactors settle into a new steady state instead of running away.' },
    { title: 'Positive void coefficient', body: 'Some early reactor designs added reactivity as they heated up at low power, a self-reinforcing loop implicated in the Chernobyl accident.' },
  ],
  faq: [
    {
      question: 'What is reactivity in a nuclear reactor?',
      answer:
        'Reactivity measures how far a reactor sits from critical, not how much power it makes. It compares one generation of fissions to the generation before it. At zero reactivity the reactor is critical, so power holds steady. Positive reactivity makes power rise; negative reactivity makes it fall. Reactivity is expressed in dollars, where 1 $ equals the delayed neutron fraction, the exact amount needed to reach prompt critical.',
    },
    {
      question: 'What does prompt critical mean?',
      answer:
        'A reactor becomes prompt critical at 1 $ of reactivity. At that point, prompt neutrons alone can sustain the chain reaction, without waiting for delayed neutrons at all. Below 1 $, delayed neutrons set the pace instead, so the reactor responds over seconds and stays controllable by rods. At or past 1 $, power rises on the prompt neutron lifetime, a fraction of a second, too fast for a mechanical rod to catch. Because of that, real reactor designs keep a large margin below 1 $.',
    },
    {
      question: 'What is a reactor trip or scram?',
      answer:
        'A reactor trip, also called a scram, is an automatic safety shutdown. Instruments detect power or temperature crossing a preset limit, and the control rods drive fully into the core within seconds. That adds a large negative reactivity, so the chain reaction shuts down. In this simulator, exceeding 200% of rated power or 80 degrees C triggers the same trip, and the rod stays in until you press Reset.',
    },
    {
      question: 'How do control rods control a chain reaction?',
      answer:
        'Control rods absorb neutrons. Inserting one removes reactivity; withdrawing it adds reactivity. Because reactivity sets the rate power changes rather than the power level itself, a rod move does not snap power to a new value. Instead, it sends power onto a new trajectory, rising or falling over a period set by how far from critical the reactivity sits. Small, slow rod movements are therefore how operators keep that period long and controllable.',
    },
    {
      question: 'Can a nuclear reactor explode like a bomb?',
      answer:
        'No. A power reactor cannot detonate like a weapon, because its fuel is far too dilute and its geometry cannot hold a supercritical mass together under explosive compression. What can happen instead, and did happen historically, is a power excursion. Reactivity pushed past prompt critical drives a very fast, damaging rise in power and heat, which can destroy the reactor through steam explosions or fire. That excursion, not a nuclear detonation, is the failure mode this simulator makes intuitive.',
    },
    {
      question: 'Why did the reactor trip in this simulator?',
      answer:
        'A trip fires automatically once reactor power exceeds 200% of its rated value, or once core temperature passes 80 degrees C, whichever comes first. Both limits stand in for the many real instruments a reactor protection system actually watches. Once tripped, the control rod is forced fully in, regardless of where its slider sits. Only pressing Reset clears the trip and restarts the reactor from its normal steady state.',
    },
  ],
  guide: {
    slug: 'how-nuclear-reactor-kinetics-works',
    title: 'How Nuclear Reactor Kinetics Works',
    description:
      'What reactivity and prompt critical mean, how control rods and delayed neutrons make a chain reaction controllable, and how temperature feedback affects it.',
    readMinutes: 8,
    updatedAt: '2026-08-23',
    quickAnswer:
      'A nuclear reactor is controllable because most of the neutrons sustaining its chain reaction arrive seconds after fission, not instantly. Reactivity measures how far the reactor sits from critical: positive reactivity makes power rise, negative makes it fall, and zero holds it steady. For example, withdrawing a control rod a little adds a small positive reactivity, and power climbs slowly over many seconds. Push reactivity past 1 dollar, the prompt-critical threshold, and the chain reaction sustains itself on prompt neutrons alone, rising in a fraction of a second instead. In this simulator, drag the control rod and watch reactor power, reactivity, period, and core temperature respond live, with an automatic trip standing in for a real reactor protection system.',
    sections: [
      {
        id: 'how-it-works',
        heading: 'How Does This Reactor Simulator Work?',
        body:
          'This simulator solves one-group point kinetics live, the reactor kinetics equations for how a neutron population responds to reactivity. Drag the control rod and reactivity changes instantly. The neutron population and reactor power respond next, and core temperature follows the heat that power produces. A temperature feedback coefficient then sends that warming back into reactivity, because the two are coupled.',
        bullets: [
          'An automatic trip, a simulated reactor scram, steps in the moment power or temperature crosses a safety limit.',
          'For example, a small rod withdrawal at the default settings raises power slowly, over roughly ten seconds.',
        ],
      },
      {
        id: 'reactivity',
        heading: 'What Does Reactivity Actually Measure?',
        body:
          'Reactivity is not the power level. It measures how fast power is changing. At zero reactivity the reactor is critical, because each fission generation produces, on average, exactly one more generation, so power holds steady. Positive reactivity means each generation slightly outproduces the last, so power rises; negative reactivity means it falls instead.',
        bullets: [
          'For example, withdrawing the rod from 50% to 55% adds about 0.05 $ of reactivity here, enough for a slow, minutes-long rise.',
          'A control rod move therefore does not snap power to a new number. It changes the rate of change, and power drifts toward a new trajectory over time.',
        ],
      },
      {
        id: 'delayed-neutrons',
        heading: 'Why Do Delayed Neutrons Make a Reactor Controllable?',
        body:
          'Most fission neutrons appear instantly, called prompt neutrons. A small fraction, the delayed neutron fraction beta, arrives seconds later from the decay of fission products. Below 1 $ of reactivity, the chain reaction still needs those delayed arrivals to keep growing, so it responds over seconds. That is the entire reason a mechanical control rod can keep up with a reactor at all.',
        bullets: [
          'Cross 1 $ and prompt neutrons alone sustain the reaction, so the response collapses to a fraction of a second.',
        ],
      },
      {
        id: 'prompt-vs-delayed',
        heading: 'Prompt Critical vs Delayed Critical: What Is the Difference?',
        body:
          'Delayed critical is the normal operating mode: reactivity stays below 1 $, and delayed neutrons set the pace over seconds. Prompt critical means reactivity has reached or passed 1 $, so prompt neutrons alone can sustain the chain reaction. The difference is speed, not size: delayed critical responds in seconds, while prompt critical responds in a fraction of one. Every rod movement in a real reactor stays firmly on the delayed-critical side of that line.',
      },
      {
        id: 'temperature-feedback',
        heading: 'Is Temperature Feedback Stabilizing or Destabilizing?',
        body:
          'As the core heats up, several physical effects change reactivity, lumped here into one temperature coefficient. A negative coefficient removes reactivity as the core warms: power rises, the core heats, reactivity falls, and as a result the reactor settles at a new, stable power. A positive coefficient does the opposite. Warming then adds reactivity instead, a self-reinforcing loop with no natural stopping point.',
        bullets: [
          'Unlike a negative coefficient, a positive one has been linked historically to low-power reactor accidents, including Chernobyl.',
          'Most modern power reactors are engineered for a negative coefficient specifically to avoid that loop.',
        ],
      },
      {
        id: 'trip',
        heading: 'What Does a Reactor Trip (Scram) Do?',
        body:
          'A trip, or scram, is the protection system stepping in. Once a reading crosses a safety limit, the rods drive fully into the core within seconds. That adds a large negative reactivity, so the chain reaction shuts down. This simulator trips at 200% of rated power or 80 degrees C, whichever comes first.',
        bullets: [
          'Only pressing Reset clears the trip, matching how a real scram needs a deliberate operator reset before restart.',
        ],
      },
    ],
    mistakes: [
      {
        heading: 'Thinking a Control Rod Sets the Power Level Directly',
        body:
          'A common misconception is that a rod move sets power directly. Instead, it only changes reactivity, which sets how fast power changes. The same small withdrawal produces a slow climb whether power starts low or high. Where it ends up depends on how long you let it run.',
      },
      {
        heading: 'Assuming Every Reactor Design Self-Stabilizes',
        body:
          'A negative temperature coefficient is a design choice, not a law of physics every reactor obeys. Some designs, and some operating conditions, do not have one. The positive void coefficient preset here shows that opposite case: reactivity keeps climbing as the core heats, with no natural ceiling until the safety trip intervenes.',
      },
      {
        type: 'note',
        heading: 'Everything Runs on Your Device',
        body:
          'The simulation runs entirely in your browser. Nothing is uploaded, logged, or shared, and it works offline once loaded. To explore exponential growth in a simpler setting first, try the ideal gas law simulator.',
      },
    ],
  },
  // relationships are auto-derived from shared concepts/quantities/family (see relations.ts).
  paramBehavior: nuclearReactor.paramBehavior,
  aspect: nuclearReactor.aspect,
  params: nuclearReactor.params,
  presets: nuclearReactor.presets,
  formula: nuclearReactor.formula,
};
