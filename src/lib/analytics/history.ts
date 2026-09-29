// Keep URL-state writes out of Google Analytics' history-change page views.
//
// With GA4 enhanced measurement's "page changes based on browser history events" switched on (it
// is on for G-WHD7CL44MX), gtag.js replaces `history.replaceState` with a wrapper and sends a
// page_view for every URL change it sees. That page_view does NOT use the page_location configured
// in platform.ts: gtag builds it from the live address, so it carries the query string, which for
// an auto URL-state tool is the user's inputs (verified against the live gtag.js; see
// docs/analytics.md).
//
// The site only ever calls replaceState to keep inputs in the address (TT.url.write, the search
// page, keep-screen-awake, the install prompt's cleanup); it never navigates with the History API.
// So a replaceState page view is never a real page view, and there is nothing to lose by keeping
// gtag's wrapper off it. This pins `history.replaceState` to the browser's own implementation as
// an accessor whose setter ignores assignment, BEFORE gtag.js loads. Every caller still gets the
// native method, so the address bar, reload and back behave exactly as before; gtag's wrapper is
// simply never installed.
//
// This is defence in depth, not the fix. It cannot reach popstate, back/forward-cache restores or a
// future pushState, which gtag also turns into page views from the live address. The complete fix
// is switching that enhanced-measurement setting off in GA admin.

/** The slice of `History` this needs; a plain object in tests. */
export interface ReplaceStateHost {
  replaceState: (...args: never[]) => void;
}

/**
 * Pin `host.replaceState` to `native` (the browser's `History.prototype.replaceState`) and make
 * later assignments no-ops. Returns true when the pin is in place. Never throws: if the browser
 * refuses, nothing changes.
 */
export function pinReplaceState(host: ReplaceStateHost, native: ReplaceStateHost['replaceState']): boolean {
  try {
    Object.defineProperty(host, 'replaceState', {
      configurable: true,
      get: () => native,
      // gtag.js assigns its page-view wrapper here; ignore it.
      set() {},
    });
    return true;
  } catch {
    return false;
  }
}
