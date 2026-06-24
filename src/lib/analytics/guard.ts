// Single source of truth for whether analytics collection is allowed.
//
// Google Analytics must reflect REAL user behavior only. So collection is
// disabled whenever the site is being driven by anything other than a human
// on production:
//
//   • local development        (import.meta.env.DEV)
//   • explicit E2E test mode   (import.meta.env.PUBLIC_E2E === 'true')
//   • browser automation       (navigator.webdriver — Playwright, Selenium, …)
//   • localhost / 127.0.0.1    (preview builds, CI smoke runs)
//
// Everything here is defensive: the module is imported in both SSR (build) and
// browser contexts, so it must never throw when `navigator` / `location` are
// undefined.

export const GA_MEASUREMENT_ID = 'G-WHD7CL44MX';

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1']);

/** Ambient signals that decide whether a session counts as a real user. */
export interface AnalyticsSignals {
  /** Vite/Astro dev server. */
  dev: boolean;
  /** Explicit E2E opt-out (`PUBLIC_E2E=true`). */
  e2e: boolean;
  /** `navigator.webdriver` — true under Playwright and other automation. */
  webdriver: boolean;
  /** `location.hostname`, or null when unavailable (SSR). */
  hostname: string | null;
}

/**
 * Pure, fully testable predicate. Signals are passed in explicitly so this can
 * be unit-tested without mutating globals. Returns true ONLY for real users on
 * production.
 */
export function isAnalyticsEnabled(signals: AnalyticsSignals): boolean {
  if (signals.dev) return false;
  if (signals.e2e) return false;
  if (signals.webdriver === true) return false;
  if (signals.hostname !== null && LOCAL_HOSTNAMES.has(signals.hostname)) return false;
  return true;
}

/** Read ambient signals from the environment, never throwing under SSR. */
export function readSignals(): AnalyticsSignals {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  const loc = typeof location !== 'undefined' ? location : undefined;
  return {
    dev: import.meta.env.DEV === true,
    // PUBLIC_ prefix is required for Vite to expose the var to the browser bundle.
    e2e: import.meta.env.PUBLIC_E2E === 'true',
    webdriver: nav?.webdriver === true,
    hostname: loc ? loc.hostname : null,
  };
}

/**
 * Resolved guard for the current environment. Evaluated once at module load.
 * In the browser this reflects the live session; during SSR it is conservative
 * (no navigator/location) but is never the surface that loads GA — the GA
 * bootstrap lives in client code (see ToyToolsRuntime.astro).
 */
export const analyticsEnabled: boolean = isAnalyticsEnabled(readSignals());
