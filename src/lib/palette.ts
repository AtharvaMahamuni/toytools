/**
 * The interaction-loaded overlay chunk: a modal primitive, the command palette, and the keyboard
 * shortcut help.
 *
 * None of this exists until a visitor asks for it (clicks the nav search, presses "/", Ctrl/Cmd+K
 * or "?"). That is the whole point: the worst tool page has roughly 4K of gzipped JS headroom on
 * the critical path, and this plus the index is more than that. Loading it on interaction keeps
 * every page's load cost at zero and moves the bytes to a moment where a short wait is expected.
 * Its size is capped separately by scripts/check-budget.ts (INTERACTION_ASSETS).
 *
 * Nothing here may import the registry: see src/lib/search/types.ts.
 */

import { rankEntries } from './search/rank';
import { entryUrl, entryCategory, type ClientIndex, type SearchEntry } from './search/types';

// /search/ and /404/ import these from here rather than from ./search/rank directly. That keeps
// every consumer on ONE chunk, so the ceiling in check-budget measures all of this code instead of
// whichever slice Rollup happened to leave behind after splitting.
export { rankEntries } from './search/rank';
export { entryUrl, entryCategory } from './search/types';

const MAX_RESULTS = 8;

// ── Modal primitive ────────────────────────────────────────────────────────────────────────────
// Everything a modal must do and usually does not: focus moves in, Tab stays in, Esc closes, focus
// returns to whatever opened it, and the page behind goes inert so assistive tech cannot wander
// into it. Presentation (centred dialog vs bottom sheet) is CSS; this owns behaviour only.

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
  'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

let openEl: HTMLElement | null = null;
let lastFocus: Element | null = null;
let backdrop: HTMLElement | null = null;

function focusableIn(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
}

function setInert(on: boolean): void {
  const main = document.querySelector('main');
  if (main && 'inert' in HTMLElement.prototype) (main as HTMLElement).inert = on;
}

function onSheetKeydown(e: KeyboardEvent): void {
  if (!openEl) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeSheet();
    return;
  }
  if (e.key !== 'Tab') return;
  const items = focusableIn(openEl);
  if (!items.length) return;
  const first = items[0]!;
  const last = items[items.length - 1]!;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function ensureBackdrop(): HTMLElement {
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'tt-sheet-backdrop';
    backdrop.addEventListener('click', () => closeSheet());
    document.body.appendChild(backdrop);
  }
  return backdrop;
}

export function openSheet(el: HTMLElement, focusTarget?: HTMLElement): void {
  if (openEl === el) return;
  if (openEl) closeSheet();
  lastFocus = document.activeElement;
  ensureBackdrop().classList.add('tt-visible');
  el.hidden = false;
  el.classList.add('tt-sheet-open');
  el.setAttribute('aria-modal', 'true');
  document.body.classList.add('tt-sheet-lock');
  setInert(true);
  openEl = el;
  document.addEventListener('keydown', onSheetKeydown, true);
  (focusTarget ?? focusableIn(el)[0])?.focus();
}

export function closeSheet(): void {
  if (!openEl) return;
  const el = openEl;
  openEl = null;
  document.removeEventListener('keydown', onSheetKeydown, true);
  el.classList.remove('tt-sheet-open');
  el.hidden = true;
  el.removeAttribute('aria-modal');
  document.body.classList.remove('tt-sheet-lock');
  setInert(false);
  backdrop?.classList.remove('tt-visible');
  // Returning focus is what stops a keyboard user being dumped at the top of the page.
  if (lastFocus instanceof HTMLElement) lastFocus.focus();
  lastFocus = null;
}

// ── Index loading ──────────────────────────────────────────────────────────────────────────────

let indexPromise: Promise<ClientIndex | null> | null = null;

export function loadIndex(): Promise<ClientIndex | null> {
  if (!indexPromise) {
    // A bundled module, so Vite inlines BASE_URL at build time (empty locally, "/toytools/" under
    // a base path). withBase() is a server function and must not be called from here.
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    indexPromise = fetch(`${base}/search-index.json`)
      .then((r) => (r.ok ? (r.json() as Promise<ClientIndex>) : null))
      .catch(() => null);
  }
  return indexPromise;
}

// ── Recents and favourites, read straight from storage ─────────────────────────────────────────
// The palette's empty state is only useful if it shows what this person actually uses. Both lists
// are written elsewhere (the inline runtime); reading them here keeps the chunk self-contained.

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed)
      ? parsed.map((v) => (typeof v === 'string' ? v : v?.slug)).filter((v): v is string => !!v)
      : [];
  } catch {
    return [];
  }
}

function suggestions(index: ClientIndex): { entry: SearchEntry; hint: string }[] {
  const bySlug = new Map(index.t.map((e) => [e.s, e]));
  const out: { entry: SearchEntry; hint: string }[] = [];
  const seen = new Set<string>();
  const push = (slugs: string[], hint: string) => {
    for (const slug of slugs) {
      const entry = bySlug.get(slug);
      if (entry && !seen.has(slug)) {
        seen.add(slug);
        out.push({ entry, hint });
      }
    }
  };
  push(readList('toytools:favorites'), 'Favourite');
  push(readList('toytools:recent-tools'), 'Recent');
  return out.slice(0, MAX_RESULTS);
}

// ── Command palette ────────────────────────────────────────────────────────────────────────────

interface Palette {
  root: HTMLElement;
  input: HTMLInputElement;
  list: HTMLElement;
  status: HTMLElement;
}

