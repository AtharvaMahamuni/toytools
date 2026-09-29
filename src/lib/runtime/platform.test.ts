// @vitest-environment happy-dom
//
// The GA bootstrap end to end, as far as it can run without gtag.js: the guard is forced open (as
// on toytoolsapp.com), the page sits on an address carrying URL-state inputs, and the dataLayer
// commands platform.ts queues are what gtag.js would read. The three live eq_* events must still
// fire through TT.track, and the config every hit inherits must carry no query or hash.
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

vi.mock('@lib/analytics/guard', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@lib/analytics/guard')>()),
  analyticsEnabled: true,
  serviceWorkerEnabled: false,
}));

import { attachPlatform } from './platform';
import { GA_MEASUREMENT_ID } from '@lib/analytics/guard';
import type { ToyToolsGlobal } from './types';

const PAGE = 'https://toytoolsapp.com/tool/audio/equalizer-presets/';
const REFERRER = 'https://toytoolsapp.com/tool/finance/loan-emi-calculator/?amount=900000&rate=8#x';

type Win = Window & { dataLayer?: IArguments[]; happyDOM?: { setURL(url: string): void } };
const w = window as unknown as Win;

let TT: ToyToolsGlobal;
let appended: Node[];
const commands = () => (w.dataLayer ?? []).map((args) => Array.from(args));

beforeAll(() => {
  w.happyDOM!.setURL(`${PAGE}?preset=bass&gain=3#share`);
  Object.defineProperty(document, 'referrer', { configurable: true, get: () => REFERRER });
  appended = [];
  // Never let the test runner fetch gtag.js; record the tag instead.
  vi.spyOn(document.head, 'appendChild').mockImplementation(<T extends Node>(node: T): T => {
    appended.push(node);
    return node;
  });
  TT = {};
  attachPlatform(TT);
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('attachPlatform with analytics enabled', () => {
  it('configures GA with page_location = origin + pathname, never the query or hash', () => {
    const config = commands().find((c) => c[0] === 'config');
    expect(config).toEqual([
      'config',
      GA_MEASUREMENT_ID,
      { page_location: PAGE, page_referrer: 'https://toytoolsapp.com/tool/finance/loan-emi-calculator/' },
    ]);
  });

  it('queues no command that carries the address query anywhere', () => {
    const serialized = JSON.stringify(commands());
    expect(serialized).not.toContain('preset=bass');
    expect(serialized).not.toContain('amount=900000');
    expect(serialized).not.toContain('#share');
  });

  it('loads gtag.js for the measurement id', () => {
    const script = appended.find((n) => (n as HTMLScriptElement).tagName === 'SCRIPT') as HTMLScriptElement;
    expect(script.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  });

  it('still fires the three live eq_* events, unchanged, through TT.track', () => {
    TT.track!('eq_preset_selected', { preset: 'bass' });
    TT.track!('eq_preset_shared', { via: 'link' });
    TT.track!('eq_image_generated', {});
    const events = commands().filter((c) => c[0] === 'event');
    expect(events).toEqual([
      ['event', 'eq_preset_selected', { preset: 'bass' }],
      ['event', 'eq_preset_shared', { via: 'link' }],
      ['event', 'eq_image_generated', {}],
    ]);
    // An event carries no location of its own, so it inherits the stripped config above.
    for (const e of events) expect(JSON.stringify(e)).not.toContain('page_location');
  });

  it('pins replaceState so gtag.js cannot wrap it, while URL-state writes still work', () => {
    const wrapper = vi.fn();
    (window.history as unknown as { replaceState: unknown }).replaceState = wrapper;
    window.history.replaceState(null, '', `${PAGE}?preset=treble`);
    expect(wrapper).not.toHaveBeenCalled();
    expect(location.search).toBe('?preset=treble');
  });
});
