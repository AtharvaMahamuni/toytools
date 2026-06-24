import { describe, it, expect } from 'vitest';
import { isAnalyticsEnabled, readSignals, type AnalyticsSignals } from './guard';

// A "real production user" baseline; each case flips exactly one signal.
const realUser: AnalyticsSignals = {
  dev: false,
  e2e: false,
  webdriver: false,
  hostname: 'toytoolsapp.com',
};

describe('isAnalyticsEnabled', () => {
  it('Case 1: DEV mode → disabled', () => {
    expect(isAnalyticsEnabled({ ...realUser, dev: true })).toBe(false);
  });

  it('Case 2: PUBLIC_E2E=true → disabled', () => {
    expect(isAnalyticsEnabled({ ...realUser, e2e: true })).toBe(false);
  });

  it('Case 3: navigator.webdriver=true → disabled', () => {
    expect(isAnalyticsEnabled({ ...realUser, webdriver: true })).toBe(false);
  });

  it('Case 4: localhost hostname → disabled', () => {
    expect(isAnalyticsEnabled({ ...realUser, hostname: 'localhost' })).toBe(false);
  });

  it('Case 5: 127.0.0.1 hostname → disabled', () => {
    expect(isAnalyticsEnabled({ ...realUser, hostname: '127.0.0.1' })).toBe(false);
  });

  it('Case 6: production real browser → enabled', () => {
    expect(isAnalyticsEnabled(realUser)).toBe(true);
  });

  it('treats a null hostname (SSR) as non-local', () => {
    expect(isAnalyticsEnabled({ ...realUser, hostname: null })).toBe(true);
  });

  it('disables when several signals trip at once', () => {
    expect(
      isAnalyticsEnabled({ dev: true, e2e: true, webdriver: true, hostname: 'localhost' }),
    ).toBe(false);
  });
});

describe('readSignals', () => {
  it('never throws and returns a well-formed shape under the test environment', () => {
    const signals = readSignals();
    expect(typeof signals.dev).toBe('boolean');
    expect(typeof signals.e2e).toBe('boolean');
    expect(typeof signals.webdriver).toBe('boolean');
    // jsdom/node: hostname is either a string or null, never undefined.
    expect(signals.hostname === null || typeof signals.hostname === 'string').toBe(true);
  });
});
