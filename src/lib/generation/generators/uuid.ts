// UUID generator strategy.
//
// Emits RFC 4122 version 4 (random) UUIDs. Uses crypto.randomUUID when available and falls back to
// building one from crypto.getRandomValues so it works across every supported browser and in Node.
// `version` is a select today with a single 'v4' option so future versions (v7 time-ordered, etc.)
// slot in as new option values + a branch here — no schema or widget change.

import type { Generator, GenerationResult, GeneratorOptions } from '../types';
import { secureInt } from '../utils';

const bool = (v: unknown, fallback: boolean): boolean => (typeof v === 'boolean' ? v : fallback);

function uuidV4(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  // Manual RFC 4122 v4 fallback: 16 random bytes with the version + variant bits fixed.
  const bytes = new Uint8Array(16);
  c!.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10xx
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex
    .slice(8, 10)
    .join('')}-${hex.slice(10, 16).join('')}`;
}

export const uuid: Generator = {
  id: 'uuid',
  family: 'identifier',
  autoGenerate: true,
  live: false,
  fields: [
    { id: 'count', label: 'How many', type: 'number', default: 1, min: 1, max: 100, step: 1 },
    { id: 'version', label: 'Version', type: 'select', default: 'v4', options: [{ value: 'v4', label: 'Version 4 (random)' }] },
    { id: 'hyphens', label: 'Include hyphens', type: 'boolean', default: true, group: 'Format' },
    { id: 'uppercase', label: 'Uppercase', type: 'boolean', default: false, group: 'Format' },
  ],
  generate(opts: GeneratorOptions): GenerationResult {
    const count = Math.max(1, Math.min(100, Math.round(Number(opts.count) || 1)));
    const hyphens = bool(opts.hyphens, true);
    const uppercase = bool(opts.uppercase, false);

    // Touch the secure source up front so an unavailable crypto surfaces as a clean error value.
    void secureInt(1);

    const lines: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = uuidV4();
      if (!hyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      lines.push(id);
    }
    return {
      ok: true,
      kind: 'lines',
      lines,
      text: lines.join('\n'),
      meta: [{ label: 'Version', value: '4 (random)' }, { label: 'Count', value: String(count) }],
    };
  },
};
