# Analytics

ToyTools uses Google Analytics 4 (measurement ID `G-WHD7CL44MX`) to count visits and see which
tools get used. What it actually collects:

- `page_view`, plus the GA4 enhanced-measurement events configured on the data stream in GA admin
  (scroll, outbound click, site search, form interactions, file download, video)
- three custom events, all from the shared equalizer widget
  (`src/tools/_shared/EqWidget.astro`): `eq_preset_selected`, `eq_preset_shared`,
  `eq_image_generated`

There is no other custom event. `src/lib/analytics/events-inventory.test.ts` pins that list, so a
new event is a decision made in the open by the PR that adds it. Privacy-first: do not add one
without a reason that survives the privacy page.

These numbers are only meaningful if they reflect **real users on the real site**. Automated UI
tests, browser automation, local development, previews, mirrors and pages framed by another site
all exercise the same pages a human would, so without a guard they would inflate and distort
production reporting.

## When GA loads

There is a single source of truth: [`src/lib/analytics/guard.ts`](../src/lib/analytics/guard.ts).
It exports `analyticsEnabled` plus the pure, testable predicate `isAnalyticsEnabled(signals)`.
It is an **allowlist**: analytics is enabled only when **all** of these hold.

| Signal | Source | Must be |
| --- | --- | --- |
| `import.meta.env.DEV` | Vite/Astro dev server | false |
| `import.meta.env.PUBLIC_E2E === 'true'` | build-time env var | false |
| `navigator.webdriver` | browser runtime | not true |
| `location.hostname` | browser runtime | in `SITE.productionHostnames` (`toytoolsapp.com`, `www.toytoolsapp.com`) |
| `window.top !== window.self` | browser runtime | false (a throw on reading `top` counts as framed) |

The hostnames come from the site identity constant in
[`src/config/site.ts`](../src/config/site.ts). Any other host (a preview deploy, a mirror, a copy
of `dist/` somewhere else, `localhost`) and any iframe, same origin or not, never loads `gtag.js`.

The guard is **SSR-safe**: it reads `navigator` / `location` / `window` defensively and never throws
when they are undefined during the build. With no hostname it resolves to disabled.

The **service worker** has its own predicate in the same file, `serviceWorkerEnabled`, which is the
old rule (off under dev, E2E, automation and localhost; on everywhere else, frames included). It
was deliberately not moved onto the analytics allowlist: that would change offline support on any
second host, which is a behaviour change for users rather than an analytics fix.

### Where GA is loaded

Google Analytics is **not** hard-coded into `BaseLayout.astro`. The `gtag.js` script is injected at
runtime by [`src/lib/runtime/platform.ts`](../src/lib/runtime/platform.ts) (the deferred half of
`ToyToolsRuntime.astro`), and **only when `analyticsEnabled === true`**. When analytics is disabled
the external script is never requested and no events are sent. Never add a second `gtag` snippet.

## What GA is told about the address

Tools with auto URL state (`src/lib/url-state.ts`) keep their inputs in the query string, and the
search page keeps the search in `?q=`. So platform.ts configures gtag with:

- `page_location` = `location.origin + location.pathname` (no query, no hash)
- `page_referrer` = `document.referrer` with its query and hash removed. The browser sends the
  full previous URL for same-origin navigations, so without this the previous tool's inputs
  would arrive as the referrer.

Both come from [`src/lib/analytics/location.ts`](../src/lib/analytics/location.ts). Every later
hit on the page (scroll, user engagement, the three `eq_*` events) inherits them.

### History-change page views (verified 2026-09-29)

GA4 enhanced measurement's **"Page changes based on browser history events"** is **on** for this
stream: the live `gtag.js?id=G-WHD7CL44MX` container carries `"vtp_historyEvents":true` on its
`__ccd_em_page_view` tag. With it on, gtag.js wraps `history.pushState` / `history.replaceState`,
listens for `popstate`, and sends a `page_view` whenever the URL changes. That page view sets
`page_location` to the **new full URL** and `page_referrer` to the **old full URL**, ignoring the
`page_location` passed to `gtag('config')`. The same tag also sends a `page_view` from the full URL
when a page is restored from the back/forward cache.

