// The craft seam for the hashing engine: checking a computed digest against one you were given.
//
// Why this exists. Every hash tool in the catalog, ours included, computes a digest and stops. But
// nobody hashes a string to look at it: they hash it to find out whether it matches the digest
// printed on a download page, in a Dockerfile, or in a `sha256sum` output. That comparison is 32 to
// 128 hex characters done by eye, which is exactly the task a person is worst at and a computer is
// best at.
//
// The failure worth catching is not the tedium, though. It is that people paste the *wrong
// algorithm's* digest, see a mismatch, and conclude their file is corrupt. A 40-character digest in
// the SHA-256 box is a SHA-1 digest, and saying so turns a false alarm into an answer. Each hasher
// knows its own digest length (`bits`), so the engine can name the algorithm that does fit.
//
// See docs/analysis/2026-08-11-tool-craft.md.

import type { DigestComparison } from '../transform/types';

/**
 * Pull the digest out of the shapes people actually paste.
 *
 * Handled, all seen in the wild:
 *   - `sha256sum` / `md5sum` output:  `d7a8fb…  ./archive.tar.gz`  (hex, two spaces, filename)
 *   - BSD `shasum -a 256` output with the same shape
 *   - an `algo:hex` prefix, as Docker image digests and some package manifests print it
 *   - uppercase hex, which Windows `certutil` emits
 *   - hex broken across lines or padded with stray whitespace, from a copy out of a PDF or terminal
 *
 * Returns lowercase hex with everything else removed, or '' when there is no hex to be found.
 */
export function normalizeExpected(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  // `algo:hex` — take the part after the last colon, so `sha256:abc…` and a bare digest both work.
  const afterPrefix = trimmed.includes(':') ? trimmed.slice(trimmed.lastIndexOf(':') + 1) : trimmed;

  // `sha256sum` output puts the filename after whitespace. The first whitespace-delimited token is
  // the digest, so take it rather than stripping all whitespace: stripping would happily glue
  // `d7a8fb` and `archive` into one "digest" and then report a length nobody can explain.
  const firstToken = afterPrefix.trim().split(/\s+/)[0] ?? '';

  return firstToken.toLowerCase();
}

const HEX_ONLY = /^[0-9a-f]+$/;

/**
 * Compare a pasted digest against the one just computed.
 *
 * `expectedLengths` maps hasher id → hex digest length, so the wrong-length branch can name the
 * algorithm the paste actually belongs to. Pure: same inputs, same answer, no clock, no DOM.
 *
 * Returns null when there is nothing to report, which is the silent case and by far the common one.
 * Every craft affordance has to be invisible when it is not needed, and an empty box is not a
 * question the user asked.
 */
export function compareDigest(
  expectedRaw: string,
  actual: string,
  ownLength: number,
  expectedLengths: Record<string, number>,
  displayNames: Record<string, string> = {},
): DigestComparison | null {
  const expected = normalizeExpected(expectedRaw);
  if (!expected) return null;

  // Nothing to compare against yet: the input box is empty or still computing. Staying silent
  // matters more than being thorough here, because the alternative is telling somebody their
  // digest is wrong before we have one of our own.
  if (!actual) return null;

  if (!HEX_ONLY.test(expected)) {
    return {
      state: 'unreadable',
      message: 'That does not look like a hex digest. Paste the hash on its own, or a line of sha256sum output.',
    };
  }

  if (expected.length !== ownLength) {
    const match = Object.entries(expectedLengths).find(([, len]) => len === expected.length);
    const named = match ? (displayNames[match[0]] ?? match[0].toUpperCase()) : null;
    return {
      state: 'wrong-length',
      message: named
        ? `That is ${expected.length} hex characters, the length of a ${named} digest. Nothing is wrong with your file: it was hashed with a different algorithm.`
        : `That is ${expected.length} hex characters, but this digest is ${ownLength}. Check which algorithm produced it.`,
    };
  }

  return expected === actual
    ? { state: 'match', message: 'Matches. Same input, same digest.' }
    : { state: 'mismatch', message: 'Does not match. The input or the expected digest is not what you think it is.' };
}
