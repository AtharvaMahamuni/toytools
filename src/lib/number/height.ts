// Heights for the comparison chart.
//
// The inch is the international inch: 2.54 cm, so a foot is 30.48 cm.
// Cited marks, not a celebrity list:
//   US adult men 20 and over, mean 175.3 cm. Women 20 and over, mean 161.3 cm.
//   Fryar et al., NCHS Vital and Health Statistics Series 3, Number 46, 2021,
//   Table 11 and Table 9 (2015-2018).
//   https://www.cdc.gov/nchs/data/series/sr_03/sr03-046-508.pdf
//   Interior door: 80 in = 203.2 cm, a common US residential door, not a statute.
//   Basketball rim: 10 ft = 304.8 cm (NBA). FIBA is 3.05 m, 2 mm higher, and that
//   gap is invisible on this chart.
//   Kitchen counter: 36 in = 91.44 cm, a common finished US kitchen counter height.

export const CM_PER_INCH = 2.54;
export const CM_PER_FOOT = 30.48;

/** Inclusive. A speck below 10 cm is not a height someone lines up. 100 m is the far end. */
export const MIN_CM = 10;
export const MAX_CM = 10000;

export type HeightUnit = 'cm' | 'ft';
export type MarkKind = 'person' | 'door' | 'counter' | 'rim';

export interface Figure {
  id: string;
  name: string;
  cm: number;
  kind: MarkKind;
}

export interface HeightReference {
  id: string;
  /** Name drawn on the chart. */
  name: string;
  /** Short label for the preset button. */
  label: string;
  cm: number;
  kind: MarkKind;
}

export const REFERENCES: readonly HeightReference[] = [
  { id: 'door', name: 'Door', label: 'Door', cm: 203.2, kind: 'door' },
  { id: 'rim', name: 'Basketball rim', label: 'Basketball rim', cm: 304.8, kind: 'rim' },
  { id: 'counter', name: 'Kitchen counter', label: 'Counter', cm: 91.44, kind: 'counter' },
  { id: 'man', name: 'Average man', label: 'Average man', cm: 175.3, kind: 'person' },
  { id: 'woman', name: 'Average woman', label: 'Average woman', cm: 161.3, kind: 'person' },
];

export const MAX_FIGURES = 6;

/**
 * The 5.11 failure. Someone typing feet and inches puts a dot between them.
 * 5.11 feet is about 5 ft 1 in. 5 ft 11 in is a different height, and the
 * shorter mark still looks like a person, so the chart does not give the
 * mistake away.
 */
export interface FeetInchesTrap {
  decimalCm: number;
  inchesCm: number;
  feet: number;
  inches: number;
  /** "5 ft 11 in". The button reads "Use" plus this. */
  label: string;
  text: string;
}

export type ParseResult =
  | { ok: true; cm: number; note?: string }
  | { ok: false; error: string };

