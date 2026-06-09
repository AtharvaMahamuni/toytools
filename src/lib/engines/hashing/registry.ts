// Hashing Engine — registry (single source of truth).
//
// Every hasher is registered here exactly once. The shared widget never imports a
// hasher directly; it calls ToyTools.runHash(id, text), which resolves through
// runHash() below. Adding a hasher: create the file, add one import + one map entry.

import type { HashTool } from './types';
import { md5 } from './md5';
import { sha1, sha256 } from './sha';

// Keyed by hasher id, referenced from a tool config's `processorId`.
export const HASHERS: Record<string, HashTool> = {
  md5,
  sha1,
  sha256,
};

/**
 * Resolve a hasher by id and run it. Always returns a Promise<string> (lowercase hex):
 * sync MD5 is normalized via Promise.resolve, async SHA awaits crypto.subtle. Never
 * throws on an unknown id — logs a warning and resolves to an empty string.
 */
export async function runHash(id: string, text: string): Promise<string> {
  const hasher = HASHERS[id];
  if (!hasher) {
    // eslint-disable-next-line no-console
    console.warn(`[hashing] Unknown hasher id "${id}" — returning empty string.`);
    return '';
  }
  return await Promise.resolve(hasher.hash(text));
}
