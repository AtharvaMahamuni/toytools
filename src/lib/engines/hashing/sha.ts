import type { HashTool } from './types';

// SHA-1 / SHA-256 via the Web Crypto API (crypto.subtle). Async and audited.
// Available as a global in browsers (secure context) and Node 18+. All calls stay
// inside hash() so importing this module is side-effect-free (safe under tsx/vitest).

function toHex(buffer: ArrayBuffer): string {
  let out = '';
  for (const byte of new Uint8Array(buffer)) {
    out += byte.toString(16).padStart(2, '0');
  }
  return out;
}

async function digest(algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512', input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest(algorithm, data);
  return toHex(buffer);
}

const SAMPLE = 'The quick brown fox jumps over the lazy dog';

export const sha1: HashTool = {
  id: 'sha1',
  family: 'cryptographic',
  displayName: 'SHA-1',
  bits: 160,
  sample: SAMPLE,
  insight:
    'SHA-1 produces a 160-bit digest. It is deprecated for security because collisions are now feasible — prefer SHA-256 for signatures or anything that must resist tampering.',
  technical: [
    { term: 'Family', detail: 'SHA-1 (FIPS 180-4)' },
    { term: 'Output', detail: '160 bits — 40 hexadecimal characters' },
    { term: 'Direction', detail: 'One-way: a digest cannot be reversed to the input' },
    { term: 'Security', detail: 'Deprecated — collision attacks are practical' },
  ],
  hash: (input) => digest('SHA-1', input),
};

export const sha256: HashTool = {
  id: 'sha256',
  family: 'cryptographic',
  displayName: 'SHA-256',
  bits: 256,
  sample: SAMPLE,
  insight:
    'SHA-256 produces a 256-bit digest from the SHA-2 family. It is the current default for integrity checks, digital signatures, and content addressing.',
  technical: [
    { term: 'Family', detail: 'SHA-2 (FIPS 180-4)' },
    { term: 'Output', detail: '256 bits — 64 hexadecimal characters' },
    { term: 'Direction', detail: 'One-way: a digest cannot be reversed to the input' },
    { term: 'Security', detail: 'Recommended for integrity and signatures' },
  ],
  hash: (input) => digest('SHA-256', input),
};

export const sha512: HashTool = {
  id: 'sha512',
  family: 'cryptographic',
  displayName: 'SHA-512',
  bits: 512,
  sample: SAMPLE,
  insight:
    'SHA-512 produces a 512-bit digest from the SHA-2 family. The larger output suits high-assurance integrity, and it can be faster than SHA-256 on 64-bit hardware.',
  technical: [
    { term: 'Family', detail: 'SHA-2 (FIPS 180-4)' },
    { term: 'Output', detail: '512 bits — 128 hexadecimal characters' },
    { term: 'Direction', detail: 'One-way: a digest cannot be reversed to the input' },
    { term: 'Security', detail: 'Recommended for integrity and signatures' },
  ],
  hash: (input) => digest('SHA-512', input),
};
