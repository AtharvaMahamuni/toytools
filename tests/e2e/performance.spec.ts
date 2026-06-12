// Lightweight performance guardrails — protect the "fast/lightweight" principle without
// Lighthouse or benchmark maintenance. Reads the in-page Navigation Timing entry for a few
// representative pages and asserts conservative, CI-friendly caps. Runs on both viewports.
import { test, expect } from '@playwright/test';

const PAGES = [
  '/',
  '/tool/text/word-counter/',
  '/tool/developer-utilities/base64-encoder-decoder/',
  '/tool/developer-utilities/json-formatter/',
];

for (const path of PAGES) {
  test(`performance: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'load' });
    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return { dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd };
    });
    // Generous caps: a static page served locally settles in well under these; the point
    // is to catch a gross regression (e.g. a heavy dependency), not micro-benchmark.
    expect(timing.dcl, 'DOMContentLoaded (ms from navigation start)').toBeLessThan(5000);
    expect(timing.load, 'load event (ms from navigation start)').toBeLessThan(8000);
  });
}
