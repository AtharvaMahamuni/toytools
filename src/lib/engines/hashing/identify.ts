// Identify a pasted digest by length, and check it against a digest this page just computed.
//
// People do not paste a hash to admire the alphabet. They paste it to answer two questions:
// which algorithm made it, and does my file match. Length is the only honest answer to the
// first. MD5 is 32 hex characters, SHA-1 is 40, SHA-256 is 64, SHA-512 is 128, CRC32 is 8.
// A length outside that set is truncated or unknown. Naming a neighbour would be a guess.
//
// The second question is a comparison, which is already what the hash generators do one
// algorithm at a time. This module is the multi-line reading those generators do not do:
// a sha256sum line with a filename stuck on, several digests at once, and the three mistakes
// that look like a corrupt file when the bytes were fine.

export const MAX_DIGEST_LINES = 20;

export const SHA1_NOT_SHA256 = 'A SHA-1 length is not SHA-256.';
export const FILENAME_STRIPPED = 'A trailing filename was stripped.';
export const CASE_STILL_MATCHES = 'Case differs, but the digest still matches.';

export const DIGEST_ALGORITHMS = [
  { id: 'crc32', name: 'CRC32', hexLength: 8 },
  { id: 'md5', name: 'MD5', hexLength: 32 },
  { id: 'sha1', name: 'SHA-1', hexLength: 40 },
  { id: 'sha256', name: 'SHA-256', hexLength: 64 },
  { id: 'sha512', name: 'SHA-512', hexLength: 128 },
] as const;

export type DigestAlgoId = (typeof DIGEST_ALGORITHMS)[number]['id'];

export interface DigestAlgorithm {
  id: string;
  name: string;
  hexLength: number;
}

export interface DigestFinding {
  line: number;
  hex: string;
  kind: 'identified' | 'ambiguous' | 'unknown' | 'not-hex';
  matches: DigestAlgorithm[];
  filenameStripped: boolean;
  hadUppercase: boolean;
  summary: string;
  callouts: string[];
}

export interface IdentifyHashResult {
  empty: boolean;
  lines: DigestFinding[];
  omitted: number;
  omittedNote: string;
}

export interface VerifyHashResult {
  status: 'match' | 'mismatch' | 'length' | 'unknown' | 'not-hex' | 'ambiguous' | 'uncomputed';
  summary: string;
  callouts: string[];
  algorithmId: string | null;
}

const HEX = /^[0-9a-fA-F]+$/;
const TWO_SPACE = /^([0-9a-fA-F]+)  (\S.*)$/;
const STAR_FILE = /^([0-9a-fA-F]+) \*(.+)$/;
const KNOWN_LENGTHS = DIGEST_ALGORITHMS.map((a) => a.name).join(', ');

function algoById(id: string): DigestAlgorithm | undefined {
  return DIGEST_ALGORITHMS.find((a) => a.id === id);
}

function matchesForLength(length: number): DigestAlgorithm[] {
  return DIGEST_ALGORITHMS.filter((a) => a.hexLength === length);
}

function joinCallouts(lead: string, callouts: string[]): string {
  return callouts.length ? `${lead} ${callouts.join(' ')}` : lead;
}

interface ParsedLine {
  hex: string;
  filenameStripped: boolean;
  hadUppercase: boolean;
  notHex: boolean;
}

/** Strip a sha256sum-style filename, then keep the hex token. Case and edge whitespace do not count. */
export function parseDigestLine(raw: string): ParsedLine {
  const trimmed = raw.trim();
  const two = TWO_SPACE.exec(trimmed);
  const star = !two ? STAR_FILE.exec(trimmed) : null;
  const token = two?.[1] ?? star?.[1] ?? trimmed;
  const filenameStripped = Boolean(two || star);
  if (!HEX.test(token)) {
    return { hex: '', filenameStripped: false, hadUppercase: false, notHex: true };
  }
  return {
    hex: token.toLowerCase(),
    filenameStripped,
    hadUppercase: token !== token.toLowerCase(),
    notHex: false,
  };
}

function filenameCallout(stripped: boolean): string[] {
  return stripped ? [FILENAME_STRIPPED] : [];
}

/**
 * Build one result line from an already-parsed token.
 *
 * `matches` is passed in so a length that hits more than one algorithm can be tested even
 * while the published lengths do not overlap. Production callers pass matchesForLength.
 */
export function findingFromParts(
  line: number,
  parsed: ParsedLine,
  matches: readonly DigestAlgorithm[],
): DigestFinding {
  if (parsed.notHex || !parsed.hex) {
    return {
      line,
      hex: '',
      kind: 'not-hex',
      matches: [],
      filenameStripped: false,
      hadUppercase: false,
      summary: 'Not a hex digest. Paste the hash on its own, or a sha256sum line.',
      callouts: [],
    };
  }

  const base = {
    line,
    hex: parsed.hex,
    matches: [...matches],
    filenameStripped: parsed.filenameStripped,
    hadUppercase: parsed.hadUppercase,
  };
  const file = filenameCallout(parsed.filenameStripped);

  if (matches.length === 0) {
    const callouts = [...file];
    return {
      ...base,
      kind: 'unknown',
      callouts,
      summary: joinCallouts(
        `${parsed.hex.length} hex characters. Truncated or unknown. This length is not ${KNOWN_LENGTHS}.`,
        callouts,
      ),
    };
  }

  if (matches.length > 1) {
    const names = matches.map((m) => m.name).join(' and ');
    const callouts = [...file];
    return {
      ...base,
      kind: 'ambiguous',
      callouts,
      summary: joinCallouts(
        `This length matches more than one algorithm: ${names}.`,
        callouts,
      ),
    };
  }

  const only = matches[0]!;
  const sha1 = only.id === 'sha1' ? [SHA1_NOT_SHA256] : [];
  const callouts = [...sha1, ...file];
  const lead = only.id === 'sha1'
    ? `SHA-1. ${only.hexLength} hex characters. ${SHA1_NOT_SHA256}`
    : `${only.name}. ${only.hexLength} hex characters.`;
  return {
    ...base,
    kind: 'identified',
    callouts,
    summary: file.length ? `${lead} ${file[0]}` : lead,
  };
}