const EMPTY = 'Enter a height.';
const BAD = 'Enter a height like 180 or 5 ft 11 in.';
const COMMA_MSG = 'Use a dot for the decimal, not a comma.';
const INCH_MSG = 'Inches stay under 12.';
const CM_PAIR = 'In centimetres, enter one number, like 175.';
const ZERO = 'Enter a height above zero.';
const RANGE_LOW = 'Heights start at 10 cm.';
const RANGE_HIGH = 'Heights stop at 100 m.';

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function numText(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** Centimetres, one decimal, trailing .0 dropped. */
export function formatCm(cm: number): string {
  return `${numText(round1(cm))} cm`;
}

/** Feet and inches. Whole feet drop the inches. Under a foot, the feet are dropped. */
export function formatFeet(cm: number): string {
  const total = round1(cm / CM_PER_INCH);
  // total has one decimal, so total - feet * 12 rounds to at most 11.9 and never carries.
  const feet = Math.floor(total / 12);
  const inches = round1(total - feet * 12);
  return feetInchesLabel(feet, inches);
}

function feetInchesLabel(feet: number, inches: number): string {
  const inchText = numText(inches);
  if (feet <= 0) return `${inchText} in`;
  if (inches === 0) return `${feet} ft`;
  return `${feet} ft ${inchText} in`;
}

export function formatHeight(cm: number, unit: HeightUnit): string {
  return unit === 'ft' ? formatFeet(cm) : formatCm(cm);
}

function formatMetres(cm: number): string {
  return `${numText(round1(cm / 100))} m`;
}

/**
 * Bare `5.11` in feet mode, or null.
 * Inches digits must be 0-11, the feet part 0-12, and the two readings must
 * differ by at least a centimetre. Anything else, including centimetre mode,
 * stays silent.
 */
export function feetInchesTrap(raw: string, unit: HeightUnit = 'ft'): FeetInchesTrap | null {
  if (unit !== 'ft') return null;
  const text = raw.trim();
  const match = text.match(/^(\d+)\.(\d{2})$/);
  if (!match) return null;
  const feet = Number(match[1]);
  const inches = Number(match[2]);
  if (feet > 12 || inches > 11) return null;
  const decimalCm = Number(text) * CM_PER_FOOT;
  const inchesCm = feet * CM_PER_FOOT + inches * CM_PER_INCH;
  if (Math.abs(decimalCm - inchesCm) < 1) return null;
  const label = feetInchesLabel(feet, inches);
  return {
    decimalCm,
    inchesCm,
    feet,
    inches,
    label,
    text: `${text} feet is ${formatFeet(decimalCm)} (${formatCm(decimalCm)}). If you meant ${label}, that is ${formatCm(inchesCm)}.`,
  };
}

function bounded(cm: number, note?: string): ParseResult {
  if (!Number.isFinite(cm)) return { ok: false, error: BAD };
  if (cm <= 0) return { ok: false, error: ZERO };
  if (cm < MIN_CM) return { ok: false, error: RANGE_LOW };
  if (cm > MAX_CM) return { ok: false, error: RANGE_HIGH };
  return note ? { ok: true, cm, note } : { ok: true, cm };
}

function fromFeetInches(feet: number, inches: number): ParseResult {
  if (inches < 0 || inches >= 12) return { ok: false, error: INCH_MSG };
  return bounded(feet * CM_PER_FOOT + inches * CM_PER_INCH);
}

/** Explicit feet-and-inches, in either unit mode. Null when the text is not that shape. */
function parseExplicit(text: string, unit: HeightUnit): ParseResult | null {
  let match = text.match(/^(\d+(?:\.\d+)?)'\s*(\d+(?:\.\d+)?)?\s*"?$/);
  if (match) return fromFeetInches(Number(match[1]), match[2] == null ? 0 : Number(match[2]));

  match = text.match(/^(\d+(?:\.\d+)?)\s*(?:ft|feet|foot)\s*(\d+(?:\.\d+)?)?\s*(?:in|inch|inches)?$/i);
  if (match) return fromFeetInches(Number(match[1]), match[2] == null ? 0 : Number(match[2]));

  match = text.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/);
  if (match && unit === 'cm') return { ok: false, error: CM_PAIR };
  if (match) return fromFeetInches(Number(match[1]), Number(match[2]));

  match = text.match(/^(\d+(?:\.\d+)?)\s*(?:cm|centimetres|centimeters)$/i);
  if (match) return bounded(Number(match[1]));

  return null;
}

/**
 * A height in centimetres.
 * Quotes, primes, and "5 ft 11 in" are feet and inches in either unit mode.
 * A bare number follows the toggle. A bare feet value over 15 adds a note:
 * the metre equivalent, in case they meant centimetres.
 */
export function parseHeight(raw: string, unit: HeightUnit): ParseResult {
  const text = raw.trim().replace(/[\u2032\u2018\u2019]/g, "'").replace(/[\u2033\u201c\u201d]/g, '"').replace(/''/g, '"');
  if (!text) return { ok: false, error: EMPTY };
  if (/[,，]/.test(text)) return { ok: false, error: COMMA_MSG };
  if (text.startsWith('-')) return { ok: false, error: ZERO };

  const explicit = parseExplicit(text, unit);
  if (explicit) return explicit;

  const bare = text.match(/^(\d+(?:\.\d+)?)$/);
  if (!bare) return { ok: false, error: BAD };
  const n = Number(bare[1]);
  if (unit === 'cm') return bounded(n);
  const cm = n * CM_PER_FOOT;
  const note = n > 15
    ? `${numText(n)} feet is ${formatMetres(cm)}. Switch to centimetres if you meant ${formatCm(n)}.`
    : undefined;
  return bounded(cm, note);
}

function markName(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : 'Mark';
}

function be(name: string): string {
  return name === 'You' ? 'are' : 'is';
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** One sentence. The taller mark is the subject, so "You" takes "are". */
export function gapLine(figures: readonly Figure[], unit: HeightUnit): string {
  const named = figures.map((figure) => ({ ...figure, name: markName(figure.name) }));
  if (named.length === 0) return '';
  if (named.length === 1) {
    const only = named[0]!;
    return `${only.name} ${be(only.name)} ${formatHeight(only.cm, unit)}.`;
  }
  const maxCm = Math.max(...named.map((figure) => figure.cm));
  const minCm = Math.min(...named.map((figure) => figure.cm));
  if (maxCm === minCm) return `${joinNames(named.map((figure) => figure.name))} are the same height.`;
  const tall = named.find((figure) => figure.cm === maxCm)!;
  const short = named.find((figure) => figure.cm === minCm)!;
  const gapCm = maxCm - minCm;
  const shown = unit === 'ft' ? round1(gapCm / CM_PER_INCH) : round1(gapCm);
  if (shown === 0) {
    const floor = unit === 'ft' ? '0.1 in' : '0.1 cm';
    return `${tall.name} and ${short.name} are about the same height, less than ${floor} apart.`;
  }
  return `${tall.name} ${be(tall.name)} ${formatHeight(maxCm - minCm, unit)} taller than ${short.name}.`;
}

/** Both units on every line, then the gap in the unit on screen. */
export function copyText(figures: readonly Figure[], unit: HeightUnit): string {
  const lines = figures.map((figure) => {
    const name = markName(figure.name);
    return `${name}: ${formatCm(figure.cm)} (${formatFeet(figure.cm)})`;
  });
  const gap = gapLine(figures, unit);
  if (gap) lines.push(gap);
  return lines.join('\n');
}

/** You at 170 cm, a placeholder, beside a common interior door. */
export function openingLineup(): Figure[] {
  return [
    { id: 'you', name: 'You', cm: 170, kind: 'person' },
    { id: 'door', name: 'Door', cm: 203.2, kind: 'door' },
  ];
}

export const heightChart = {
  references: REFERENCES,
  maxFigures: MAX_FIGURES,
  opening: openingLineup,
  trap: feetInchesTrap,
  parse: parseHeight,
  format: formatHeight,
  gap: gapLine,
  share: copyText,
};
