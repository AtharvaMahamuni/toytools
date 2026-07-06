// Generation Engine — shared helpers.
//
// Secure randomness (rejection sampling over crypto.getRandomValues so there is no modulo bias),
// entropy math, a strength model shared by password/random-string, and the QR payload encoders.
// crypto is read INSIDE these functions, not at module top-level, so the module imports cleanly in
// Node (vitest) and the browser alike.

import type { GeneratorStrength } from './types';

/** The platform's crypto source (window.crypto in browsers, globalThis.crypto in Node 18+). */
function getCrypto(): Crypto {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c || typeof c.getRandomValues !== 'function') {
    throw new Error('Secure randomness is unavailable in this environment.');
  }
  return c;
}

/**
 * A uniformly random integer in [0, max) with no modulo bias. We draw 32-bit values and reject any
 * that fall in the final, incomplete band before taking the remainder. max must be a positive int.
 */
export function secureInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0) throw new Error('secureInt: max must be a positive integer');
  if (max === 1) return 0;
  const c = getCrypto();
  const limit = Math.floor(0xffffffff / max) * max; // largest multiple of max within uint32
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    c.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

/** Pick one element from a non-empty array with a uniform, unbiased draw. */
export function pick<T>(pool: T[]): T {
  return pool[secureInt(pool.length)];
}

/** Fisher-Yates shuffle in place, using unbiased secureInt. Returns the same array for chaining. */
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Shannon entropy of a uniformly random string: length * log2(poolSize), rounded to a whole bit. */
export function entropyBits(length: number, poolSize: number): number {
  if (length <= 0 || poolSize <= 1) return 0;
  return Math.round(length * Math.log2(poolSize));
}

/**
 * Map entropy in bits to a 0..4 strength score with a human label. Bands follow common password
 * guidance: under 28 bits is trivially guessable, 128+ bits is effectively uncrackable.
 */
export function strengthFromEntropy(bits: number): GeneratorStrength {
  if (bits < 28) return { score: 0, label: 'Very weak' };
  if (bits < 40) return { score: 1, label: 'Weak' };
  if (bits < 60) return { score: 2, label: 'Fair' };
  if (bits < 128) return { score: 3, label: 'Strong' };
  return { score: 4, label: 'Very strong' };
}

// ── QR payload encoders ──────────────────────────────────────────────────────
// Format the string that gets encoded into the QR matrix. These follow the widely supported
// de-facto conventions that phone cameras recognise (WIFI:, MECARD:, mailto:, tel:).

/** Escape the reserved characters in a Wi-Fi / MECARD field (\ ; , : "). */
function escapeQrField(value: string): string {
  return value.replace(/([\\;,:"])/g, '\\$1');
}

export interface WifiPayload {
  ssid: string;
  password?: string;
  encryption?: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

/** WIFI:T:WPA;S:<ssid>;P:<password>;H:true;; — the standard Wi-Fi join string. */
export function wifiPayload({ ssid, password = '', encryption = 'WPA', hidden = false }: WifiPayload): string {
  const auth = encryption === 'nopass' ? 'nopass' : encryption;
  const parts = [`T:${auth}`, `S:${escapeQrField(ssid)}`];
  if (auth !== 'nopass' && password) parts.push(`P:${escapeQrField(password)}`);
  if (hidden) parts.push('H:true');
  return `WIFI:${parts.join(';')};;`;
}

export interface VcardPayload {
  fullName: string;
  phone?: string;
  email?: string;
  org?: string;
}

/** MECARD:N:<name>;TEL:<phone>;EMAIL:<email>;ORG:<org>;; — compact contact card. */
export function vcardPayload({ fullName, phone = '', email = '', org = '' }: VcardPayload): string {
  const parts = [`N:${escapeQrField(fullName)}`];
  if (phone) parts.push(`TEL:${escapeQrField(phone)}`);
  if (email) parts.push(`EMAIL:${escapeQrField(email)}`);
  if (org) parts.push(`ORG:${escapeQrField(org)}`);
  return `MECARD:${parts.join(';')};;`;
}

/** mailto: link (the phone camera opens a pre-addressed email). */
export function emailPayload(address: string): string {
  return `mailto:${address.trim()}`;
}

/** tel: link (the phone camera offers to dial). */
export function phonePayload(number: string): string {
  return `tel:${number.trim().replace(/[^\d+]/g, '')}`;
}
