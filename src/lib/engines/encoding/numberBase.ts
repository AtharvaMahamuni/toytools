import type { EncodingTool, EncodingMode } from './types';
import type { DetectResult, MetaItem, RecoveryOffer, ValidationDetail } from '../transform/types';

// Numbers between decimal and binary, with hex and octal alongside as metadata.
//
// This is the NUMBER converter, not the text one: 65 becomes 1000001, not the eight bits of the
// letter A. Both tools are called "binary converter" by the people looking for them and they answer
// different questions, which is why binary-text-converter keeps its own page and its own vocabulary
// rather than growing a mode switch nobody would find.
//
// Values are held as BigInt, so a 256-bit key or a 64-bit register value converts exactly. A double
// starts losing integers at 2^53, which is well inside the range people paste here.

const MAX_BITS = 512;

export interface BaseValue {
  value: bigint;
  negative: boolean;
}

/** Strip the prefixes and separators a number arrives wearing. Pure formatting, never digits. */
export function normalise(input: string): string {
  return input.trim().replace(/[\s_,']/g, '');
}

function parseIn(text: string, base: 2 | 10): bigint {
  const s = normalise(text);
  if (!s) throw new Error('Enter a number.');
  const negative = s.startsWith('-');
  const body = s.replace(/^[+-]/, '').replace(base === 2 ? /^0b/i : /^$/, '');
  if (!body) throw new Error('Enter a number.');
  const pattern = base === 2 ? /^[01]+$/ : /^\d+$/;
  if (!pattern.test(body)) {
    throw new Error(base === 2 ? 'Binary uses only 0 and 1.' : 'Enter a whole number, digits only.');
  }
  const value = base === 2 ? BigInt(`0b${body}`) : BigInt(body);
  if (value.toString(2).length > MAX_BITS) throw new Error(`That is over ${MAX_BITS} bits.`);
  return negative ? -value : value;
}

/** Decimal to binary. A negative keeps its sign rather than pretending to be two's complement. */
export function toBinary(input: string): string {
  const n = parseIn(input, 10);
  return n < 0n ? `-${(-n).toString(2)}` : n.toString(2);
}

/** Binary to decimal. */
export function toDecimal(input: string): string {
  const n = parseIn(input, 2);
  return n.toString(10);
}

/** Group bits into bytes for reading: 1000001 shows as 100 0001. Copy still yields the raw value. */
export function groupBits(bits: string): string {
  const negative = bits.startsWith('-');
  const body = negative ? bits.slice(1) : bits;
  const out: string[] = [];
  for (let end = body.length; end > 0; end -= 4) out.unshift(body.slice(Math.max(0, end - 4), end));
  return (negative ? '-' : '') + out.join(' ');
}

/**
 * What a value would look like padded to the next whole byte, or null when it already fills one.
 * A register, a colour channel and a permission mask are all read a byte at a time, and 1000001 is
 * genuinely harder to line up against 01000001 than it looks.
 */
export function padToByte(bits: string): string | null {
  const body = bits.replace(/^-/, '');
  if (!/^[01]+$/.test(body)) return null;
  const width = Math.max(8, Math.ceil(body.length / 8) * 8);
  if (width === body.length) return null;
  return (bits.startsWith('-') ? '-' : '') + body.padStart(width, '0');
}

export const numberBase: EncodingTool = {
  id: 'number-base',
  family: 'numeral',
  displayName: 'Binary',
  forwardLabel: 'To binary →',
  inverseLabel: 'To decimal ←',
  outputLabel: 'Result',
  sample: '2026',
  placeholder: 'Type a decimal number, or paste binary digits.',
  insight: [
    'Binary is the same counting you already do, with two digits instead of ten. Each place is worth twice the one to its right, so 1011 is 8 plus 2 plus 1, which is 11.',
    'Hexadecimal is here because it is binary in shorthand. One hex digit is exactly four bits, so 0xFF is 1111 1111 with no arithmetic in between, and that is why memory dumps and colour codes are written in hex rather than binary.',
    'Bit width matters more than the value. The same 1000001 is one byte in a colour channel and half a register elsewhere, and the leading zeros that make it line up are the ones people leave off.',
  ],
  technical: [
    { term: 'Range', detail: `Exact to ${MAX_BITS} bits, held as BigInt (no float rounding past 2^53)` },
    { term: 'Accepts', detail: '0b prefix, spaces, underscores, commas and apostrophes as separators' },
    { term: 'Negatives', detail: 'Signed magnitude (-1011), not two\'s complement' },
    { term: 'Alongside', detail: 'Hex, octal, bit count and byte count as metadata' },
    { term: 'Not', detail: 'Text encoding. For characters to bits, use the binary text converter' },
  ],

  encode: (input: string) => toBinary(input),
  decode: (input: string) => toDecimal(input),

  detect(input: string): DetectResult {
    const s = normalise(input).replace(/^[+-]/, '');
    if (!s) return { mode: 'encode', confidence: 'low' };
    if (/^0b[01]+$/i.test(s)) return { mode: 'decode', confidence: 'high', label: 'Binary' };
    if (!/^\d+$/.test(s)) return { mode: 'encode', confidence: 'low' };
    // A run of only 0s and 1s is almost always binary, but 10 and 11 are ordinary decimals too, so
    // short strings stay a guess rather than a claim.
    if (/^[01]+$/.test(s)) {
      return s.length >= 4
        ? { mode: 'decode', confidence: 'high', label: 'Binary' }
        : { mode: 'encode', confidence: 'low', label: 'Number' };
    }
    return { mode: 'encode', confidence: 'high', label: 'Number' };
  },

  validate(input: string, mode: EncodingMode): ValidationDetail {
    const raw = input.trim();
    if (!raw) return { ok: true };
    const s = normalise(raw).replace(/^[+-]/, '').replace(/^0b/i, '');
    if (!s) return { ok: false, severity: 'error', message: 'Enter a number.' };

    if (mode === 'decode') {
      const bad = s.split('').findIndex((c) => c !== '0' && c !== '1');
      if (bad !== -1) {
        return {
          ok: false,
          severity: 'error',
          message: `"${s[bad]}" is not a binary digit. Binary uses only 0 and 1.`,
          position: bad,
        };
      }
    } else if (!/^\d+$/.test(s)) {
      return { ok: false, severity: 'error', message: 'Enter a whole number, digits only.' };
    }

    const bits = mode === 'decode' ? s.length : BigInt(s).toString(2).length;
    if (bits > MAX_BITS) {
      return { ok: false, severity: 'error', message: `That is ${bits} bits. The ceiling here is ${MAX_BITS}.` };
    }
    return { ok: true };
  },

  meta(input: string, output: string, mode: EncodingMode): MetaItem[] {
    const decimal = mode === 'encode' ? normalise(input) : output;
    let n: bigint;
    try {
      n = BigInt(decimal.replace(/^\+/, ''));
    } catch {
      return [];
    }
    const magnitude = n < 0n ? -n : n;
    const bits = magnitude.toString(2).length;
    return [
      { label: 'Hex', value: `0x${magnitude.toString(16).toUpperCase()}` },
      { label: 'Octal', value: `0o${magnitude.toString(8)}` },
      { label: 'Bits', value: String(bits) },
      { label: 'Bytes', value: String(Math.ceil(bits / 8)) },
    ];
  },

  /**
   * The craft seam. Binary is almost never copied bare. It arrives as 0b1010, as 1010 1100 out of a
   * datasheet, or as 1010_1100 out of source, and all three are a parse failure in a tool whose
   * whole job is reading binary. Decimals arrive with thousands separators for the same reason.
   */
  recover(input: string, mode: EncodingMode): RecoveryOffer | null {
    const raw = input.trim();
    if (!raw) return null;
    const cleaned = normalise(raw).replace(/^([+-]?)0b/i, '$1');
    if (cleaned === raw || !cleaned) return null;

    const body = cleaned.replace(/^[+-]/, '');
    const valid = mode === 'decode' ? /^[01]+$/.test(body) : /^\d+$/.test(body);
    if (!valid) return null;
    return { label: `Use ${cleaned}`, text: cleaned, mode };
  },
};
