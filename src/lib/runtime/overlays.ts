// Triggers for the interaction-loaded overlay chunk (command palette, shortcut help).
//
// This is the ONLY part that ships on every page, so it is deliberately just listeners plus one
// dynamic import. The chunk itself (src/lib/palette.ts) is fetched the first time someone actually
// reaches for search, and never otherwise.
//
// It lives here rather than in the inline runtime half because `<script is:inline>` cannot use a
// bundler import. The cost is that these listeners attach when the deferred module runs rather than
// during parse; the nav search is a real link to /search/, so a click landing in that window
// navigates instead of opening the palette, which is a correct outcome either way.

let chunk: Promise<typeof import('../palette')> | null = null;

function overlays() {
  chunk ??= import('../palette');
  return chunk;
}

function isTyping(el: Element | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

export function attachOverlays(): void {
  // The nav search is an <a href="/search/">, so it works with no JS at all. Intercepting the
  // click is the enhancement, not the mechanism.
  document.addEventListener('click', (e) => {
    const el = e.target as HTMLElement | null;
    if (el?.closest?.('[data-palette-open]')) {
      e.preventDefault();
      void overlays().then((m) => m.openPalette());
      return;
    }
    // The footer link exists because a shortcut whose only trigger is a shortcut helps nobody.
    if (el?.closest?.('[data-shortcuts-open]')) {
      e.preventDefault();
      void overlays().then((m) => m.openHelp());
    }
  });

  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd+K works even while typing: it is the one shortcut people expect to interrupt them.
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      void overlays().then((m) => m.openPalette());
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey || isTyping(document.activeElement)) return;
    if (e.key === '/') {
      e.preventDefault();
      void overlays().then((m) => m.openPalette());
    } else if (e.key === '?') {
      e.preventDefault();
      void overlays().then((m) => m.openHelp());
    }
  });
}
