// One pinned day for every e2e check of the New row, so none of them depends on the real date.
//
// The e2e build renders New badges against E2E_BUILD_NOW (playwright.config.ts passes it to
// `npm run build`; src/lib/tools/freshness.ts buildNow() reads it), and the browser is pinned
// inside the same window with page.clock. FIXTURE_ADDED_ON is the addedOn of the six beta-v12.3
// tools, which stay in the registry, so the e2e build always carries a six-card New row.
export const FIXTURE_ADDED_ON = '2026-10-02';
export const E2E_BUILD_NOW = '2026-10-03T12:00:00.000Z';
