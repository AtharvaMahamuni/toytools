import { describe, it, expect } from 'vitest';
import { gtagPageFields, stripQueryAndHash } from './location';

const TOOL = 'https://toytoolsapp.com/tool/finance/compound-interest-calculator/';

describe('stripQueryAndHash', () => {
  it('drops the query string', () => {
    expect(stripQueryAndHash(`${TOOL}?principal=5000&rate=7`)).toBe(TOOL);
  });

  it('drops the hash', () => {
    expect(stripQueryAndHash(`${TOOL}#faq`)).toBe(TOOL);
  });

  it('drops both, in either order of appearance', () => {
    expect(stripQueryAndHash(`${TOOL}?principal=5000#faq`)).toBe(TOOL);
    expect(stripQueryAndHash(`${TOOL}#faq?principal=5000`)).toBe(TOOL);
  });

  it('leaves a URL with neither unchanged', () => {
    expect(stripQueryAndHash(TOOL)).toBe(TOOL);
  });

  it('handles a bare "?" or "#" and the empty string', () => {
    expect(stripQueryAndHash(`${TOOL}?`)).toBe(TOOL);
    expect(stripQueryAndHash(`${TOOL}#`)).toBe(TOOL);
    expect(stripQueryAndHash('')).toBe('');
  });
});

describe('gtagPageFields', () => {
  // A location-shaped object as the browser would give it for this address.
  function at(href: string) {
    const u = new URL(href);
    return { origin: u.origin, pathname: u.pathname };
  }

  it('builds page_location from origin + pathname when the address has a query', () => {
    expect(gtagPageFields(at(`${TOOL}?principal=5000&rate=7`), '').page_location).toBe(TOOL);
  });

  it('builds page_location without the hash', () => {
    expect(gtagPageFields(at(`${TOOL}#faq`), '').page_location).toBe(TOOL);
  });

  it('builds page_location without query and hash together', () => {
    expect(gtagPageFields(at(`${TOOL}?principal=5000#faq`), '').page_location).toBe(TOOL);
  });

  it('builds page_location unchanged when there is neither', () => {
    expect(gtagPageFields(at(TOOL), '').page_location).toBe(TOOL);
  });

  it('keeps a search term out of page_location on the search page', () => {
    expect(gtagPageFields(at('https://toytoolsapp.com/search/?q=my+salary'), '').page_location).toBe(
      'https://toytoolsapp.com/search/',
    );
  });

  it('strips the query and hash from a same-origin referrer carrying the previous inputs', () => {
    const fields = gtagPageFields(at(TOOL), 'https://toytoolsapp.com/tool/finance/loan-emi-calculator/?amount=900000#x');
    expect(fields.page_referrer).toBe('https://toytoolsapp.com/tool/finance/loan-emi-calculator/');
  });

  it('keeps a query-free external referrer as it is', () => {
    expect(gtagPageFields(at(TOOL), 'https://www.google.com/').page_referrer).toBe('https://www.google.com/');
  });

  it('omits page_referrer when there is no referrer', () => {
    expect(gtagPageFields(at(TOOL), '')).toEqual({ page_location: TOOL });
  });
});
