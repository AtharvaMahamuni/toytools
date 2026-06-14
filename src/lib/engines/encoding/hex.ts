import type { EncodingTool } from './types';

export const hex: EncodingTool = {
  id: 'hex',
  family: 'binary-text',
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
};
