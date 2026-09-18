import { describe, expect, it } from 'vitest';
import { hashBytes, runHash } from './registry';
import {
  CASE_STILL_MATCHES,
  DIGEST_ALGORITHMS,
  FILENAME_STRIPPED,
  MAX_DIGEST_LINES,
  SHA1_NOT_SHA256,
  findingFromParts,
  identifyHash,
  parseDigestLine,
  verifyHash,
  type DigestFinding,
} from './identify';

const HELLO_SHA256 = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
const HELLO_SHA1 = 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d';
const HELLO_MD5 = '5d41402abc4b2a76b9719d911017c592';
const HELLO_CRC = '3610a686';

describe('parseDigestLine', () => {
  it('keeps a bare hex digest and ignores case and surrounding space', () => {
    const parsed = parseDigestLine(`  ${HELLO_SHA256.toUpperCase()}  `);
    expect(parsed.notHex).toBe(false);
    expect(parsed.hex).toBe(HELLO_SHA256);
    expect(parsed.hadUppercase).toBe(true);
    expect(parsed.filenameStripped).toBe(false);
  });

  it('strips a sha256sum text-mode filename (two spaces)', () => {
    const parsed = parseDigestLine(`${HELLO_SHA256}  ./archive.tar.gz`);
    expect(parsed.hex).toBe(HELLO_SHA256);
    expect(parsed.filenameStripped).toBe(true);
  });

  it('strips a sha256sum binary-mode filename (space star)', () => {
    const parsed = parseDigestLine(`${HELLO_MD5.toUpperCase()} *hello.txt`);
    expect(parsed.hex).toBe(HELLO_MD5);
    expect(parsed.filenameStripped).toBe(true);
    expect(parsed.hadUppercase).toBe(true);
  });

  it('does not glue a single space into the digest', () => {
    const parsed = parseDigestLine(`${HELLO_CRC} hello.txt`);
    expect(parsed.notHex).toBe(true);
  });

  it('rejects a colon prefix rather than guessing an algorithm label', () => {
    expect(parseDigestLine(`sha256:${HELLO_SHA256}`).notHex).toBe(true);
  });
});

