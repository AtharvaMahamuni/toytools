// Centralized analytics access. Every custom event MUST flow through this
// wrapper — no component or widget should call `gtag(...)` directly. The wrapper
// is a no-op whenever analytics is disabled (see ./guard), so test traffic,
// localhost, and dev sessions can never reach Google Analytics.
//
// In the browser the same wrapper is exposed as `ToyTools.track(name, params)`
// for `is:inline` widget scripts (which cannot import modules). See
// ToyToolsRuntime.astro.

import { analyticsEnabled } from './guard';
import type { AnalyticsEvent } from './events';

export { analyticsEnabled, GA_MEASUREMENT_ID } from './guard';
export { AnalyticsEvents } from './events';
export type { AnalyticsEvent } from './events';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Record a custom analytics event. Silently does nothing when analytics is
 * disabled or when called outside the browser (SSR-safe).
 */
export function trackEvent(
  name: AnalyticsEvent | string,
  params?: Record<string, unknown>,
): void {
  if (!analyticsEnabled) return;
  if (typeof window === 'undefined') return;
  window.gtag?.('event', name, params);
}
