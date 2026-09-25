// Declarative manifest for the Molecular Geometry Simulator. Single source of truth for its
// config, knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in
// molecular-geometry.ts. No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import molecularGeometry from './molecular-geometry';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Molecular Geometry Calculator',
    slug: 'molecular-geometry-calculator',
    processorId: 'molecular-geometry',
    domain: 'chemistry-lab',
    category: 'chemistry',
    family: 'chemical-bonding',
    difficulty: 'beginner',
    schoolLevel: 'high-school',
    estimatedLearningTime: '7 min',
    prerequisites: ['chemical bonding', 'lone pairs', 'octet rule'],
    nextTopics: ['hybridization', 'dipole moment', 'polarity of molecules'],
    curriculumTags: ['general chemistry', 'chemical bonding', 'VSEPR'],
    learningObjectives: [
      'Work out the steric number from bonding pairs and lone pairs',
      'Name the electron geometry and the molecular shape as two facts',
      'Explain why lone pairs compress the ideal bond angle',
    ],
    keyTakeaways: [
      'Steric number is bonding pairs plus lone pairs, and that number picks the electron geometry',
      'Molecular shape ignores lone pairs, so water is tetrahedral in its electrons and bent in its atoms',
      'Each lone pair on a tetrahedral centre knocks about 2.5 degrees off 109.5, which is why water is 104.5',
    ],
    references: [
      { label: 'IUPAC Gold Book: VSEPR theory', url: 'https://goldbook.iupac.org/terms/view/V06617' },
    ],
  },
  concepts: {
    primary: ['molecular geometry', 'VSEPR'],
    secondary: [
      'electron geometry',
      'steric number',
      'bond angle',
      'lone pairs',
      'AXE notation',
      'tetrahedral',
      'trigonal bipyramidal',
    ],
    related: ['hybridization', 'dipole moment', 'octet rule'],
    aliases: [
      'molecular geometry calculator',
      'VSEPR calculator',
      'bond angle calculator',
      'electron geometry vs molecular geometry',
      'steric number calculator',
      'molecular shape',
      'VSEPR theory',
    ],
  },
  equations: [
    {
      id: 'steric-number',
      symbol: 'SN',
      expression: 'steric number = bonding pairs + lone pairs',
      description: 'How many electron groups sit around the central atom. That count, not the formula, picks the electron geometry.',
      variables: [
        { symbol: 'SN', label: 'Steric number', unit: '', measurementId: 'stericNumber' },
        { symbol: 'X', label: 'Bonding pairs', unit: '', paramId: 'bondingPairs' },
        { symbol: 'E', label: 'Lone pairs', unit: '', paramId: 'lonePairs' },
      ],
    },
    {
      id: 'bond-angle',
      symbol: 'angle',
      expression: 'bond angle = ideal angle - 2.5 x lone pairs (tetrahedral)',
      description: 'Lone pairs take more room than bonding pairs. On a tetrahedral electron geometry each lone pair knocks 2.5 degrees off 109.5, which is how ammonia becomes 107 and water 104.5.',
      variables: [
        { symbol: 'angle', label: 'Bond angle', unit: 'degrees', measurementId: 'compressedAngle' },
        { symbol: 'ideal', label: 'Ideal angle', unit: 'degrees', measurementId: 'idealAngle' },
      ],
    },
  ],
  educational: {
    summary:
      'Set bonding pairs and lone pairs. VSEPR names electron geometry and molecular shape as two facts, and compresses the angle when lone pairs take extra room.',
    intentGroups: {
      informational: [
        'What is molecular geometry?',
        'What is VSEPR theory?',
        'What is steric number?',
        'What is electron geometry?',
      ],
      howTo: [
        'How to find the molecular shape of a molecule',
        'How to calculate steric number',
        'How to find the bond angle from VSEPR',
      ],
      comparison: [
        'Electron geometry vs molecular geometry',
        'Electron geometry vs molecular shape',
        'Ideal bond angle vs actual bond angle',
      ],
      misconception: [
        'Electron geometry and molecular shape are not the same name',
        'Ideal tetrahedral 109.5 is not the angle in water',
      ],
      troubleshooting: [
        'Why water is bent not linear',
        'Why ammonia is pyramidal not tetrahedral',
        'Why XeF4 is square planar',
      ],
    },
    commonMistakes: [
      'Reporting electron geometry where molecular shape was asked',
      'Forgetting lone pairs when counting the steric number',
      'Quoting 109.5 for water and ammonia',
    ],
    realWorldUseCases: [
      'Deciding whether a molecule with polar bonds has a net dipole',
      'Checking a VSEPR exam answer against both names, not one',
      'Explaining why CO2 is nonpolar and water is polar from the same kind of bond',
    ],
    audience: ['chemistry students', 'chemistry teachers', 'high school chemistry'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Molecular Geometry Calculator: VSEPR Shapes',
    description:
      'Set bonding pairs and lone pairs. Get the VSEPR shape, steric number, and bond angle. Electron geometry and molecular shape stay labelled separately.',
    tagline: 'Watch electron geometry and molecular shape come apart as you add lone pairs.',
    keywords: [
      'molecular geometry calculator',
      'VSEPR calculator',
      'bond angle calculator',
      'electron geometry vs molecular geometry',
      'steric number calculator',
      'molecular shape',
      'VSEPR theory',
      'electron geometry',
    ],
  },
  presentation: {
    tags: [
      'VSEPR calculator',
      'VSEPR',
      'bond angle calculator',
      'electron geometry',
      'steric number',
      'molecular shape',
      'lone pairs',
    ],
    updatedAt: '2026-09-20',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    {
      title: 'Carbon dioxide',
      body: 'Two bonding pairs and no lone pairs. Steric number 2, electron geometry linear, molecular shape linear, angle 180°. The two polar bonds cancel, which is why CO2 has no dipole.',
    },
    {
      title: 'Water',
      body: 'Two bonding pairs and two lone pairs. Steric number 4, so the electrons sit tetrahedral, but the atoms make a bent shape at 104.5°. That is the case that shows the two names coming apart.',
    },
    {
      title: 'Ammonia',
      body: 'Three bonding pairs and one lone pair. Steric number 4 again, electron geometry tetrahedral, molecular shape trigonal pyramidal, angle 107°. One lone pair, one step of compression.',
    },
    {
      title: 'Xenon tetrafluoride',
      body: 'Four bonding pairs and two lone pairs. Steric number 6, electron geometry octahedral, molecular shape square planar. The two lone pairs sit opposite each other, which is why the fluorines land in a plane.',
    },
  ],
  faq: [
    {
      question: 'What is molecular geometry?',
      answer:
        'Molecular geometry is the arrangement of the bonded atoms around a central atom. It is not the arrangement of all the electron groups. Water has four electron groups, so the electrons sit tetrahedral, but only two of those groups are bonds, so the molecular shape is bent. The name you want on an exam is almost always this one, the shape of the atoms.',
    },
    {
      question: 'What is VSEPR theory?',
      answer:
        'VSEPR means valence shell electron pair repulsion. Electron groups around a central atom get as far from each other as they can, and the arrangement they settle into is the electron geometry. Linear, trigonal planar, tetrahedral, trigonal bipyramidal, octahedral: those five are the whole table for steric numbers 2 through 6. Molecular shape is then what is left after you ignore the lone pairs.',
    },
    {
      question: 'What is steric number?',
      answer:
        'Steric number is the count of electron groups around the central atom: bonding pairs plus lone pairs. Carbon dioxide is 2, water is 4, sulfur hexafluoride is 6. That integer picks the electron geometry. Used as a steric number calculator, this page is just X plus E, and the shape names follow from that sum.',
    },
    {
      question: 'What is the difference between electron geometry and molecular geometry?',
      answer:
        'Electron geometry counts every group, bonds and lone pairs. Molecular geometry, also called molecular shape, counts only the bonded atoms. They match when there are no lone pairs (methane is tetrahedral both ways) and they split as soon as a lone pair occupies a site (water, ammonia, xenon tetrafluoride). A chart that prints one name is conflating the two.',
    },
    {
      question: 'How do you find the molecular shape of a molecule?',
      answer:
        'Count bonding pairs and lone pairs on the central atom, add them to get the steric number, read the electron geometry from that number, then drop the lone pairs to name the shape. Water is AX2E2: steric number 4, tetrahedral electrons, bent atoms. The calculator does the table lookup. The step people skip is counting the lone pairs in the first place.',
    },
    {
      question: 'Why is water bent, not linear?',
      answer:
        'Oxygen has two bonds and two lone pairs, so four electron groups. Four groups sit tetrahedral, not in a line. The two hydrogen atoms occupy two of those four sites, so they sit 104.5° apart rather than 180°. Carbon dioxide is linear because its central carbon has no lone pairs. Same kind of polar bond, opposite shapes, which is why one molecule has a dipole and the other does not.',
    },
    {
      question: 'How do lone pairs affect bond angles?',
      answer:
        'Lone pairs take more room than bonding pairs, so they compress the angle between the bonds. On a tetrahedral electron geometry the ideal is 109.5°. One lone pair (ammonia) brings it to 107°. Two (water) bring it to 104.5°. Quoting 109.5 for either molecule is the ideal, not the molecule.',
    },
    {
      question: 'What is the bond angle of a tetrahedral molecule?',
      answer:
        'The ideal tetrahedral angle is 109.5°, and that is the angle in methane, where every group is a bonding pair. Ammonia and water share the same electron geometry and do not share that angle, because their lone pairs compress it. A bond angle calculator that always prints 109.5 for steric number 4 is printing the electron geometry, not the molecule.',
    },
  ],
  guide: {
    slug: 'how-molecular-geometry-works',
    title: 'How Molecular Geometry Works',
    description:
      'How steric number picks a VSEPR shape, why electron geometry and molecular shape are two names, and how lone pairs compress the ideal bond angle.',
    readMinutes: 7,
    updatedAt: '2026-09-20',
    quickAnswer:
      'Molecular geometry is the arrangement of bonded atoms around a central atom, assigned by VSEPR from the steric number. Steric number is bonding pairs plus lone pairs. That integer picks the electron geometry: 2 linear, 3 trigonal planar, 4 tetrahedral, 5 trigonal bipyramidal, 6 octahedral. Molecular shape then ignores the lone pairs, so water is tetrahedral in its electrons and bent in its atoms at 104.5°. Set the two counts here and watch the two names come apart.',
    sections: [
      {
        id: 'what-it-is',
        heading: 'What Is Molecular Geometry?',
        body:
          'It is the shape the bonded atoms make around a central atom. The formula does not print this. You count the groups on the central atom and read a table. Water looks bent, methane looks tetrahedral, carbon dioxide looks linear, and those three facts decide polarity, boiling point, and a lot of exam marks. The calculator on this page is that table, drawn as a molecule you can turn.',
        bullets: [
          'The shape is of the atoms, not of every electron group.',
          'A polar bond does not make a polar molecule if the shape cancels the dipoles, which is the CO2 case.',
        ],
      },
      {
        id: 'vsepr',
        heading: 'What Does VSEPR Actually Say?',
        body:
          'Valence shell electron pair repulsion says electron groups push each other as far apart as they can. Two groups sit 180° apart, three sit 120° apart in a plane, four sit at 109.5° as a tetrahedron, five as a trigonal bipyramid, six as an octahedron. That is the electron geometry. VSEPR theory is that list, plus the rule that lone pairs occupy sites but do not count as atoms when you name the shape.',
        bullets: [
          'Used as a VSEPR calculator, this page is steric number in, both names out.',
          'The five electron geometries cover steric numbers 2 through 6, which is the whole first-course table.',
        ],
      },
      {
        id: 'steric',
        heading: 'How Do You Calculate Steric Number?',
        body:
          'Add the bonding pairs to the lone pairs on the central atom. Carbon dioxide has two bonds and no lone pairs, so 2. Water has two bonds and two lone pairs, so 4. Sulfur hexafluoride has six bonds and no lone pairs, so 6. Double and triple bonds still count as one group. That is the whole calculation, and it is the step a steric number calculator exists to stop people skipping.',
        bullets: [
          'Bonding pairs are X in AXE notation. Lone pairs are E. Steric number is X plus E.',
          'For example, ammonia is AX3E: three bonds, one lone pair, steric number 4.',
        ],
      },
      {
        id: 'two-names',
        heading: 'Electron Geometry vs Molecular Geometry',
        body:
          'They are two names for two counts. Electron geometry vs molecular geometry is the comparison this page is built around. Electron geometry includes lone pairs. Molecular geometry, also called molecular shape, does not. Methane is tetrahedral both ways. Water shares that electron geometry and does not share that shape: the atoms are bent. A static chart that prints one word for water is picking a side and not telling you.',
        bullets: [
          'Electron geometry vs molecular shape is the same split under a slightly different name.',
          'XeF4 is the inorganic version: octahedral electrons, square planar atoms.',
          'When the two names match, this page stays quiet. When they split, it says so.',
        ],
      },
      {
        id: 'angles',
        heading: 'How Do You Find The Bond Angle From VSEPR?',
        body:
          'Start from the ideal angle of the electron geometry, then compress it if lone pairs are present. Linear is 180°, trigonal planar 120°, tetrahedral 109.5°, trigonal bipyramidal and octahedral 90° (with 120° in the TBP equator). On a tetrahedral centre each lone pair knocks about 2.5° off, so ammonia is 107° and water is 104.5°. A bond angle calculator that always returns the ideal is returning the electron geometry.',
        bullets: [
          'Methane really is 109.5°, because it has no lone pair to compress the angle.',
          'SO2, bent with one lone pair on a trigonal-planar centre, sits just under 120°.',
        ],
      },
      {
        id: 'water',
        heading: 'Why Is Water Bent And Carbon Dioxide Linear?',
        body:
          'Both have two bonds from the central atom. Carbon has no lone pairs, so two groups sit 180° apart. Oxygen has two lone pairs as well, so four groups sit tetrahedral and the hydrogens occupy two of those sites. Same count of bonds, different count of groups, opposite shapes. That is also why CO2 has no dipole and water does: two polar bonds cancel in a line and add in a bent molecule.',
        bullets: [
          'Open Water, bent and CO2, linear as a pair. The bonding-pair slider does not move. The lone-pair slider does.',
          'Ammonia is the in-between case: one lone pair, trigonal pyramidal, 107°.',
        ],
      },
      {
        id: 'where-it-matters',
        heading: 'Where Does The Shape Get Used?',
        body:
          'Polarity is the everyday answer. A molecule with polar bonds is polar only if the shape does not cancel the dipoles. Work out the bonds first on the chemical bond calculator, then come here for the shape. The same split decides why methane is a gas with no dipole, why water is a bent liquid that hydrogen-bonds, and why xenon tetrafluoride is square planar rather than tetrahedral.',
        bullets: [
          'Exam questions that ask for molecular geometry want the atom shape, not the electron geometry.',
          'If a bond dipole can cancel, you cannot stop at the bond. You need this page as well.',
        ],
      },
    ],
    mistakes: [
      {
        heading: 'Reporting Electron Geometry Where Shape Was Asked',
        body:
          'The most common miss is to count the groups, read tetrahedral, and write that as the answer for water or ammonia. Tetrahedral is the electron geometry. The molecular shape is bent or trigonal pyramidal. This simulator keeps both labels on the canvas, and only talks when they disagree, so the two cannot hide behind one word.',
      },
      {
        heading: 'Quoting 109.5 For Every Tetrahedral Electron Geometry',
        body:
          '109.5° is the ideal, and methane has it. Water and ammonia share the electron geometry and do not share the angle. Lone pairs take more room, so the bonds close up. Quote 104.5° for water and 107° for ammonia, or quote the ideal and say it has been compressed. Do not treat the textbook tetrahedral number as a law the molecule obeys.',
      },
      {
        type: 'note',
        heading: 'Everything Runs On Your Device',
        body:
          'The simulation runs entirely in your browser. Nothing is uploaded, logged, or shared, and it works offline once the page has loaded. To see the polarity of one bond before the shape of the molecule, open the chemical bond calculator.',
      },
    ],
  },
  relationships: {
    usedWith: [
      {
        slug: 'chemical-bond-calculator',
        reason: 'Bond polarity is one input to a molecular dipole; this page is the geometry that can cancel it',
        strength: 0.9,
      },
    ],
    nextSteps: [
      {
        slug: 'newman-projection-calculator',
        reason: 'Once the bonded shape is settled, a single bond can still rotate, which is the next geometry question',
        priority: 2,
      },
    ],
  },
  paramBehavior: molecularGeometry.paramBehavior,
  aspect: molecularGeometry.aspect,
  params: molecularGeometry.params,
  presets: molecularGeometry.presets,
  formula: molecularGeometry.formula,
};
