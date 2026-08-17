// Password generator strategy.
//
// Builds a character pool from the enabled sets, draws each character with an unbiased secure
// random pick, and reports the exact Shannon entropy plus a 0..4 strength score. When a set is
// enabled we guarantee at least one character from it (so "include numbers" is never silently
// dropped), then fill the rest at random and shuffle so the guaranteed characters are not stuck
// at the front. All randomness is crypto-backed inside generate().

import type { Generator, GenerationResult, GeneratorOptions } from '../types';
import { secureInt, pick, shuffle, entropyBits, strengthFromEntropy } from '../utils';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?';
// Characters that look alike in many fonts (O/0, l/1/I, etc.) — removed when "exclude ambiguous".
const AMBIGUOUS = new Set('O0oIl1|`'.split(''));

const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback);

function poolFor(opts: GeneratorOptions): string[] {
  const excludeAmbiguous = bool(opts.excludeAmbiguous, false);
  const sets: string[] = [];
  if (bool(opts.uppercase, true)) sets.push(UPPER);
  if (bool(opts.lowercase, true)) sets.push(LOWER);
  if (bool(opts.numbers, true)) sets.push(DIGITS);
  if (bool(opts.symbols, true)) sets.push(SYMBOLS);
  return sets
    .map((set) => (excludeAmbiguous ? [...set].filter((ch) => !AMBIGUOUS.has(ch)).join('') : set))
    .filter((set) => set.length > 0);
}

export const password: Generator = {
  id: 'password',
  family: 'credential',
  autoGenerate: true,
  live: false,
  fields: [
    { id: 'length', label: 'Length', type: 'number', default: 16, min: 4, max: 128, step: 1, help: 'Number of characters. Longer is stronger.' },
    { id: 'uppercase', label: 'Uppercase (A-Z)', type: 'boolean', default: true, group: 'Character sets' },
    { id: 'lowercase', label: 'Lowercase (a-z)', type: 'boolean', default: true, group: 'Character sets' },
    { id: 'numbers', label: 'Numbers (0-9)', type: 'boolean', default: true, group: 'Character sets' },
    { id: 'symbols', label: 'Symbols (!@#$)', type: 'boolean', default: true, group: 'Character sets' },
    {
      id: 'excludeAmbiguous',
      label: 'Exclude ambiguous characters (O 0 l 1)',
      type: 'boolean',
      default: false,
      group: 'Options',
      craft: 'pwd-unambiguous',
    },
  ],
  generate(opts: GeneratorOptions): GenerationResult {
    const length = Math.max(4, Math.min(128, Math.round(Number(opts.length) || 16)));
    const sets = poolFor(opts);
    if (sets.length === 0) {
      return { ok: false, kind: 'text', error: 'Enable at least one character set.' };
    }
    const combined = sets.join('');
    const combinedArr = [...combined];

    // Guarantee one character from each enabled set, then fill the remainder from the full pool.
    const chars: string[] = [];
    for (const set of sets) {
      if (chars.length < length) chars.push(pick([...set]));
    }
    while (chars.length < length) chars.push(combinedArr[secureInt(combinedArr.length)]);
    shuffle(chars);

    const value = chars.join('');
    const bits = entropyBits(length, combined.length);
    return {
      ok: true,
      kind: 'text',
      text: value,
      strength: strengthFromEntropy(bits),
      meta: [
        { label: 'Entropy', value: `${bits} bits` },
        { label: 'Length', value: String(length) },
        { label: 'Pool', value: `${combined.length} chars` },
      ],
    };
  },
};
