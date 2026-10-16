import { describe, expect, it } from 'vitest';
import { dropContainedTerms } from './index';

describe('dropContainedTerms', () => {
  it('drops a term that sits as whole words inside a longer one', () => {
    expect(dropContainedTerms(['iso 8601', 'iso 8601 vs us date', 'dd/mm']).sort()).toEqual(['dd/mm', 'iso 8601 vs us date']);
  });
  it('keeps a term that is only part of a word', () => {
    expect(dropContainedTerms(['date', 'dates list']).sort()).toEqual(['date', 'dates list']);
  });
  it('keeps curated aliases', () => {
    expect(dropContainedTerms(['url slug', 'url slug maker'], new Set(['url slug'])).sort()).toEqual(['url slug', 'url slug maker']);
  });
});
