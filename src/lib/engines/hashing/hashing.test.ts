import { describe, it, expect } from 'vitest';
import { runHash, HASHERS } from './registry';
import { md5hex } from './md5';

// Published reference digests.
const QUICK_FOX = 'The quick brown fox jumps over the lazy dog';

describe('md5', () => {
  it('hashes empty string', () => expect(md5hex('')).toBe('d41d8cd98f00b204e9800998ecf8427e'));
  it("hashes 'abc'", () => expect(md5hex('abc')).toBe('900150983cd24fb0d6963f7d28e17f72'));
  it('hashes the quick brown fox', () =>
    expect(md5hex(QUICK_FOX)).toBe('9e107d9d372bb6826bd81d3542a419d6'));
  it('changes drastically on a one-char edit', () =>
    expect(md5hex(QUICK_FOX + '.')).toBe('e4d909c290d0fb1ca068ffaddf22cbd0'));
  it('handles UTF-8', () => expect(md5hex('café')).toBe('07117fe4a1ebd544965dc19573183da2'));
  it('handles multi-block input (>64 bytes)', () => {
    const long = 'a'.repeat(200);
    expect(md5hex(long)).toBe('887f30b43b2867f4a9accceee7d16e6c');
  });
  it('handles a length needing a two-block padding tail (56..63 remainder)', () =>
    expect(md5hex('a'.repeat(60))).toBe('cc7ed669cf88f201c3297c6a91e1d18d'));
});

describe('sha1', () => {
  it('hashes empty string', async () =>
    expect(await HASHERS.sha1.hash('')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709'));
  it("hashes 'abc'", async () =>
    expect(await HASHERS.sha1.hash('abc')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d'));
  it('hashes the quick brown fox', async () =>
    expect(await HASHERS.sha1.hash(QUICK_FOX)).toBe('2fd4e1c67a2d28fced849ee1bb76e7391b93eb12'));
});

describe('sha256', () => {
  it('hashes empty string', async () =>
    expect(await HASHERS.sha256.hash('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ));
  it("hashes 'abc'", async () =>
    expect(await HASHERS.sha256.hash('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    ));
});

describe('sha512', () => {
  it('hashes empty string', async () =>
    expect(await HASHERS.sha512.hash('')).toBe(
      'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
    ));
  it("hashes 'abc'", async () =>
    expect(await HASHERS.sha512.hash('abc')).toBe(
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
    ));
});

describe('runHash', () => {
  it('resolves a sync hasher (md5)', async () =>
    expect(await runHash('md5', 'abc')).toBe('900150983cd24fb0d6963f7d28e17f72'));
  it('resolves an async hasher (sha256)', async () =>
    expect(await runHash('sha256', 'abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    ));
  it('returns empty string for unknown id', async () =>
    expect(await runHash('does-not-exist', 'abc')).toBe(''));
  it('never rejects — a throwing hasher resolves to empty string', async () => {
    HASHERS['boom'] = { id: 'boom', family: 'cryptographic', hash: () => { throw new Error('no subtle'); } };
    try {
      await expect(runHash('boom', 'abc')).resolves.toBe('');
    } finally {
      delete HASHERS['boom'];
    }
  });
});
