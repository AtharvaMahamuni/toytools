// Incremental SHA-256. crypto.subtle.digest hashes one buffer, so a multi-gigabyte file
// would have to sit in memory in full. This folds 64-byte blocks as each slice arrives.

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));

function block(state: Uint32Array, words: Uint32Array): void {
  const w = new Uint32Array(64);
  w.set(words);
  for (let i = 16; i < 64; i++) {
    const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
    const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
    w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
  }
  let a = state[0], b = state[1], c = state[2], d = state[3];
  let e = state[4], f = state[5], g = state[6], h = state[7];
  for (let i = 0; i < 64; i++) {
    const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
    const ch = (e & f) ^ (~e & g);
    const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
    const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
    const maj = (a & b) ^ (a & c) ^ (b & c);
    const t2 = (S0 + maj) >>> 0;
    h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
  }
  state[0] = (state[0] + a) >>> 0;
  state[1] = (state[1] + b) >>> 0;
  state[2] = (state[2] + c) >>> 0;
  state[3] = (state[3] + d) >>> 0;
  state[4] = (state[4] + e) >>> 0;
  state[5] = (state[5] + f) >>> 0;
  state[6] = (state[6] + g) >>> 0;
  state[7] = (state[7] + h) >>> 0;
}

export interface Sha256Inc {
  update(chunk: Uint8Array): void;
  hex(): string;
  bytes: number;
}

export function createSha256(): Sha256Inc {
  const state = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const pending = new Uint8Array(64);
  let pendingLen = 0;
  let bytes = 0;

  function absorb(chunk: Uint8Array): void {
    let offset = 0;
    if (pendingLen > 0) {
      const need = 64 - pendingLen;
      const take = Math.min(need, chunk.length);
      pending.set(chunk.subarray(0, take), pendingLen);
      pendingLen += take;
      offset = take;
      if (pendingLen < 64) return;
      const words = new Uint32Array(16);
      const view = new DataView(pending.buffer, pending.byteOffset, 64);
      for (let i = 0; i < 16; i++) words[i] = view.getUint32(i * 4);
      block(state, words);
      pendingLen = 0;
    }
    const view = new DataView(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    while (offset + 64 <= chunk.length) {
      const words = new Uint32Array(16);
      for (let i = 0; i < 16; i++) words[i] = view.getUint32(offset + i * 4);
      block(state, words);
      offset += 64;
    }
    if (offset < chunk.length) {
      pending.set(chunk.subarray(offset));
      pendingLen = chunk.length - offset;
    }
  }

  return {
    get bytes() { return bytes; },
    update(chunk) {
      bytes += chunk.length;
      if (chunk.length) absorb(chunk);
    },
    hex() {
      const bits = bytes * 8;
      const tail = new Uint8Array(pendingLen + 1 + 8 + 64);
      tail.set(pending.subarray(0, pendingLen));
      tail[pendingLen] = 0x80;
      const bitLenAt = Math.ceil((pendingLen + 9) / 64) * 64 - 8;
      const view = new DataView(tail.buffer);
      view.setUint32(bitLenAt, Math.floor(bits / 0x100000000));
      view.setUint32(bitLenAt + 4, bits >>> 0);
      const words = new Uint32Array(16);
      const full = bitLenAt + 8;
      for (let off = 0; off < full; off += 64) {
        for (let i = 0; i < 16; i++) words[i] = view.getUint32(off + i * 4);
        block(state, words);
      }
      let out = '';
      for (let i = 0; i < 8; i++) out += state[i].toString(16).padStart(8, '0');
      return out;
    },
  };
}

export function sha256Hex(bytes: Uint8Array): string {
  const hasher = createSha256();
  hasher.update(bytes);
  return hasher.hex();
}
