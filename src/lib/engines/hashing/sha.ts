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

export const sha1: HashTool = {
  id: 'sha1',
  family: 'cryptographic',
  hash: (input) => digest('SHA-1', input),
};

export const sha256: HashTool = {
  id: 'sha256',
  family: 'cryptographic',
  hash: (input) => digest('SHA-256', input),
};

export const sha512: HashTool = {
  id: 'sha512',
  family: 'cryptographic',
  hash: (input) => digest('SHA-512', input),
};
