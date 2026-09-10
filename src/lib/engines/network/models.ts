// Pure IPv4 addressing math. Unsigned 32-bit throughout (`>>> 0`) so prefix 0 and 32 stay honest.
// Never throws: parse failures come back as `{ ok: false, error }`.

import type { IPv4Kind, IPv4Subnet, ParsedIPv4 } from './types';

export interface ParseOk<T> { ok: true; value: T }
export interface ParseErr { ok: false; error: string }
export type Parsed<T> = ParseOk<T> | ParseErr;

const OCTET = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
const DOTTED = `${OCTET}\\.${OCTET}\\.${OCTET}\\.${OCTET}`;
const DOTTED_RE = new RegExp(`^${DOTTED}$`);
const CIDR_RE = new RegExp(`^(${DOTTED})(?:\\s*/\\s*(\\d{1,2}|${DOTTED}))?$`);
const PAIR_RE = new RegExp(`^(${DOTTED})\\s+(${DOTTED})$`);

export function ipToInt(a: number, b: number, c: number, d: number): number {
  return (((a << 24) >>> 0) + (b << 16) + (c << 8) + d) >>> 0;
}

export function intToIp(n: number): string {
  const x = n >>> 0;
  return `${x >>> 24}.${(x >>> 16) & 255}.${(x >>> 8) & 255}.${x & 255}`;
}

export function parseDotted(input: string): Parsed<number> {
  const s = input.trim();
  if (!DOTTED_RE.test(s)) return { ok: false, error: 'Use four octets from 0 to 255, like 192.168.1.0.' };
  const parts = s.split('.').map(Number);
  return { ok: true, value: ipToInt(parts[0]!, parts[1]!, parts[2]!, parts[3]!) };
}

/** Prefix length 0..32 to a contiguous mask. */
export function prefixToMask(prefix: number): number {
  if (prefix <= 0) return 0;
  if (prefix >= 32) return 0xffffffff >>> 0;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

/** Contiguous mask to prefix length, or null when the bits have a hole. */
export function maskToPrefix(mask: number): number | null {
  const m = mask >>> 0;
  // A valid CIDR mask is (32 - prefix) trailing zeros, so m | (m-1) fills to all ones
  // only when there is no 0 sitting between 1s.
  if (m === 0) return 0;
  if (((m | (m - 1)) >>> 0) !== 0xffffffff) return null;
  let prefix = 0;
  let bit = 0x80000000;
  while (bit && (m & bit)) {
    prefix++;
    bit >>>= 1;
  }
  return prefix;
}

function invert(n: number): number {
  return (~n) >>> 0;
}

export function parseIPv4Network(raw: string): Parsed<ParsedIPv4> {
  const s = raw.trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
  if (!s) return { ok: false, error: 'Enter an IPv4 address or a CIDR like 192.168.1.0/24.' };
  if (s.includes(':')) return { ok: false, error: 'This calculator is IPv4 only. Paste a dotted address, not IPv6.' };

  const pair = PAIR_RE.exec(s);
  if (pair) {
    const addr = parseDotted(pair[1]!);
    if (!addr.ok) return addr;
    const other = parseDotted(pair[2]!);
    if (!other.ok) return other;
    const asPrefix = maskToPrefix(other.value);
    if (asPrefix !== null) return { ok: true, value: { addr: addr.value, prefix: asPrefix, source: 'mask' } };
    const asWildcard = maskToPrefix(invert(other.value));
    if (asWildcard !== null) return { ok: true, value: { addr: addr.value, prefix: asWildcard, source: 'wildcard' } };
    return { ok: false, error: 'The mask must be a contiguous CIDR mask (or its wildcard inverse). 255.0.255.0 is not a prefix.' };
  }

  const cidr = CIDR_RE.exec(s);
  if (!cidr) return { ok: false, error: 'Use CIDR like 192.168.1.0/24, or an address and mask like 10.0.0.1 255.255.255.0.' };
  const addr = parseDotted(cidr[1]!);
  if (!addr.ok) return addr;
  if (!cidr[2]) return { ok: true, value: { addr: addr.value, prefix: 32, source: 'host' } };
  if (cidr[2].includes('.')) {
    const mask = parseDotted(cidr[2]);
    if (!mask.ok) return mask;
    const prefix = maskToPrefix(mask.value);
    if (prefix === null) return { ok: false, error: 'The mask must be a contiguous CIDR mask. 255.0.255.0 is not a prefix.' };
    return { ok: true, value: { addr: addr.value, prefix, source: 'mask' } };
  }
  const prefix = Number(cidr[2]);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    return { ok: false, error: 'The prefix after the slash should be a whole number from 0 to 32.' };
  }
  return { ok: true, value: { addr: addr.value, prefix, source: 'cidr' } };
}

