// @vitest-environment happy-dom
//
// The interaction-loaded overlay chunk: modal primitive, command palette, and shortcut help. It is
// pure DOM behaviour, so it is driven here the way a user would drive it — open the palette, type,
// arrow through results, press Enter — against a stubbed search index and a shimmed layout. happy-dom
// has no layout engine, so offsetParent is null for everything; the focus trap and focusableIn()
// depend on it, so we shim it to reflect connectedness. The module keeps singletons (palette root,
// backdrop, help, cached index), so every test re-imports a fresh copy via resetModules.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ClientIndex } from './search/types';

type Mod = typeof import('./palette');

const INDEX: ClientIndex = {
  b: '',
  g: ['text'],
  c: ['Text'],
  t: [
    { s: 'word-counter', n: 'Word Counter', g: 0, c: 0, k: ['count', 'words'] },
    { s: 'char-counter', n: 'Character Counter', g: 0, c: 0, k: ['characters', 'length'] },
    { s: 'ampersand', n: 'Fish & Chips', g: 0, c: 0, k: ['escape', 'html'] },
  ],
};

function okFetch(index: ClientIndex = INDEX) {
  return vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(structuredClone(index)) });
}

let mod: Mod;

async function load(fetchImpl = okFetch()): Promise<Mod> {
  vi.resetModules();
  vi.stubGlobal('fetch', fetchImpl);
  mod = await import('./palette');
  return mod;
}

// The palette renders asynchronously (loadIndex + render are async, fired via `void`).
const flushRender = () => vi.waitFor(() => expect(document.querySelector('.tt-palette-status')?.textContent).toBeTruthy());

function paletteEls() {
  const root = document.getElementById('tt-palette')!;
  return {
    root,
    input: root.querySelector<HTMLInputElement>('.tt-palette-input')!,
    list: root.querySelector<HTMLElement>('.tt-palette-list')!,
    status: root.querySelector<HTMLElement>('.tt-palette-status')!,
    options: () => [...root.querySelectorAll<HTMLElement>('[data-url]')],
  };
}