export function identifyHash(raw: string): IdentifyHashResult {
  const rows = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const kept: { line: number; text: string }[] = [];
  let seen = 0;
  let omitted = 0;
  for (const text of rows) {
    if (!text.trim()) continue;
    seen += 1;
    if (seen <= MAX_DIGEST_LINES) kept.push({ line: seen, text });
    else omitted += 1;
  }

  const lines = kept.map(({ line, text }) => {
    const parsed = parseDigestLine(text);
    const matches = parsed.notHex ? [] : matchesForLength(parsed.hex.length);
    return findingFromParts(line, parsed, matches);
  });

  const omittedNote = omitted === 0
    ? ''
    : `Only the first ${MAX_DIGEST_LINES} digests were checked. ${omitted} more ${omitted === 1 ? 'line was' : 'lines were'} left out.`;

  return { empty: lines.length === 0, lines, omitted, omittedNote };
}

function lengthMessage(hexLength: number, picked: DigestAlgorithm, filenameStripped: boolean): VerifyHashResult {
  const named = matchesForLength(hexLength);
  const file = filenameCallout(filenameStripped);
  let lead: string;
  const callouts = [...file];

  if (named.length === 1 && named[0]!.id === 'sha1' && picked.id === 'sha256') {
    lead = `${hexLength} hex characters. ${SHA1_NOT_SHA256}`;
    callouts.unshift(SHA1_NOT_SHA256);
  } else if (named.length === 1) {
    lead = `${hexLength} hex characters. That is a ${named[0]!.name} length, not ${picked.name}.`;
  } else if (named.length > 1) {
    const names = named.map((m) => m.name).join(' and ');
    lead = `${hexLength} hex characters. This length matches more than one algorithm: ${names}. Not ${picked.name}.`;
  } else {
    lead = `${hexLength} hex characters. Truncated or unknown. This length is not ${picked.name}.`;
  }

  return {
    status: 'length',
    algorithmId: picked.id,
    callouts,
    summary: file.length && !lead.endsWith(FILENAME_STRIPPED) ? `${lead} ${FILENAME_STRIPPED}` : lead,
  };
}

/**
 * Compare one identified line with digests computed for this input.
 *
 * `picked` is `infer` or a hasher id. A length that does not belong to the chosen algorithm
 * is reported as a length problem, never as a mismatch: that is the false alarm this exists
 * to stop. Case is ignored for the comparison. A case-only difference is still a match, and
 * the result line says so.
 */
export function verifyHash(
  finding: DigestFinding,
  actualById: Partial<Record<string, string>>,
  picked: string,
): VerifyHashResult {
  if (finding.kind === 'not-hex') {
    return { status: 'not-hex', summary: finding.summary, callouts: [], algorithmId: null };
  }

  const chosen = picked === 'infer' ? null : algoById(picked);
  if (picked !== 'infer' && !chosen) {
    return {
      status: 'uncomputed',
      algorithmId: null,
      callouts: [],
      summary: 'Pick MD5, SHA-1, SHA-256, SHA-512, CRC32, or infer.',
    };
  }

  if (finding.kind === 'unknown') {
    if (chosen) return lengthMessage(finding.hex.length, chosen, finding.filenameStripped);
    return { status: 'unknown', summary: finding.summary, callouts: finding.callouts, algorithmId: null };
  }

  if (finding.kind === 'ambiguous' && !chosen) {
    return {
      status: 'ambiguous',
      algorithmId: null,
      callouts: finding.callouts,
      summary: finding.summary.endsWith('Pick one to verify.')
        ? finding.summary
        : `${finding.summary} Pick one to verify.`,
    };
  }

  const algo = chosen ?? finding.matches[0];
  if (!algo) {
    return { status: 'unknown', summary: finding.summary, callouts: finding.callouts, algorithmId: null };
  }

  if (finding.hex.length !== algo.hexLength) {
    return lengthMessage(finding.hex.length, algo, finding.filenameStripped);
  }

  const actual = (actualById[algo.id] ?? '').trim().toLowerCase();
  const file = filenameCallout(finding.filenameStripped);
  if (!actual || !HEX.test(actual)) {
    const callouts = [...file];
    return {
      status: 'uncomputed',
      algorithmId: algo.id,
      callouts,
      summary: joinCallouts(`Could not compute a ${algo.name} digest in this browser.`, callouts),
    };
  }

  if (actual === finding.hex) {
    const callouts = [...file];
    if (finding.hadUppercase) callouts.unshift(CASE_STILL_MATCHES);
    const lead = `Matches ${algo.name}.`;
    const ordered = finding.hadUppercase
      ? [CASE_STILL_MATCHES, ...file]
      : [...file];
    return {
      status: 'match',
      algorithmId: algo.id,
      callouts: ordered,
      summary: joinCallouts(lead, ordered),
    };
  }

  return {
    status: 'mismatch',
    algorithmId: algo.id,
    callouts: [...file],
    summary: joinCallouts(`Does not match ${algo.name}. Computed ${actual}.`, file),
  };
}
