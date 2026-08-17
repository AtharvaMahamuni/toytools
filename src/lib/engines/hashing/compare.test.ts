import { describe, expect, it } from 'vitest';
import { compareDigest, normalizeExpected } from './compare';
import { compareHash } from './registry';

// Digest lengths in hex characters, as the registry supplies them (bits / 4).
const LENGTHS = { crc32: 8, md5: 32, sha1: 40, sha256: 64, sha512: 128 };
const NAMES = { crc32: 'CRC32', md5: 'MD5', sha1: 'SHA-1', sha256: 'SHA-256', sha512: 'SHA-512' };

const SHA256_ABC = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
const cmp = (expected: string, actual = SHA256_ABC, own = 64) =>
  compareDigest(expected, actual, own, LENGTHS, NAMES);

describe('normalizeExpected', () => {
  it('takes a bare digest as-is', () => {
    expect(normalizeExpected(SHA256_ABC)).toBe(SHA256_ABC);
  });

  it('lowercases, because Windows certutil prints uppercase', () => {
    expect(normalizeExpected(SHA256_ABC.toUpperCase())).toBe(SHA256_ABC);
  });

  it('takes the digest out of sha256sum output, filename and all', () => {
    expect(normalizeExpected(`${SHA256_ABC}  ./archive.tar.gz`)).toBe(SHA256_ABC);
  });

  it('strips an algo: prefix, as Docker digests carry', () => {
    expect(normalizeExpected(`sha256:${SHA256_ABC}`)).toBe(SHA256_ABC);
  });

  it('survives stray whitespace and newlines from a terminal copy', () => {
    expect(normalizeExpected(`\n  ${SHA256_ABC}\t\n`)).toBe(SHA256_ABC);
  });

  it('keeps the filename out of the digest rather than gluing them together', () => {
    // Stripping all whitespace instead of taking the first token would produce a 78-character
    // "digest" here and then report a length nobody could explain.
    expect(normalizeExpected(`${SHA256_ABC} archive`)).toBe(SHA256_ABC);
  });

  it('returns empty for nothing', () => {
    expect(normalizeExpected('')).toBe('');
    expect(normalizeExpected('   \n ')).toBe('');
  });
});

describe('compareDigest — the answer it exists to give', () => {
  it('confirms a match', () => {
    expect(cmp(SHA256_ABC)?.state).toBe('match');
  });

  it('confirms a match through sha256sum output', () => {
    expect(cmp(`${SHA256_ABC}  ./file.iso`)?.state).toBe('match');
  });

  it('reports a real mismatch', () => {
    const other = 'f'.repeat(64);
    expect(cmp(other)?.state).toBe('mismatch');
  });

  it('names the algorithm when the paste is the wrong length', () => {
    const sha1Digest = 'a9993e364706816aba3e25717850c26c9cd0d89d';
    const r = cmp(sha1Digest);
    expect(r?.state).toBe('wrong-length');
    expect(r?.message).toContain('SHA-1');
    // The reassurance is the point: a mismatch here is not a corrupt file.
    expect(r?.message).toContain('Nothing is wrong with your file');
  });

  it('still explains an unrecognised length without naming an algorithm', () => {
    const r = cmp('abc123');
    expect(r?.state).toBe('wrong-length');
    expect(r?.message).toContain('6 hex characters');
  });

  it('rejects something that is not hex at all', () => {
    expect(cmp('not a digest at all')?.state).toBe('unreadable');
  });

  it('treats a CRC32 paste in the MD5 tool as the wrong algorithm, not a mismatch', () => {
    const r = compareDigest('414fa339', 'd41d8cd98f00b204e9800998ecf8427e', 32, LENGTHS, NAMES);
    expect(r?.state).toBe('wrong-length');
    expect(r?.message).toContain('CRC32');
  });
});

// The half that gets lost. An affordance that speaks when it is not wanted turns a quiet tool into
// a nagging one, and a suite that only checks the happy path cannot see it.
describe('compareDigest — silence', () => {
  it('says nothing for an empty expected value', () => {
    expect(cmp('')).toBeNull();
    expect(cmp('   ')).toBeNull();
  });

  it('says nothing before there is a computed digest to compare against', () => {
    expect(compareDigest(SHA256_ABC, '', 64, LENGTHS, NAMES)).toBeNull();
  });

  it('says nothing when both sides are empty', () => {
    expect(compareDigest('', '', 64, LENGTHS, NAMES)).toBeNull();
  });

  it('does not treat a whitespace-only paste as unreadable', () => {
    // Reporting "that is not a hex digest" for an untouched box would be the nagging failure.
    expect(cmp('\n\t  ')).toBeNull();
  });
});

// ── The registry-level entry point ────────────────────────────────────────────
// compareHash is what the runtime facade actually calls. It supplies the per-hasher digest length
// from HASHERS, which is the knowledge that makes the wrong-length branch able to name an algorithm.
describe('compareHash (registry wiring)', () => {
  it('resolves the digest length from the hasher itself', () => {
    expect(compareHash('sha256', SHA256_ABC, SHA256_ABC)?.state).toBe('match');
  });

  it('names SHA-1 for a 40-character paste in the SHA-256 tool', () => {
    const r = compareHash('sha256', 'a9993e364706816aba3e25717850c26c9cd0d89d', SHA256_ABC);
    expect(r?.state).toBe('wrong-length');
    expect(r?.message).toContain('SHA-1');
  });

  it('works for the checksum family too', () => {
    expect(compareHash('crc32', '414fa339', '414fa339')?.state).toBe('match');
  });

  it('falls back to the computed digest length for an unknown hasher id', () => {
    // Never-throw contract: an unknown id still answers rather than blowing up the widget.
    expect(compareHash('nope', SHA256_ABC, SHA256_ABC)?.state).toBe('match');
  });

  it('stays silent for an unknown hasher with nothing computed yet', () => {
    // ownLength resolves to 0 here, and 0 means "we have no basis to judge" rather than "mismatch".
    expect(compareHash('nope', SHA256_ABC, '')).toBeNull();
  });
});

// The `?? ''` and `?? toUpperCase()` fallbacks exist for inputs the callers above cannot produce,
// so they are exercised directly rather than left as uncovered branches nobody has reasoned about.
describe('compareDigest fallbacks', () => {
  it('reports a bare length when no registered algorithm has it', () => {
    const r = compareDigest('abcdef', SHA256_ABC, 64, {}, {});
    expect(r?.state).toBe('wrong-length');
    expect(r?.message).toContain('6 hex characters');
    expect(r?.message).toContain('64');
  });

  it('upper-cases a hasher id when it has no display name', () => {
    const r = compareDigest('abcdef', SHA256_ABC, 64, { weird: 6 }, {});
    expect(r?.message).toContain('WEIRD');
  });

  it('accepts an omitted display-name map entirely', () => {
    const r = compareDigest('abcdef', SHA256_ABC, 64, { weird: 6 });
    expect(r?.message).toContain('WEIRD');
  });
});