Checked by loading the real container in headless Chromium on an intercepted `toytoolsapp.com`
origin, with every collect request recorded and aborted (nothing reached GA): a debounced
`replaceState(?amount=6000)` produced `page_view dl=.../?amount=6000 dr=.../?amount=5000` even with
the stripped config.

What the code does about it:

- [`src/lib/analytics/history.ts`](../src/lib/analytics/history.ts) pins `history.replaceState` to
  the browser's own implementation (an accessor that ignores assignment) **before** gtag.js loads,
  so gtag's wrapper is never installed on it. The site only uses `replaceState` for URL state (the
  shared `TT.url.write`, the search page, keep-screen-awake, the install prompt's cleanup) and never
  navigates with the History API, so no real page view is lost. Re-running the check with the pin:
  URL-state writes, an in-page anchor jump and `history.back()` produced no page view with a query.
- What code cannot reach: `pushState` (unused today), back/forward-cache restores, and any change in
  how gtag.js hooks history. Only the GA admin setting controls those.

**So "Page changes based on browser history events" should be switched off** in GA admin (Admin,
Data streams, the web stream, Enhanced measurement, gear icon, Page views, Show advanced settings).
Every real navigation on this site is a full page load that sends its own `page_view`, so the
setting only ever adds duplicate page views, some of them carrying inputs.

### Other enhanced-measurement fields that can carry the query

- **Site search** (`view_search_results`) reads the search words from the real address
  (`q`, `s`, `search`, `query`, `keyword`), not from `page_location`, so a load of
  `/search/?q=...` reports the search term. The privacy page says so. Turning site search off in
  the same Enhanced measurement panel is the only way to stop it.
- **Form interactions** (`form_start` / `form_submit`) send `form_destination`, the form's
  resolved `action`. The search forms point at `/search/`. The three widgets with an action-less
  form (book-tracker, habit-streak-tracker, shop-upi-tally) resolve to the current address, which
  carries a query only if the page was opened with one; none of the three writes its inputs to the
  URL.
- Scroll, user engagement, outbound click and the custom events use the configured
  `page_location` / `page_referrer`.

## How events are sent

Inside `is:inline` widget scripts (which cannot import modules) use the global, which platform.ts
wires to the guard:

```js
ToyTools.track('eq_preset_selected', { preset: 'bass' });
```

`ToyTools.track` is a no-op stub until the deferred runtime loads, and stays a no-op whenever
analytics is disabled. **Never call `gtag(...)` directly**; the inventory test fails if an
`event` call appears anywhere but platform.ts.

## Running E2E without polluting GA

The Playwright config sets the opt-out for you, so the normal command is safe:

```sh
npm run test:e2e
```

Under the hood it builds with the explicit flag:

```sh
PUBLIC_E2E=true npm run build && npm run preview -- --port 4331
```

Even without the flag the run would still be excluded (it serves on `localhost`, which is not a
production hostname, and `navigator.webdriver` is `true`), but `PUBLIC_E2E=true` bakes the opt-out
into the bundle as the explicit, primary signal. To check by hand that no analytics request
fires during a run, watch network requests to `googletagmanager.com`: there should be none.

## Tests

- `src/lib/analytics/guard.test.ts`: every rule (production apex and www, other hosts, preview
  hosts and lookalikes, same-origin and cross-origin iframes, `localhost`, `127.0.0.1`, DEV,
  `PUBLIC_E2E`, `navigator.webdriver`, SSR) and the unchanged service-worker predicate.
- `src/lib/analytics/location.test.ts`: `page_location` / `page_referrer` stripping (query, hash,
  both, neither).
- `src/lib/analytics/history.test.ts`: the `replaceState` pin.
- `src/lib/runtime/platform.test.ts`: the bootstrap with the guard forced open on an address with
  inputs; the config is stripped and the three `eq_*` events still fire through `TT.track`.
- `src/lib/analytics/events-inventory.test.ts`: the whole custom-event list.

If you change the guard, what GA is told, or the event list, change `src/pages/privacy.astro` in
the same commit.
