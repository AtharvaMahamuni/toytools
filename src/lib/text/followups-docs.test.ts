// Copy that must match tool behaviour (followups cleanup). Each check pins one stale claim.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { analyzeText } from './analysis';
import { items as ageFaqs } from '../../tools/datetime/age-calculator/faq';
import { items as lineFaqs } from '../../tools/text/line-counter/faq';

const read = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

describe('stale docs (item 5)', () => {
  it('the JSON Formatter guide no longer says it re-serializes', () => {
    const g = read('tools/developer-utilities/json-formatter/Guide.astro');
    expect(g).not.toMatch(/parses the JSON and re-serializes/);
    expect(g).not.toMatch(/before re-serializing it/);
  });

  it('the reading-time guide matches the 0 min for empty text', () => {
    expect(read('tools/text/reading-time-calculator/Guide.astro')).not.toMatch(/never shows less than 1 minute/);
    expect(analyzeText('   ').readingTime).toBe(0);
    expect(analyzeText('word').readingTime).toBe(1);
  });

  it('the Age FAQ says "old", not "older"', () => {
    expect(ageFaqs[0].answer).toContain('1 month and 1 day old.');
    expect(ageFaqs[0].answer).not.toContain('day older');
  });
});

describe('line-counter FAQ (item 9)', () => {
  it('says "Hello\\n" is 2 lines, as the tool counts it', () => {
    expect(analyzeText('Hello\n').lines).toBe(2);
    expect(analyzeText('Hello\n').nonEmptyLines).toBe(1);
    const all = lineFaqs.map(f => f.answer).join(' ');
    expect(all).toContain('"Hello\\n" (with a trailing newline) has 2 lines');
    expect(all).not.toContain('also has 1 line');
  });
});
