// Hashing Engine — registry (single source of truth).
//
// Every hasher is registered here exactly once. The shared widget never imports a
// hasher directly; it calls ToyTools.runHash(id, text), which resolves through
// runHash() below. Adding a hasher: create the file, add one import + one map entry.

import type { HashTool } from './types';
import type {
  DetectResult,
  MetaItem,
  TransformInfo,
  TransformProvider,
  TransformResult,
  ValidationDetail,
  DigestComparison,
} from '../transform/types';
import { md5 } from './md5';
import { sha1, sha256, sha512 } from './sha';
import { crc32 } from './crc32';
import { compareDigest } from './compare';

// Keyed by hasher id, referenced from a tool config's `processorId`.
export const HASHERS: Record<string, HashTool> = {
  md5,
  sha1,
  sha256,
  sha512,
  crc32,
};

/**
 * Resolve a hasher by id and run it. Always returns a Promise<string> (lowercase hex).
 * Never rejects: an unknown id, or a runtime hash failure (e.g. crypto.subtle missing
 * outside a secure context), logs a warning and resolves to an empty string — the
 * same never-throw contract as the other engine registries.
 */
export async function runHash(id: string, text: string): Promise<string> {
  const hasher = HASHERS[id];
  if (!hasher) {
    // eslint-disable-next-line no-console
    console.warn(`[hashing] Unknown hasher id "${id}" — returning empty string.`);
    return '';
  }
  try {
    return await Promise.resolve(hasher.hash(text));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[hashing] "${id}" failed (crypto.subtle requires a secure context):`, err);
    return '';
  }
}

// ── Generic transform surface (one-way) ──────────────────────────────────────
// Hashing has no decode, so it plugs into the same ConverterWidget as a one-way,
// async transform. Each verb resolves through the same never-throw registry contract.

const UTF8 = (s: string): number => new TextEncoder().encode(s).length;

/** Static, build-time-renderable description of a hasher (one-way, grouped output). */
export function hashInfo(id: string): TransformInfo {
  const h = HASHERS[id];
  return {
    displayName: h?.displayName ?? h?.id ?? id,
    reversible: false,
    modes: { forward: 'hash', forwardLabel: 'Hash' },
    outputLabel: 'Digest (hex)',
    grouped: true,
    groupSize: 8,
    placeholder: 'Type or paste text to hash.',
    insight: h?.insight,
    technical: h?.technical,
    sample: h?.sample,
    // Every hasher can be checked against a digest the user was given; nothing else on this engine
    // contract can. See compare.ts for why the wrong-length case is the one that earns it.
    comparable: true,
    compareLabel: 'Paste the digest you were given',
  };
}

/** Hex digest length per hasher, so a wrong-length paste can be named rather than just rejected. */
function digestLengths(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [id, h] of Object.entries(HASHERS)) {
    if (h.bits) out[id] = h.bits / 4;
  }
  return out;
}

function displayNames(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [id, h] of Object.entries(HASHERS)) out[id] = h.displayName ?? id.toUpperCase();
  return out;
}

/**
 * Check a computed digest against one the user pasted.
 *
 * The per-hasher knowledge is its digest length, which is why this belongs to the engine rather
 * than the widget: only the registry knows that 40 hex characters is SHA-1 and not a broken
 * SHA-256. Returns null when there is nothing worth saying, which is most of the time.
 */
export function compareHash(id: string, expected: string, actual: string): DigestComparison | null {
  const h = HASHERS[id];
  const ownLength = h?.bits ? h.bits / 4 : actual.length;
  if (!ownLength) return null;
  return compareDigest(expected, actual, ownLength, digestLengths(), displayNames());
}

/** Live metadata rows derived from the digest size. */
export function hashMeta(id: string, input: string, output: string): MetaItem[] {
  const h = HASHERS[id];
  const bits = h?.bits ?? output.length * 4;
  return [
    { label: 'Algorithm', value: h?.displayName ?? id },
    { label: 'Output', value: `${bits} bits` },
    { label: 'Hex characters', value: String(output.length) },
    { label: 'Input bytes', value: String(UTF8(input)) },
  ];
}

/** Hashing always accepts its input; emptiness is handled by the widget. */
export function validateHash(_id: string, _text: string): ValidationDetail {
  return { ok: true, severity: 'info' };
}

/** The hashing provider, consumed by the runtime's ToyTools.transform facade.
 *  `run` is async (SHA via crypto.subtle); an empty digest is surfaced as an error. */
export const hashingProvider: TransformProvider = {
  run: (id, _mode, input): Promise<TransformResult> =>
    runHash(id, input).then((hex) =>
      hex
        ? { ok: true, output: hex }
        : { ok: false, output: '', error: 'Unable to hash — a secure context is required for SHA.' },
    ),
  // Hashing is one-way; detection is unused but kept contract-complete.
  detect: (): DetectResult => ({ mode: 'hash', confidence: 'low' }),
  validate: (id, _mode, input) => validateHash(id, input),
  meta: (id, input, output) => hashMeta(id, input, output),
  info: hashInfo,
  compare: compareHash,
};
