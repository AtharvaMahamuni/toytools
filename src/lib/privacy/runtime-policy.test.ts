// @vitest-environment happy-dom
//
// The storage policy lives in the inline half of the runtime (src/components/ToyToolsRuntime.astro),
// which ships as plain script in every page. This evaluates that exact script, so the test pins the
// code visitors run rather than a copy of it.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Window } from 'happy-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const source = readFileSync(path.resolve(__dirname, '../../components/ToyToolsRuntime.astro'), 'utf8');
const inline = /<script is:inline>([\s\S]*?)<\/script>/.exec(source)?.[1] ?? '';

interface Runtime {
  state: {
    ephemeral: boolean;
    save(id: string, data: unknown, keep?: string[]): boolean;
    load(id: string, keep?: string[]): Record<string, unknown> | null;
  };
  url: { write(values: Record<string, string>): void };
  history: {
    get(key: string): { input: string }[];
    push(key: string, item: { input: string }): { input: string }[];
    clear(key: string): void;
  };
  profile: {
    KEY: string;
    get(): Record<string, unknown>;
    merge(values: Record<string, unknown>): Record<string, unknown>;
    setDerived(name: string, value: unknown): void;
  };
}

/**
 * The tab: each boot() is a page load in it, a fresh happy-dom Window with its own document and
 * listeners. The origin's storage is shared across loads, and window.name carries over, the way a
 * same-tab navigation behaves.
 */
let page: Window | null = null;
let tabName = '';

function boot(ephemeral: boolean): Runtime {
  if (page) tabName = page.name;
  const win = new Window({ url: 'https://toytoolsapp.com/' }) as unknown as globalThis.Window;
  win.name = tabName;
  if (ephemeral) win.document.documentElement.setAttribute('data-ephemeral', '');
  const w = win as unknown as { ToyTools?: Runtime };
  new Function('window', 'document', 'localStorage', 'sessionStorage', inline)(win, win.document, localStorage, sessionStorage);
  page = win;
  return w.ToyTools!;
}

/** The current page's window.name. */
const name = () => page!.name;

function pill(init: MouseEventInit = {}) {
  const doc = page!.document;
  const a = doc.createElement('a');
  a.className = 'group-pill';
  a.href = '#';
  doc.body.appendChild(a);
  a.addEventListener('click', (e) => e.preventDefault());
  a.dispatchEvent(new (page as unknown as typeof globalThis).MouseEvent('click', { bubbles: true, cancelable: true, ...init }));
  a.remove();
}

const stored = (id: string) => JSON.parse(localStorage.getItem(`toytools:${id}`) ?? 'null');

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  page = null;
  tabName = '';
});

describe('ToyTools.state on a private page', () => {
  it('found the inline script', () => {
    expect(inline).toContain('TT.state');
  });

  it('writes only the fields named in keep', () => {
    const TT = boot(true);
    expect(TT.state.ephemeral).toBe(true);
    expect(TT.state.save('base64-encoder-decoder', { input: 'secret', mode: 'decode' }, ['mode'])).toBe(true);
    expect(stored('base64-encoder-decoder')).toEqual({ v: 1, data: { mode: 'decode' } });
  });

  it('removes the key when nothing in the data is an option', () => {
    const TT = boot(true);
    localStorage.setItem('toytools:age-calculator', JSON.stringify({ v: 1, data: { fields: { dob: '1990-01-01' } } }));
    TT.state.save('age-calculator', { fields: { dob: '2000-01-01' } });
    expect(localStorage.getItem('toytools:age-calculator')).toBeNull();
    TT.state.save('sha256-hash-generator', { input: 'pw' }, ['mode']);
    expect(localStorage.getItem('toytools:sha256-hash-generator')).toBeNull();
  });

  it('writes no record when the kept fields are empty', () => {
    const TT = boot(true);
    localStorage.setItem('toytools:age-calculator', JSON.stringify({ v: 1, data: { opts: {} } }));
    TT.state.save('age-calculator', { fields: { birthDate: '2000-01-31' }, opts: {} }, ['opts']);
    expect(localStorage.getItem('toytools:age-calculator')).toBeNull();
    TT.state.save('x', { list: [], mode: 'a' }, ['list', 'mode']);
    expect(stored('x')).toEqual({ v: 1, data: { mode: 'a' } });
    TT.state.save('y', { opts: { unit: 'metric' } }, ['opts']);
    expect(stored('y')).toEqual({ v: 1, data: { opts: { unit: 'metric' } } });
  });

  it('returns only kept fields, even from an envelope an older build wrote', () => {
    localStorage.setItem('toytools:qr-code-generator', JSON.stringify({ v: 1, data: { options: { errorLevel: 'H' }, input: 'Wi-Fi pw' } }));
    const TT = boot(true);
    expect(TT.state.load('qr-code-generator', ['options'])).toEqual({ options: { errorLevel: 'H' } });
    expect(TT.state.load('qr-code-generator')).toBeNull();
  });

  it('keeps the body profile out of storage', () => {
    localStorage.setItem('toytools:profile:body', JSON.stringify({ unit: 'metric', weight: 80 }));
    const TT = boot(true);
    expect(TT.profile.get()).toEqual({});
    localStorage.removeItem(TT.profile.KEY);
    TT.profile.merge({ unit: 'metric', weight: 70 });
    TT.profile.setDerived('tdee', 2400);
    expect(localStorage.getItem(TT.profile.KEY)).toBeNull();
  });
});

