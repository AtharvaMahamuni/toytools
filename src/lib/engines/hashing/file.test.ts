import { describe, expect, it } from 'vitest';
import { crc32hexBytes } from './crc32';
import { compareFileDigest, FILE_ONESHOT_LIMIT, hashBlob } from './file';
import { sha256Hex } from './sha256-inc';

const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const ABC_SHA256 = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
const ABC_MD5 = '900150983cd24fb0d6963f7d28e17f72';

const enc = (text: string) => new TextEncoder().encode(text);

describe('sha256Hex', () => {
  it('hashes empty bytes', () => {
    expect(sha256Hex(new Uint8Array())).toBe(EMPTY_SHA256);
  });

  it('hashes abc', () => {
    expect(sha256Hex(enc('abc'))).toBe(ABC_SHA256);
  });

  it('matches a one-shot digest when the message crosses a block', async () => {
    const bytes = enc('a'.repeat(100));
    const subtle = await crypto.subtle.digest('SHA-256', bytes);
    const hex = [...new Uint8Array(subtle)].map((b) => b.toString(16).padStart(2, '0')).join('');
    expect(sha256Hex(bytes)).toBe(hex);
  });

  it('matches when updates split inside a block', async () => {
    const bytes = enc('The quick brown fox jumps over the lazy dog');
    const { createSha256 } = await import('./sha256-inc');
    const hasher = createSha256();
    hasher.update(bytes.subarray(0, 1));
    hasher.update(bytes.subarray(1, 20));
    hasher.update(bytes.subarray(20));
    const subtle = await crypto.subtle.digest('SHA-256', bytes);
    const hex = [...new Uint8Array(subtle)].map((b) => b.toString(16).padStart(2, '0')).join('');
    expect(hasher.hex()).toBe(hex);
  });
});

describe('hashBlob', () => {
  it('hashes an empty file and says so', async () => {
    const out = await hashBlob(new Blob([]), 'sha256');
    expect(out).toEqual({ ok: true, id: 'sha256', hex: EMPTY_SHA256, bytes: 0, empty: true });
  });

  it('hashes abc as sha256 and md5', async () => {
    const sha = await hashBlob(new Blob([enc('abc')]), 'sha256');
    const md5 = await hashBlob(new Blob([enc('abc')]), 'md5');
    expect(sha).toMatchObject({ ok: true, hex: ABC_SHA256, empty: false });
    expect(md5).toMatchObject({ ok: true, hex: ABC_MD5 });
  });

  it('crc32 of empty is 00000000 and matches the byte helper on abc', async () => {
    const empty = await hashBlob(new Blob([]), 'crc32');
    const abc = await hashBlob(new Blob([enc('abc')]), 'crc32');
    expect(empty).toMatchObject({ ok: true, hex: '00000000', empty: true });
    expect(abc).toMatchObject({ ok: true, hex: crc32hexBytes(enc('abc')) });
    expect(crc32hexBytes(enc('123456789'))).toBe('cbf43926');
  });

  it('refuses a huge one-shot algorithm without reading the blob', async () => {
    const fake = {
      size: FILE_ONESHOT_LIMIT + 1,
      slice: () => { throw new Error('sliced'); },
      arrayBuffer: () => { throw new Error('whole'); },
    } as unknown as Blob;
    const out = await hashBlob(fake, 'md5');
    expect(out).toEqual({ ok: false, reason: 'too-large', id: 'md5', bytes: FILE_ONESHOT_LIMIT + 1 });
  });

  it('returns unreadable when a slice cannot be read', async () => {
    const fake = {
      size: 4,
      slice: () => ({ arrayBuffer: () => Promise.reject(new Error('NotReadableError')) }),
      arrayBuffer: () => Promise.reject(new Error('NotReadableError')),
    } as unknown as Blob;
    await expect(hashBlob(fake, 'sha256')).resolves.toEqual({
      ok: false,
      reason: 'unreadable',
      id: 'sha256',
      bytes: 4,
    });
    await expect(hashBlob(fake, 'md5')).resolves.toEqual({
      ok: false,
      reason: 'unreadable',
      id: 'md5',
      bytes: 4,
    });
  });

  it('reports progress across slices', async () => {
    const calls: number[] = [];
    const blob = new Blob([enc('abc')]);
    await hashBlob(blob, 'sha256', (done) => calls.push(done));
    expect(calls).toEqual([3]);
  });
});

describe('compareFileDigest', () => {
  it('strips a sha256sum filename and matches', () => {
    const result = compareFileDigest('sha256', `${ABC_SHA256}  archive.bin`, ABC_SHA256);
    expect(result?.state).toBe('match');
  });

  it('names SHA-256 when an MD5 box is given a 64-character digest', () => {
    const result = compareFileDigest('md5', ABC_SHA256, ABC_MD5);
    expect(result?.state).toBe('wrong-length');
    expect(result?.message).toContain('SHA-256');
  });
});
