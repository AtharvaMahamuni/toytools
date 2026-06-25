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
