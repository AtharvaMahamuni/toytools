// @vitest-environment happy-dom
//
// The GA bootstrap with the guard really CLOSED: nothing about @lib/analytics/guard is mocked.
// Each case sets the page address (and, for the framed case, window.top), then imports a fresh
// guard + platform so the guard resolves from those signals exactly as in a browser.
//
// happy-dom reports DEV=true and navigator.webdriver=true, either of which would close the guard
// on its own and make these cases pass for the wrong reason. Both are neutralised, and a control
// case on toytoolsapp.com in the top window proves the guard opens under the same setup, so the
// host or the frame is the only thing that closes it in the other cases.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ToyToolsGlobal } from './types';

type Win = Window & {
  dataLayer?: unknown;
  gtag?: unknown;
  happyDOM: { setURL(url: string): void };
};
const w = window as unknown as Win;
const originalTop = Object.getOwnPropertyDescriptor(window, 'top');
const originalWebdriver = Object.getOwnPropertyDescriptor(navigator, 'webdriver');

let appended: Node[];

interface Loaded {
  analyticsEnabled: boolean;
  TT: ToyToolsGlobal;
}

async function load(url: string, opts: { framed?: boolean } = {}): Promise<Loaded> {
  w.happyDOM.setURL(url);
  if (opts.framed) {
    const parent = {};
    Object.defineProperty(window, 'top', { configurable: true, get: () => parent });
  }
  vi.resetModules();
  const guard = await import('@lib/analytics/guard');
  const { attachPlatform } = await import('./platform');
  const TT: ToyToolsGlobal = {};
  attachPlatform(TT);
  return { analyticsEnabled: guard.analyticsEnabled, TT };
}

function expectNothingLoaded(TT: ToyToolsGlobal): void {
  expect(w.dataLayer).toBeUndefined();
  expect(w.gtag).toBeUndefined();
  expect(appended.filter((n) => (n as Element).tagName === 'SCRIPT')).toEqual([]);
  expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();

  // replaceState is untouched: no own accessor on history, and assignment still lands.
  expect(Object.getOwnPropertyDescriptor(window.history, 'replaceState')).toBeUndefined();
  const replacement = vi.fn();
  (window.history as unknown as { replaceState: unknown }).replaceState = replacement;
  expect(window.history.replaceState).toBe(replacement);
  delete (window.history as unknown as { replaceState?: unknown }).replaceState;

  // TT.track exists and does nothing: no throw, no dataLayer, no gtag.
  expect(typeof TT.track).toBe('function');
  expect(TT.track!('eq_preset_selected', { preset: 'bass' })).toBeUndefined();
  expect(w.dataLayer).toBeUndefined();
  expect(w.gtag).toBeUndefined();
}

beforeEach(() => {
  vi.stubEnv('DEV', false);
  vi.stubEnv('PUBLIC_E2E', 'false');
  Object.defineProperty(navigator, 'webdriver', { configurable: true, get: () => false });
  appended = [];
  // Never let the test runner fetch gtag.js; record the tag instead.
  vi.spyOn(document.head, 'appendChild').mockImplementation(<T extends Node>(node: T): T => {
    appended.push(node);
    return node;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  if (originalWebdriver) Object.defineProperty(navigator, 'webdriver', originalWebdriver);
  else delete (navigator as unknown as { webdriver?: unknown }).webdriver;
  if (originalTop) Object.defineProperty(window, 'top', originalTop);
  delete w.dataLayer;
  delete w.gtag;
  delete (window.history as unknown as { replaceState?: unknown }).replaceState;
});

describe('attachPlatform with the guard closed', () => {
  it('control: the same setup on toytoolsapp.com in the top window opens the guard and loads GA', async () => {
    const { analyticsEnabled } = await load('https://toytoolsapp.com/tool/audio/equalizer-presets/');
    expect(analyticsEnabled).toBe(true);
    expect(Array.isArray(w.dataLayer)).toBe(true);
    expect(appended.some((n) => (n as HTMLScriptElement).src?.includes('googletagmanager'))).toBe(true);
  });

  it('loads nothing on a non-production host', async () => {
    const { analyticsEnabled, TT } = await load('https://atharvamahamuni.github.io/toytools/tool/audio/equalizer-presets/');
    expect(analyticsEnabled).toBe(false);
    expectNothingLoaded(TT);
  });

  it('loads nothing when framed, even on toytoolsapp.com', async () => {
    const { analyticsEnabled, TT } = await load('https://toytoolsapp.com/tool/audio/equalizer-presets/', { framed: true });
    expect(analyticsEnabled).toBe(false);
    expectNothingLoaded(TT);
  });
});
