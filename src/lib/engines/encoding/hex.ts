import type { EncodingTool } from './types';
import { byteLength, count } from './util';

export const hex: EncodingTool = {
  id: 'hex',
  family: 'binary-text',
  displayName: 'Hex',
  sample: 'Hello',
  placeholder: 'Type text to encode, or paste hex bytes to decode.',
  insight:
    'Hexadecimal shows each byte of the UTF-8 text as two base-16 digits. It is a readable view of raw bytes, common in debugging, color codes, and binary file inspection.',
  technical: [
    { term: 'Base', detail: 'Base-16 — each byte is two hex digits (00–ff)' },
    { term: 'Text encoding', detail: 'Input is UTF-8 encoded before conversion' },
    { term: 'Decode input', detail: 'Tolerant: ignores whitespace and 0x prefixes, case-insensitive' },
    { term: 'Output', detail: 'Space-separated lowercase byte pairs' },
  ],
  encode(input: string): string {
    return Array.from(new TextEncoder().encode(input))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(' ');
  },
  decode(input: string): string {
    const cleaned = input.replace(/0x/gi, '').replace(/[^0-9a-f]/gi, '');
    if (cleaned.length % 2 !== 0) throw new Error('Invalid hex: odd number of nibbles');
    const bytes = new Uint8Array(cleaned.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
    }
    return new TextDecoder().decode(bytes);
  },

  detect(input) {
    const cleaned = input.replace(/0x/gi, '').replace(/\s+/g, '');
    if (cleaned.length >= 2 && /^[0-9a-fA-F]+$/.test(cleaned) && cleaned.length % 2 === 0) {
      // Space-separated byte pairs are an unambiguous hex dump.
      const grouped = /^([0-9a-fA-F]{2}[\s]+)+[0-9a-fA-F]{2}$/.test(input.trim());
      return { mode: 'decode', confidence: grouped ? 'high' : 'medium', label: 'Hex' };
    }
    return { mode: 'encode', confidence: 'low', label: 'Text' };
  },

  validate(input, mode) {
    if (mode === 'encode' || !input) return { ok: true, severity: 'info' };
    const stripped = input.replace(/0x/gi, '');
    const bad = stripped.search(/[^0-9a-fA-F\s]/);
    if (bad !== -1) {
      return {
        ok: false,
        severity: 'error',
        message: `Unexpected character "${stripped[bad]}" near position ${bad + 1} — hex uses 0–9 and a–f only.`,
        position: bad,
      };
    }
    const cleaned = stripped.replace(/\s+/g, '');
    if (cleaned.length % 2 !== 0) {
      return {
        ok: false,
        severity: 'error',
        message: 'Hex needs an even number of digits — each byte is exactly two hex digits.',
      };
    }
    return { ok: true, severity: 'info' };
  },

  meta(input, output, mode) {
    const hexStr = (mode === 'encode' ? output : input).replace(/0x/gi, '').replace(/\s+/g, '');
    const bytes = Math.floor(hexStr.length / 2);
    return [
      { label: 'Bytes', value: count(bytes, 'byte') },
      { label: 'Hex digits', value: String(hexStr.length) },
      { label: 'Text bytes', value: String(byteLength(mode === 'encode' ? input : output)) },
    ];
  },
};
