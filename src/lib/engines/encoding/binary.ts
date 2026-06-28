import type { EncodingTool } from './types';
import { byteLength, count } from './util';

// Binary (base-2) view of text: each UTF-8 byte shown as eight bits, space-separated.
export const binary: EncodingTool = {
  id: 'binary',
  family: 'binary-text',
  displayName: 'Binary',
  sample: 'Hi',
  placeholder: 'Type text to encode, or paste 0s and 1s to decode.',
  insight:
    'Binary shows each byte of the UTF-8 text as eight bits (0s and 1s). It is the rawest readable form of data and a useful way to see exactly how characters are stored.',
  technical: [
    { term: 'Base', detail: 'Base-2 — each byte is eight bits' },
    { term: 'Text encoding', detail: 'Input is UTF-8 encoded before conversion' },
    { term: 'Decode input', detail: 'Tolerant: ignores any character that is not 0 or 1' },
    { term: 'Output', detail: 'Space-separated 8-bit groups' },
  ],
  encode(input: string): string {
    return Array.from(new TextEncoder().encode(input))
      .map(b => b.toString(2).padStart(8, '0'))
      .join(' ');
  },
  decode(input: string): string {
    const bits = input.replace(/[^01]/g, '');
    if (bits.length === 0) return '';
    if (bits.length % 8 !== 0) throw new Error('Invalid binary: bit count is not a multiple of 8');
    const bytes = new Uint8Array(bits.length / 8);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
    }
    return new TextDecoder().decode(bytes);
  },

  detect(input) {
    const bits = input.replace(/\s+/g, '');
    if (bits.length >= 8 && /^[01]+$/.test(bits) && bits.length % 8 === 0) {
      const grouped = /^([01]{8}\s+)*[01]{8}$/.test(input.trim());
      return { mode: 'decode', confidence: grouped ? 'high' : 'medium', label: 'Binary' };
    }
    return { mode: 'encode', confidence: 'low', label: 'Text' };
  },

  validate(input, mode) {
    if (mode === 'encode' || !input) return { ok: true, severity: 'info' };
    const bad = input.search(/[^01\s]/);
    if (bad !== -1) {
      return {
        ok: false,
        severity: 'error',
        message: `Unexpected character "${input[bad]}" near position ${bad + 1} — binary uses only 0 and 1.`,
        position: bad,
      };
    }
    const bits = input.replace(/\s+/g, '');
    if (bits.length % 8 !== 0) {
      return {
        ok: false,
        severity: 'error',
        message: 'Binary needs a multiple of 8 bits — each byte is exactly eight bits.',
      };
    }
    return { ok: true, severity: 'info' };
  },

  meta(input, output, mode) {
    const bits = (mode === 'encode' ? output : input).replace(/[^01]/g, '');
    const bytes = Math.floor(bits.length / 8);
    return [
      { label: 'Bytes', value: count(bytes, 'byte') },
      { label: 'Bits', value: String(bits.length) },
      { label: 'Text bytes', value: String(byteLength(mode === 'encode' ? input : output)) },
    ];
  },
};