export function subnetFrom(parsed: ParsedIPv4): IPv4Subnet {
  const mask = prefixToMask(parsed.prefix);
  const network = (parsed.addr & mask) >>> 0;
  const hostBits = 32 - parsed.prefix;
  const total = 2 ** hostBits;
  const broadcast = (network + (total - 1)) >>> 0;
  const rfc3021 = parsed.prefix === 31;
  const hostRoute = parsed.prefix === 32;
  let usable: number;
  let firstUsable: number;
  let lastUsable: number;
  if (hostRoute) {
    usable = 1;
    firstUsable = network;
    lastUsable = network;
  } else if (rfc3021) {
    usable = 2;
    firstUsable = network;
    lastUsable = broadcast;
  } else {
    usable = Math.max(total - 2, 0);
    firstUsable = (network + 1) >>> 0;
    lastUsable = (broadcast - 1) >>> 0;
  }
  return {
    addr: parsed.addr,
    prefix: parsed.prefix,
    mask,
    wildcard: invert(mask),
    network,
    broadcast,
    hostBits,
    total,
    usable,
    firstUsable,
    lastUsable,
    hostWasNetwork: parsed.addr === network,
    rfc3021,
    hostRoute,
  };
}

function inNet(addr: number, network: string, prefix: number): boolean {
  const n = parseDotted(network);
  if (!n.ok) return false;
  const mask = prefixToMask(prefix);
  return ((addr & mask) >>> 0) === ((n.value & mask) >>> 0);
}

export function classifyIPv4(addr: number): IPv4Kind {
  const a = addr >>> 0;
  if (a === 0xffffffff) return 'broadcast';
  if (inNet(a, '0.0.0.0', 8)) return 'unspecified';
  if (inNet(a, '127.0.0.0', 8)) return 'loopback';
  if (inNet(a, '169.254.0.0', 16)) return 'link-local';
  if (inNet(a, '10.0.0.0', 8)) return 'private';
  if (inNet(a, '172.16.0.0', 12)) return 'private';
  if (inNet(a, '192.168.0.0', 16)) return 'private';
  if (inNet(a, '100.64.0.0', 10)) return 'cgnat';
  if (inNet(a, '224.0.0.0', 4)) return 'multicast';
  if (inNet(a, '240.0.0.0', 4)) return 'reserved';
  return 'public';
}

export function classifyIPv4String(ip: string): IPv4Kind | null {
  const parsed = parseDotted(ip);
  if (!parsed.ok) return null;
  return classifyIPv4(parsed.value);
}

const KIND_LABEL: Record<IPv4Kind, string> = {
  public: 'public',
  private: 'private (RFC 1918)',
  cgnat: 'shared CGNAT (RFC 6598)',
  loopback: 'loopback',
  'link-local': 'link-local',
  multicast: 'multicast',
  reserved: 'reserved',
  unspecified: 'unspecified',
  broadcast: 'limited broadcast',
};

export function kindLabel(kind: IPv4Kind): string {
  return KIND_LABEL[kind];
}

export function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}

export function dottedBinary(n: number): string {
  const x = n >>> 0;
  const oct = (v: number) => v.toString(2).padStart(8, '0');
  return `${oct(x >>> 24)}.${oct((x >>> 16) & 255)}.${oct((x >>> 8) & 255)}.${oct(x & 255)}`;
}

const IPV6_RE = /^[0-9a-f:]+$/i;

/** Loose IPv6 shape check for display. Not a full RFC 4291 validator. */
export function looksLikeIPv6(s: string): boolean {
  const t = s.trim();
  if (!t.includes(':') || t.includes('.')) return false;
  if (t.split(':').length < 3) return false;
  return IPV6_RE.test(t);
}
