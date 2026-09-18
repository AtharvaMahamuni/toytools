// UUID inspector strategy.
//
// Paste is the input. The result is a reading of bits a human cannot see: version, variant, and
// a timestamp only when the version actually stores one. Version 4 is random. This file does not
// invent a clock for it.
//
// The craft (uuid-version-check) is the failure the research seed records: a version 4 UUID looks
// fine, and the schema that will store it wants version 7. The expected-version control is silent
// until someone names the version they need.

import type { Generator, GenerationNote, GenerationResult, GeneratorOptions } from '../types';

const MAX_LINES = 50;
const UUID_EPOCH_OFFSET = 122192928000000000n;

const HYPHENATED = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BARE = /^[0-9a-f]{32}$/i;

export type InspectedLine = {
  raw: string;
  valid: boolean;
  /** Display label: "v4", "nil UUID", "max UUID", "unknown". */
  version: string;
  /** Machine version: "v4", "nil", "max", "unknown". Used by the expected-version check. */
  versionId: string;
  variant: string;
  timestampUtc?: string;
  reason?: string;
};

function floorDiv(n: bigint, d: bigint): bigint {
  const q = n / d;
  return n % d !== 0n && n < 0n ? q - 1n : q;
}

function floorMod(n: bigint, d: bigint): bigint {
  const r = n % d;
  return r < 0n ? r + d : r;
}

function pad(n: number | bigint, width: number): string {
  return String(n).padStart(width, '0');
}

/** Calendar time in UTC from a millisecond offset of the Unix epoch. */
function formatUnixMs(ms: bigint, extra100ns?: bigint): string {
  const date = new Date(Number(ms));
  const y = date.getUTCFullYear();
  const body =
    `${pad(y, 4)}-${pad(date.getUTCMonth() + 1, 2)}-${pad(date.getUTCDate(), 2)} ` +
    `${pad(date.getUTCHours(), 2)}:${pad(date.getUTCMinutes(), 2)}:${pad(date.getUTCSeconds(), 2)}`;
  const milli = floorMod(ms, 1000n);
  if (extra100ns === undefined) return `${body}.${pad(milli, 3)} UTC`;
  return `${body}.${pad(milli, 3)}${pad(extra100ns, 4)} UTC`;
}

/** v1 and v6 store 100-nanosecond ticks since 1582-10-15. Show that precision, not a rounded guess. */
function formatGregorianTicks(ticks: bigint): string {
  const delta = ticks - UUID_EPOCH_OFFSET;
  const ms = floorDiv(delta, 10000n);
  const frac = floorMod(delta, 10000n);
  return formatUnixMs(ms, frac);
}

function read32(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset]! << 24) | (bytes[offset + 1]! << 16) | (bytes[offset + 2]! << 8) | bytes[offset + 3]!) >>> 0
  );
}

function read16(bytes: Uint8Array, offset: number): number {
  return (bytes[offset]! << 8) | bytes[offset + 1]!;
}

function variantOf(byte: number): string {
  if ((byte & 0x80) === 0) return 'NCS';
  if ((byte & 0xc0) === 0x80) return 'RFC 4122';
  if ((byte & 0xe0) === 0xc0) return 'Microsoft';
  return 'future';
}