function type(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function keydown(el: Element, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
  const e = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, ...init });
  el.dispatchEvent(e);
  return e;
}

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '<main></main>';
  // happy-dom has no layout: offsetParent is always null, which would make every element read as
  // hidden. Reflect DOM-connectedness instead so focusableIn()/the focus trap behave.
  Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    configurable: true,
    get(this: HTMLElement) {
      return this.isConnected ? (this.parentElement ?? document.body) : null;
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('loadIndex', () => {
  it('fetches, parses, and caches the index (one network hit for repeated calls)', async () => {
    const fetchImpl = okFetch();
    await load(fetchImpl);

    const a = await mod.loadIndex();
    const b = await mod.loadIndex();

    expect(a).toEqual(INDEX);
    expect(b).toBe(a);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('resolves to null when the response is not ok', async () => {
    await load(vi.fn().mockResolvedValue({ ok: false }));
    expect(await mod.loadIndex()).toBeNull();
  });

  it('resolves to null when the fetch rejects (offline)', async () => {
    await load(vi.fn().mockRejectedValue(new Error('offline')));
    expect(await mod.loadIndex()).toBeNull();
  });
});

describe('openPalette — build and empty state', () => {
  it('builds the palette, opens the sheet, and focuses the input', async () => {
    await load();
    mod.openPalette();

    const { root, input, status } = paletteEls();
    expect(root.hidden).toBe(false);
    expect(root.getAttribute('aria-modal')).toBe('true');
    expect(document.body.classList.contains('tt-sheet-lock')).toBe(true);
    expect(document.activeElement).toBe(input);

    await vi.waitFor(() => expect(status.textContent).toBe('Type to search every tool.'));
  });

  it('shows favourites and recents (deduped) as suggestions when the query is empty', async () => {
    localStorage.setItem('toytools:favorites', JSON.stringify(['char-counter']));
    // Object-shaped recents (as the runtime writes them) and a duplicate of the favourite.
    localStorage.setItem(
      'toytools:recent-tools',
      JSON.stringify([{ slug: 'word-counter' }, { slug: 'char-counter' }]),
    );
    await load();
    mod.openPalette();
    await flushRender();

    const { list, options, status } = paletteEls();
    const names = options().map((li) => li.querySelector('.tt-palette-name')!.textContent);
    expect(names).toEqual(['Character Counter', 'Word Counter']); // favourite first, deduped
    expect(list.querySelector('.tt-palette-hint')!.textContent).toBe('Favourite');
    expect(status.textContent).toBe('2 results');
  });

  it('ignores malformed favourites/recents storage', async () => {
    localStorage.setItem('toytools:favorites', '{not json');
    localStorage.setItem('toytools:recent-tools', JSON.stringify({ not: 'an array' }));
    await load();
    mod.openPalette();
    await vi.waitFor(() =>
      expect(paletteEls().status.textContent).toBe('Type to search every tool.'),
    );
    expect(paletteEls().options()).toHaveLength(0);
  });
});

describe('openPalette — searching', () => {
  it('ranks matches, marks the first active, and reports the count', async () => {
    await load();
    mod.openPalette();
    await flushRender();

    const { input, options, status } = paletteEls();
    type(input, 'word');
    await vi.waitFor(() => expect(status.textContent).toBe('1 result'));

    const opts = options();
    expect(opts[0].querySelector('.tt-palette-name')!.textContent).toBe('Word Counter');
    expect(opts[0].getAttribute('aria-selected')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toBe(opts[0].id);
  });

  it('offers a Suggest-it link when nothing matches', async () => {
    await load();
    mod.openPalette();
    await flushRender();

    const { input, status, options } = paletteEls();
    type(input, 'zzzz-nothing');
    await vi.waitFor(() => expect(status.textContent).toContain('No tool matches'));

    expect(options()).toHaveLength(0);
    const link = status.querySelector('a')!;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('/feedback/?type=new&q=zzzz-nothing');
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('escapes HTML in entry names', async () => {
    await load();
    mod.openPalette();
    await flushRender();

    const { input, options } = paletteEls();
    type(input, 'fish');
    await vi.waitFor(() => expect(options().length).toBe(1));

    const name = options()[0].querySelector('.tt-palette-name')!;
    expect(name.textContent).toBe('Fish & Chips');
    expect(name.innerHTML).toContain('&amp;');
  });

  it('reports "Search is unavailable offline" when the index will not load', async () => {
    await load(vi.fn().mockResolvedValue({ ok: false }));
    mod.openPalette();
    await vi.waitFor(() =>
      expect(paletteEls().status.textContent).toContain('Search is unavailable offline'),
    );
  });
});

describe('palette keyboard navigation', () => {
  it('cycles the active option with ArrowDown/ArrowUp (wrapping both ends)', async () => {
    localStorage.setItem('toytools:favorites', JSON.stringify(['word-counter', 'char-counter']));
    await load();
    mod.openPalette();
    await flushRender();

    const { input, options } = paletteEls();
    const activeIdx = () => options().findIndex((li) => li.classList.contains('is-active'));
    expect(activeIdx()).toBe(0);

    keydown(input, 'ArrowDown');
    expect(activeIdx()).toBe(1);

    keydown(input, 'ArrowDown'); // wraps to the top
    expect(activeIdx()).toBe(0);

    keydown(input, 'ArrowUp'); // wraps to the bottom
    expect(activeIdx()).toBe(1);
  });

  it('does nothing on ArrowDown when there are no results', async () => {
    await load();
    mod.openPalette();
    await vi.waitFor(() => expect(paletteEls().status.textContent).toBeTruthy());

    const { input } = paletteEls();
    const e = keydown(input, 'ArrowDown');
    expect(e.defaultPrevented).toBe(true); // handled, but no crash / no active change
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('navigates to the active option on Enter', async () => {
    await load();
    mod.openPalette();
    await flushRender();

    const { input, root } = paletteEls();
    type(input, 'word');
    await vi.waitFor(() => expect(paletteEls().options().length).toBe(1));

    keydown(input, 'Enter');
    expect(window.location.href).toContain('/tool/text/word-counter/');
    expect(root.hidden).toBe(true); // go() closes the sheet first
  });

  it('navigates on a click on a result row', async () => {
    await load();
    mod.openPalette();
    await flushRender();

    const { input, options } = paletteEls();
    type(input, 'char');
    await vi.waitFor(() => expect(paletteEls().options().length).toBe(1));

    options()[0].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(window.location.href).toContain('/tool/text/char-counter/');
  });
});

describe('modal primitive — openSheet / closeSheet', () => {
  function sheetWithButtons(): { el: HTMLElement; a: HTMLButtonElement; b: HTMLButtonElement } {
    const el = document.createElement('div');
    el.hidden = true;
    const a = document.createElement('button');
    a.textContent = 'first';
    const b = document.createElement('button');
    b.textContent = 'last';
    el.append(a, b);
    document.body.appendChild(el);
    return { el, a, b };
  }

  it('opens the sheet, locks the body, marks main inert, and returns focus on close', async () => {
    await load();
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    opener.focus();

    const { el, a } = sheetWithButtons();
    mod.openSheet(el);

    expect(el.hidden).toBe(false);
    expect(el.getAttribute('aria-modal')).toBe('true');
    expect(document.body.classList.contains('tt-sheet-lock')).toBe(true);
    expect(document.activeElement).toBe(a); // first focusable
    const main = document.querySelector('main') as HTMLElement;
    if ('inert' in HTMLElement.prototype) expect(main.inert).toBe(true);

    mod.closeSheet();
    expect(el.hidden).toBe(true);
    expect(document.body.classList.contains('tt-sheet-lock')).toBe(false);
    expect(document.activeElement).toBe(opener); // focus restored
  });

  it('honours an explicit focus target', async () => {
    await load();
    const { el, b } = sheetWithButtons();
    mod.openSheet(el, b);
    expect(document.activeElement).toBe(b);
  });

  it('is a no-op when the same sheet is opened again', async () => {
    await load();
    const { el, a } = sheetWithButtons();
    mod.openSheet(el);
    a.blur();
    mod.openSheet(el); // same element → early return, no re-focus
    expect(document.activeElement).not.toBe(a);
  });

  it('closes a previously open sheet when a different one opens', async () => {
    await load();
    const first = sheetWithButtons();
    const second = sheetWithButtons();
    mod.openSheet(first.el);
    mod.openSheet(second.el);
    expect(first.el.hidden).toBe(true);
    expect(second.el.hidden).toBe(false);
  });

  it('closeSheet is a no-op when nothing is open', async () => {
    await load();
    expect(() => mod.closeSheet()).not.toThrow();
  });

  it('traps Tab focus at both ends', async () => {
    await load();
    const { el, a, b } = sheetWithButtons();
    mod.openSheet(el);

    b.focus();
    const fwd = keydown(document, 'Tab');
    expect(fwd.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(a); // last → wraps to first

    a.focus();
    const back = keydown(document, 'Tab', { shiftKey: true });
    expect(back.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(b); // first (shift) → wraps to last
  });

  it('lets Tab through when focus is mid-list', async () => {
    await load();
    const { el, a } = sheetWithButtons();
    // three buttons so the active one is neither first nor last
    const mid = document.createElement('button');
    el.insertBefore(mid, el.lastChild);
    mod.openSheet(el);

    a.focus();
    const e = keydown(document, 'Tab');
    expect(e.defaultPrevented).toBe(false); // not trapped, native tab proceeds
  });

  it('closes on Escape', async () => {
    await load();
    const { el } = sheetWithButtons();
    mod.openSheet(el);
    const e = keydown(document, 'Escape');
    expect(e.defaultPrevented).toBe(true);
    expect(el.hidden).toBe(true);
  });

  it('ignores non-Tab, non-Escape keys while open', async () => {
    await load();
    const { el } = sheetWithButtons();
    mod.openSheet(el);
    const e = keydown(document, 'a');
    expect(e.defaultPrevented).toBe(false);
    expect(el.hidden).toBe(false);
  });

  it('does not trap Tab when the sheet has no focusable items', async () => {
    await load();
    const el = document.createElement('div');
    el.hidden = true;
    el.appendChild(document.createTextNode('nothing focusable'));
    document.body.appendChild(el);
    mod.openSheet(el);
    const e = keydown(document, 'Tab');
    expect(e.defaultPrevented).toBe(false);
  });

  it('closes when the backdrop is clicked', async () => {
    await load();
    const { el } = sheetWithButtons();
    mod.openSheet(el);
    const bd = document.querySelector<HTMLElement>('.tt-sheet-backdrop')!;
    expect(bd.classList.contains('tt-visible')).toBe(true);
    bd.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(el.hidden).toBe(true);
    expect(bd.classList.contains('tt-visible')).toBe(false);
  });
});

describe('shortcut help', () => {
  it('builds the help dialog with every shortcut row and closes via the button', async () => {
    await load();
    mod.openHelp();

    const help = document.querySelector<HTMLElement>('.tt-help')!;
    expect(help.hidden).toBe(false);
    expect(help.getAttribute('aria-label')).toBe('Keyboard shortcuts');
    expect(help.querySelectorAll('.tt-help-row')).toHaveLength(5);
    expect(help.querySelectorAll('kbd').length).toBeGreaterThan(0);

    help.querySelector<HTMLButtonElement>('.tt-help-close')!.click();
    expect(help.hidden).toBe(true);
  });

  it('reuses the same help element on a second open', async () => {
    await load();
    mod.openHelp();
    const first = document.querySelector('.tt-help');
    mod.closeSheet();
    mod.openHelp();
    const second = document.querySelector('.tt-help');
    expect(second).toBe(first);
    expect(document.querySelectorAll('.tt-help')).toHaveLength(1);
  });
});
