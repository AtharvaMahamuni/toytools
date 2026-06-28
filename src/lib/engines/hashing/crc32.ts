import type { HashTool } from './types';

// CRC32 (IEEE 802.3, polynomial 0xEDB88320) — a fast checksum, NOT a cryptographic hash.
// Table-based, pure, synchronous. Output is an 8-digit lowercase hex string.

const TABLE: number[] = (() => {
  const t: number[] = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32hex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  crc = (crc ^ 0xffffffff) >>> 0;
  return crc.toString(16).padStart(8, '0');
}

export const crc32: HashTool = {
  id: 'crc32',
  family: 'checksum',
  displayName: 'CRC32',
  bits: 32,
  sample: 'The quick brown fox jumps over the lazy dog',
  insight:
    'CRC32 is a 32-bit checksum used to detect accidental changes in data (corrupt downloads, damaged frames). It is fast and great at catching errors, but it is NOT secure: it is easy to forge, so never use it for passwords or integrity against an attacker.',
  technical: [
    { term: 'Algorithm', detail: 'CRC-32/IEEE 802.3, polynomial 0xEDB88320 (reflected)' },
    { term: 'Output', detail: '32-bit value as 8 hexadecimal digits' },
    { term: 'Purpose', detail: 'Error detection (checksums), not cryptographic integrity' },
    { term: 'Input', detail: 'Text is UTF-8 encoded before checksumming' },
  ],
  hash(input: string): string {
    return crc32hex(input);
  },
};
