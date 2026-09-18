import { describe, expect, it } from 'vitest';
import { getGenerator } from './registry';
import { inspectLine, inspectUuids, versionCheckNote } from './generators/uuidInspector';

const V1 = 'C232AB00-9414-11EC-B3C8-9F6BDECED846';
const V3 = '5df41881-3aed-3515-88a7-2f4a814cf09e';
const V4 = '919108f7-52d1-4320-9bac-f847db4148a8';
const V5 = '2ed6657d-e927-568b-95e1-2665a8aea6a2';
const V6 = '1EC9414C-232A-6B00-B3C8-9F6BDECED846';
const V7 = '017F22E2-79B0-7CC3-98C4-DC0C0C07398F';
const NIL = '00000000-0000-0000-0000-000000000000';
const MAX = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const GREGORIAN = '2022-02-22 19:22:22.0000000 UTC';
const UNIX_MS = '2022-02-22 19:22:22.000 UTC';

describe('inspectLine', () => {
  it('ignores a blank line', () => {
    expect(inspectLine('   ')).toBeNull();
  });

  it('reads the RFC 9562 version 1 vector in UTC', () => {
    const line = inspectLine(V1)!;
    expect(line.valid).toBe(true);
    expect(line.version).toBe('v1');
    expect(line.variant).toBe('RFC 4122');
    expect(line.timestampUtc).toBe(GREGORIAN);
  });

  it('reads version 6 as the same instant', () => {
    const line = inspectLine(V6.toLowerCase())!;
    expect(line.version).toBe('v6');
    expect(line.timestampUtc).toBe(GREGORIAN);
  });

  it('reads version 7 to the millisecond only', () => {
    const line = inspectLine(V7)!;
    expect(line.version).toBe('v7');
    expect(line.variant).toBe('RFC 4122');
    expect(line.timestampUtc).toBe(UNIX_MS);
  });

  it('does not invent a time for version 3, 4, 5, or 8', () => {
    expect(inspectLine(V3)!.timestampUtc).toBeUndefined();
    const v4 = inspectLine(V4)!;
    expect(v4.version).toBe('v4');
    expect(v4.timestampUtc).toBeUndefined();
    expect(inspectLine(V5)!.version).toBe('v5');
    expect(inspectLine(V5)!.timestampUtc).toBeUndefined();
    const v8 = inspectLine('2489E9AD-2EE2-8E00-8EC9-32D5F69181C0')!;
    expect(v8.version).toBe('v8');
    expect(v8.timestampUtc).toBeUndefined();
  });

  it('labels version 2 without decoding DCE fields', () => {
    const line = inspectLine('00000000-0000-2000-8000-000000000001')!;
    expect(line.version).toBe('v2');
    expect(line.timestampUtc).toBeUndefined();
  });

  it('labels an unused version nibble as unknown', () => {
    const line = inspectLine('00000000-0000-9000-8000-000000000001')!;
    expect(line.version).toBe('unknown');
    expect(line.timestampUtc).toBeUndefined();
  });

  it('calls out nil and max as special', () => {
    const nil = inspectLine(NIL)!;
    expect(nil.version).toBe('nil UUID');
    expect(nil.versionId).toBe('nil');
    expect(nil.variant).toBe('NCS');
    expect(nil.timestampUtc).toBeUndefined();

    const max = inspectLine(MAX)!;
    expect(max.version).toBe('max UUID');
    expect(max.versionId).toBe('max');
    expect(max.variant).toBe('future');
    expect(max.timestampUtc).toBeUndefined();
  });

  it('accepts bare 32-hex and uppercase', () => {
    expect(inspectLine('919108f752d143209bacf847db4148a8')!.version).toBe('v4');
    expect(inspectLine(V4.toUpperCase())!.version).toBe('v4');
  });

  it('names NCS, Microsoft, and future when the bits say so', () => {
    expect(inspectLine('919108f7-52d1-4320-0bac-f847db4148a8')!.variant).toBe('NCS');
    expect(inspectLine('919108f7-52d1-4320-cbac-f847db4148a8')!.variant).toBe('Microsoft');
    expect(inspectLine('919108f7-52d1-4320-ebac-f847db4148a8')!.variant).toBe('future');
  });

  it('gives one reason for each invalid shape', () => {
    expect(inspectLine('919108f7-52d1')!.reason).toBe('wrong length');
    expect(inspectLine('g919108f-52d1-4320-9bac-f847db4148a8')!.reason).toBe('bad hex');
    expect(inspectLine('919108f7-52d14320-9bac-f847db4148a8')!.reason).toBe('hyphens are in the wrong places');
    expect(inspectLine('{' + V4 + '}')!.reason).toBe('remove the surrounding braces');
    expect(inspectLine('urn:uuid:' + V4)!.reason).toBe('strip the urn:uuid: prefix');
    expect(inspectLine('919108f7 52d1 4320 9bac f847db4148a8')!.reason).toBe('spaces inside the value');
  });

  it('decodes a tick just before the Unix epoch', () => {
    const line = inspectLine('13813fce-1dd2-11b2-8000-000000000000')!;
    expect(line.version).toBe('v1');
    expect(line.timestampUtc).toBe('1969-12-31 23:59:59.9999950 UTC');
  });
});