describe('identifyHash', () => {
  it('is silent on an empty paste', () => {
    const result = identifyHash(' \n\n  ');
    expect(result.empty).toBe(true);
    expect(result.lines).toEqual([]);
    expect(result.omitted).toBe(0);
    expect(result.omittedNote).toBe('');
  });

  it('names each published length and stays quiet when nothing is wrong', () => {
    const result = identifyHash([HELLO_CRC, HELLO_MD5, HELLO_SHA256, 'a'.repeat(128)].join('\n'));
    expect(result.lines.map((l) => l.matches[0]?.name)).toEqual(['CRC32', 'MD5', 'SHA-256', 'SHA-512']);
    for (const line of result.lines) {
      expect(line.kind).toBe('identified');
      expect(line.callouts).toEqual([]);
      expect(line.summary).not.toContain(SHA1_NOT_SHA256);
      expect(line.summary).not.toContain(FILENAME_STRIPPED);
      expect(line.summary).not.toContain(CASE_STILL_MATCHES);
    }
  });

  it('says a 40 character digest is SHA-1, not SHA-256', () => {
    const line = identifyHash(HELLO_SHA1).lines[0]!;
    expect(line.matches.map((m) => m.id)).toEqual(['sha1']);
    expect(line.summary).toContain('SHA-1');
    expect(line.summary).toContain(SHA1_NOT_SHA256);
    expect(line.callouts).toContain(SHA1_NOT_SHA256);
  });

  it('calls out a stripped filename on the result line', () => {
    const line = identifyHash(`${HELLO_SHA256}  hello.txt`).lines[0]!;
    expect(line.filenameStripped).toBe(true);
    expect(line.summary).toContain('SHA-256');
    expect(line.summary).toContain(FILENAME_STRIPPED);
    expect(line.callouts).toEqual([FILENAME_STRIPPED]);
  });

  it('does not guess a length that matches none of the five', () => {
    for (const sample of ['abc', 'ab', 'a'.repeat(56), 'a'.repeat(63), 'a'.repeat(96)]) {
      const line = identifyHash(sample).lines[0]!;
      expect(line.kind).toBe('unknown');
      expect(line.matches).toEqual([]);
      expect(line.summary).toContain('Truncated or unknown');
      expect(line.summary).not.toMatch(/SHA-384|SHA-224|BLAKE/);
    }
  });

  it('rejects a line that is not hex', () => {
    const line = identifyHash('not a hash').lines[0]!;
    expect(line.kind).toBe('not-hex');
    expect(line.callouts).toEqual([]);
    expect(line.summary).toContain('Not a hex digest');
  });

  it('ignores blank lines and stops after 20 non-empty lines', () => {
    const rows = ['', HELLO_MD5, '   ', ...Array.from({ length: 25 }, () => HELLO_CRC)];
    const result = identifyHash(rows.join('\r\n'));
    expect(result.lines).toHaveLength(MAX_DIGEST_LINES);
    expect(result.omitted).toBe(6);
    expect(result.omittedNote).toContain('6 more lines were left out');
    expect(result.lines[0]?.matches[0]?.id).toBe('md5');
  });

  it('uses the singular when exactly one line is left out', () => {
    const result = identifyHash(Array.from({ length: 21 }, () => HELLO_CRC).join('\n'));
    expect(result.omitted).toBe(1);
    expect(result.omittedNote).toContain('1 more line was left out');
  });

  it('says so when a length matches more than one algorithm', () => {
    const parsed = parseDigestLine('abcd');
    const finding = findingFromParts(1, parsed, [
      { id: 'md5', name: 'MD5', hexLength: 4 },
      { id: 'sha1', name: 'SHA-1', hexLength: 4 },
    ]);
    expect(finding.kind).toBe('ambiguous');
    expect(finding.summary).toContain('more than one algorithm');
    expect(finding.summary).toContain('MD5 and SHA-1');
  });
});

