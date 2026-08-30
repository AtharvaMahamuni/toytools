// Declarative manifest for the Electron Configuration Simulator. Single source of truth for its
// config, knowledge, FAQ, guide, SEO, and relationships. Runtime behavior is in
// electron-configuration.ts. No em-dashes.

import type { SimulationManifest } from '../manifest';
import { SIMULATION_SCHEMA_VERSION } from '../manifest';
import electronConfiguration from './electron-configuration';

export const manifest: SimulationManifest = {
  schemaVersion: SIMULATION_SCHEMA_VERSION,
  metadata: {
    title: 'Electron Configuration Calculator',
    slug: 'electron-configuration-calculator',
    processorId: 'electron-configuration',
    domain: 'chemistry-lab',
    category: 'chemistry',
    family: 'atomic-structure',
    difficulty: 'beginner',
    schoolLevel: 'high-school',
    estimatedLearningTime: '7 min',
    prerequisites: ['atomic number', 'protons and electrons'],
    nextTopics: ['periodic trends', 'chemical bonding', 'crystal field splitting'],
    curriculumTags: ['general chemistry', 'atomic structure'],
    learningObjectives: [
      'Write the electron configuration of any element in the periodic table',
      'Explain why 4s fills before 3d and why that ordering matters',
      'Work out the configuration of an ion, removing electrons from the right shell first',
    ],
    keyTakeaways: [
      'Electrons fill in Madelung order, so the fourth shell starts before the third finishes',
      'Twenty ground states break the aufbau order, and they all buy a half-filled or filled subshell',
      'A cation loses electrons from the outermost shell first, not in reverse filling order',
    ],
    references: [
      { label: 'IUPAC Gold Book: aufbau principle', url: 'https://goldbook.iupac.org/terms/view/A00512' },
    ],
  },
  concepts: {
    primary: ['electron configuration', 'atomic structure'],
    secondary: ['aufbau principle', 'valence electrons', 'orbital diagram', 'noble gas shorthand', 'Hund\'s rule', 'electron shells'],
    related: ['periodic table', 'ions', 'unpaired electrons'],
    aliases: ['electron configuration', 'electron configuration calculator', 'aufbau principle', 'orbital diagram', 'valence electrons', 'noble gas configuration', 'electron shells', 'madelung rule'],
  },
  equations: [
    {
      id: 'electron-count',
      symbol: 'e',
      expression: 'electrons = Z - charge',
      description: 'How many electrons a species carries: its atomic number, less the charge it has gained or lost.',
      variables: [
        { symbol: 'e', label: 'Electrons', unit: '', measurementId: 'electrons' },
        { symbol: 'Z', label: 'Atomic number', unit: '', paramId: 'atomicNumber' },
        { symbol: 'charge', label: 'Ion charge', unit: '', paramId: 'charge' },
      ],
    },
    {
      id: 'shell-capacity',
      symbol: 'capacity',
      expression: 'shell capacity = 2 n squared',
      description: 'The most electrons a principal shell can hold: 2 in the first, 8 in the second, 18 in the third.',
      variables: [
        { symbol: 'n', label: 'Occupied shells', unit: '', measurementId: 'shells' },
      ],
    },
  ],
  educational: {
    summary:
      'Build any atom or ion one electron at a time, in the order electrons really fill, with the valence shell and the aufbau exceptions called out.',
    intentGroups: {
      informational: ['What is electron configuration?', 'What is the aufbau principle?', 'What are valence electrons?'],
      howTo: ['How to write an electron configuration', 'How to find the electron configuration of an ion'],
      comparison: ['Aufbau order vs shell order', 'Electron configuration vs noble gas shorthand', 'Atoms vs ions'],
      misconception: ['Electrons are not removed in reverse filling order', 'Aufbau order is not the same as shell order'],
      troubleshooting: ['Why chromium does not follow the pattern', 'Why 4s empties before 3d in an ion'],
    },
    commonMistakes: [
      'Removing electrons from an ion in reverse aufbau order instead of from the outermost shell',
      'Applying the aufbau order to chromium and copper without checking the exceptions',
      'Confusing the filling order with the order the shells sit in',
    ],
    realWorldUseCases: [
      'Predicting the ion an element forms before writing a formula',
      'Explaining why transition metals have several oxidation states',
      'Checking a configuration before an exam question on periodic trends',
    ],
    audience: ['chemistry students', 'chemistry teachers', 'physics students'],
    workflowStage: ['analyze'],
  },
  seo: {
    title: 'Electron Configuration Calculator and Orbital Diagram',
    description:
      'Build any element or ion one electron at a time and watch 4s fill before 3d. Valence electrons, orbital diagram, noble gas shorthand and the aufbau principle.',
    tagline: 'Watch the electrons fill in the order they really go in.',
    keywords: ['electron configuration calculator', 'electron configuration', 'orbital diagram', 'aufbau principle', 'valence electrons calculator', 'noble gas configuration', 'electron configuration of ions'],
  },
  presentation: {
    // Tags are the tool's search vocabulary (they feed the client index, and nothing renders them).
    // seo.keywords does NOT reach the index, so a phrase needed for retrieval is repeated here.
    tags: ['electron configuration calculator', 'electron configuration', 'electron configuration of an element', 'orbital diagram', 'aufbau principle', 'madelung rule', 'valence electrons', 'valence electrons calculator', 'noble gas configuration', 'electron shells', 'electron configuration of ions', 'atomic structure', 'unpaired electrons'],
    updatedAt: '2026-08-29',
    isNew: true,
    trustVariant: 'offline',
  },
  examples: [
    { title: 'Iron', body: 'Iron fills 4s before 3d, ending at 4s2 3d6. For example, that is why the fourth shell is already occupied while the third is still eight electrons short of full.' },
    { title: 'The iron(II) ion', body: 'Fe2+ is [Ar] 3d6, not [Ar] 4s2 3d4. The 4s electrons leave first because they sit in the outer shell, even though they arrived before the 3d ones.' },
    { title: 'Chromium', body: 'Aufbau predicts 4s2 3d4. The real ground state is 4s1 3d5, because a half-filled d subshell costs less than the order predicts.' },
    { title: 'The chloride ion', body: 'Adding one electron to chlorine completes the third shell, giving exactly the argon configuration. That is what isoelectronic means, and it is why chloride is stable.' },
  ],
  faq: [
    {
      question: 'What is an electron configuration?',
      answer:
        'An electron configuration lists which orbitals an atom\'s electrons occupy, in order, with the count in each. Iron is 1s2 2s2 2p6 3s2 3p6 4s2 3d6. The notation packs three facts into each term: the shell number, the subshell letter, and how many electrons are in it. Everything about how an element bonds follows from the last few terms.',
    },
    {
      question: 'What is the aufbau principle?',
      answer:
        'Aufbau means building up. Electrons occupy the lowest energy subshell available, and the order follows n plus l, with lower n breaking a tie. That gives 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p and onward. Notice that 4s comes before 3d, which is the step that surprises people most.',
    },
    {
      question: 'Why does 4s fill before 3d?',
      answer:
        'Because 4s has a lower n plus l value: 4 plus 0 is 4, while 3d is 3 plus 2, which is 5. Energy depends on both quantum numbers rather than on the shell number alone. The two subshells sit very close together, which is also why several elements swap an electron between them.',
    },
    {
      question: 'How do you write the electron configuration of an ion?',
      answer:
        'Start from the neutral atom, then remove electrons from the highest principal shell first. For iron that means taking the 4s electrons before the 3d ones, so Fe2+ is [Ar] 3d6. This is the step most people get wrong, because running the filling order backwards would wrongly give [Ar] 4s2 3d4. For anions, simply continue down the filling order.',
    },
    {
      question: 'Which elements break the aufbau rule?',
      answer:
        'Twenty ground states do, and chromium and copper are the two every course covers. Chromium is 4s1 3d5 rather than 4s2 3d4, and copper is 4s1 3d10 rather than 4s2 3d9. Each swap buys a half-filled or completely filled d subshell. Palladium goes further and empties its 5s entirely.',
    },
    {
      question: 'What are valence electrons?',
      answer:
        'Valence electrons are the ones in the outermost occupied shell, and they are the electrons that form bonds. Chlorine has seven, calcium has two. For a transition metal the picture is wider: iron has two in the 4s shell, but its incomplete 3d subshell takes part in bonding as well, which is why it shows several oxidation states.',
    },
    {
      question: 'What is noble gas shorthand?',
      answer:
        'Noble gas shorthand replaces the filled inner shells with the symbol of the noble gas that matches them. Iron becomes [Ar] 4s2 3d6 instead of the full string. It keeps the part that matters, because the electrons beyond the core are the ones that react. Writing a noble gas as its own core is circular, so the element itself keeps the full form.',
    },
    {
      question: 'How many electrons fit in each shell?',
      answer:
        'Electron shells hold up to 2n squared electrons: 2 in the first, 8 in the second, 18 in the third, 32 in the fourth. However, the outermost shell of a real atom never holds more than 8, because the next shell starts before the current one fills. That gap between capacity and occupancy is the whole reason the filling order looks strange.',
    },
  ],
  guide: {
    slug: 'how-electron-configuration-works',
    title: 'How Electron Configuration Works',
    description:
      'How to write an electron configuration, why 4s fills before 3d, how ions differ from atoms, and which elements break the aufbau order.',
    readMinutes: 7,
    updatedAt: '2026-08-29',
    quickAnswer:
      'An electron configuration says which orbitals an atom\'s electrons occupy. Electrons fill in Madelung order, lowest n plus l first, which gives 1s, 2s, 2p, 3s, 3p, 4s, 3d and onward. Iron is therefore 1s2 2s2 2p6 3s2 3p6 4s2 3d6, or [Ar] 4s2 3d6 in noble gas shorthand. Two things trip people up. Ions lose electrons from the outermost shell first, so Fe2+ is [Ar] 3d6 rather than [Ar] 4s2 3d4. And twenty ground states, chromium and copper among them, break the aufbau order to buy a half-filled or filled subshell. Build any element here and watch the electrons land in order.',
    sections: [
      {
        id: 'reading',
        heading: 'How Do You Read An Electron Configuration?',
        body:
          'Each term carries three facts. The number is the principal shell, the letter is the subshell, and the superscript is how many electrons sit in it. So 3p6 means six electrons in the p subshell of the third shell. Read the terms left to right and you have read the order they filled, which is why the written string and the orbital diagram carry the same information.',
        bullets: [
          'The s subshell holds 2 electrons, p holds 6, d holds 10 and f holds 14.',
          'The last terms are the ones that bond, therefore a noble gas configuration written as shorthand keeps only those.',
          'The shell picture and the orbital diagram show the same electron shells two ways, so watch both fill together.',
        ],
      },
      {
        id: 'filling-order',
        heading: 'Why Does 4s Fill Before 3d?',
        body:
          'Energy depends on the shell number and the subshell shape together, not on the shell number alone. Madelung order ranks subshells by n plus l, with the lower n winning a tie. That puts 4s at 4 and 3d at 5, therefore 4s fills first. The two sit close in energy, which matters again as soon as you make an ion.',
        bullets: [
          'For example, potassium is 4s1 rather than 3d1, even though the third shell has room for ten more electrons.',
          'The same rule puts 6s before 4f, which is where the lanthanides come from.',
        ],
      },
      {
        id: 'ions',
        heading: 'How Do You Find The Electron Configuration Of An Ion?',
        body:
          'Atoms vs ions is where most marks are lost. The electron configuration of ions follows a different rule from filling: electrons are removed from the outermost shell first, not by running the filling order backwards. Iron fills 4s then 3d, however Fe2+ loses both 4s electrons and keeps all six 3d ones. For example, set the charge slider to plus two and watch which bar empties.',
        bullets: [
          'Fe2+ is [Ar] 3d6. Writing [Ar] 4s2 3d4 is the classic error.',
          'Anions are simpler: the extra electrons just continue down the filling order.',
          'An ion that reaches a noble gas configuration is called isoelectronic with it, therefore chloride is written [Ar].',
        ],
      },
      {
        id: 'exceptions',
        heading: 'Which Elements Break The Rule?',
        body:
          'Twenty ground states do not match aufbau, and every one of them buys a half-filled or completely filled subshell. Chromium moves an electron from 4s to 3d to reach 3d5. Copper does the same to reach 3d10. However, these are measured ground states rather than a pattern you can derive, so they have to be learned or looked up.',
        bullets: [
          'Chromium: 4s1 3d5, not 4s2 3d4.',
          'Copper: 4s1 3d10, not 4s2 3d9.',
          'Palladium goes furthest and empties 5s completely, ending at 4d10.',
        ],
      },
      {
        id: 'valence',
        heading: 'Which Electrons Actually Bond?',
        body:
          'The valence electrons, meaning the ones in the outermost occupied shell. Chlorine has seven and forms one bond to complete an octet. Calcium has two and loses both. A transition metal is the interesting case: iron has two valence electrons in 4s, but its incomplete 3d subshell joins in as well, therefore iron shows several oxidation states rather than one. Used as a valence electrons calculator, the readout above the orbital diagram gives that count directly.',
        bullets: [
          'The valence shell is drawn highlighted on both the shell picture and the orbital diagram, so the electrons that bond are never buried in the middle of a string.',
          'However, for a transition metal read the d count as well, because those electrons bond too.',
        ],
      },
      {
        id: 'where-it-matters',
        heading: 'Where Does This Get Used?',
        body:
          'Atomic structure is the foundation the rest of chemistry sits on, and predicting the ion an element forms is the everyday use, because that is what a formula needs. Sodium has one valence electron, loses it, and becomes Na+, so the formula with chloride is NaCl. Configuration also explains why transition metals have several oxidation states and why some ions are coloured. For an exam, the practical use is checking a configuration before answering anything on periodic trends.',
        bullets: [
          'Main group elements gain or lose electrons to reach the nearest noble gas count.',
          'Unpaired electrons make a species paramagnetic, which a magnetic measurement can check.',
        ],
      },
    ],
    mistakes: [
      {
        heading: 'Removing Ion Electrons In Reverse Filling Order',
        body:
          'Filling order and removal order are different rules, and assuming they are the same is the most common mistake in the topic. Electrons fill by energy but leave from the outermost shell. Iron fills 4s before 3d, then loses 4s first. Check which shell number is highest, not which subshell filled last.',
      },
      {
        heading: 'Trusting Aufbau For Every Element',
        body:
          'Aufbau predicts the ground state for most of the periodic table, but not all of it. Chromium and copper are the two you will be asked about, and there are eighteen more. Do not derive them from the rule and assume you are right; the exceptions are measured, not calculated.',
      },
      {
        type: 'note',
        heading: 'Everything Runs On Your Device',
        body:
          'The simulation runs entirely in your browser. Nothing is uploaded, logged, or shared, and it works offline once the page has loaded. To see what happens once these electrons meet another atom, open the chemical bond simulator.',
      },
    ],
  },
  // Authored ON TOP of the derived sibling edges (see relations.ts).
  relationships: {
    usedWith: [
      {
        slug: 'chemical-bond-calculator',
        reason: 'The valence electrons this tool finds are exactly what decides the bond the next one draws',
        strength: 0.85,
      },
    ],
  },
  paramBehavior: electronConfiguration.paramBehavior,
  aspect: electronConfiguration.aspect,
  params: electronConfiguration.params,
  presets: electronConfiguration.presets,
  formula: electronConfiguration.formula,
};
