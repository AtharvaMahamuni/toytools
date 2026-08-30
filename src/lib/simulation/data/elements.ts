// The periodic table, as much of it as the chemistry simulators actually need: symbol, name, and
// the Pauling electronegativity. One table rather than one per tool, because the electron
// configuration simulator and the chemical bond simulator disagreeing about what element 26 is
// would be a bug nothing else would catch.
//
// Electronegativity is `null` where Pauling's scale does not define a value. That is not missing
// data to be filled in later: the noble gases below radon have no accepted Pauling value, and
// neither do the synthetic elements past lawrencium. Tools MUST handle null rather than defaulting
// it to zero, which would report every bond to helium as wildly ionic.
//
// Pure data. No browser APIs, safe to import anywhere.

export interface Element {
  /** Atomic number, and the index into ELEMENTS plus one. */
  z: number;
  symbol: string;
  name: string;
  /** Pauling electronegativity, or null where the scale defines none. */
  electronegativity: number | null;
}

/** [symbol, name, Pauling electronegativity] in atomic-number order, starting at hydrogen. */
const RAW: [string, string, number | null][] = [
  ['H', 'Hydrogen', 2.20],
  ['He', 'Helium', null],
  ['Li', 'Lithium', 0.98],
  ['Be', 'Beryllium', 1.57],
  ['B', 'Boron', 2.04],
  ['C', 'Carbon', 2.55],
  ['N', 'Nitrogen', 3.04],
  ['O', 'Oxygen', 3.44],
  ['F', 'Fluorine', 3.98],
  ['Ne', 'Neon', null],
  ['Na', 'Sodium', 0.93],
  ['Mg', 'Magnesium', 1.31],
  ['Al', 'Aluminium', 1.61],
  ['Si', 'Silicon', 1.90],
  ['P', 'Phosphorus', 2.19],
  ['S', 'Sulfur', 2.58],
  ['Cl', 'Chlorine', 3.16],
  ['Ar', 'Argon', null],
  ['K', 'Potassium', 0.82],
  ['Ca', 'Calcium', 1.00],
  ['Sc', 'Scandium', 1.36],
  ['Ti', 'Titanium', 1.54],
  ['V', 'Vanadium', 1.63],
  ['Cr', 'Chromium', 1.66],
  ['Mn', 'Manganese', 1.55],
  ['Fe', 'Iron', 1.83],
  ['Co', 'Cobalt', 1.88],
  ['Ni', 'Nickel', 1.91],
  ['Cu', 'Copper', 1.90],
  ['Zn', 'Zinc', 1.65],
  ['Ga', 'Gallium', 1.81],
  ['Ge', 'Germanium', 2.01],
  ['As', 'Arsenic', 2.18],
  ['Se', 'Selenium', 2.55],
  ['Br', 'Bromine', 2.96],
  ['Kr', 'Krypton', 3.00],
  ['Rb', 'Rubidium', 0.82],
  ['Sr', 'Strontium', 0.95],
  ['Y', 'Yttrium', 1.22],
  ['Zr', 'Zirconium', 1.33],
  ['Nb', 'Niobium', 1.60],
  ['Mo', 'Molybdenum', 2.16],
  ['Tc', 'Technetium', 1.90],
  ['Ru', 'Ruthenium', 2.20],
  ['Rh', 'Rhodium', 2.28],
  ['Pd', 'Palladium', 2.20],
  ['Ag', 'Silver', 1.93],
  ['Cd', 'Cadmium', 1.69],
  ['In', 'Indium', 1.78],
  ['Sn', 'Tin', 1.96],
  ['Sb', 'Antimony', 2.05],
  ['Te', 'Tellurium', 2.10],
  ['I', 'Iodine', 2.66],
  ['Xe', 'Xenon', 2.60],
  ['Cs', 'Caesium', 0.79],
  ['Ba', 'Barium', 0.89],
  ['La', 'Lanthanum', 1.10],
  ['Ce', 'Cerium', 1.12],
  ['Pr', 'Praseodymium', 1.13],
  ['Nd', 'Neodymium', 1.14],
  ['Pm', 'Promethium', 1.13],
  ['Sm', 'Samarium', 1.17],
  ['Eu', 'Europium', 1.20],
  ['Gd', 'Gadolinium', 1.20],
  ['Tb', 'Terbium', 1.10],
  ['Dy', 'Dysprosium', 1.22],
  ['Ho', 'Holmium', 1.23],
  ['Er', 'Erbium', 1.24],
  ['Tm', 'Thulium', 1.25],
  ['Yb', 'Ytterbium', 1.10],
  ['Lu', 'Lutetium', 1.27],
  ['Hf', 'Hafnium', 1.30],
  ['Ta', 'Tantalum', 1.50],
  ['W', 'Tungsten', 2.36],
  ['Re', 'Rhenium', 1.90],
  ['Os', 'Osmium', 2.20],
  ['Ir', 'Iridium', 2.20],
  ['Pt', 'Platinum', 2.28],
  ['Au', 'Gold', 2.54],
  ['Hg', 'Mercury', 2.00],
  ['Tl', 'Thallium', 1.62],
  ['Pb', 'Lead', 2.33],
  ['Bi', 'Bismuth', 2.02],
  ['Po', 'Polonium', 2.00],
  ['At', 'Astatine', 2.20],
  ['Rn', 'Radon', null],
  ['Fr', 'Francium', 0.70],
  ['Ra', 'Radium', 0.90],
  ['Ac', 'Actinium', 1.10],
  ['Th', 'Thorium', 1.30],
  ['Pa', 'Protactinium', 1.50],
  ['U', 'Uranium', 1.38],
  ['Np', 'Neptunium', 1.36],
  ['Pu', 'Plutonium', 1.28],
  ['Am', 'Americium', 1.13],
  ['Cm', 'Curium', 1.28],
  ['Bk', 'Berkelium', 1.30],
  ['Cf', 'Californium', 1.30],
  ['Es', 'Einsteinium', 1.30],
  ['Fm', 'Fermium', 1.30],
  ['Md', 'Mendelevium', 1.30],
  ['No', 'Nobelium', 1.30],
  ['Lr', 'Lawrencium', 1.30],
  ['Rf', 'Rutherfordium', null],
  ['Db', 'Dubnium', null],
  ['Sg', 'Seaborgium', null],
  ['Bh', 'Bohrium', null],
  ['Hs', 'Hassium', null],
  ['Mt', 'Meitnerium', null],
  ['Ds', 'Darmstadtium', null],
  ['Rg', 'Roentgenium', null],
  ['Cn', 'Copernicium', null],
  ['Nh', 'Nihonium', null],
  ['Fl', 'Flerovium', null],
  ['Mc', 'Moscovium', null],
  ['Lv', 'Livermorium', null],
  ['Ts', 'Tennessine', null],
  ['Og', 'Oganesson', null],
];

export const ELEMENTS: Element[] = RAW.map(([symbol, name, electronegativity], i) => ({
  z: i + 1,
  symbol,
  name,
  electronegativity,
}));

/** The heaviest element in the table. */
export const MAX_Z = ELEMENTS.length;

/** The heaviest element carrying a Pauling electronegativity, so a bond tool can bound its slider. */
export const MAX_ELECTRONEGATIVE_Z = ELEMENTS.reduce(
  (max, e) => (e.electronegativity !== null ? e.z : max),
  1,
);

/** Look up an element by atomic number, clamped into range so a slider can never miss. */
export function elementOf(z: number): Element {
  const index = Math.min(MAX_Z, Math.max(1, Math.round(z))) - 1;
  return ELEMENTS[index]!;
}
