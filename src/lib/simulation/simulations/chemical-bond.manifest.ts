// Declarative manifest for the Chemical Bond Simulator. Single source of truth for its config,
// knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in chemical-bond.ts.
// No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import chemicalBond from './chemical-bond';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Chemical Bond Calculator',
    slug: 'chemical-bond-calculator',
    processorId: 'chemical-bond',
    domain: 'chemistry-lab',
    category: 'chemistry',
    family: 'chemical-bonding',
    difficulty: 'beginner',
    schoolLevel: 'high-school',
    estimatedLearningTime: '6 min',
    prerequisites: ['electron configuration', 'valence electrons'],
    nextTopics: ['molecular geometry', 'intermolecular forces', 'dipole moment'],
    curriculumTags: ['general chemistry', 'chemical bonding'],
    learningObjectives: [
      'Work out the electronegativity difference between two elements',
      'Turn that difference into a percent ionic character with Pauling\'s relation',
      'Explain why the ionic and covalent cutoffs are conventions rather than laws',
    ],
    keyTakeaways: [
      'Bond character is a continuum, and the 0.4 and 1.7 cutoffs are lines drawn on a smooth curve',
      'Pauling\'s relation passes through 50 percent ionic at a difference of 1.7, which is where the cutoff comes from',
      'Two nonmetals cannot form an ionic bond however large the difference gets, which is why HF breaks the rule',
    ],
    references: [
      { label: 'IUPAC Gold Book: electronegativity', url: 'https://goldbook.iupac.org/terms/view/E01990' },
    ],
  },
  concepts: {
    primary: ['chemical bond', 'electronegativity'],
    secondary: ['ionic character', 'polar covalent bond', 'nonpolar covalent bond', 'bond polarity', 'partial charge', 'Pauling scale'],
    related: ['dipole moment', 'valence electrons', 'octet rule'],
    aliases: ['chemical bond calculator', 'bond polarity', 'electronegativity difference', 'percent ionic character', 'ionic or covalent', 'polar or nonpolar', 'pauling scale', 'bond type'],
  },
  equations: [
    {
      id: 'pauling-ionic',
      symbol: 'ionic %',
      expression: 'percent ionic character = (1 - e^(-(delta chi)^2 / 4)) x 100',
      description: 'Pauling\'s relation between electronegativity difference and how ionic a bond is. It is a smooth curve, with no steps in it anywhere.',
      variables: [
        { symbol: 'ionic %', label: 'Ionic character', unit: '%', measurementId: 'ionicCharacter' },
        { symbol: 'delta chi', label: 'Electronegativity difference', unit: '', measurementId: 'deltaEN' },
      ],
    },
    {
      id: 'difference',
      symbol: 'delta chi',
      expression: 'delta chi = |chi A - chi B|',
      description: 'The electronegativity difference: the gap between the two atoms on the Pauling scale, taken as a magnitude.',
      variables: [
        { symbol: 'chi A', label: 'First electronegativity', unit: '', measurementId: 'enA' },
        { symbol: 'chi B', label: 'Second electronegativity', unit: '', measurementId: 'enB' },
      ],
    },
  ],
  educational: {
    summary:
      'Pick two elements and watch the bond slide along the continuum from nonpolar covalent to ionic, with the conventional cutoffs shown as conventions.',
    intentGroups: {
      informational: ['What is electronegativity?', 'What is percent ionic character?', 'What makes a bond polar?'],
      howTo: ['How to work out if a bond is ionic or covalent', 'How to calculate electronegativity difference'],
      comparison: ['Ionic vs covalent bonds', 'Polar vs nonpolar covalent', 'Electronegativity difference vs bond type'],
      misconception: ['Bond type is a continuum, not three boxes', 'Two nonmetals never form an ionic bond'],
      troubleshooting: ['Why HF is not ionic despite the difference', 'Why a bond near a cutoff is labelled differently in different books'],
    },
    commonMistakes: [
      'Treating the 1.7 cutoff as a law rather than a convention drawn on a curve',
      'Calling a nonmetal pair ionic because the difference passed the threshold',
      'Assuming a polar bond always makes a polar molecule, ignoring geometry',
    ],
    realWorldUseCases: [
      'Deciding whether a compound will dissolve in water or in a nonpolar solvent',
      'Explaining why sodium chloride forms a lattice while hydrogen chloride is a gas',
      'Predicting which atom carries the partial negative charge in a reaction',
    ],
    audience: ['chemistry students', 'chemistry teachers', 'materials science students'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Chemical Bond Calculator: Ionic or Covalent',
    description:
      'Pick two elements and see the bond polarity: electronegativity difference, percent ionic character, and whether the bond type is polar, nonpolar or ionic.',
    tagline: 'Watch a bond slide from covalent to ionic as you change the atoms.',
    keywords: ['chemical bond calculator', 'bond polarity calculator', 'electronegativity difference calculator', 'percent ionic character', 'ionic or covalent', 'polar or nonpolar bond', 'bond type calculator'],
  },
  presentation: {
    // Tags are the tool's search vocabulary (they feed the client index, and nothing renders them).
    // seo.keywords does NOT reach the index, so a phrase needed for retrieval is repeated here.
    tags: ['chemical bond calculator', 'bond polarity calculator', 'bond polarity', 'electronegativity', 'electronegativity difference', 'electronegativity difference calculator', 'percent ionic character', 'ionic character', 'ionic or covalent', 'polar or nonpolar bond', 'bond type calculator', 'pauling scale', 'partial charge', 'chemical bonding'],
    updatedAt: '2026-08-29',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Sodium chloride', body: 'Sodium at 0.93 and chlorine at 3.16 differ by 2.23, giving 71% ionic character. A metal and a nonmetal that far apart really do form a lattice rather than molecules.' },
    { title: 'Hydrogen chloride', body: 'The same chlorine against hydrogen differs by 0.96, giving 21% ionic character. For example, that is why HCl is a molecular gas while NaCl is a solid.' },
    { title: 'Oxygen to oxygen', body: 'Two identical atoms have no difference at all, so the pair sits exactly at the midpoint and the bond is 0% ionic. This is the only genuinely nonpolar case.' },
    { title: 'Hydrogen fluoride', body: 'Difference 1.78, which is past the 1.7 cutoff, so the rule says ionic. HF is a molecular gas. Both partners are nonmetals, and this is the case that shows the cutoff is a convention.' },
  ],
  faq: [
    {
      question: 'What is electronegativity?',
      answer:
        'Electronegativity measures how strongly an atom pulls a shared pair of electrons toward itself. Pauling\'s scale runs from caesium at 0.79 to fluorine at 3.98. The number has no units, because it is a comparison rather than a measurement of a quantity. What matters for bonding is never the value itself, only the difference between two of them.',
    },
    {
      question: 'How do you tell if a bond is ionic or covalent?',
      answer:
        'Take the electronegativity difference between the two atoms. Below 0.4 the bond is called nonpolar covalent, between 0.4 and 1.7 polar covalent, and above 1.7 ionic. However, those numbers are conventions rather than laws. Pauling\'s relation turns the difference into a percent ionic character on a smooth curve, and reading the percentage tells you more than reading the box.',
    },
    {
      question: 'What is percent ionic character?',
      answer:
        'It is how far a bond has moved from perfectly shared toward completely transferred, from Pauling\'s relation: 100 x (1 - e raised to minus the difference squared over 4). Sodium chloride comes out at 71%, hydrogen chloride at 21%. The curve is smooth, therefore no bond suddenly changes nature at any particular difference.',
    },
    {
      question: 'Why is 1.7 the cutoff for an ionic bond?',
      answer:
        'Because Pauling\'s curve passes through 50% ionic character at a difference of 1.7. Someone drew the line where the bond is half ionic and half covalent, which is a reasonable place to put it and still an arbitrary one. Move the sliders across that point and watch the percentage change by a fraction while the label jumps.',
    },
    {
      question: 'Why is hydrogen fluoride not ionic?',
      answer:
        'Its difference is 1.78, past the cutoff, so the rule says ionic. HF is a molecular gas that dissolves to give an acid. The reason is that both hydrogen and fluorine are nonmetals, and two nonmetals share electrons rather than transferring one to form a lattice. This simulator flags any nonmetal pair past the threshold instead of confidently mislabelling it.',
    },
    {
      question: 'What is a partial charge?',
      answer:
        'In a polar bond the shared pair sits nearer the more electronegative atom, so that atom carries a small negative charge written delta minus, and its partner carries delta plus. These are fractions of an electron rather than whole ones, which is exactly what separates a polar covalent bond from an ionic one where the transfer is complete.',
    },
    {
      question: 'Does a polar bond always make a polar molecule?',
      answer:
        'No, and this is a common mistake. Carbon dioxide has two strongly polar carbon to oxygen bonds, yet the molecule has no dipole at all, because the bonds point in opposite directions and cancel. Bond polarity is one input; molecular geometry is the other. Work out the bonds first, then the shape.',
    },
    {
      question: 'Why do some elements have no electronegativity value?',
      answer:
        'Pauling\'s scale is built from bond energies, so an element that forms no ordinary bonds gets no value. Helium, neon and argon have none, and neither do the synthetic elements past lawrencium. That is a real gap in the scale rather than missing data, so this tool reports no difference instead of defaulting the value to zero.',
    },
  ],
  guide: {
    slug: 'how-chemical-bonds-work',
    title: 'How Chemical Bonds Work',
    description:
      'How electronegativity difference sets bond character, what percent ionic character means, and why the ionic and covalent cutoffs are conventions.',
    readMinutes: 6,
    updatedAt: '2026-08-29',
    quickAnswer:
      'A chemical bond is characterised by how evenly two atoms share their electrons, and electronegativity difference measures that. Pauling\'s relation turns the difference into a percent ionic character: 100 x (1 - e raised to minus the difference squared over 4). Sodium chloride differs by 2.23 and comes out 71% ionic; hydrogen chloride differs by 0.96 and comes out 21%. The familiar cutoffs at 0.4 and 1.7 are lines drawn on that smooth curve rather than laws, and 1.7 is simply where the curve passes 50%. Pick two elements here and watch the shared pair slide toward the greedier atom.',
    sections: [
      {
        id: 'electronegativity',
        heading: 'What Does Electronegativity Actually Measure?',
        body:
          'It measures how hard an atom pulls on a shared pair. Fluorine pulls hardest at 3.98 and caesium pulls least at 0.79. The value on its own tells you nothing about a bond, because a bond involves two atoms. Only the difference between the partners matters, which is why the same chlorine atom makes an ionic bond with sodium and a covalent one with hydrogen.',
        bullets: [
          'The scale is unitless, because it is a comparison rather than a measured quantity.',
          'Electronegativity rises across a period and falls down a group, so the extremes sit in opposite corners of the table.',
        ],
      },
      {
        id: 'continuum',
        heading: 'Ionic vs Covalent: Where Is The Line?',
        body:
          'There is no line. Pauling\'s relation gives a smooth curve from 0% ionic at no difference toward 100% at a very large one, and the conventional cutoffs are marks drawn on it. The 1.7 boundary is simply where the curve passes 50%. For example, a bond at 1.65 and a bond at 1.75 differ by about one percentage point of ionic character, yet the labels either side call them different kinds of bond.',
        bullets: [
          'Below 0.4: called nonpolar covalent, under 4% ionic.',
          'Between 0.4 and 1.7: called polar covalent.',
          'Above 1.7: called ionic, which is where more than half the character has transferred.',
        ],
      },
      {
        id: 'hf',
        heading: 'Why Does The Cutoff Fail For Hydrogen Fluoride?',
        body:
          'HF has a difference of 1.78, past the threshold, so a mechanical application of the rule calls it ionic. Hydrogen fluoride is a molecular gas. Both atoms are nonmetals, and two nonmetals share electrons instead of transferring one to build a lattice. Therefore the difference is necessary but not sufficient: check what kind of elements you have before trusting the number.',
        bullets: [
          'A metal with a nonmetal past 1.7 really is ionic, which is why sodium chloride behaves as the rule predicts.',
          'This simulator flags a nonmetal pair past the threshold rather than sorting it into the wrong box.',
        ],
      },
      {
        id: 'how-to',
        heading: 'How Do You Calculate An Electronegativity Difference?',
        body:
          'Look up both values on the Pauling scale and subtract the smaller from the larger. Sodium is 0.93 and chlorine is 3.16, therefore the difference is 2.23. That is the whole calculation, and used as an electronegativity difference calculator this page does the lookup for you when you move either slider. The difference then feeds Pauling\'s relation, which is how the tool works: difference in, percent ionic character out, bond type read off the curve.',
        bullets: [
          'For example, hydrogen at 2.20 against chlorine at 3.16 gives 0.96, which is 21% ionic.',
          'The order does not matter, because only the magnitude of the gap affects the bond.',
        ],
      },
      {
        id: 'difference-vs-type',
        heading: 'Electronegativity Difference vs Bond Type',
        body:
          'The difference is a measurement; the bond type is a label someone put on a range of it. As a bond polarity calculator this page reports both, therefore you can see how loosely the two are connected. Asking whether you have a polar or nonpolar bond is asking which side of 0.4 the difference falls, and nothing about the bond changes as it crosses.',
        bullets: [
          'Difference 0.00 to 0.4: polar or nonpolar bond is decided here, and below 0.4 it is called nonpolar.',
          'However, two bonds either side of a boundary differ by about one percentage point of ionic character.',
        ],
      },
      {
        id: 'partial-charges',
        heading: 'Where Do Partial Charges Come From?',
        body:
          'When one atom pulls harder, the shared pair spends more time near it, so that atom carries a small negative charge and its partner a small positive one. These are fractions of an electron, written delta minus and delta plus. For example, in hydrogen chloride the chlorine end is delta minus, which is why the molecule lines up in an electric field and why it dissolves readily in water.',
      },
      {
        id: 'where-it-matters',
        heading: 'Where Does Bond Character Get Used?',
        body:
          'Solubility is the everyday answer. Like dissolves like, so an ionic or strongly polar compound goes into water while a nonpolar one prefers a nonpolar solvent. Bond character also explains why sodium chloride is a solid with a high melting point while hydrogen chloride is a gas: a lattice of ions holds together far more strongly than separate molecules do. In a reaction, the partial negative atom is where an electrophile attacks.',
        bullets: [
          'However, a polar bond does not guarantee a polar molecule. Carbon dioxide has two polar bonds that cancel.',
          'Work out the bonds first, then apply the geometry.',
        ],
      },
    ],
    mistakes: [
      {
        heading: 'Treating The Cutoffs As Laws',
        body:
          'The 0.4 and 1.7 boundaries are conventions, and different textbooks use slightly different ones. A bond sitting close to either is not meaningfully different from one just the other side. Quote the percent ionic character when you can, and treat the label as a rough sorting rather than a fact about the bond.',
      },
      {
        heading: 'Calling A Nonmetal Pair Ionic',
        body:
          'A common mistake is to run the difference through the cutoff and stop there. Two nonmetals share electrons however greedy one of them is, so hydrogen fluoride is polar covalent despite a difference of 1.78. Check the elements as well as the number, every time.',
      },
      {
        type: 'note',
        heading: 'Everything Runs On Your Device',
        body:
          'The simulation runs entirely in your browser. Nothing is uploaded, logged, or shared, and it works offline once the page has loaded. To see where the valence electrons doing this bonding came from, open the electron configuration simulator.',
      },
    ],
  },
  // Authored ON TOP of the derived sibling edges (see relations.ts).
  relationships: {
    usedWith: [
      {
        slug: 'electron-configuration-calculator',
        reason: 'The valence electrons that form this bond are the ones that tool counts',
        strength: 0.85,
      },
    ],
    nextSteps: [
      {
        slug: 'crystal-field-splitting-calculator',
        reason: 'Once a bond forms to a metal centre, the ligand field decides what the d electrons do next',
        priority: 2,
      },
    ],
  },
  paramBehavior: chemicalBond.paramBehavior,
  aspect: chemicalBond.aspect,
  params: chemicalBond.params,
  presets: chemicalBond.presets,
  formula: chemicalBond.formula,
};
