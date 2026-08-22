// Dice roller strategy.
//
// Parses standard dice notation (2d6, d20, 4d8+3, 3d6-1) and rolls it with the same unbiased
// secureInt every other generator uses. A tabletop player types the notation their rulebook
// prints, so the notation IS the interface: a pair of "count" and "sides" spinners would make
// "4d6 drop lowest" unrepresentable and read as arithmetic homework rather than a dice cup.
//
// The craft (`dice-odds`) is the exact distribution of the pool, not a rule of thumb. Dice
// intuition is famously bad: 2d6 and 1d12 have the same range and nothing alike in the middle,
// and a player deciding whether a +2 is worth a smaller die has no way to see that from a number.
// The convolution is exact and cheap for tabletop-sized pools, and the note is simply absent for
// anything larger rather than approximated, because a made-up percentage is worse than silence.

import type { Generator, GenerationResult, GeneratorOptions, GenerationNote } from '../types';
import { secureInt } from '../utils';

/** Hard ceilings. 100 dice of 1000 sides is already far past any table, and the parse rejects
 *  above them rather than trying to roll a number nobody asked for. */
const MAX_DICE = 100;
const MAX_SIDES = 1000;
const MAX_ROLLS = 20;

/** The pool the exact distribution is computed for. 20d100 is a 2000-entry table and about 40k
 *  operations, which is imperceptible; past it the note goes quiet. */
const DIST_MAX_DICE = 20;
const DIST_MAX_SIDES = 100;

export interface DiceNotation {
  count: number;
  sides: number;
  modifier: number;
}

const NOTATION = /^\s*(\d*)\s*d\s*(\d+)\s*(?:([+-])\s*(\d+))?\s*$/i;

/** Parse "2d6+3". A bare count is optional (d20 means 1d20). Returns null on anything else. */
export function parseNotation(input: string): DiceNotation | null {
  const m = NOTATION.exec(String(input ?? ''));
  if (!m) return null;
  const count = m[1] === '' ? 1 : Number(m[1]);
  const sides = Number(m[2]);
  const modifier = m[3] ? (m[3] === '-' ? -Number(m[4]) : Number(m[4])) : 0;
  if (count < 1 || count > MAX_DICE) return null;
  if (sides < 2 || sides > MAX_SIDES) return null;
  return { count, sides, modifier };
}

/** Canonical printed form, so the note names the pool the way the rulebook does. */
export function formatNotation(n: DiceNotation): string {
  const mod = n.modifier === 0 ? '' : n.modifier > 0 ? `+${n.modifier}` : String(n.modifier);
  return `${n.count}d${n.sides}${mod}`;
}

/**
 * Exact probability mass of the sum of `count` dice with `sides` faces, indexed by
 * (sum - count). Repeated convolution: exact, integer-free and fast at tabletop sizes.
 */
export function distribution(count: number, sides: number): number[] {
  let dist = new Array<number>(sides).fill(1 / sides);
  for (let d = 1; d < count; d++) {
    const next = new Array<number>(dist.length + sides - 1).fill(0);
    for (let i = 0; i < dist.length; i++) {
      const p = dist[i];
      if (p === 0) continue;
      for (let f = 0; f < sides; f++) next[i + f] += p / sides;
    }
    dist = next;
  }
  return dist;
}

/** P(sum >= target) for the given pool, as a fraction in [0, 1]. */
export function atLeast(n: DiceNotation, target: number): number {
  const dist = distribution(n.count, n.sides);
  const min = n.count + n.modifier;
  let p = 0;
  for (let i = 0; i < dist.length; i++) {
    if (min + i >= target) p += dist[i];
  }
  return Math.min(1, Math.max(0, p));
}

/** Round a probability to a percentage a person can act on: never 0% for something that happened. */
function pct(p: number): string {
  const v = p * 100;
  if (v > 0 && v < 1) return '<1';
  if (v < 100 && v > 99) return '>99';
  return String(Math.round(v));
}

function rollOnce(n: DiceNotation): { faces: number[]; total: number } {
  const faces: number[] = [];
  for (let i = 0; i < n.count; i++) faces.push(secureInt(n.sides) + 1);
  const total = faces.reduce((a, b) => a + b, 0) + n.modifier;
  return { faces, total };
}

/**
 * What this roll was actually worth against the pool it came from, or undefined when the pool is
 * too large to answer exactly.
 */
export function oddsNote(n: DiceNotation, totals: number[]): GenerationNote | undefined {
  if (n.count > DIST_MAX_DICE || n.sides > DIST_MAX_SIDES) return undefined;
  if (!totals.length) return undefined;
  const best = Math.max(...totals);
  const share = pct(atLeast(n, best));
  const label = formatNotation(n);
  const text =
    totals.length === 1
      ? `${best} on ${label}. A roll reaches ${best} or higher ${share}% of the time.`
      : `Best of ${totals.length}: ${best}. A single ${label} reaches that or higher ${share}% of the time.`;
  return { text };
}

export const dice: Generator = {
  id: 'dice',
  family: 'chance',
  autoGenerate: true,
  live: false,
  notes: true,
  fields: [
    {
      id: 'notation',
      label: 'Dice',
      type: 'text',
      default: '2d6',
      placeholder: '2d6+3',
      help: 'Standard notation: d20, 3d8, 4d6+2, 2d10-1.',
    },
    {
      id: 'rolls',
      label: 'How many rolls',
      type: 'number',
      default: 1,
      min: 1,
      max: MAX_ROLLS,
      step: 1,
    },
    {
      id: 'breakdown',
      label: 'Show each die',
      type: 'boolean',
      default: true,
    },
  ],
  generate(opts: GeneratorOptions): GenerationResult {
    const parsed = parseNotation(String(opts.notation ?? ''));
    if (!parsed) {
      return {
        ok: false,
        kind: 'text',
        error: `Could not read that as dice. Try 2d6, d20 or 4d8+3 (up to ${MAX_DICE} dice of ${MAX_SIDES} sides).`,
      };
    }
    const rolls = Math.max(1, Math.min(MAX_ROLLS, Math.round(Number(opts.rolls) || 1)));
    const breakdown = opts.breakdown !== false;

    const results = Array.from({ length: rolls }, () => rollOnce(parsed));
    const totals = results.map((r) => r.total);

    const lines = results.map((r) => {
      if (!breakdown || parsed.count === 1) return String(r.total);
      const mod = parsed.modifier === 0 ? '' : parsed.modifier > 0 ? ` + ${parsed.modifier}` : ` - ${-parsed.modifier}`;
      return `${r.total}   (${r.faces.join(' + ')}${mod})`;
    });

    const min = parsed.count + parsed.modifier;
    const max = parsed.count * parsed.sides + parsed.modifier;
    const mean = parsed.count * ((parsed.sides + 1) / 2) + parsed.modifier;

    return {
      ok: true,
      kind: 'lines',
      lines,
      text: lines.join('\n'),
      meta: [
        { label: 'Pool', value: formatNotation(parsed) },
        { label: 'Range', value: `${min} to ${max}` },
        { label: 'Average', value: mean.toFixed(1) },
        ...(rolls > 1 ? [{ label: 'Sum', value: String(totals.reduce((a, b) => a + b, 0)) }] : []),
      ],
      note: oddsNote(parsed, totals),
    };
  },
};
