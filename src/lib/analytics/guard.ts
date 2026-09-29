// Single source of truth for whether analytics collection is allowed.
//
// Google Analytics must reflect REAL user behaviour on the REAL site only. So collection is an
// allowlist, not a blocklist: it runs only when every one of these holds:
//
//   • not local development      (import.meta.env.DEV)
//   • not an explicit E2E build   (import.meta.env.PUBLIC_E2E === 'true')
//   • not browser automation      (navigator.webdriver: Playwright, Selenium, ...)
//   • the hostname is production  (SITE.productionHostnames in src/config/site.ts)
//   • the page is the top window  (not framed by anyone, same origin or not)
//
// A preview deploy, a mirror, a copy of dist/ on another host, localhost and any iframe all fail
// the test, so none of them ever loads gtag.js.
//
// The service worker keeps its own, older predicate (serviceWorkerEnabled below): tying it to the
// new allowlist would stop offline support wherever the site is served from a second host or a
// frame, which is a user-visible change this module is not the place to make.
//
// Everything here is defensive: the module is imported in both SSR (build) and browser contexts,
// so it must never throw when `navigator` / `location` / `window` are undefined.

import { SITE } from '@config/site';

export const GA_MEASUREMENT_ID = 'G-WHD7CL44MX';

const PRODUCTION_HOSTNAMES: readonly string[] = SITE.productionHostnames;
const LOCAL_HOSTNAMES: readonly string[] = ['localhost', '127.0.0.1'];

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
 * The service worker's predicate: unchanged from before the analytics allowlist (dev, E2E,
 * automation and localhost are excluded; every other host and frame registers it), so offline
 * support behaves exactly as it did.
 */
export function isServiceWorkerEnabled(signals: AnalyticsSignals): boolean {
  return !isAutomatedOrDev(signals) && !LOCAL_HOSTNAMES.includes(signals.hostname ?? '');
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
