import { describe, expect, it } from 'vitest';
import { repairJson } from './repair';
import { repairStructuredData } from './registry';

describe('repairJson — the fixes it exists for', () => {
  it('removes a trailing comma in an object', () => {
    const r = repairJson('{"a": 1, "b": 2,}');
    expect(r?.label).toBe('Remove the trailing comma');
    expect(JSON.parse(r!.text)).toEqual({ a: 1, b: 2 });
  });

  it('removes a trailing comma in an array', () => {
    const r = repairJson('[1, 2, 3,]');
    expect(JSON.parse(r!.text)).toEqual([1, 2, 3]);
  });

  it('removes trailing commas across newlines, as a hand-edited file has them', () => {
    const r = repairJson('{\n  "a": 1,\n  "b": 2,\n}');
    expect(JSON.parse(r!.text)).toEqual({ a: 1, b: 2 });
  });

  it('replaces the smart quotes a word processor inserts', () => {
    const r = repairJson('{“a”: 1}');
    expect(r?.label).toContain('smart quotes');
    expect(JSON.parse(r!.text)).toEqual({ a: 1 });
  });

  it('handles both faults at once and says so', () => {
    const r = repairJson('{“a”: 1,}');
    expect(r?.label).toBe('Fix the smart quotes and trailing comma');
    expect(JSON.parse(r!.text)).toEqual({ a: 1 });
  });

  it('never corrupts a comma that lives inside a string', () => {
    // The reason this is a scanner and not a regex: /,\s*}/ would eat the comma in the value and
    // silently change the data while reporting a successful "fix".
    const r = repairJson('{"a": "x, }",}');
    expect(JSON.parse(r!.text)).toEqual({ a: 'x, }' });
  });

  it('respects escaped quotes when tracking string boundaries', () => {
    const r = repairJson('{"a": "he said \\"hi\\", ok",}');
    expect(JSON.parse(r!.text)).toEqual({ a: 'he said "hi", ok' });
  });
});

describe('repairJson — silence', () => {
  it('says nothing for valid JSON', () => {
    expect(repairJson('{"a": 1}')).toBeNull();
    expect(repairJson('[]')).toBeNull();
  });

  it('says nothing for empty input', () => {
    expect(repairJson('')).toBeNull();
    expect(repairJson('   \n ')).toBeNull();
  });

  it('says nothing when the fault is something it cannot fix', () => {
    // A missing brace is not a repair this knows how to make, and guessing would be worse.
    expect(repairJson('{"a": 1')).toBeNull();
    expect(repairJson('not json at all')).toBeNull();
  });

  it('refuses to offer a repair that would still not parse', () => {
    // Has a trailing comma AND a structural fault. Fixing only the comma leaves it broken, so the
    // offer would move the user one tap further from an answer.
    expect(repairJson('{"a": 1,, }')).toBeNull();
    expect(repairJson('{"a": [1,2,],')).toBeNull();
  });
});

// ── Registry gating ───────────────────────────────────────────────────────────
describe('repairStructuredData (registry wiring)', () => {
  it('offers a repair for a tool whose input is JSON', () => {
    expect(repairStructuredData('json-formatter', '{"a": 1,}')?.label).toBe('Remove the trailing comma');
    expect(repairStructuredData('json-validator', '{“a”: 1}')?.label).toContain('smart quotes');
  });

  it('declines for tools that consume something other than JSON', () => {
    // Offering to strip a trailing comma from a CSV or YAML file would be gibberish.
    expect(repairStructuredData('csv-to-json', 'a,b,\n1,2,')).toBeNull();
    expect(repairStructuredData('yaml-to-json', 'a: 1,')).toBeNull();
  });

  it('declines for an unknown tool id', () => {
    expect(repairStructuredData('nope', '{"a": 1,}')).toBeNull();
  });
});
