import type { HashTool } from './types';

// MD5 (RFC 1321) — pure JS, no dependencies. crypto.subtle does not support MD5,
// so this is bundled. Operates on the UTF-8 byte encoding of the input string.
// MD5 is NOT cryptographically secure; use it only for non-security checksums.

function add32(a: number, b: number): number {
  return (a + b) & 0xffffffff;
}

function rol(n: number, c: number): number {
  return (n << c) | (n >>> (32 - c));
}

function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
  a = add32(add32(a, q), add32(x, t));
  return add32(rol(a, s), b);
}
function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn((b & c) | (~b & d), a, b, x, s, t);
}
function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn((b & d) | (c & ~d), a, b, x, s, t);
}
function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}

// Process the message (as 32-bit little-endian words) into the four state words.
function md5cycle(state: number[], k: number[]): void {
  let [a, b, c, d] = state;

  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

  state[0] = add32(state[0], a);
  state[1] = add32(state[1], b);
  state[2] = add32(state[2], c);
  state[3] = add32(state[3], d);
}

// Pad bytes per MD5 spec and run the compression function block by block.
function md5bytes(bytes: Uint8Array): number[] {
  const n = bytes.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];

  let i: number;
  for (i = 0; i + 64 <= n; i += 64) {
    md5cycle(state, bytesToWords(bytes, i, 64));
  }

  // Final block(s) with padding.
  const tail = new Uint8Array(((n - i) < 56 ? 64 : 128));
  tail.set(bytes.subarray(i));
  tail[n - i] = 0x80;
  const bitLenLow = (n * 8) >>> 0;
  const bitLenHigh = Math.floor(n / 0x20000000) >>> 0;
  const last = tail.length;
  tail[last - 8] = bitLenLow & 0xff;
  tail[last - 7] = (bitLenLow >>> 8) & 0xff;
  tail[last - 6] = (bitLenLow >>> 16) & 0xff;
  tail[last - 5] = (bitLenLow >>> 24) & 0xff;
  tail[last - 4] = bitLenHigh & 0xff;
  tail[last - 3] = (bitLenHigh >>> 8) & 0xff;
  tail[last - 2] = (bitLenHigh >>> 16) & 0xff;
  tail[last - 1] = (bitLenHigh >>> 24) & 0xff;

  for (let j = 0; j < tail.length; j += 64) {
    md5cycle(state, bytesToWords(tail, j, 64));
  }
  return state;
}

// Read 16 little-endian 32-bit words from a byte offset.
function bytesToWords(bytes: Uint8Array, offset: number, len: number): number[] {
  const words: number[] = new Array(16);
  for (let i = 0; i < 16; i++) {
    const b = offset + i * 4;
    words[i] =
      (b < offset + len ? bytes[b] : 0) |
      ((b + 1 < offset + len ? bytes[b + 1] : 0) << 8) |
      ((b + 2 < offset + len ? bytes[b + 2] : 0) << 16) |
      ((b + 3 < offset + len ? bytes[b + 3] : 0) << 24);
  }
  return words;
}

function wordsToHex(state: number[]): string {
  const hexChars = '0123456789abcdef';
  let out = '';
  for (let i = 0; i < 4; i++) {
    const word = state[i];
    for (let j = 0; j < 4; j++) {
      const byte = (word >>> (j * 8)) & 0xff;
      out += hexChars[(byte >>> 4) & 0x0f] + hexChars[byte & 0x0f];
    }
  }
  return out;
}

export function md5hex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return wordsToHex(md5bytes(bytes));
}

export const md5: HashTool = {
  id: 'md5',
  family: 'cryptographic',
  hash: md5hex,
};