describe('version check', () => {
  it('stays silent when no version is expected', () => {
    const result = inspectUuids(V4, 'any');
    expect(result.note).toBeUndefined();
    expect(result.text).toContain('valid, v4, RFC 4122');
    expect(result.text).not.toContain('UTC');
  });

  it('stays silent when every valid line matches, and when nothing is valid', () => {
    expect(inspectUuids(V7, '7').note).toBeUndefined();
    expect(inspectUuids('not-a-uuid', '7').note).toBeUndefined();
  });

  it('names a version 4 pasted where version 7 was expected', () => {
    const result = inspectUuids(V4 + '\n' + V7, '7');
    expect(result.note?.text).toContain('1 of 2 valid UUIDs are not version 7');
    expect(result.note?.text).toContain('A version 4 looks fine to a human even when a system wants version 7.');
    expect(result.text).toContain('not version 7');
  });

  it('does not mention the version 4 trap when another version was expected', () => {
    const note = versionCheckNote(
      [
        { raw: V1, valid: true, version: 'v1', versionId: 'v1', variant: 'RFC 4122' },
        { raw: V4, valid: true, version: 'v4', versionId: 'v4', variant: 'RFC 4122' },
      ],
      '1',
    );
    expect(note?.text).toBe('1 of 2 valid UUIDs are not version 1.');
  });

  it('covers the all-mismatch and singular wordings', () => {
    expect(
      versionCheckNote(
        [
          { raw: V4, valid: true, version: 'v4', versionId: 'v4', variant: 'RFC 4122' },
          { raw: V4, valid: true, version: 'v4', versionId: 'v4', variant: 'RFC 4122' },
        ],
        '1',
      )?.text,
    ).toBe('None of the 2 valid UUIDs are version 1.');
    expect(
      versionCheckNote(
        [{ raw: V4, valid: true, version: 'v4', versionId: 'v4', variant: 'RFC 4122' }],
        '1',
      )?.text,
    ).toBe('The valid UUID is not version 1.');
  });
});

describe('inspectUuids batch', () => {
  it('shows the empty state for a blank paste', () => {
    expect(inspectUuids('\n\n', 'any').ok).toBe(false);
  });

  it('caps the batch at 50 and says so', () => {
    const rows = [V4, '', V7].concat(Array.from({ length: 49 }, () => NIL));
    const result = inspectUuids(rows.join('\n'), 'any');
    expect(result.meta?.find((m) => m.label === 'Checked')?.value).toBe('50');
    expect(result.meta?.find((m) => m.label === 'Skipped')?.value).toBe('1');
    expect(result.text).toContain('Checked 50 of 51 lines');
  });

  it('does not mention a cap at exactly 50', () => {
    const result = inspectUuids(Array.from({ length: 50 }, () => V4).join('\n'), 'any');
    expect(result.text).not.toContain('not inspected');
    expect(result.meta?.find((m) => m.label === 'Valid')?.value).toBe('50');
  });

  it('is the uuid-inspector generator', () => {
    const gen = getGenerator('uuid-inspector')!;
    expect(gen.autoGenerate).toBe(false);
    expect(gen.notes).toBe(true);
    expect(gen.generate({ input: '', expect: 'any' }).ok).toBe(false);
    expect(gen.generate({ input: V4, expect: 'any' }).text).toContain('v4');
  });
});
