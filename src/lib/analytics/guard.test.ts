import { describe, it, expect } from 'vitest';
import {
  isAnalyticsEnabled,
  isFramed,
  isProductionHostname,
  isServiceWorkerEnabled,
  readSignals,
  analyticsEnabled,
  type AnalyticsSignals,
} from './guard';
import { SITE } from '@config/site';

// A "real production user" baseline; each case flips exactly one signal.
const realUser: AnalyticsSignals = {
  dev: false,
  e2e: false,
  webdriver: false,
  hostname: 'toytoolsapp.com',
  framed: false,
};

describe('isAnalyticsEnabled: the production allowlist', () => {
  it('enables a real browser on the apex production host', () => {
    expect(isAnalyticsEnabled(realUser)).toBe(true);
  });

  it('enables a real browser on www', () => {
    expect(isAnalyticsEnabled({ ...realUser, hostname: 'www.toytoolsapp.com' })).toBe(true);
  });

  it('reads the allowlist from the site identity constant, and only those two hosts', () => {
    expect([...SITE.productionHostnames]).toEqual(['toytoolsapp.com', 'www.toytoolsapp.com']);
    for (const host of SITE.productionHostnames) {
      expect(isAnalyticsEnabled({ ...realUser, hostname: host })).toBe(true);
    }
  });

  it('disables any other host', () => {
    expect(isAnalyticsEnabled({ ...realUser, hostname: 'example.com' })).toBe(false);
  });

  it('disables a GitHub Pages preview or mirror host', () => {
    expect(isAnalyticsEnabled({ ...realUser, hostname: 'atharvamahamuni.github.io' })).toBe(false);
  });

  it('disables a preview subdomain of the production host', () => {
    expect(isAnalyticsEnabled({ ...realUser, hostname: 'pr-235.toytoolsapp.com' })).toBe(false);
  });

  it('disables lookalikes that only contain the production host', () => {
    expect(isAnalyticsEnabled({ ...realUser, hostname: 'toytoolsapp.com.evil.test' })).toBe(false);
    expect(isAnalyticsEnabled({ ...realUser, hostname: 'nottoytoolsapp.com' })).toBe(false);
  });

  it('disables inside any iframe, even on the production host', () => {
    expect(isAnalyticsEnabled({ ...realUser, framed: true })).toBe(false);
  });

  it('disables on localhost', () => {
    expect(isAnalyticsEnabled({ ...realUser, hostname: 'localhost' })).toBe(false);
  });

  it('disables on 127.0.0.1', () => {
    expect(isAnalyticsEnabled({ ...realUser, hostname: '127.0.0.1' })).toBe(false);
  });

  it('disables with PUBLIC_E2E=true, even on the production host', () => {
    expect(isAnalyticsEnabled({ ...realUser, e2e: true })).toBe(false);
  });

  it('disables in DEV mode', () => {
    expect(isAnalyticsEnabled({ ...realUser, dev: true })).toBe(false);
  });

  it('disables under navigator.webdriver', () => {
    expect(isAnalyticsEnabled({ ...realUser, webdriver: true })).toBe(false);
  });

  it('disables when there is no hostname (SSR)', () => {
    expect(isAnalyticsEnabled({ ...realUser, hostname: null })).toBe(false);
  });

  it('disables when several signals trip at once', () => {
    expect(
      isAnalyticsEnabled({ dev: true, e2e: true, webdriver: true, hostname: 'localhost', framed: true }),
    ).toBe(false);
  });
});

describe('isFramed', () => {
  it('is false for the top window (top === self)', () => {
    const win = {} as { top: unknown; self: unknown };
    win.top = win;
    win.self = win;
    expect(isFramed(win)).toBe(false);
  });

  it('is true for a same-origin iframe (top !== self)', () => {
    expect(isFramed({ top: {}, self: {} })).toBe(true);
  });

  it('is true when reading top throws (a cross-origin parent)', () => {
    const win = {
      self: {},
      get top(): unknown {
        throw new DOMException('Blocked a frame with origin', 'SecurityError');
      },
    };
    expect(isFramed(win)).toBe(true);
  });

  it('is false when there is no window (SSR)', () => {
    expect(isFramed(undefined)).toBe(false);
  });
});

