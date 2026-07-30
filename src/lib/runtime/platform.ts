// Always-on platform glue: Google Analytics and the service worker.
//
// Both are gated by the analytics guard (real production users only: never in dev, E2E, automation,
// or localhost), so test runs and local previews never make a network request and are never
// controlled by a caching worker. This is the only part of the deferred runtime that loads on every
// page — everything else arrives per-engine from ./loaders.

import { analyticsEnabled, GA_MEASUREMENT_ID } from '@lib/analytics/guard';
import type { ToyToolsGlobal } from './types';

export function attachPlatform(TT: ToyToolsGlobal): void {
  // All custom events must go through ToyTools.track — never call gtag() directly.
  if (analyticsEnabled) {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
    w.gtag('js', new Date());
    w.gtag('config', GA_MEASUREMENT_ID);
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
  if (analyticsEnabled && 'serviceWorker' in navigator) {
    const swUrl = (import.meta.env.BASE_URL || '/') + 'sw.js';
    const swScope = import.meta.env.BASE_URL || '/';
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(swUrl, { scope: swScope }).catch(() => { /* never break the UI */ });
    });
  }
}
