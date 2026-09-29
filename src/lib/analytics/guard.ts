// Single source of truth for whether analytics collection, and the service worker, are allowed.
//
// Google Analytics must reflect REAL user behaviour on the REAL site only. So collection is an
// allowlist, not a blocklist: it runs only when every one of these holds:
//
//   • not local development      (import.meta.env.DEV)
//   • not an explicit E2E build   (import.meta.env.PUBLIC_E2E === 'true')
//   • not browser automation      (navigator.webdriver: Playwright, Selenium, ...)
//   • the hostname is production  (PRODUCTION_HOSTNAMES in src/config/site.ts)
//   • the page is the top window  (not framed by anyone, same origin or not)
//
// A preview deploy, a mirror, a copy of dist/ on another host, localhost and any iframe all fail
// the test, so none of them ever loads gtag.js.
//
// The service worker follows the same rule (C3, beta-v12.1.3). Until then it had its own, older
// predicate (everything except dev, E2E, automation and localhost, frames included). The reasons
// for tying it to the production allowlist, and why nobody loses a working worker, are on
// isServiceWorkerEnabled below.
//
// Everything here is defensive: the module is imported in both SSR (build) and browser contexts,
// so it must never throw when `navigator` / `location` / `window` are undefined.

import { PRODUCTION_HOSTNAMES, GA_MEASUREMENT_ID } from '@config/site';

export { GA_MEASUREMENT_ID };

/** Ambient signals that decide whether a session counts as a real user on the real site. */
export interface AnalyticsSignals {
  /** Vite/Astro dev server. */
  dev: boolean;
  /** Explicit E2E opt-out (`PUBLIC_E2E=true`). */
  e2e: boolean;
  /** `navigator.webdriver`: true under Playwright and other automation. */
  webdriver: boolean;
  /** `location.hostname`, or null when unavailable (SSR). */
  hostname: string | null;
  /** True when the page is not the top window (any iframe, including a cross-origin one). */
  framed: boolean;
}

/** The two window properties framing is decided from. */
export interface FrameProbe {
  readonly top: unknown;
  readonly self: unknown;
}

/**
 * Whether this window is inside a frame. Reading `top` from a cross-origin frame can throw in some
 * browsers; a throw can only happen in a frame, so it counts as framed.
 */
export function isFramed(win: FrameProbe | undefined): boolean {
  if (!win) return false;
  try {
    return win.top !== win.self;
  } catch {
    return true;
  }
}

/** Whether a hostname is one of the production hostnames. */
export function isProductionHostname(hostname: string | null): boolean {
  return hostname !== null && PRODUCTION_HOSTNAMES.includes(hostname);
}

/** Dev server, E2E build or browser automation: never a real user, on any host. */
function isAutomatedOrDev(signals: AnalyticsSignals): boolean {
  return signals.dev || signals.e2e || signals.webdriver === true;
}

/**
 * Pure, fully testable predicate. Signals are passed in explicitly so this can be unit-tested
 * without mutating globals. Returns true ONLY for a real user on a production hostname, in the top
 * window.
 */
export function isAnalyticsEnabled(signals: AnalyticsSignals): boolean {
  return !isAutomatedOrDev(signals) && !signals.framed && isProductionHostname(signals.hostname);
}

/**
 * The service worker's predicate: the same rule as analytics. A real user, on a production
 * hostname, in the top window.
 *
 * Why the worker follows the site's host list rather than keeping its own, wider rule:
 *   • A frame is a non-page surface. The Tool Render Unit contract (ARCHITECTURE.md) forbids a
 *     service worker on any surface that is not a ToyTools page, and a page framed by another
 *     site is exactly that. A worker registered there is partitioned under the framing site, so
 *     it gives the visitor nothing on toytoolsapp.com and only spends their storage.
 *   • Offline on a mirror, a preview deploy or a proxy (a translate or cache host) is not a
 *     product: those origins are not where anyone installs ToyTools, and a caching worker on a
 *     preview origin is one more way to be looking at a stale build.
 *   • Nobody on toytoolsapp.com is affected: the installed app and every top-level visit still
 *     register exactly as before. Nothing here ever calls unregister(), so a worker already
 *     installed on another host keeps running and keeps updating; that host simply stops
 *     installing new ones.
 */
export function isServiceWorkerEnabled(signals: AnalyticsSignals): boolean {
  return isAnalyticsEnabled(signals);
}

/** Read ambient signals from the environment, never throwing under SSR. */
export function readSignals(): AnalyticsSignals {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  const loc = typeof location !== 'undefined' ? location : undefined;
  const win = typeof window !== 'undefined' ? window : undefined;
  return {
    dev: import.meta.env.DEV === true,
    // PUBLIC_ prefix is required for Vite to expose the var to the browser bundle.
    e2e: import.meta.env.PUBLIC_E2E === 'true',
    webdriver: nav?.webdriver === true,
    hostname: loc ? loc.hostname : null,
    framed: isFramed(win),
  };
}

const signals = readSignals();

/**
 * Resolved guard for the current environment. Evaluated once at module load. In the browser this
 * reflects the live session; during SSR there is no hostname, so it is false, and SSR is never
 * the surface that loads GA anyway (the bootstrap is src/lib/runtime/platform.ts, client-side).
 */
export const analyticsEnabled: boolean = isAnalyticsEnabled(signals);

/** Resolved service-worker gate for the current environment (see isServiceWorkerEnabled). */
export const serviceWorkerEnabled: boolean = isServiceWorkerEnabled(signals);
