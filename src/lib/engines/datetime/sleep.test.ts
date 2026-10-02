import { describe, expect, it } from 'vitest';
import { runDateTime } from './registry';
import { formatClock, parseClock } from './calculators/sleep';

describe('parseClock', () => {
  it('accepts 24-hour, padded, and am/pm forms', () => {
    expect(parseClock('07:00')).toBe(7 * 60);
    expect(parseClock('7:00 am')).toBe(7 * 60);
    expect(parseClock('19:00')).toBe(19 * 60);
    expect(parseClock('7:00 pm')).toBe(19 * 60);
    expect(parseClock('12:00 am')).toBe(0);
    expect(parseClock('12:30 pm')).toBe(12 * 60 + 30);
    expect(parseClock('nope')).toBeNull();
  });

  it('formats back to a 12-hour clock', () => {
    expect(formatClock(21 * 60 + 45)).toBe('9:45 pm');
    expect(formatClock(0)).toBe('12:00 am');
    expect(formatClock(12 * 60)).toBe('12:00 pm');
  });
});

describe('sleep calculator', () => {
  it('warns when the list assumes instant sleep', () => {
    const res = runDateTime('sleep', { direction: 'wake', time: '7:00', latency: 0, cycle: 90 }, {});
    expect(res.uiState).toBe('success');
    expect(res.insights.some((item) => item.tone === 'caution' && item.text.includes('instant sleep'))).toBe(true);
  });

  it('stays quiet about instant sleep when latency is counted', () => {
    const res = runDateTime('sleep', { direction: 'wake', time: '07:00', latency: 15, cycle: 90 }, {});
    expect(res.insights.some((item) => item.text.includes('instant sleep'))).toBe(false);
    expect(res.hero?.note).toContain('15 minutes');
  });
});
