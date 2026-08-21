// Encoding-detection tests.
//
// Half of these assert that the detector says NOTHING, and that is the point. A detector's failure
// mode is not missing a codec, it is confidently naming one for ordinary text: every English word
// matches the Base64 alphabet and "decade" is valid hex, so a tool that reports alphabet matches
// would be wrong on almost every input a person pastes by mistake.

import { describe, it, expect } from 'vitest';
import { detectEncoding } from './detect';

const top = (s: string) => detectEncoding(s).candidates[0];
const ids = (s: string) => detectEncoding(s).candidates.map(c => c.id);

describe('detectEncoding — identifies what it can', () => {
  it('reads standard Base64', () => {
    const c = top('SGVsbG8sIFdvcmxkIQ==');
    expect(c?.id).toBe('base64');
    expect(c?.decoded).toBe('Hello, World!');
    expect(c?.confidence).toBe('high');
  });

  it('reads Base64URL and says why a standard decoder would not', () => {
    // "<<?>>?" round-trips through the URL-safe alphabet, so +/ never appear.
    const encoded = 'PDw_Pj4_';
    const c = top(encoded);
    expect(c?.id).toBe('base64url');
    expect(c?.note).toMatch(/-_/);
  });

  it('reads URL-encoding, HTML entities and binary', () => {
    expect(top('hello%20world%21')?.id).toBe('url');
    expect(top('&lt;b&gt;hi&lt;/b&gt;')?.id).toBe('html-entity');
    expect(top('01001000 01101001')?.id).toBe('binary');
  });

  it('reads punycode and warns that the decode may not look like what it is', () => {
    const c = top('xn--80ak6aa92e.com');
    expect(c?.id).toBe('punycode');
    expect(c?.note).toMatch(/look like ASCII/i);
  });
});

describe('detectEncoding — declines to guess', () => {
  it('says nothing for ordinary prose, which matches the Base64 alphabet', () => {
    expect(detectEncoding('Hello there friend').candidates).toEqual([]);
  });

  it('says nothing for empty or whitespace input', () => {
    expect(detectEncoding('').candidates).toEqual([]);
    expect(detectEncoding('   \n ').candidates).toEqual([]);
  });

  it('never offers ROT13, which no structural test can distinguish from its input', () => {
    expect(ids('Uryyb, Jbeyq!')).not.toContain('rot13');
  });

  it('does not claim Base64 when the length is unpaddable', () => {
    expect(ids('SGVsbG8sIFdvcmxkIQ=A=')).not.toContain('base64');
  });
});

describe('detectEncoding — the caveats that change what the user does next', () => {
  it('flags a digest-length hex string as probably not decodable text', () => {
    const sha256 = 'a'.repeat(64);
    const hex = detectEncoding(sha256).candidates.find(c => c.id === 'hex');
    // Either it is declined outright or it is reported with low confidence and a warning; what must
    // never happen is a confident "this is hex-encoded text".
    expect(hex?.confidence ?? 'low').toBe('low');
    if (hex) expect(hex.note).toMatch(/hash digest/i);
  });

  it('adds the missing padding rather than calling stripped Base64 invalid', () => {
    const c = top('SGVsbG8sIFdvcmxkIQ'); // same as above with "==" stripped
    expect(c?.id).toBe('base64');
    expect(c?.decoded).toBe('Hello, World!');
    expect(c?.note).toMatch(/padding/i);
  });

  it('strips a data: URI wrapper so the payload gets read instead of rejected', () => {
    const d = detectEncoding('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==');
    expect(d.unwrapped?.label).toMatch(/data:/);
    expect(d.candidates[0]?.decoded).toBe('Hello, World!');
  });
});

describe('detectEncoding — the craft: a decode that is still encoded', () => {
  it('offers the next layer when the decoded output is itself encoded', () => {
    // URL-encoded wrapper around a Base64 payload — the two-tab workflow this tool replaces.
    const inner = 'SGVsbG8sIFdvcmxkIQ==';
    const outer = encodeURIComponent(inner);
    const d = detectEncoding(outer);
    expect(d.candidates[0]?.id).toBe('url');
    expect(d.next).not.toBeNull();
    expect(d.next?.text).toBe(inner);
    expect(d.next?.label).toMatch(/base64/i);
  });

  it('offers nothing further once the decode is plain text', () => {
    expect(detectEncoding('SGVsbG8sIFdvcmxkIQ==').next).toBeNull();
  });

  it('does not chain endlessly through low-confidence hex reads', () => {
    // Peeling must terminate; hex is excluded from the chain for exactly this reason.
    let d = detectEncoding('68656c6c6f20776f726c64');
    let hops = 0;
    while (d.next && hops < 5) {
      d = detectEncoding(d.next.text);
      hops++;
    }
    expect(hops).toBeLessThan(5);
  });
});
