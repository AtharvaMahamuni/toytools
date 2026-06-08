import { describe, it, expect } from 'vitest';
import { formatMetric } from './formatters';

describe('formatMetric', () => {
  describe('integer formatter', () => {
    it('formats zero', () => expect(formatMetric(0, 'integer')).toBe((0).toLocaleString()));
    it('formats single digit', () => expect(formatMetric(5, 'integer')).toBe((5).toLocaleString()));
    it('formats hundreds', () => expect(formatMetric(100, 'integer')).toBe((100).toLocaleString()));
    it('formats thousands with locale separators', () => expect(formatMetric(1000, 'integer')).toBe((1000).toLocaleString()));
    it('formats millions', () => expect(formatMetric(1000000, 'integer')).toBe((1000000).toLocaleString()));
    it('formats large numbers consistently', () => expect(formatMetric(999999, 'integer')).toBe((999999).toLocaleString()));
  });

  describe('duration formatter', () => {
    it('formats zero minutes', () => expect(formatMetric(0, 'duration')).toBe('0 min'));
    it('formats one minute', () => expect(formatMetric(1, 'duration')).toBe('1 min'));
    it('formats multiple minutes', () => expect(formatMetric(5, 'duration')).toBe('5 min'));
    it('formats large duration', () => expect(formatMetric(120, 'duration')).toBe('120 min'));
  });

  describe('percentage formatter', () => {
    it('formats zero percent', () => expect(formatMetric(0, 'percentage')).toBe('0%'));
    it('formats 50 percent', () => expect(formatMetric(50, 'percentage')).toBe('50%'));
    it('formats 100 percent', () => expect(formatMetric(100, 'percentage')).toBe('100%'));
    it('formats fractional percentage', () => expect(formatMetric(33, 'percentage')).toBe('33%'));
  });

  describe('decimal formatter', () => {
    it('formats zero as one decimal place', () => expect(formatMetric(0, 'decimal')).toBe('0.0'));
    it('formats integer as one decimal place', () => expect(formatMetric(3, 'decimal')).toBe('3.0'));
    it('formats exact decimal', () => expect(formatMetric(3.7, 'decimal')).toBe('3.7'));
    it('rounds to one decimal place', () => expect(formatMetric(3.14159, 'decimal')).toBe('3.1'));
    it('rounds up when appropriate', () => expect(formatMetric(3.95, 'decimal')).toBe('4.0'));
    it('formats larger decimal value', () => expect(formatMetric(42.5, 'decimal')).toBe('42.5'));
  });
});