describe('ToyTools.state on a data tool page', () => {
  it('saves and loads the whole envelope as before', () => {
    const TT = boot(false);
    expect(TT.state.ephemeral).toBe(false);
    const data = { habits: [{ name: 'Run', done: ['2026-10-06'] }] };
    TT.state.save('habit-tracker', data, ['ignored']);
    expect(stored('habit-tracker')).toEqual({ v: 1, data });
    expect(TT.state.load('habit-tracker')).toEqual(data);
  });

  it('still keeps the body profile', () => {
    const TT = boot(false);
    TT.profile.merge({ unit: 'metric', weight: 70 });
    expect(JSON.parse(localStorage.getItem(TT.profile.KEY)!)).toMatchObject({ unit: 'metric', weight: 70 });
  });
});

describe('ToyTools.history (Recent conversions)', () => {
  it('lives in memory: deduped, newest first, capped at 5, never in any storage', () => {
    const TT = boot(true);
    for (const input of ['a', 'b', 'c', 'd', 'e', 'f', 'b']) TT.history.push('group:encoders', { input });
    expect(TT.history.get('group:encoders').map((e) => e.input)).toEqual(['b', 'f', 'e', 'd', 'c']);
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });

  it('is gone when the page loads again, and clear empties it', () => {
    let TT = boot(false);
    TT.history.push('k', { input: 'x' });
    expect(TT.history.get('k')).toHaveLength(1);
    TT.history.clear('k');
    expect(TT.history.get('k')).toEqual([]);
    TT.history.push('k', { input: 'y' });
    TT = boot(false);
    expect(TT.history.get('k')).toEqual([]);
  });

  it('hands out copies, so a caller cannot edit the list in place', () => {
    const TT = boot(true);
    TT.history.push('k', { input: 'x' });
    TT.history.get('k').push({ input: 'z' });
    expect(TT.history.get('k')).toHaveLength(1);
  });
});

describe('group hand-off (text follows a switcher pill, never storage)', () => {
  it('carries group input to the next page on a plain pill click, then forgets it', () => {
    let TT = boot(true);
    TT.state.save('group:encoders', { input: 'Hello World' });
    TT.state.save('base64-encoder-decoder', { mode: 'decode', input: 'x' }, ['mode']);
    expect(localStorage.getItem('toytools:group:encoders')).toBeNull();
    pill();
    expect(name().startsWith('tt:')).toBe(true);
    expect(name()).not.toContain('decode');

    TT = boot(true); // the sibling page
    expect(name()).toBe('');
    expect(TT.state.load('group:encoders')).toEqual({ input: 'Hello World' });
    expect(localStorage.getItem('toytools:group:encoders')).toBeNull();

    TT = boot(true); // a reload of it
    expect(TT.state.load('group:encoders')).toBeNull();
  });

  it('writes nothing on a modified click (new tab) or a click elsewhere', () => {
    const TT = boot(true);
    TT.state.save('group:hash-generators', { input: 'pw' });
    pill({ ctrlKey: true });
    pill({ metaKey: true });
    pill({ button: 1 });
    page!.document.body.click();
    expect(name()).toBe('');
  });

  it('Clear drops the text from the hand-off', () => {
    let TT = boot(true);
    TT.state.save('group:encoders', { input: 'Hello' });
    TT.state.clear('group:encoders');
    pill();
    TT = boot(true);
    expect(TT.state.load('group:encoders')).toBeNull();
  });

  it('is inert on a data tool page, which saves group state the usual way', () => {
    const TT = boot(false);
    TT.state.save('group:encoders', { input: 'Hello' });
    pill();
    expect(name()).toBe('');
    expect(stored('group:encoders')).toEqual({ v: 1, data: { input: 'Hello' } });
  });

  it('ignores a window.name it did not write', () => {
    tabName = 'some-frame';
    const TT = boot(true);
    expect(name()).toBe('some-frame');
    expect(TT.state.load('group:encoders')).toBeNull();
    page!.name = 'tt:{broken';
    expect(() => boot(true)).not.toThrow();
    expect(name()).toBe('');
  });
});

describe('ToyTools.url.write (auto URL sync)', () => {
  beforeEach(() => { vi.useFakeTimers(); history.replaceState(null, '', '/tool/x/'); });
  afterEach(() => { vi.useRealTimers(); history.replaceState(null, '', '/'); });

  it('never writes typed values into the address bar on a private page', () => {
    const TT = boot(true);
    TT.url.write({ birthDate: '2000-01-31' });
    vi.advanceTimersByTime(1000);
    expect(location.search).toBe('');
  });

  it('still syncs on a page that is not private', () => {
    const TT = boot(false);
    TT.url.write({ principal: '5000' });
    vi.advanceTimersByTime(1000);
    expect(location.search).toBe('?principal=5000');
  });
});
