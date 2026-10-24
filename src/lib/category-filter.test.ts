import { describe, expect, it } from 'vitest';
import { announceCat, catUrl, parseCat, toggleCat } from './category-filter';

const valid = ['money-finance', 'physics'];

describe('parseCat', () => {
  it('reads a valid slug', () => expect(parseCat('?cat=physics', valid)).toBe('physics'));
  it('falls back to All for an unknown slug', () => expect(parseCat('?cat=nope', valid)).toBeNull());
  it('falls back to All when absent or empty', () => {
    expect(parseCat('', valid)).toBeNull();
    expect(parseCat('?cat=', valid)).toBeNull();
    expect(parseCat('?q=tip', valid)).toBeNull();
  });
});

describe('toggleCat', () => {
  it('selects a new chip', () => expect(toggleCat(null, 'physics')).toBe('physics'));
  it('switches between chips', () => expect(toggleCat('physics', 'money-finance')).toBe('money-finance'));
  it('clears when the active chip is tapped again', () => expect(toggleCat('physics', 'physics')).toBeNull());
  it('clears on All', () => expect(toggleCat('physics', '')).toBeNull());
});

describe('catUrl', () => {
  it('sets the param and keeps ?q', () => {
    expect(catUrl('https://x.test/search/?q=tip', 'money-finance')).toBe('https://x.test/search/?q=tip&cat=money-finance');
  });
  it('removes the param for All', () => {
    expect(catUrl('https://x.test/?cat=physics', null)).toBe('https://x.test/');
  });
  it('round-trips through parseCat', () => {
    const url = new URL(catUrl('https://x.test/', 'physics'));
    expect(parseCat(url.search, valid)).toBe('physics');
  });
});

describe('announceCat', () => {
  it('names the category', () => expect(announceCat(12, 'Finance')).toBe('Showing 12 Finance tools'));
  it('is singular for one', () => expect(announceCat(1, 'Physics')).toBe('Showing 1 Physics tool'));
  it('describes All', () => expect(announceCat(114, null)).toBe('Showing all 114 tools'));
});
