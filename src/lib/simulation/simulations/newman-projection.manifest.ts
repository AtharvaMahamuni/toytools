// Declarative manifest for the Newman Projection Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in newman-projection.ts.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import newmanProjection from './newman-projection';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Newman Projection Calculator',
    slug: 'newman-projection-calculator',
    processorId: 'newman-projection',
    domain: 'chemistry-lab',
    category: 'chemistry',
    family: 'organic-chemistry',
    difficulty: 'intermediate',
    schoolLevel: 'introductory-college',
    estimatedLearningTime: '7 min',
    prerequisites: ['covalent bonding', 'reading a skeletal structure'],
    nextTopics: ['cyclohexane chair conformations', 'E2 elimination stereochemistry'],
    curriculumTags: ['organic chemistry', 'conformational analysis'],
    learningObjectives: [
      'Read a Newman projection and name the conformer it shows',
      'Separate torsional strain from steric strain in a rotation energy curve',
      'Work out which conformer a population sits in at a given temperature',
    ],
    keyTakeaways: [
      'Staggered conformers are minima and eclipsed conformers are maxima, at every substituent size',
      'Ethane rotation costs 12 kJ/mol and comes entirely from eclipsing bonds, with no steric term',
      'Anti butane beats gauche butane by 3.8 kJ/mol, which leaves gauche about a third of the population at room temperature',
    ],
    references: [
      { label: 'IUPAC Gold Book: torsion angle', url: 'https://goldbook.iupac.org/terms/view/T06406' },
    ],
  },
  concepts: {
    primary: ['newman projection', 'conformational analysis'],
    secondary: ['dihedral angle', 'torsional strain', 'steric strain', 'anti conformer', 'gauche conformer', 'staggered and eclipsed'],
    related: ['butane', 'ethane', 'boltzmann distribution'],
    aliases: ['newman projection', 'dihedral angle', 'torsion angle', 'staggered vs eclipsed', 'anti conformer', 'gauche conformer', 'conformational analysis', 'butane conformers'],
  },
  equations: [
    {
      id: 'strain-decomposition',
      symbol: 'E',
      expression: 'E(phi) = E torsional + E steric',
      description: 'Total strain energy at a dihedral angle, split into the cost of eclipsing bonds and the cost of crowding two large groups together.',
      variables: [
        { symbol: 'E', label: 'Strain energy', unit: 'kJ/mol', measurementId: 'strain' },
        { symbol: 'E tors', label: 'Torsional strain', unit: 'kJ/mol', measurementId: 'torsional' },
        { symbol: 'E ster', label: 'Steric strain', unit: 'kJ/mol', measurementId: 'steric' },
        { symbol: 'phi', label: 'Dihedral angle', unit: 'degrees', paramId: 'dihedral' },
      ],
    },
    {
      id: 'boltzmann-ratio',
      symbol: 'N ratio',
      expression: 'N gauche / N anti = 2 x e^(-delta E / RT)',
      description: 'How a strain difference turns into a population split. The factor of two counts both gauche wells, one on each side of anti.',
      variables: [
        { symbol: 'N anti', label: 'Anti population', unit: '%', measurementId: 'antiPopulation' },
        { symbol: 'N gauche', label: 'Gauche population', unit: '%', measurementId: 'gauchePopulation' },
        { symbol: 'T', label: 'Temperature', unit: 'K', paramId: 'temperature' },
      ],
    },
  ],
  educational: {
    summary:
      'Rotate a carbon-carbon bond and watch the strain energy curve draw itself: staggered, eclipsed, anti, gauche, with live conformer populations.',
    intentGroups: {
      informational: ['What is a Newman projection?', 'What is a dihedral angle?', 'What is torsional strain?'],
      howTo: ['How to draw a Newman projection', 'How to find the most stable conformer of butane'],
      comparison: ['Staggered vs eclipsed conformers', 'Anti vs gauche butane', 'Torsional strain vs steric strain'],
      misconception: ['Conformers are not separate compounds you can bottle', 'Ethane has no steric strain to speak of'],
      troubleshooting: ['Which two bonds the dihedral angle is measured between', 'Why the gauche well is off 60 degrees'],
    },
    commonMistakes: [
      'Measuring the dihedral between the wrong pair of front and back bonds',
      'Calling conformers isomers that can be separated',
      'Assuming ethane has steric strain because it has a rotation barrier',
    ],
    realWorldUseCases: [
      'Predicting the reactive conformer for an E2 elimination',
      'Explaining why polyethylene chains prefer an extended zig-zag',
      'Checking a conformer drawing before an organic chemistry exam',
    ],
    audience: ['organic chemistry students', 'chemistry teachers', 'biochemistry students'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Newman Projection Calculator and Conformer Energy',
    description:
      'Conformational analysis you can turn: set the dihedral angle of butane and read torsional vs steric strain, with live anti and gauche populations.',
    tagline: 'Rotate the bond and watch the strain energy curve draw itself.',
    keywords: ['newman projection simulator', 'newman projection', 'dihedral angle', 'conformational analysis', 'anti vs gauche', 'torsional strain', 'butane conformers'],
  },
  presentation: {
    // Tags are the tool's search vocabulary (they feed the client index, and nothing renders them),
    // so the compound phrasings a course sets belong here rather than in a manifest field that only
    // reaches the knowledge graph. seo.keywords does NOT reach the index, which is why a phrase
    // needed for retrieval is repeated here on purpose.
    tags: ['newman projection calculator', 'newman projection', 'conformational analysis', 'conformational analysis butane', 'dihedral angle', 'torsion angle', 'torsional strain', 'steric strain', 'anti conformer', 'gauche conformer', 'anti vs gauche', 'anti vs gauche butane', 'staggered vs eclipsed', 'butane conformers', 'organic chemistry'],
    updatedAt: '2026-08-29',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Ethane', body: 'Shrink both large groups to hydrogen and the steric term disappears. What is left is a 12 kJ/mol barrier from three eclipsing H/H pairs, and three staggered conformers no molecule prefers over the others.' },
    { title: 'Anti butane', body: 'At 180 degrees the two methyls sit as far apart as the bond allows. This is the global minimum, and about two thirds of butane molecules are in it at room temperature.' },
    { title: 'Gauche butane', body: 'At 60 degrees the molecule is still staggered, yet the two methyls are close enough to cost 3.8 kJ/mol. There are two of these wells, so gauche keeps a real share of the population.' },
    { title: 'Fully eclipsed', body: 'At 0 degrees the methyls are directly behind one another, which costs 19 kJ/mol and is the highest point on the curve. Nothing sits here; it is the wall between the two gauche wells.' },
  ],
  faq: [
    {
      question: 'What is a Newman projection?',
      answer:
        'A Newman projection is what one carbon-carbon bond looks like end on. The front carbon is the point where three bonds meet. The back carbon is the circle behind it, and its three bonds start at the circumference. Drawing the bond this way makes the angle between front and back groups the only thing you have to read.',
    },
    {
      question: 'What is the dihedral angle in a Newman projection?',
      answer:
        'The dihedral angle, also called the torsion angle, is the angle between a chosen front bond and a chosen back bond. Zero degrees means the two point the same way, so the groups eclipse. One hundred and eighty degrees means they point opposite ways, which is the anti arrangement. Pick the two highest-priority groups and measure between those, or you will read a different number for the same molecule.',
    },
    {
      question: 'What is the difference between staggered and eclipsed conformers?',
      answer:
        'Staggered means every front bond sits between two back bonds, at 60, 180 and 300 degrees. Eclipsed means front and back bonds line up, at 0, 120 and 240 degrees. Staggered conformers are the minima on the energy curve and eclipsed conformers are the maxima. Nothing rests at an eclipsed angle, because there is no well there to rest in.',
    },
    {
      question: 'Why is anti butane more stable than gauche butane?',
      answer:
        'Both are staggered, so their torsional strain is identical. The difference is distance between the two methyl groups. Anti holds them 180 degrees apart and gauche holds them 60 degrees apart, close enough for their electron clouds to push against each other. That crowding costs 3.8 kJ/mol, which is the whole gap.',
    },
    {
      question: 'What is the rotation barrier of ethane?',
      answer:
        'Ethane costs 12 kJ/mol to rotate through its eclipsed conformation. That number is three eclipsing hydrogen pairs at about 4 kJ/mol each. Set the substituent size slider to zero and the simulator becomes ethane exactly, with the steric readout pinned at zero and the barrier at 12.',
    },
    {
      question: 'How do you calculate the percentage of anti and gauche conformers?',
      answer:
        'Compare Boltzmann factors. The gauche to anti ratio is 2 x e^(-delta E / RT), where delta E is 3.8 kJ/mol for butane and the two counts both gauche wells. At 298 K that works out near 64 percent anti. Raise the temperature slider and watch the split even out, because RT climbs toward the size of the gap.',
    },
    {
      question: 'Can conformers be separated from each other?',
      answer:
        'No, and this is the most common misconception about them. A 12 to 19 kJ/mol barrier is small enough that a bond rotates through it billions of times a second at room temperature. Conformers are a population, so a bottle of butane holds every conformer at once in the proportions the Boltzmann factors set.',
    },
    {
      question: 'Why does the gauche minimum sit slightly off 60 degrees?',
      answer:
        'Steric repulsion keeps falling as the methyls move apart, so it pulls the minimum toward anti. Torsional strain pushes back once the bonds start to eclipse again. The balance lands a degree or two past 60 rather than exactly on it, which real conformational energy surfaces also show.',
    },
  ],
  guide: {
    slug: 'how-newman-projections-work',
    title: 'How Newman Projections Work',
    description:
      'How to read a Newman projection, tell torsional strain from steric strain, and turn a conformer energy gap into anti and gauche populations.',
    readMinutes: 7,
    updatedAt: '2026-08-29',
    quickAnswer:
      'A Newman projection shows one carbon-carbon bond viewed end on, so you can read the angle between the groups on either end. That angle is the dihedral angle, and the energy it costs is E(phi) = E torsional + E steric. Staggered angles at 60, 180 and 300 degrees are the minima; eclipsed angles at 0, 120 and 240 degrees are the maxima. For butane the anti conformer at 180 degrees is the global minimum, gauche at 60 degrees costs 3.8 kJ/mol, and rotating through the fully eclipsed conformation costs 19 kJ/mol. Drag the molecule here and the energy curve fills in underneath it.',
    sections: [
      {
        id: 'reading',
        heading: 'How Do You Read A Newman Projection?',
        body:
          'The point in the middle is the front carbon, and the circle behind it is the back carbon. Three bonds meet at the point and three more start at the circumference. Everything else about the drawing is the angle between one front bond and one back bond. Read that angle and you have named the conformer.',
        bullets: [
          'Front bonds run all the way to the centre; back bonds stop at the circle.',
          'Measure the dihedral between the two highest-priority groups, one on each carbon.',
          'Zero degrees is eclipsed and 180 degrees is anti, whichever molecule you are drawing.',
        ],
      },
      {
        id: 'strain-types',
        heading: 'What Is The Difference Between Torsional And Steric Strain?',
        body:
          'Torsional strain is the cost of lining bonds up behind each other, and it appears only near an eclipsed angle. Steric strain is two bulky groups pushing against each other, and it never fully switches off. The simulator reports the two separately because they answer different questions. One explains why staggered beats eclipsed, and the other explains why anti beats gauche.',
        bullets: [
          'Torsional strain in ethane is about 4 kJ/mol per eclipsing hydrogen pair.',
          'Steric strain scales with how big the two groups are, so it grows as you widen the size slider.',
        ],
      },
      {
        id: 'anti-vs-gauche',
        heading: 'Why Is Anti Butane More Stable Than Gauche Butane?',
        body:
          'Both conformers are staggered, so neither pays any torsional penalty. The methyl groups are what differ: 180 degrees apart in anti, 60 degrees apart in gauche. Crowding at 60 degrees costs 3.8 kJ/mol, and that is the entire anti vs gauche energy gap. Set the size slider to zero and the gap vanishes, because hydrogens are too small to crowd.',
        bullets: [
          'For example, drag from 180 to 60 degrees and the strain readout climbs from 0.0 to 3.8 kJ/mol while the torsional readout stays at zero.',
          'That is the anti vs gauche difference isolated: same staggering, different distance.',
        ],
      },
      {
        id: 'most-stable',
        heading: 'How Do You Find The Most Stable Conformer Of Butane?',
        body:
          'Rotate to every staggered angle and compare. Butane has three: 60, 180 and 300 degrees. Anti at 180 degrees reads 0.0 kJ/mol and the other two read 3.8 kJ/mol each, therefore anti is the most stable conformer. The Newman projection simulator does the comparison for you, because the strain curve underneath marks all three wells at once.',
        bullets: [
          'The minima are always staggered. If your answer is an eclipsed angle, you have found a maximum instead.',
          'Ties are real: ethane has three identical minima, so no single conformer is most stable.',
        ],
      },
      {
        id: 'populations',
        heading: 'How Do You Work Out Conformer Populations?',
        body:
          'A strain gap becomes a population split through the Boltzmann factor e^(-delta E / RT). Butane has two gauche wells against one anti well, so the ratio carries a factor of two. At 298 K the arithmetic lands near 64 percent anti. Raise the temperature and the split flattens, because RT grows toward the size of the gap.',
        bullets: [
          'RT at 298 K is about 2.5 kJ/mol, which is the same order as the 3.8 kJ/mol gauche penalty.',
          'A gap of 3.8 kJ/mol is worth a two to one split; a gap of 12 kJ/mol leaves almost nothing in the higher well.',
        ],
      },
      {
        id: 'ethane-vs-butane',
        heading: 'Ethane vs Butane: What Actually Changes?',
        body:
          'Ethane has three identical staggered conformers and one barrier height. Butane splits that symmetry: one anti well, two shallower gauche wells, and two different barrier heights depending on which groups eclipse. Slide the substituent size from zero up to 25 percent and watch the flat ethane curve break into butane in front of you.',
        bullets: [
          'Ethane barrier: 12 kJ/mol, from three eclipsing hydrogen pairs.',
          'Butane barriers: 16 kJ/mol through the methyl and hydrogen eclipse, 19 kJ/mol through the methyl and methyl eclipse.',
        ],
      },
      {
        id: 'where-it-matters',
        heading: 'Where Does Conformational Analysis Actually Matter?',
        body:
          'Conformational analysis decides which shape a molecule reacts from, not merely which shape it prefers. An E2 elimination needs the leaving group and the hydrogen anti-periplanar, so the reactive conformer is a specific dihedral rather than the most populated one. Polyethylene chains pack into an extended zig-zag for the same reason butane prefers anti, and that packing is what makes the material stiff. For an exam, the practical use is checking a conformer drawing before you commit to it.',
        bullets: [
          'E2 elimination: the reactive conformer can be a minor one, because reaction rate depends on both population and geometry.',
          'Polymers: repeat the anti preference along a chain and you get the extended zig-zag that sets how the solid packs.',
        ],
      },
    ],
    mistakes: [
      {
        heading: 'Measuring The Dihedral Between The Wrong Two Bonds',
        body:
          'Six bonds meet the eye in a Newman projection, which gives nine front and back pairs to choose from. Only one of them is the torsion angle anyone means. Pick the highest-priority group on each carbon, and stay with that choice for the whole problem. Switching halfway is how a 60 degree conformer gets written up as a 180 degree one.',
      },
      {
        heading: 'Treating Conformers As Compounds You Could Separate',
        body:
          'A common mistake is to write anti butane and gauche butane as though a chemist could put each in its own flask. Rotation past a 19 kJ/mol barrier happens billions of times a second at room temperature. What you can measure is the population, so ask what fraction is anti rather than how to isolate it.',
      },
      {
        type: 'note',
        heading: 'Everything Runs On Your Device',
        body:
          'The simulation runs entirely in your browser. Nothing is uploaded, logged, or shared, and it works offline once the page has loaded. To see a related energy landscape in a different setting, open the reaction rate simulator and compare an activation barrier with a rotation barrier.',
      },
    ],
  },
  // Authored ON TOP of the derived sibling edges (see relations.ts).
  relationships: {
    usedWith: [
      {
        slug: 'simple-harmonic-motion-calculator',
        reason: 'The thermal wobble in a conformer well is small-amplitude harmonic motion, the same maths as a mass on a spring',
        strength: 0.6,
      },
    ],
  },
  paramBehavior: newmanProjection.paramBehavior,
  aspect: newmanProjection.aspect,
  params: newmanProjection.params,
  presets: newmanProjection.presets,
  formula: newmanProjection.formula,
};
