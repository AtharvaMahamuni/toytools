import { describe, it, expect } from 'vitest';
import { normalizeUrl } from './normalizeUrl';

const HOST = 'toytoolsapp.com';

describe('normalizeUrl', () => {
  it('forces https', () => {
    expect(normalizeUrl('http://toytoolsapp.com/tool/')).toBe('https://toytoolsapp.com/tool/');
  });

  it('strips the query string including utm_*', () => {
    expect(normalizeUrl('https://toytoolsapp.com/tool/?utm_source=x&a=1')).toBe(
      'https://toytoolsapp.com/tool/',
    );
  });

  it('strips the fragment', () => {
    expect(normalizeUrl('https://toytoolsapp.com/tool/#faq')).toBe('https://toytoolsapp.com/tool/');
  });

  it('adds a trailing slash so /x and /x/ normalize identically', () => {
    expect(normalizeUrl('https://toytoolsapp.com/tool')).toBe('https://toytoolsapp.com/tool/');
    expect(normalizeUrl('https://toytoolsapp.com/tool/')).toBe('https://toytoolsapp.com/tool/');
  });

  it('keeps the bare root as /', () => {
    expect(normalizeUrl('https://toytoolsapp.com/')).toBe('https://toytoolsapp.com/');
  });

  it('rejects a different host', () => {
    expect(normalizeUrl('https://evil.example.com/tool/')).toBeNull();
  });

  it('honors an explicit host argument', () => {
    expect(normalizeUrl('https://staging.test/x', 'staging.test')).toBe('https://staging.test/x/');
  });

  it('returns null for an unparseable URL', () => {
    expect(normalizeUrl('not a url')).toBeNull();
  });

  it('is host-case-insensitive', () => {
    expect(normalizeUrl(`https://TOYTOOLSAPP.COM/tool/`, HOST)).toBe('https://toytoolsapp.com/tool/');
  });
});