function bytesOf(hex: string): Uint8Array {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

function hexOf(raw: string): string {
  return raw.replace(/-/g, '').toLowerCase();
}

function timestampUtc(bytes: Uint8Array, versionId: string): string | undefined {
  if (versionId === 'v1') {
    const timeLow = read32(bytes, 0);
    const timeMid = read16(bytes, 4);
    const timeHi = ((bytes[6]! & 0x0f) << 8) | bytes[7]!;
    const ticks = (BigInt(timeHi) << 48n) | (BigInt(timeMid) << 32n) | BigInt(timeLow);
    return formatGregorianTicks(ticks);
  }
  if (versionId === 'v6') {
    const timeHigh = read32(bytes, 0);
    const timeMid = read16(bytes, 4);
    const timeLow = ((bytes[6]! & 0x0f) << 8) | bytes[7]!;
    const ticks = (BigInt(timeHigh) << 28n) | (BigInt(timeMid) << 12n) | BigInt(timeLow);
    return formatGregorianTicks(ticks);
  }
  if (versionId === 'v7') {
    let ms = 0n;
    for (let i = 0; i < 6; i++) ms = (ms << 8n) | BigInt(bytes[i]!);
    return formatUnixMs(ms);
  }
  return undefined;
}

function invalid(raw: string, reason: string): InspectedLine {
  return { raw, valid: false, version: '', versionId: '', variant: '', reason };
}

/**
 * One pasted line. Blank lines return null so a trailing newline does not count as a UUID.
 * Hyphenated 8-4-4-4-12 and bare 32 hex are both valid. A missing hyphen is not an error.
 */
export function inspectLine(raw: string): InspectedLine | null {
  const text = raw.trim();
  if (!text) return null;

  if (/^urn:uuid:/i.test(text)) return invalid(text, 'strip the urn:uuid: prefix');
  if (text.startsWith('{') && text.endsWith('}')) return invalid(text, 'remove the surrounding braces');
  if (/\s/.test(text)) return invalid(text, 'spaces inside the value');

  const canonical = HYPHENATED.test(text) || BARE.test(text);
  if (!canonical) {
    const onlyHexAndHyphen = /^[0-9a-f-]+$/i.test(text);
    const stripped = text.replace(/-/g, '');
    if (!onlyHexAndHyphen || !/^[0-9a-f]*$/i.test(stripped)) return invalid(text, 'bad hex');
    if (stripped.length !== 32) return invalid(text, 'wrong length');
    return invalid(text, 'hyphens are in the wrong places');
  }

  const bytes = bytesOf(hexOf(text));
  let nil = true;
  let max = true;
  for (const byte of bytes) {
    if (byte !== 0) nil = false;
    if (byte !== 0xff) max = false;
  }

  let versionId: string;
  let version: string;
  if (nil) {
    versionId = 'nil';
    version = 'nil UUID';
  } else if (max) {
    versionId = 'max';
    version = 'max UUID';
  } else {
    const nibble = bytes[6]! >> 4;
    if (nibble >= 1 && nibble <= 8) {
      versionId = `v${nibble}`;
      version = versionId;
    } else {
      versionId = 'unknown';
      version = 'unknown';
    }
  }

  return {
    raw: text,
    valid: true,
    version,
    versionId,
    variant: variantOf(bytes[8]!),
    timestampUtc: nil || max ? undefined : timestampUtc(bytes, versionId),
  };
}

/** The version check. Silent when no version is expected, and silent when every valid line matches. */
export function versionCheckNote(lines: InspectedLine[], expect: string): GenerationNote | undefined {
  if (!expect || expect === 'any') return undefined;
  const wanted = `v${expect}`;
  const valid = lines.filter((line) => line.valid);
  const off = valid.filter((line) => line.versionId !== wanted);
  if (off.length === 0) return undefined;

  const text =
    off.length === valid.length
      ? off.length === 1
        ? `The valid UUID is not version ${expect}.`
        : `None of the ${off.length} valid UUIDs are version ${expect}.`
      : `${off.length} of ${valid.length} valid UUIDs are not version ${expect}.`;

  if (expect === '7' && off.some((line) => line.versionId === 'v4')) {
    return {
      text: `${text} A version 4 looks fine to a human even when a system wants version 7.`,
    };
  }
  return { text };
}

function renderLine(line: InspectedLine, expect: string): string {
  if (!line.valid) return `${line.raw}\n  invalid, ${line.reason}`;
  const parts = ['valid', line.version, line.variant];
  if (line.timestampUtc) parts.push(line.timestampUtc);
  if (expect !== 'any' && line.versionId !== `v${expect}`) parts.push(`not version ${expect}`);
  return `${line.raw}\n  ${parts.join(', ')}`;
}

const EMPTY_PASTE = 'Paste a UUID to see its version and variant.';

export function inspectUuids(raw: string, expect: string): GenerationResult {
  const trimmed = String(raw ?? '');
  if (!trimmed.trim()) return { ok: false, kind: 'text', error: EMPTY_PASTE };

  const parsed: InspectedLine[] = [];
  for (const row of trimmed.split(/\r?\n/)) {
    const line = inspectLine(row);
    if (line) parsed.push(line);
  }
  if (parsed.length === 0) return { ok: false, kind: 'text', error: EMPTY_PASTE };

  const skipped = Math.max(0, parsed.length - MAX_LINES);
  const shown = parsed.slice(0, MAX_LINES);
  const blocks = shown.map((line) => renderLine(line, expect));
  if (skipped > 0) {
    blocks.unshift(`Checked ${shown.length} of ${parsed.length} lines. The rest were not inspected.`);
  }

  const validCount = shown.filter((line) => line.valid).length;
  const meta = [
    { label: 'Checked', value: String(shown.length) },
    { label: 'Valid', value: String(validCount) },
    { label: 'Invalid', value: String(shown.length - validCount) },
  ];
  if (skipped > 0) meta.push({ label: 'Skipped', value: String(skipped) });

  return {
    ok: true,
    kind: 'text',
    text: blocks.join('\n\n'),
    meta,
    note: versionCheckNote(shown, expect),
  };
}

const EXPECT_OPTIONS = [
  { value: 'any', label: 'Any version' },
  { value: '1', label: 'Version 1' },
  { value: '2', label: 'Version 2' },
  { value: '3', label: 'Version 3' },
  { value: '4', label: 'Version 4' },
  { value: '5', label: 'Version 5' },
  { value: '6', label: 'Version 6' },
  { value: '7', label: 'Version 7' },
  { value: '8', label: 'Version 8' },
];

export const uuidInspector: Generator = {
  id: 'uuid-inspector',
  family: 'identifier',
  autoGenerate: false,
  live: true,
  notes: true,
  fields: [
    {
      id: 'input',
      label: 'UUIDs',
      type: 'textarea',
      default: '',
      rows: 8,
      placeholder: 'One UUID per line, up to 50. Hyphens optional.',
      help: 'Hyphenated and 32-hex forms are both accepted.',
    },
    {
      id: 'expect',
      label: 'Expected version',
      type: 'select',
      default: 'any',
      options: EXPECT_OPTIONS,
      help: 'Flag a valid UUID whose version is not the one a system expects.',
    },
  ],
  generate(opts: GeneratorOptions): GenerationResult {
    const expect = typeof opts.expect === 'string' ? opts.expect : 'any';
    const input = typeof opts.input === 'string' ? opts.input : '';
    return inspectUuids(input, expect);
  },
};
