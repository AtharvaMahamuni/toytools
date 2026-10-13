import { describe, it, expect } from 'vitest';
import { jsonLimitError, duplicateKeyWarning, formatJsonLossless, MAX_JSON_DEPTH } from './losslessJson';
import { jsonFormatter } from './jsonFormatter';
import { jsonMinifier } from './jsonMinifier';

describe('JSON size and depth guard', () => {
  it('allows 2,000 levels and refuses 2,001 with a clear error, fast', () => {
    expect(jsonLimitError('['.repeat(MAX_JSON_DEPTH) + ']'.repeat(MAX_JSON_DEPTH))).toBeNull();
    const deep = '['.repeat(10000) + ']'.repeat(10000);
    const t0 = performance.now();
    for (const tool of [jsonFormatter, jsonMinifier]) {
      const r = tool.execute(deep) as { ok: boolean; error?: string };
      expect(r.ok).toBe(false);
      expect(r.error).toMatch(/more than 2000 levels deep/);
    }
    expect(performance.now() - t0).toBeLessThan(1000);
  });

  it('ignores brackets inside strings, escaped quotes included', () => {
    expect(jsonLimitError(JSON.stringify({ a: '['.repeat(5000) + '\\"' + '{'.repeat(5000) }))).toBeNull();
  });

  it('refuses input over 20 MB', () => {
    const big = '"' + 'a'.repeat(20 * 1024 * 1024) + '"';
    expect(jsonLimitError(big)).toMatch(/larger than 20 MB/);
    expect((jsonFormatter.execute(big) as { ok: boolean }).ok).toBe(false);
  });

  it('still formats ordinary JSON', () => {
    const r = jsonFormatter.execute('{"a":[1,2]}') as { ok: boolean; output: string };
    expect(r.ok).toBe(true);
    expect(r.output).toBe('{\n  "a": [\n    1,\n    2\n  ]\n}');
  });
});

describe('duplicate-key warning', () => {
  it('lists each duplicate once and at most the first 5', () => {
    const text = '{' + ['a', 'b', 'c', 'd', 'e', 'f', 'g'].flatMap(k => [`"${k}":1`, `"${k}":2`, `"${k}":3`]).join(',') + '}';
    const { duplicates } = formatJsonLossless(text);
    expect(duplicates).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    const w = duplicateKeyWarning(duplicates) as string;
    expect(w).toContain('"a", "b", "c", "d", "e" and 2 more');
    expect(w).not.toContain('"f"');
  });

  it('names a single duplicate without "more"', () => {
    expect(duplicateKeyWarning(['x'])).toBe('Duplicate key "x": kept as written here, but most JSON parsers keep only the last value.');
  });
});
