// Readings of one IPv4 address: dotted quad, 32-bit decimal, 0x hex, 32-bit
// binary, and IPv4-mapped IPv6. Never throws. A mapped address is refused
// rather than truncated, and the embedded dotted form is returned so the
// page can offer it. An undotted integer that is also four octets glued
// together is reported; the caller decides whether that reading is unique.

import { intToIp, ipToInt, parseDotted } from './models';

export interface GluedOctets {
  splits: string[];
  /** The one split, when there is only one and it is a different host from the integer. */
  unique: string | null;
}

export interface IPv4Literal {
  addr: number;
  glued: GluedOctets | null;
}

export interface IPv4LiteralErr {
  ok: false;
  error: string;
  /** Dotted address inside an IPv4-mapped IPv6 value. Absent for every other error. */
  mapped?: string;
}

export type IPv4LiteralResult = { ok: true; value: IPv4Literal } | IPv4LiteralErr;

const HEX32 = /^0x([0-9a-f]{1,8})$/i;
const HEX_BARE = /^[0-9a-f]{8}$/i;
const BIN_GROUPED = /^[01]{8}(?:\.[01]{8}){3}$/;
const BIN_FLAT = /^[01]{32}$/;
const DIGITS = /^\d+$/;
const DOTTED_LOOSE = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
const MAPPED_DOTTED = /^(?:::|[0:]+:)ffff:(\d+\.\d+\.\d+\.\d+)$/i;
const MAPPED_HEX = /^(?:::|[0:]+:)ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i;

function gluedOctets(digits: string, addr: number): GluedOctets | null {
  const splits: string[] = [];
  const walk = (index: number, parts: string[]): void => {
    if (parts.length === 4) {
      if (index === digits.length) splits.push(parts.join('.'));
      return;
    }
    const room = digits.length - index;
    const slotsLeft = 4 - parts.length;
    for (let len = 1; len <= 3 && len <= room - (slotsLeft - 1); len++) {
      const piece = digits.slice(index, index + len);
      if (piece.length > 1 && piece.startsWith('0')) continue;
      const n = Number(piece);
      if (n > 255) continue;
      parts.push(piece);
      walk(index + len, parts);
      parts.pop();
    }
  };
  walk(0, []);
  if (splits.length === 0) return null;
  const dotted = intToIp(addr);
  const unique = splits.length === 1 && splits[0] !== dotted ? splits[0]! : null;
  if (splits.length === 1 && splits[0] === dotted) return null;
  return { splits, unique };
}

/** Why these four spellings are not a host, or null when they are a plain dotted quad. */
function dottedQuadError(parts: readonly string[]): string | null {
  const over = parts.find(part => Number(part) > 255);
  if (over) return `${over} is outside 0 to 255, so this is not an IPv4 address.`;
  const padded = parts.find(part => part.length > 1 && part.startsWith('0'));
  if (padded) return `${padded} has a leading zero. Write the octet in decimal without one.`;
  return null;
}

function fromMappedDotted(dotted: string): IPv4LiteralResult {
  const match = DOTTED_LOOSE.exec(dotted);
  if (!match) {
    return { ok: false, error: 'The address inside this IPv4-mapped IPv6 value is not four octets from 0 to 255.' };
  }
  const parts = [match[1]!, match[2]!, match[3]!, match[4]!];
  const problem = dottedQuadError(parts);
  if (problem) return { ok: false, error: problem };
  const canonical = parts.join('.');
  return {
    ok: false,
    error: `This is an IPv4-mapped IPv6 address. The IPv4 address inside it is ${canonical}. It was not shortened by cutting the text.`,
    mapped: canonical,
  };
}

export function parseIPv4Literal(raw: string): IPv4LiteralResult {
  const s = raw.trim();
  if (!s) return { ok: false, error: 'Enter an IPv4 address, or its decimal, hex, or binary form.' };

  if (BIN_GROUPED.test(s) || BIN_FLAT.test(s)) {
    return { ok: true, value: { addr: parseInt(s.replace(/\./g, ''), 2) >>> 0, glued: null } };
  }

  if (s.includes(':')) {
    const dotted = MAPPED_DOTTED.exec(s.replace(/\s+/g, ''));
    if (dotted) return fromMappedDotted(dotted[1]!);
    const hex = MAPPED_HEX.exec(s.replace(/\s+/g, ''));
    if (hex) {
      const hi = parseInt(hex[1]!, 16);
      const lo = parseInt(hex[2]!, 16);
      const addr = ipToInt((hi >>> 8) & 255, hi & 255, (lo >>> 8) & 255, lo & 255);
      const embedded = intToIp(addr);
      return {
        ok: false,
        error: `This is an IPv4-mapped IPv6 address. The IPv4 address inside it is ${embedded}. It was not shortened by cutting the text.`,
        mapped: embedded,
      };
    }
    return { ok: false, error: 'This is IPv6. It was not cut down to an IPv4 address.' };
  }

  const loose = DOTTED_LOOSE.exec(s);
  if (loose) {
    const octets = [loose[1]!, loose[2]!, loose[3]!, loose[4]!];
    const problem = dottedQuadError(octets);
    if (problem) return { ok: false, error: problem };
    const parsed = parseDotted(octets.join('.'));
    if (!parsed.ok) return { ok: false, error: parsed.error };
    return { ok: true, value: { addr: parsed.value, glued: null } };
  }

  const hexPrefixed = HEX32.exec(s);
  if (hexPrefixed) {
    return { ok: true, value: { addr: parseInt(hexPrefixed[1]!, 16) >>> 0, glued: null } };
  }

  if (HEX_BARE.test(s) && /[a-f]/i.test(s)) {
    return { ok: true, value: { addr: parseInt(s, 16) >>> 0, glued: null } };
  }

  if (DIGITS.test(s)) {
    if (s.length > 1 && s.startsWith('0')) {
      return { ok: false, error: 'A decimal IPv4 value has no leading zero. Use a dotted address, or 0x for hex.' };
    }
    const n = Number(s);
    if (!Number.isSafeInteger(n) || n > 0xffffffff) {
      return { ok: false, error: 'A decimal IPv4 address is a whole number from 0 to 4294967295.' };
    }
    const addr = n >>> 0;
    return { ok: true, value: { addr, glued: gluedOctets(s, addr) } };
  }

  return { ok: false, error: 'Use a dotted address like 192.168.0.1, a decimal, 0x hex, or 32 bits.' };
}

export function formatHex(addr: number): string {
  return `0x${(addr >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
}

export function formatBinary(addr: number): string {
  const bits = (addr >>> 0).toString(2).padStart(32, '0');
  return `${bits.slice(0, 8)}.${bits.slice(8, 16)}.${bits.slice(16, 24)}.${bits.slice(24)}`;
}
