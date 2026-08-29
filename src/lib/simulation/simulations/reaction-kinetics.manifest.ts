// Declarative manifest for the Reaction Rate Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in reaction-kinetics.ts.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import reactionKinetics from './reaction-kinetics';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Reaction Rate Calculator',
    slug: 'reaction-rate-calculator',
    processorId: 'reaction-kinetics',
    domain: 'chemistry-lab',
    category: 'chemistry',
    family: 'physical-chemistry',
    difficulty: 'intermediate',
    schoolLevel: 'introductory-college',
    estimatedLearningTime: '8 min',
    prerequisites: ['concentration and moles', 'exponential functions'],
    nextTopics: ['reaction mechanisms', 'catalysis', 'transition state theory'],
    curriculumTags: ['physical chemistry', 'chemical kinetics'],
    learningObjectives: [
      'Use the Arrhenius equation to get a rate constant from activation energy and temperature',
      'Tell zero, first and second order reactions apart from the shape of a concentration curve',
      'Explain why a small temperature rise changes a rate so much',
    ],
    keyTakeaways: [
      'Activation energy sits in an exponent, so it controls the rate far more strongly than the pre-exponential factor',
      'Only a first order half-life is independent of the starting concentration',
      'A ten degree rise near room temperature roughly doubles a rate with a typical activation energy',
    ],
    references: [
      { label: 'IUPAC Gold Book: Arrhenius equation', url: 'https://goldbook.iupac.org/terms/view/A00446' },
    ],
  },
  concepts: {
    primary: ['reaction rate', 'arrhenius equation'],
    secondary: ['activation energy', 'rate constant', 'reaction order', 'half-life', 'rate law', 'chemical kinetics'],
    related: ['catalysis', 'transition state', 'collision theory'],
    aliases: ['reaction rate calculator', 'arrhenius equation calculator', 'rate constant', 'activation energy', 'reaction order', 'first order half life', 'rate law', 'chemical kinetics'],
  },
  equations: [
    {
      id: 'arrhenius',
      symbol: 'k',
      expression: 'log10 k = log10 A - Ea / (2.303 x R x T)',
      description: 'The Arrhenius equation in its base-10 linear form, which is the straight line an Arrhenius plot fits.',
      variables: [
        { symbol: 'log10 k', label: 'Rate constant, log10', unit: '', measurementId: 'logRate' },
        { symbol: 'log10 A', label: 'Pre-exponential factor, log10', unit: '', paramId: 'logA' },
        { symbol: 'Ea', label: 'Activation energy', unit: 'kJ/mol', paramId: 'activationEnergy' },
        { symbol: 'T', label: 'Temperature', unit: 'K', paramId: 'temperature' },
      ],
    },
    {
      id: 'first-order-half-life',
      symbol: 't half',
      expression: 't half = ln 2 / k',
      description: 'The first order half-life, which depends on the rate constant alone and not on how much reactant you started with.',
      variables: [
        { symbol: 't half', label: 'Half-life, log10 seconds', unit: '', measurementId: 'logHalfLife' },
        { symbol: '[A]0', label: 'Starting concentration', unit: 'mol/L', paramId: 'initial' },
      ],
    },
  ],
  educational: {
    summary:
      'Set an activation energy and a temperature, then watch the reaction run at the rate the Arrhenius equation gives, with live half-life and conversion.',
    intentGroups: {
      informational: ['What is the Arrhenius equation?', 'What is activation energy?', 'What is a rate constant?'],
      howTo: ['How to calculate a rate constant from activation energy', 'How to find the half-life of a first order reaction'],
      comparison: ['Zero vs first vs second order reactions', 'Activation energy vs pre-exponential factor', 'Rate vs rate constant'],
      misconception: ['Not every half-life is independent of concentration', 'A catalyst does not change how far a reaction goes'],
      troubleshooting: ['Why a reaction appears not to be happening at all', 'Why raising temperature changes the rate so much'],
    },
    commonMistakes: [
      'Assuming every reaction has a concentration-independent half-life',
      'Confusing the rate with the rate constant',
      'Using degrees Celsius instead of kelvin in the Arrhenius equation',
    ],
    realWorldUseCases: [
      'Estimating the shelf life of a drug from an accelerated stability test',
      'Choosing a reaction temperature that finishes in a working day',
      'Explaining why food keeps longer in a fridge than on a counter',
    ],
    audience: ['chemistry students', 'chemical engineering students', 'chemistry teachers'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Reaction Rate Calculator and Arrhenius Equation',
    description:
      'Set an activation energy and temperature, then watch the reaction run. Live rate constant, conversion, and the zero, first or second order half-life.',
    tagline: 'Set the barrier and the temperature, then watch the reaction run.',
    keywords: ['reaction rate calculator', 'arrhenius equation calculator', 'activation energy', 'rate constant', 'half life calculator', 'reaction order', 'chemical kinetics'],
  },
  presentation: {
    // Tags are the tool's search vocabulary (they feed the client index, and nothing renders them),
    // so the compound phrasings a course sets belong here rather than in a manifest field that only
    // reaches the knowledge graph. seo.keywords does NOT reach the index, which is why a phrase
    // needed for retrieval is repeated here on purpose.
    tags: ['reaction rate calculator', 'arrhenius equation', 'arrhenius equation calculator', 'activation energy', 'rate constant', 'rate law', 'reaction order', 'half-life', 'first order half life', 'first order half life calculator', 'chemical kinetics', 'physical chemistry'],
    updatedAt: '2026-08-29',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Runs in seconds', body: 'A 60 kJ/mol barrier at room temperature with a typical pre-exponential factor gives a half-life of about a quarter of a second. The flask empties while you watch.' },
    { title: 'Too slow to see', body: 'Raise the barrier to 120 kJ/mol and nothing appears to happen. The half-life is now measured in thousands of years, which is the honest answer rather than a bug.' },
    { title: 'Same reaction, heated', body: 'Take that 120 kJ/mol reaction to 500 K and it finishes in seconds. Nothing about the molecules changed; only the fraction of collisions with enough energy did.' },
    { title: 'Second order tail', body: 'Switch to second order and the curve drags. Each half-life is twice as long as the one before, so the last few percent takes longer than everything else put together.' },
  ],
  faq: [
    {
      question: 'What is the Arrhenius equation?',
      answer:
        'The Arrhenius equation gives the rate constant from temperature: k = A x e^(-Ea / RT). A is the pre-exponential factor, which counts how frequently molecules collide with the right geometry. The exponential term is the fraction of those collisions carrying enough energy to clear the barrier. Because Ea sits in the exponent, a small change in it moves k enormously.',
    },
    {
      question: 'What is activation energy?',
      answer:
        'Activation energy is the energy barrier between reactants and products, measured at the transition state. It is the peak on the reaction coordinate drawn here. Reactants that cannot reach the peak fall back, so the barrier height decides how many collisions succeed. It says nothing about whether the reaction releases energy overall.',
    },
    {
      question: 'How do you calculate the half-life of a reaction?',
      answer:
        'It depends on the order. First order gives t = ln 2 / k, which ignores concentration. Zero order gives t = [A]0 / 2k, so it shortens as reactant runs out. Second order gives t = 1 / (k [A]0), so it lengthens. Switch orders on the slider and the half-life readout jumps, even though k has not moved.',
    },
    {
      question: 'What is the difference between zero, first and second order reactions?',
      answer:
        'The order says how the rate responds to concentration. Zero order ignores it, so [A] falls in a straight line and hits zero. First order is proportional to [A], giving the exponential decay everyone recognises. Second order goes with [A] squared, so the curve drops fast then drags. Plotted against half-lives, those three shapes are the whole difference.',
    },
    {
      question: 'Why does a 10 degree temperature rise double the rate?',
      answer:
        'It is arithmetic rather than a law. For an activation energy near 50 kJ/mol at room temperature, the exponential term changes by roughly a factor of two over ten kelvin. Change the activation energy and the factor changes with it, which the rate change readout shows live. Treat the doubling rule as a rough guide for typical barriers.',
    },
    {
      question: 'What is the difference between rate and rate constant?',
      answer:
        'The rate is how fast concentration is changing right now, and it falls as the reactant is used up. The rate constant k does not change during a run at fixed temperature. This is a common mistake in exam answers: a first order reaction slows down while its rate constant stays exactly where it started.',
    },
    {
      question: 'Does a catalyst change how far a reaction goes?',
      answer:
        'No. A catalyst lowers the activation energy, so the reaction reaches its destination sooner. It leaves the energies of the reactants and products alone, so the equilibrium position is unchanged. Drop the activation energy slider and watch the half-life collapse while the final conversion stays exactly where it was.',
    },
    {
      question: 'Why do the readouts show logarithms instead of the numbers themselves?',
      answer:
        'Because the numbers span forty orders of magnitude. Across the slider ranges here, k runs from about 10^-38 to 10^15, and no fixed decimal readout stays useful over that. Logarithms keep every setting readable, and they are the same axis an Arrhenius plot uses, so the readout matches how the data gets plotted anyway.',
    },
  ],
  guide: {
    slug: 'how-reaction-rates-work',
    title: 'How Reaction Rates Work',
    description:
      'How the Arrhenius equation turns activation energy and temperature into a rate constant, and how reaction order sets the shape of a concentration curve.',
    readMinutes: 8,
    updatedAt: '2026-08-29',
    quickAnswer:
      'A reaction rate is set by two separate things: how high the energy barrier is, and how the rate responds to concentration. The Arrhenius equation covers the first, k = A x e^(-Ea / RT), and the reaction order covers the second. Activation energy sits inside an exponent, so raising it by 20 kJ/mol at room temperature slows a reaction by a factor of about three thousand, while doubling the pre-exponential factor only doubles it. Order decides shape rather than speed: zero order falls in a straight line, first order decays exponentially, and second order drags out a long tail. Set both here and watch the flask empty at the rate the numbers actually give.',
    sections: [
      {
        id: 'arrhenius',
        heading: 'What Does The Arrhenius Equation Tell You?',
        body:
          'The Arrhenius equation splits a rate constant into two parts. The pre-exponential factor A counts collisions with the right orientation. The exponential term is the fraction of those collisions carrying enough energy to clear the barrier. Multiply them and you have k. Everything a temperature change does to a rate happens inside that exponential.',
        bullets: [
          'Temperature must be in kelvin, because the exponent divides by T rather than shifting it.',
          'The base-10 form log k = log A - Ea / (2.303 R T) is a straight line against 1/T, which is how Ea is measured.',
        ],
      },
      {
        id: 'temperature',
        heading: 'Why Does Temperature Matter So Much?',
        body:
          'Heating a flask by ten degrees changes the average molecular energy by a few percent. It changes the number of molecules above the barrier by far more, because that population sits in the tail of the distribution. The rate change readout puts a number on it for the current settings. Around 50 kJ/mol at room temperature that number is close to two, which is where the rule of thumb comes from.',
      },
      {
        id: 'first-order-half-life',
        heading: 'How Do You Find The Half-Life Of A First Order Reaction?',
        body:
          'Get k from the Arrhenius equation, then divide ln 2 by it. For example, a 60 kJ/mol barrier at 298 K with log A of 11 gives k near 3.0 per second, therefore the half-life is 0.69 / 3.0, about 0.23 seconds. Nothing in that arithmetic mentions concentration, which is what makes first order the easy case. This page doubles as an Arrhenius equation calculator and a half life calculator, because both readouts update from the same three sliders.',
        bullets: [
          'The readouts are base-10 logarithms, so a half-life of 0.23 s reads as -0.64.',
          'However, the same k gives a different half-life at zero or second order, so check the order before you use ln 2 / k.',
        ],
      },
      {
        id: 'order',
        heading: 'Zero vs First vs Second Order: What Changes?',
        body:
          'Order describes how the rate responds to how much reactant is left. Zero order does not respond at all, so the line is straight and the reaction stops dead when the reactant runs out. First order halves in equal intervals forever. Second order slows faster than it consumes, so the tail drags. Plotting against half-lives rather than seconds strips out the rate constant and leaves those three shapes.',
        bullets: [
          'Zero order finishes at exactly two half-lives, which no other order does.',
          'First order is the only one whose half-life ignores the starting concentration.',
          'Second order doubles its half-life every time, so the last percent takes the longest.',
        ],
      },
      {
        id: 'half-life',
        heading: 'How Do You Read A Half-Life From The Order?',
        body:
          'Each order has its own expression, and mixing them up is the most common error in a kinetics problem. First order is ln 2 / k. Zero order is [A]0 / 2k, which shrinks as the run proceeds. Second order is 1 / (k [A]0), which grows. Move the starting concentration slider and watch which of the three readouts responds.',
      },
      {
        id: 'catalysis',
        heading: 'What Does A Catalyst Actually Change?',
        body:
          'A catalyst offers a lower barrier by way of a different mechanism. It leaves the reactant and product energies untouched, so the position of equilibrium does not move. Lower the activation energy slider and the half-life collapses while the final conversion stays the same. That is the difference between kinetics and thermodynamics in one slider.',
      },
      {
        id: 'where-it-matters',
        heading: 'Where Does Chemical Kinetics Get Used?',
        body:
          'Shelf life is the everyday answer. An accelerated stability test runs a drug hot for weeks, fits the Arrhenius line, and extrapolates back down to storage temperature to predict how long it lasts. Food works the same way in reverse: a fridge at 4 C rather than 20 C cuts the rate of every spoilage reaction by a large factor, therefore milk keeps for days instead of hours. Chemical kinetics is what turns a barrier height into a date on a label.',
        bullets: [
          'Accelerated testing only works while the mechanism stays the same at the higher temperature.',
          'For example, a 60 kJ/mol spoilage reaction slows by about a factor of four between 20 C and 4 C.',
        ],
      },
    ],
    mistakes: [
      {
        heading: 'Assuming Every Half-Life Ignores Concentration',
        body:
          'Textbooks introduce half-life through first order reactions and radioactive decay, so the concentration-independent version gets remembered as the rule. It is a property of first order only. A second order half-life doubles every time, so a reaction that looks nearly finished can take as long again to actually finish.',
      },
      {
        heading: 'Putting Celsius Into The Arrhenius Equation',
        body:
          'The exponent divides by absolute temperature, so 25 degrees Celsius and 298 kelvin give answers that are not remotely close. Convert first, every time. This simulator only offers kelvin, which removes the trap here but not on your problem sheet.',
      },
      {
        type: 'note',
        heading: 'Everything Runs On Your Device',
        body:
          'The simulation runs entirely in your browser. Nothing is uploaded, logged, or shared, and it works offline once the page has loaded. The time lapse slider speeds up the chemical clock rather than the chemistry, so the half-life readout stays the real one.',
      },
    ],
  },
  // Authored ON TOP of the derived sibling edges (see relations.ts). Every chemistry simulator is
  // the only member of its family, so nothing outside the domain derives, and the two links that
  // matter most here both point at physics.
  relationships: {
    usedWith: [
      {
        slug: 'ideal-gas-law-calculator',
        reason: 'A gas-phase rate starts from how often molecules collide, which is where PV = nRT comes in',
        strength: 0.7,
      },
    ],
    nextSteps: [
      {
        slug: 'nuclear-reactor-calculator',
        reason: 'Radioactive decay is first order kinetics with a rate constant temperature cannot change',
        priority: 2,
      },
    ],
  },
  paramBehavior: reactionKinetics.paramBehavior,
  aspect: reactionKinetics.aspect,
  params: reactionKinetics.params,
  presets: reactionKinetics.presets,
  formula: reactionKinetics.formula,
};
