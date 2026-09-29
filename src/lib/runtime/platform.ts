// Always-on platform glue: Google Analytics and the service worker.
//
// Google Analytics loads only for real users on a production hostname in the top window (see
// src/lib/analytics/guard.ts). The service worker keeps its own gate (never in dev, E2E, automation
// or localhost), so test runs and local previews never make a network request and are never
// controlled by a caching worker. This is the only part of the deferred runtime that loads on every
// page — everything else arrives per-engine from ./loaders.

import { analyticsEnabled, serviceWorkerEnabled, GA_MEASUREMENT_ID } from '@lib/analytics/guard';
import { gtagPageFields } from '@lib/analytics/location';
import { pinReplaceState } from '@lib/analytics/history';
import type { ToyToolsGlobal } from './types';

export function attachPlatform(TT: ToyToolsGlobal): void {
  // All custom events must go through ToyTools.track — never call gtag() directly.
  if (analyticsEnabled) {
    const w = window as any;
    // Before gtag.js loads, so its history-change wrapper never lands on replaceState: URL-state
    // writes must not become page views carrying the inputs (see src/lib/analytics/history.ts).
    pinReplaceState(history, History.prototype.replaceState);
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
    w.gtag('js', new Date());
    // page_location is origin + path and page_referrer loses its query, so neither the inputs in
    // this page's address nor the previous page's ever reach GA. Every later hit on this page,
    // including the eq_* events sent through TT.track, inherits these fields.
    w.gtag('config', GA_MEASUREMENT_ID, gtagPageFields(location, document.referrer));
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    TT.track = function (name: string, params?: Record<string, unknown>) {
      try { w.gtag('event', name, params); } catch (_) { /* never break the UI */ }
    };
  } else {
    TT.track = function () { /* analytics disabled for this session */ };
  }

  // Progressive Web App — register the service worker so tools work offline and can be installed
  // to the home screen.
  if (serviceWorkerEnabled && 'serviceWorker' in navigator) {
    const swUrl = (import.meta.env.BASE_URL || '/') + 'sw.js';
    const swScope = import.meta.env.BASE_URL || '/';
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(swUrl, { scope: swScope }).catch(() => { /* never break the UI */ });
    });
  }
}