describe('isProductionHostname', () => {
  it('matches exactly, not by suffix or case-folded lookalike', () => {
    expect(isProductionHostname('toytoolsapp.com')).toBe(true);
    expect(isProductionHostname('www.toytoolsapp.com')).toBe(true);
    expect(isProductionHostname('staging.toytoolsapp.com')).toBe(false);
    expect(isProductionHostname('')).toBe(false);
    expect(isProductionHostname(null)).toBe(false);
  });
});

describe('isServiceWorkerEnabled: follows the site host list (C3)', () => {
  it('still registers for every visitor it registered for on toytoolsapp.com', () => {
    // The apex and www in the top window: every browser tab and the installed app (standalone
    // mode is a top window too). Nobody on the real site loses a worker.
    expect(isServiceWorkerEnabled(realUser)).toBe(true);
    expect(isServiceWorkerEnabled({ ...realUser, hostname: 'www.toytoolsapp.com' })).toBe(true);
    for (const host of SITE.productionHostnames) {
      expect(isServiceWorkerEnabled({ ...realUser, hostname: host })).toBe(true);
    }
  });

  it('no longer registers on a mirror, a preview deploy or a proxy host', () => {
    for (const host of [
      'atharvamahamuni.github.io',
      'staging.toytoolsapp.com',
      'toytoolsapp-com.translate.goog',
      'example.com',
    ]) {
      expect(isServiceWorkerEnabled({ ...realUser, hostname: host })).toBe(false);
    }
    expect(isServiceWorkerEnabled({ ...realUser, hostname: null })).toBe(false);
  });

  it('no longer registers inside a frame, even on the production host (a non-page surface)', () => {
    expect(isServiceWorkerEnabled({ ...realUser, framed: true })).toBe(false);
    expect(isServiceWorkerEnabled({ ...realUser, hostname: 'www.toytoolsapp.com', framed: true })).toBe(false);
  });

  it('never registers under dev, E2E, automation or localhost', () => {
    expect(isServiceWorkerEnabled({ ...realUser, dev: true })).toBe(false);
    expect(isServiceWorkerEnabled({ ...realUser, e2e: true })).toBe(false);
    expect(isServiceWorkerEnabled({ ...realUser, webdriver: true })).toBe(false);
    expect(isServiceWorkerEnabled({ ...realUser, hostname: 'localhost' })).toBe(false);
    expect(isServiceWorkerEnabled({ ...realUser, hostname: '127.0.0.1' })).toBe(false);
  });

  it('agrees with the analytics guard on every combination of signals', () => {
    const hosts = ['toytoolsapp.com', 'www.toytoolsapp.com', 'example.com', 'localhost', null];
    for (const dev of [false, true])
      for (const e2e of [false, true])
        for (const webdriver of [false, true])
          for (const framed of [false, true])
            for (const hostname of hosts) {
              const signals = { dev, e2e, webdriver, framed, hostname };
              expect(isServiceWorkerEnabled(signals)).toBe(isAnalyticsEnabled(signals));
            }
  });
});

describe('readSignals', () => {
  it('never throws and returns a well-formed shape under the test environment', () => {
    const signals = readSignals();
    expect(typeof signals.dev).toBe('boolean');
    expect(typeof signals.e2e).toBe('boolean');
    expect(typeof signals.webdriver).toBe('boolean');
    expect(typeof signals.framed).toBe('boolean');
    // node: hostname is either a string or null, never undefined.
    expect(signals.hostname === null || typeof signals.hostname === 'string').toBe(true);
  });

  it('resolves to disabled outside production (the test runner is not toytoolsapp.com)', () => {
    expect(analyticsEnabled).toBe(false);
  });
});
