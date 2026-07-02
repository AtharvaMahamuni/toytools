import type { EncodingTool } from './types';
import { byteLength } from './util';

// ROT13: rotate each Latin letter 13 places (A→N, n→a). With 26 letters, applying it twice
// returns the original, so encode and decode are the same operation. Digits, punctuation,
// whitespace, and non-Latin characters pass through untouched.

function rotate(input: string): string {
  return input.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function letterCount(s: string): number {
  return (s.match(/[a-zA-Z]/g) ?? []).length;
}

export const rot13: EncodingTool = {
  id: 'rot13',
  family: 'binary-text',
  displayName: 'ROT13',
  sample: 'Why did the chicken cross the road?',
  placeholder: 'Type or paste text; ROT13 works the same in both directions.',
  insight:
    'ROT13 shifts every Latin letter 13 places around the alphabet, so A becomes N and N becomes A. Because 13 is exactly half of 26, running it twice restores the original text: the cipher is its own inverse. It offers no security; its classic job is hiding spoilers, puzzle answers, and punchlines from a casual glance.',
  technical: [
    { term: 'Cipher', detail: 'Caesar shift of 13 over A-Z and a-z' },
    { term: 'Self-inverse', detail: 'encode(encode(x)) = x, so one button does both directions' },
    { term: 'Untouched', detail: 'Digits, punctuation, spaces, and non-Latin letters' },
    { term: 'Security', detail: 'None. Obfuscation only, never encryption' },
  ],
  encode(input: string): string {
    return rotate(input);
  },
  decode(input: string): string {
    return rotate(input);
  },

  detect() {
    // Both directions are the same transform, so there is nothing to detect.
    return { mode: 'encode', confidence: 'low', label: 'Text' };
  },

  meta(input, output) {
    return [
      { label: 'Letters rotated', value: String(letterCount(input)) },
      { label: 'Characters unchanged', value: String(input.length - letterCount(input)) },
      { label: 'Length', value: String(output.length) },
      { label: 'UTF-8 bytes', value: String(byteLength(input)) },
    ];
  },
};
