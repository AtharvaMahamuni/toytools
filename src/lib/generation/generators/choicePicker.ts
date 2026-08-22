// Random choice picker strategy.
//
// Decides between pasted options, or shuffles the lot into a running order. Same unbiased draw as
// every other generator here; the interesting part is what arrives in the box.
//
// The craft (`choice-split`) is the one input mistake this tool cannot survive. People type their
// options the way they say them, on one line separated by commas or the word "or", and a picker
// that reads lines then has exactly one option and "picks" it with total confidence. That is a
// wrong answer wearing the costume of a right one, which is the worst kind. The tool can see a
// single line holding separators, so it says what happened and offers the split. A list that is
// already one per line gets nothing.

import type { Generator, GenerationResult, GeneratorOptions, GenerationNote } from '../types';
import { shuffle } from '../utils';

const MAX_OPTIONS = 2000;
const MAX_PICKS = 50;

const SAMPLE = ['Pizza', 'Sushi', 'Tacos', 'Ramen', 'Curry'].join('\n');

/** Separators people actually type when they write a choice out as a sentence. */
const SPLITTERS: { pattern: RegExp; name: string }[] = [
  { pattern: /\s*,\s*/g, name: 'commas' },
  { pattern: /\s*;\s*/g, name: 'semicolons' },
  { pattern: /\s+or\s+/gi, name: '"or"' },
  { pattern: /\s*\|\s*/g, name: 'pipes' },
];

export function parseOptions(raw: string): string[] {
  return String(raw ?? '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_OPTIONS);
}

/**
 * A single line that is really several options, or null.
 *
 * Deliberately narrow. It fires only when the whole input is ONE line, so there is no judgement
 * call about whether a comma inside one of several options was meant as a separator. An option
 * legitimately containing a comma stays safe the moment a second line exists.
 */
export function detectCompound(options: string[]): { parts: string[]; separator: string } | null {
  if (options.length !== 1) return null;
  const line = options[0];
  for (const { pattern, name } of SPLITTERS) {
    const parts = line
      .split(new RegExp(pattern.source, pattern.flags.replace('g', '')))
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length >= 2) return { parts, separator: name };
  }
  return null;
}

/** Say that the list is one option pretending to be several, or nothing. */
export function compoundNote(options: string[]): GenerationNote | undefined {
  const found = detectCompound(options);
  if (!found) return undefined;
  return {
    text: `That is one option with ${found.separator} inside it, so there is nothing here to choose between.`,
    fix: {
      label: `Split into ${found.parts.length} options`,
      field: 'options',
      value: found.parts.join('\n'),
    },
  };
}

export const choicePicker: Generator = {
  id: 'choice-picker',
  family: 'chance',
  autoGenerate: true,
  live: false,
  notes: true,
  fields: [
    {
      id: 'options',
      label: 'Options',
      type: 'textarea',
      default: SAMPLE,
      rows: 8,
      placeholder: 'One option per line',
      help: 'One option per line. Blank lines are ignored.',
    },
    {
      id: 'mode',
      label: 'What to do',
      type: 'select',
      default: 'pick',
      options: [
        { value: 'pick', label: 'Pick a winner' },
        { value: 'order', label: 'Put them all in a random order' },
      ],
    },
    {
      id: 'count',
      label: 'How many to pick',
      type: 'number',
      default: 1,
      min: 1,
      max: MAX_PICKS,
      step: 1,
      showWhen: { field: 'mode', equals: 'pick' },
    },
  ],
  generate(opts: GeneratorOptions): GenerationResult {
    const options = parseOptions(String(opts.options ?? ''));
    if (!options.length) {
      return { ok: false, kind: 'text', error: 'Add at least one option, one per line.' };
    }

    const note = compoundNote(options);
    const order = String(opts.mode) === 'order';
    const count = order
      ? options.length
      : Math.min(options.length, Math.max(1, Math.min(MAX_PICKS, Math.round(Number(opts.count) || 1))));

    const drawn = shuffle([...options]).slice(0, count);
    const lines = count === 1 && !order ? drawn : drawn.map((o, i) => `${i + 1}. ${o}`);

    return {
      ok: true,
      kind: 'lines',
      lines,
      text: lines.join('\n'),
      meta: [
        { label: 'Options', value: String(options.length) },
        order
          ? { label: 'Order', value: 'all shuffled' }
          : { label: 'Each option', value: `1 in ${options.length}` },
      ],
      note,
    };
  },
};
