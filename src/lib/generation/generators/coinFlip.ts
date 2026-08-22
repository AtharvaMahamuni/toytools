// Coin flipper strategy.
//
// One flip, or a run of them, from the same unbiased secureInt the password generator uses.
//
// The craft (`coin-streak`) exists because of the complaint every online coin flipper collects:
// somebody flips ten times, gets eight heads, and concludes the tool is rigged. It is not, and the
// useful reply is a number rather than a reassurance. The note states how often a split at least
// that uneven turns up, computed exactly, so the answer is checkable instead of soothing.
// A single flip has nothing to be surprised by, so the note stays away entirely.

import type { Generator, GenerationResult, GeneratorOptions, GenerationNote } from '../types';
import { secureInt } from '../utils';

const MAX_FLIPS = 500;

const FACE_SETS: Record<string, [string, string]> = {
  'heads-tails': ['Heads', 'Tails'],
  'yes-no': ['Yes', 'No'],
  'true-false': ['True', 'False'],
  'a-b': ['A', 'B'],
};

/** log(n!) with a growing cache. Exact factorials overflow past 170, and the tails below need
 *  n up to 500, so the whole binomial is done in log space. */
const logFactCache: number[] = [0];
function logFactorial(n: number): number {
  for (let i = logFactCache.length; i <= n; i++) logFactCache[i] = logFactCache[i - 1] + Math.log(i);
  return logFactCache[n];
}

/** P(exactly k heads in n fair flips). */
function binomialPmf(n: number, k: number): number {
  return Math.exp(logFactorial(n) - logFactorial(k) - logFactorial(n - k) - n * Math.LN2);
}

/**
 * P(a run of n fair flips lands at least as far from an even split as `heads` did), counting both
 * directions. This is the number that answers "is this coin broken".
 */
export function lopsidedness(n: number, heads: number): number {
  const gap = Math.abs(heads - n / 2);
  let p = 0;
  for (let k = 0; k <= n; k++) {
    if (Math.abs(k - n / 2) >= gap - 1e-9) p += binomialPmf(n, k);
  }
  return Math.min(1, p);
}

/** P(exactly an even split), only defined for even n. */
export function evenSplitChance(n: number): number {
  return binomialPmf(n, n / 2);
}

function pct(p: number): string {
  const v = p * 100;
  if (v > 0 && v < 1) return 'under 1';
  if (v < 100 && v > 99.5) return 'over 99';
  return String(Math.round(v));
}

/** What the run just produced is worth knowing about, or nothing at all for a single flip. */
export function streakNote(
  faces: [string, string],
  flips: string[],
): GenerationNote | undefined {
  const n = flips.length;
  if (n < 2) return undefined;
  const heads = flips.filter((f) => f === faces[0]).length;
  const tails = n - heads;
  const low = faces[0].toLowerCase();
  const lowTails = faces[1].toLowerCase();

  if (heads === tails) {
    return {
      text: `${heads} ${low} and ${tails} ${lowTails}. A dead-even split is the single likeliest result of ${n} flips and it still only turns up ${pct(evenSplitChance(n))}% of the time.`,
    };
  }
  return {
    text: `${heads} ${low}, ${tails} ${lowTails}. A split at least this uneven turns up in ${pct(lopsidedness(n, heads))}% of ${n}-flip runs, so it is what a fair coin looks like.`,
  };
}

export const coinFlip: Generator = {
  id: 'coin-flip',
  family: 'chance',
  autoGenerate: true,
  live: false,
  notes: true,
  fields: [
    {
      id: 'flips',
      label: 'How many flips',
      type: 'number',
      default: 1,
      min: 1,
      max: MAX_FLIPS,
      step: 1,
    },
    {
      id: 'faces',
      label: 'Sides',
      type: 'select',
      default: 'heads-tails',
      options: [
        { value: 'heads-tails', label: 'Heads and tails' },
        { value: 'yes-no', label: 'Yes and no' },
        { value: 'true-false', label: 'True and false' },
        { value: 'a-b', label: 'A and B' },
      ],
    },
  ],
  generate(opts: GeneratorOptions): GenerationResult {
    const n = Math.max(1, Math.min(MAX_FLIPS, Math.round(Number(opts.flips) || 1)));
    const faces = FACE_SETS[String(opts.faces)] ?? FACE_SETS['heads-tails'];

    const flips = Array.from({ length: n }, () => faces[secureInt(2)]);
    const heads = flips.filter((f) => f === faces[0]).length;

    // One flip reads as an answer; a run reads as data, so it is grouped ten to a line rather than
    // stacked into a column nobody scrolls.
    let text: string;
    if (n === 1) {
      text = flips[0];
    } else {
      const rows: string[] = [];
      for (let i = 0; i < n; i += 10) rows.push(flips.slice(i, i + 10).join('  '));
      text = rows.join('\n');
    }

    return {
      ok: true,
      kind: 'text',
      text,
      meta:
        n === 1
          ? [{ label: 'Flips', value: '1' }]
          : [
              { label: faces[0], value: String(heads) },
              { label: faces[1], value: String(n - heads) },
              { label: 'Flips', value: String(n) },
            ],
      note: streakNote(faces, flips),
    };
  },
};
