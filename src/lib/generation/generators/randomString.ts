// Random string generator strategy.
//
// A general-purpose token/key generator. Like the password generator it composes a pool from the
// enabled sets, but it also accepts a fully custom character set that overrides everything when
// provided. Each character is an unbiased secure draw; entropy and strength are reported so the
// output doubles as an API key / nonce generator with a visible security estimate.

import type { Generator, GenerationResult, GeneratorOptions } from '../types';
import { secureInt, entropyBits, strengthFromEntropy } from '../utils';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?';

const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback);

/** Deduplicate a custom character set while preserving order (so entropy math is honest). */
function dedupe(chars: string): string {
  const seen = new Set<string>();
  let out = '';
  for (const ch of chars) {
    if (!seen.has(ch)) {
      seen.add(ch);
      out += ch;
    }
  }
  return out;
}

export const randomString: Generator = {
  id: 'random-string',
  family: 'credential',
  autoGenerate: true,
  live: false,
  fields: [
    { id: 'length', label: 'Length', type: 'number', default: 24, min: 1, max: 256, step: 1, help: 'Number of characters.' },
    { id: 'uppercase', label: 'Uppercase (A-Z)', type: 'boolean', default: true, group: 'Character sets' },
    { id: 'lowercase', label: 'Lowercase (a-z)', type: 'boolean', default: true, group: 'Character sets' },
    { id: 'numbers', label: 'Numbers (0-9)', type: 'boolean', default: true, group: 'Character sets' },
    { id: 'symbols', label: 'Symbols (!@#$)', type: 'boolean', default: false, group: 'Character sets' },
    {
      id: 'custom',
      label: 'Custom character set (overrides the sets above)',
      type: 'text',
      default: '',
      placeholder: 'e.g. ABCDEF0123456789',
    },
  ],
  generate(opts: GeneratorOptions): GenerationResult {
    const length = Math.max(1, Math.min(256, Math.round(Number(opts.length) || 24)));
    const custom = typeof opts.custom === 'string' ? dedupe(opts.custom.trim()) : '';

    let pool = custom;
    if (!pool) {
      let sets = '';
      if (bool(opts.uppercase, true)) sets += UPPER;
      if (bool(opts.lowercase, true)) sets += LOWER;
      if (bool(opts.numbers, true)) sets += DIGITS;
      if (bool(opts.symbols, false)) sets += SYMBOLS;
      pool = sets;
    }
    if (!pool) return { ok: false, kind: 'text', error: 'Enable a character set or enter a custom one.' };

    const poolArr = [...pool];
    let out = '';
    for (let i = 0; i < length; i++) out += poolArr[secureInt(poolArr.length)];

    const bits = entropyBits(length, poolArr.length);
    return {
      ok: true,
      kind: 'text',
      text: out,
      strength: strengthFromEntropy(bits),
      meta: [
        { label: 'Entropy', value: `${bits} bits` },
        { label: 'Length', value: String(length) },
        { label: 'Pool', value: `${poolArr.length} chars` },
      ],
    };
  },
};
