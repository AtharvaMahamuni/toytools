import { describe, it, expect } from 'vitest';
import { diffLines, diffStats } from './compare';

describe('diffLines', () => {
  it('returns empty array for two empty strings', () => {
    expect(diffLines('', '')).toEqual([]);
  });

  it('marks all lines as added when a is empty', () => {
    const result = diffLines('', 'hello\nworld');
    expect(result).toEqual([
      { type: 'added', line: 'hello' },
      { type: 'added', line: 'world' },
    ]);
  });

  it('marks all lines as removed when b is empty', () => {
    const result = diffLines('hello\nworld', '');
    expect(result).toEqual([
      { type: 'removed', line: 'hello' },
      { type: 'removed', line: 'world' },
    ]);
  });

  it('marks all lines as unchanged for identical strings', () => {
    const result = diffLines('hello\nworld', 'hello\nworld');
    expect(result.every(r => r.type === 'unchanged')).toBe(true);
    expect(result.length).toBe(2);
  });

  it('detects a single added line', () => {
    const result = diffLines('hello', 'hello\nworld');
    const added = result.filter(r => r.type === 'added');
    expect(added.length).toBe(1);
    expect(added[0].line).toBe('world');
  });

  it('detects a single removed line', () => {
    const result = diffLines('hello\nworld', 'hello');
    const removed = result.filter(r => r.type === 'removed');
    expect(removed.length).toBe(1);
    expect(removed[0].line).toBe('world');
  });

  it('detects a changed line as remove + add', () => {
    const result = diffLines('hello', 'goodbye');
    expect(result.some(r => r.type === 'removed' && r.line === 'hello')).toBe(true);
    expect(result.some(r => r.type === 'added' && r.line === 'goodbye')).toBe(true);
  });

  it('handles single-line inputs with no newline', () => {
    const result = diffLines('abc', 'abc');
    expect(result).toEqual([{ type: 'unchanged', line: 'abc' }]);
  });

  it('preserves common prefix and suffix around a changed middle line', () => {
    const result = diffLines('a\nb\nc', 'a\nX\nc');
    const unchanged = result.filter(r => r.type === 'unchanged').map(r => r.line);
    expect(unchanged).toContain('a');
    expect(unchanged).toContain('c');
    expect(result.some(r => r.type === 'removed' && r.line === 'b')).toBe(true);
    expect(result.some(r => r.type === 'added' && r.line === 'X')).toBe(true);
  });
});

describe('diffStats', () => {
  it('returns zeros for empty diff', () => {
    const stats = diffStats([]);
    expect(stats.added).toBe(0);
    expect(stats.removed).toBe(0);
    expect(stats.unchanged).toBe(0);
  });

  it('treats two empty texts as 100% similar (not 0%)', () => {
    expect(diffStats(diffLines('', '')).similarity).toBe(100);
  });

  it('returns 100% similarity for all-unchanged diff', () => {
    const result = diffLines('hello\nworld', 'hello\nworld');
    const stats = diffStats(result);
    expect(stats.similarity).toBe(100);
    expect(stats.unchanged).toBe(2);
    expect(stats.added).toBe(0);
    expect(stats.removed).toBe(0);
  });

  it('returns 0% similarity for completely different texts', () => {
    const result = diffLines('aaa', 'bbb');
    const stats = diffStats(result);
    expect(stats.similarity).toBe(0);
    expect(stats.unchanged).toBe(0);
  });

  it('counts added and removed lines correctly', () => {
    const result = diffLines('a\nb\nc', 'a\nX\nY\nc');
    const stats = diffStats(result);
    expect(stats.unchanged).toBeGreaterThanOrEqual(2); // a and c
    expect(stats.added).toBeGreaterThanOrEqual(1);
    expect(stats.removed).toBeGreaterThanOrEqual(1);
  });
});

describe('diffLines — large inputs (heuristic fallback path)', () => {
  // Over 2000 lines per side triggers computeLCSHeuristic (prefix/suffix matching).
  const big = (n: number, marker = '') =>
    Array.from({ length: n }, (_, i) => `line ${i}${marker}`).join('\n');

  it('keeps a shared prefix/suffix unchanged when one middle line changes', () => {
    const a = big(2500);
    const b = a.replace('line 1250', 'line 1250 CHANGED');
    const result = diffLines(a, b);
    const stats = diffStats(result);
    // The vast bulk of lines are identical at the head and tail and stay unchanged.
    expect(stats.unchanged).toBeGreaterThan(2000);
    expect(stats.added).toBeGreaterThanOrEqual(1);
    expect(stats.removed).toBeGreaterThanOrEqual(1);
    // Every input line is represented exactly once on each side.
    expect(stats.unchanged + stats.removed).toBe(2500); // a-side lines
    expect(stats.unchanged + stats.added).toBe(2500);   // b-side lines
  });

  it('marks every line changed when two large inputs share no prefix or suffix', () => {
    const result = diffLines(big(2100, 'A'), big(2100, 'B'));
    const stats = diffStats(result);
    expect(stats.unchanged).toBe(0);
    expect(stats.added).toBe(2100);
    expect(stats.removed).toBe(2100);
    expect(stats.similarity).toBe(0);
  });
});
