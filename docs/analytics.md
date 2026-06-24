# Analytics

ToyTools uses Google Analytics 4 (measurement ID `G-WHD7CL44MX`) to understand
how real visitors use the site. The metrics we care about are:

- `page_view`
- `tool_used`
- `search_tool`
- `guide_opened`
- `faq_opened`
- `related_tool_clicked`

These numbers are only meaningful if they reflect **real user behavior**. Automated
UI tests (Playwright), browser automation, local development, and CI all exercise
the same pages a human would, so without a guard they would silently inflate and
distort production reporting. This document explains how that traffic is excluded.

## How it works

There is a single source of truth: [`src/lib/analytics/guard.ts`](../src/lib/analytics/guard.ts).

It exports `analyticsEnabled` (a boolean) plus the pure, testable predicate
`isAnalyticsEnabled(signals)`. Analytics is **disabled** when **any** of the
following is true:

| Signal | Source | Catches |
| --- | --- | --- |
| `import.meta.env.DEV` | Vite/Astro dev server | `npm run dev` |
| `import.meta.env.PUBLIC_E2E === 'true'` | build-time env var | E2E builds |
| `navigator.webdriver === true` | browser runtime | Playwright, Selenium, bots |
| `hostname === 'localhost'` | browser runtime | local preview, CI |
| `hostname === '127.0.0.1'` | browser runtime | local preview, CI |

Otherwise (a real browser on the production host) analytics is enabled.

The guard is **SSR-safe**: it reads `navigator` / `location` defensively and never
throws when they are undefined during the build.

### Where GA is loaded

Google Analytics is **not** hard-coded into `BaseLayout.astro`. The `gtag.js`
script is injected at runtime by the shared client runtime
([`src/components/ToyToolsRuntime.astro`](../src/components/ToyToolsRuntime.astro))
and **only when `analyticsEnabled === true`**. When analytics is disabled, the
external script is never requested and no events are sent.

### How events are sent

All custom event tracking flows through one wrapper:

```ts
import { trackEvent } from '@lib/analytics';

trackEvent('tool_used', { tool: 'json-formatter' });
```

`trackEvent` is a no-op when analytics is disabled. Inside `is:inline` widget
scripts (which cannot import modules) use the global equivalent, which is wired
to the same guard:

```js
ToyTools.track('tool_used', { tool: 'json-formatter' });
```

**Never call `gtag(...)` directly** — always go through `trackEvent` /
`ToyTools.track` so the guard can suppress test traffic in one place.

The event name vocabulary lives in
[`src/lib/analytics/events.ts`](../src/lib/analytics/events.ts) (`AnalyticsEvents`);
reuse those names instead of inventing tool-specific ones.

## Running E2E without polluting GA

The Playwright config already sets the opt-out for you, so the normal command is
safe:

```sh
npm run test:e2e
```

Under the hood it builds with the explicit flag:

```sh
PUBLIC_E2E=true npm run build && npm run preview -- --port 4331
```

Even without the flag, the E2E run would still be excluded (it serves on
`localhost` and `navigator.webdriver` is `true`), but `PUBLIC_E2E=true` bakes the
opt-out into the bundle as the explicit, primary signal.

To verify locally that no analytics request fires during a run, watch network
requests to `googletagmanager.com` — there should be none.

## Adding a new event

1. Add the event name to `AnalyticsEvents` in `src/lib/analytics/events.ts`.
2. Fire it via `trackEvent(name, params)` (server/module code) or
   `ToyTools.track(name, params)` (inline widget scripts).
3. Do not touch `BaseLayout.astro` or call `gtag` directly — the guard and loader
   already handle enabling/disabling.

## Tests

`src/lib/analytics/guard.test.ts` covers every detection rule (DEV, `PUBLIC_E2E`,
`navigator.webdriver`, `localhost`, `127.0.0.1`, and the production-real-user case)
plus SSR safety. Run them with `npm run test`.