let palette: Palette | null = null;
let active = -1;
let rendered: SearchEntry[] = [];

function buildPalette(): Palette {
  const root = document.createElement('div');
  root.className = 'tt-sheet tt-palette';
  root.id = 'tt-palette';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', 'Search tools');

  root.innerHTML = `
    <div class="tt-palette-head">
      <input type="search" class="tt-palette-input" id="tt-palette-input"
             placeholder="Search tools" autocomplete="off" autocapitalize="off"
             autocorrect="off" spellcheck="false" enterkeyhint="go"
             role="combobox" aria-expanded="true" aria-controls="tt-palette-list"
             aria-autocomplete="list" aria-label="Search tools" />
    </div>
    <ul class="tt-palette-list" id="tt-palette-list" role="listbox" aria-label="Results"></ul>
    <p class="tt-palette-status" role="status" aria-live="polite"></p>
  `;
  document.body.appendChild(root);

  const p: Palette = {
    root,
    input: root.querySelector('.tt-palette-input')!,
    list: root.querySelector('.tt-palette-list')!,
    status: root.querySelector('.tt-palette-status')!,
  };

  p.input.addEventListener('input', () => {
    void render(p.input.value);
  });
  p.input.addEventListener('keydown', onPaletteKeydown);
  p.list.addEventListener('click', (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('[data-url]');
    if (li) {
      e.preventDefault();
      go(li.dataset.url!);
    }
  });

  return p;
}

function go(url: string): void {
  closeSheet();
  window.location.href = url;
}

function onPaletteKeydown(e: KeyboardEvent): void {
  if (!palette) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!rendered.length) return;
    const delta = e.key === 'ArrowDown' ? 1 : -1;
    active = (active + delta + rendered.length) % rendered.length;
    paintActive();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const items = [...palette.list.querySelectorAll<HTMLElement>('[data-url]')];
    const target = items[active] ?? items[0];
    if (target) go(target.dataset.url!);
  }
}

function paintActive(): void {
  if (!palette) return;
  const items = [...palette.list.querySelectorAll<HTMLElement>('[data-url]')];
  items.forEach((li, i) => {
    const on = i === active;
    li.classList.toggle('is-active', on);
    li.setAttribute('aria-selected', on ? 'true' : 'false');
    if (on) {
      palette!.input.setAttribute('aria-activedescendant', li.id);
      li.scrollIntoView({ block: 'nearest' });
    }
  });
  if (active < 0) palette.input.removeAttribute('aria-activedescendant');
}

async function render(query: string): Promise<void> {
  if (!palette) return;
  const index = await loadIndex();
  if (!index) {
    palette.status.textContent = 'Search is unavailable offline. Browse tools from the home page.';
    return;
  }

  const trimmed = query.trim();
  let hints: string[] = [];
  if (trimmed) {
    rendered = rankEntries(index.t, trimmed, MAX_RESULTS);
    hints = rendered.map((e) => entryCategory(index, e));
  } else {
    const picks = suggestions(index);
    rendered = picks.map((p) => p.entry);
    hints = picks.map((p) => p.hint);
  }

  palette.list.innerHTML = rendered
    .map((entry, i) => {
      const url = entryUrl(index, entry);
      return `<li id="tt-palette-opt-${i}" role="option" aria-selected="false" data-url="${url}">
        <span class="tt-palette-name">${escapeHtml(entry.n)}</span>
        <span class="tt-palette-hint">${escapeHtml(hints[i] ?? '')}</span>
      </li>`;
    })
    .join('');

  active = rendered.length ? 0 : -1;
  paintActive();

  if (trimmed && !rendered.length) {
    palette.status.innerHTML =
      `No tool matches “${escapeHtml(trimmed)}”. ` +
      `<a href="${index.b}/feedback/?type=new&q=${encodeURIComponent(trimmed)}">Suggest it</a>`;
  } else if (!trimmed && !rendered.length) {
    palette.status.textContent = 'Type to search every tool.';
  } else {
    palette.status.textContent = `${rendered.length} result${rendered.length === 1 ? '' : 's'}`;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function openPalette(): void {
  palette ??= buildPalette();
  palette.input.value = '';
  void render('');
  openSheet(palette.root, palette.input);
}

// ── Shortcut help ──────────────────────────────────────────────────────────────────────────────

const SHORTCUTS: [string, string][] = [
  ['/ or Ctrl K', 'Search every tool'],
  ['?', 'Show this list'],
  ['Esc', 'Close this, or leave the field you are typing in'],
  ['Ctrl Shift C', 'Copy the result'],
  ['Ctrl Shift X', 'Clear the input'],
];

let help: HTMLElement | null = null;

export function openHelp(): void {
  if (!help) {
    help = document.createElement('div');
    help.className = 'tt-sheet tt-help';
    help.hidden = true;
    help.setAttribute('role', 'dialog');
    help.setAttribute('aria-label', 'Keyboard shortcuts');
    help.innerHTML =
      '<h2 class="tt-help-title">Keyboard shortcuts</h2><dl class="tt-help-list">' +
      SHORTCUTS.map(([keys, what]) =>
        `<div class="tt-help-row"><dt>${keys.split(' ').map((k) => `<kbd>${escapeHtml(k)}</kbd>`).join(' ')}</dt>` +
        `<dd>${escapeHtml(what)}</dd></div>`).join('') +
      '</dl><button type="button" class="tt-help-close">Close</button>';
    help.querySelector('.tt-help-close')!.addEventListener('click', () => closeSheet());
    document.body.appendChild(help);
  }
  openSheet(help);
}