describe('verifyHash', () => {
  it('treats a case-only difference as a match and says so', async () => {
    const finding = identifyHash(HELLO_SHA256.toUpperCase()).lines[0]!;
    const actual = await runHash('sha256', 'hello');
    const result = verifyHash(finding, { sha256: actual }, 'infer');
    expect(result.status).toBe('match');
    expect(result.summary).toContain('Matches SHA-256');
    expect(result.summary).toContain(CASE_STILL_MATCHES);
    expect(result.callouts).toContain(CASE_STILL_MATCHES);
  });

  it('stays silent about case when the paste was already lowercase', async () => {
    const finding = identifyHash(`${HELLO_SHA256}  hello.txt`).lines[0]!;
    const actual = await runHash('sha256', 'hello');
    const result = verifyHash(finding, { sha256: actual }, 'sha256');
    expect(result.status).toBe('match');
    expect(result.summary).toContain(FILENAME_STRIPPED);
    expect(result.summary).not.toContain(CASE_STILL_MATCHES);
  });

  it('does not call a real mismatch a case problem', async () => {
    const finding = identifyHash(HELLO_SHA256.toUpperCase()).lines[0]!;
    const result = verifyHash(finding, { sha256: HELLO_MD5.padEnd(64, '0') }, 'infer');
    expect(result.status).toBe('mismatch');
    expect(result.summary).toContain('Does not match SHA-256');
    expect(result.summary).toContain('Computed');
    expect(result.summary).not.toContain(CASE_STILL_MATCHES);
  });

  it('refuses to treat a SHA-1 length as a SHA-256 mismatch', async () => {
    const finding = identifyHash(HELLO_SHA1).lines[0]!;
    const result = verifyHash(finding, { sha256: HELLO_SHA256 }, 'sha256');
    expect(result.status).toBe('length');
    expect(result.summary).toContain(SHA1_NOT_SHA256);
    expect(result.summary).not.toContain(HELLO_SHA256);
  });

  it('names the algorithm that fits when a different one was picked', () => {
    const finding = identifyHash(HELLO_MD5).lines[0]!;
    const result = verifyHash(finding, {}, 'sha1');
    expect(result.status).toBe('length');
    expect(result.summary).toContain('MD5 length, not SHA-1');
  });

  it('does not guess when inferring a truncated digest', () => {
    const finding = identifyHash('abc').lines[0]!;
    const result = verifyHash(finding, { sha256: HELLO_SHA256 }, 'infer');
    expect(result.status).toBe('unknown');
    expect(result.summary).toContain('Truncated or unknown');
    expect(result.algorithmId).toBeNull();
  });

  it('says truncated when a picked algorithm does not fit an unknown length', () => {
    const finding = identifyHash('abcd').lines[0]!;
    const result = verifyHash(finding, { md5: HELLO_MD5 }, 'md5');
    expect(result.status).toBe('length');
    expect(result.summary).toContain('Truncated or unknown');
    expect(result.summary).toContain('not MD5');
  });

  it('asks for a pick when the length matches more than one algorithm', () => {
    const finding: DigestFinding = {
      line: 1,
      hex: 'abcd',
      kind: 'ambiguous',
      matches: [
        { id: 'md5', name: 'MD5', hexLength: 4 },
        { id: 'sha1', name: 'SHA-1', hexLength: 4 },
      ],
      filenameStripped: false,
      hadUppercase: false,
      summary: 'This length matches more than one algorithm: MD5 and SHA-1.',
      callouts: [],
    };
    const once = verifyHash(finding, {}, 'infer');
    expect(once.status).toBe('ambiguous');
    expect(once.summary).toContain('Pick one to verify.');
    const twice = verifyHash({ ...finding, summary: once.summary }, {}, 'infer');
    expect(twice.summary.match(/Pick one to verify/g)).toHaveLength(1);
  });

  it('keeps a not-hex line as not-hex', () => {
    const finding = identifyHash('hello').lines[0]!;
    const result = verifyHash(finding, { md5: HELLO_MD5 }, 'md5');
    expect(result.status).toBe('not-hex');
  });

  it('rejects an unknown algorithm id', () => {
    const finding = identifyHash(HELLO_MD5).lines[0]!;
    const result = verifyHash(finding, {}, 'blake3');
    expect(result.status).toBe('uncomputed');
    expect(result.summary).toContain('infer');
  });

  it('says when the browser could not compute a digest', () => {
    const finding = identifyHash(HELLO_CRC).lines[0]!;
    const result = verifyHash(finding, { crc32: '' }, 'infer');
    expect(result.status).toBe('uncomputed');
    expect(result.summary).toContain('Could not compute a CRC32 digest');
  });

  it('appends a stripped filename when a picked algorithm cannot hash that length', () => {
    const finding = identifyHash(`${HELLO_SHA1}  notes.txt`).lines[0]!;
    const result = verifyHash(finding, {}, 'sha256');
    expect(result.summary).toContain(SHA1_NOT_SHA256);
    expect(result.summary).toContain(FILENAME_STRIPPED);
    expect(result.callouts).toEqual([SHA1_NOT_SHA256, FILENAME_STRIPPED]);
  });
});

describe('hashBytes', () => {
  it('matches runHash for the same UTF-8 text on every hasher', async () => {
    const text = 'The quick brown fox jumps over the lazy dog';
    const bytes = new TextEncoder().encode(text);
    for (const algo of DIGEST_ALGORITHMS) {
      expect(await hashBytes(algo.id, bytes)).toBe(await runHash(algo.id, text));
    }
  });

  it('hashes file bytes, including a known CRC32 check value', async () => {
    expect(await hashBytes('crc32', new TextEncoder().encode('123456789'))).toBe('cbf43926');
    expect(await hashBytes('md5', new TextEncoder().encode('hello'))).toBe(HELLO_MD5);
    expect(await hashBytes('sha1', new TextEncoder().encode('hello'))).toBe(HELLO_SHA1);
    expect(await hashBytes('sha256', new TextEncoder().encode('hello'))).toBe(HELLO_SHA256);
    expect(await hashBytes('nope', new Uint8Array([1, 2, 3]))).toBe('');
  });
});
