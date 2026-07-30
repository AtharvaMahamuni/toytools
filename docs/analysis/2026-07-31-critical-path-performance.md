# Critical-path performance: why simulation pages scored badly, and what changed

**Date:** 2026-07-31
**Trigger:** Physics and applied-math simulator pages scored poorly on Google's performance tests.
The working hypothesis was that the canvas animation was the expensive part.

## The hypothesis was wrong

The simulation engine was already the best-optimised thing on the page. `loader.ts` code-splits one
chunk per simulation via `import.meta.glob`, so a sim page carried the shared engine core plus
exactly one model. The pendulum chunk is a few KB.

What actually cost the page was **platform-wide payload that every page carried**, which simply
showed up worst on sim pages because those also have the largest DOM. Three independent causes, all
measured against the built output rather than guessed at.

## Baseline (before)

Per representative page, gzipped, measured in a real browser:

| page | sheets | CSS raw / gz | JS raw / gz | TOTAL gz |
|---|---|---|---|---|
| physics sim | 11 | 100.4K / 20.5K | 242.2K / 83.1K | 124.4K |
| math sim | 11 | 100.4K / 20.5K | 242.2K / 83.1K | 125.1K |
| text tool | 11 | 100.4K / 20.5K | 226.2K / 76.8K | 120.1K |
| guide | 2 | 79.6K / 9.4K | 226.2K / 76.8K | 100.4K |
| home | 2 | 37.0K / 7.5K | 226.2K / 76.8K | 97.6K |

## Cause 1 — the widget glob hoisted every tool's CSS onto every tool page

`src/pages/tool/[category]/[slug].astro` resolved any tool's widget with
`import.meta.glob('../../../tools/*/*/Widget.astro')`. That puts every widget in the route's module
graph, and Astro derives a page's stylesheet links from the whole graph. Result: **every tool page
linked the identical 11 stylesheets** (verified byte-identical across pendulum, fraction-calculator,
pomodoro-timer and word-counter). Nine of them were other tools' bespoke widget CSS — sampling 40
selectors from each against the pendulum HTML matched 0-1 per sheet. That is ~53 KB raw of dead
weight on the **render-blocking** path, which hits FCP directly.

**Fix.** One generated route per category segment (`src/pages/tool/<segment>/[slug].astro`), each
globbing only its own segment, with the page body shared in `src/components/tool/ToolPage.astro` and
the widget passed through the default slot. Simulation-only segments (physics) have no
`Widget.astro` at all, so they emit no glob and carry no widget CSS. Routes are generated and
byte-compared like the existing registration barrels, so a new category cannot silently miss one.

Two constraints discovered while implementing: the glob pattern must stay a **literal** (Vite
resolves it at build time), and `getStaticPaths` needs a **block-bodied** arrow — with a
single-expression body the Astro compiler folds the following statements into the `getStaticPaths`
scope, where reading `Astro.props` throws `UnavailableAstroGlobal`.

## Cause 2 — one runtime bundle held every engine (the dominant cost)

`ToyToolsRuntime.astro`'s module script statically imported all ~18 engines — text analysis,
processors, encoding, hashing, structured data, CSV, JWT, finance, datetime, math, wellness,
tracker, generation, JSON, YAML, diff, experience, visualization — into a single **231 KB raw /
77.7 KB gzipped** bundle shipped to every page. A physics page used none of it beyond
`state.save/load`; a guide page and the homepage used none of it at all.

Being `type="module"` it was deferred, so it did not block FCP directly. But parsing and executing
231 KB is pure main-thread time and drives **Total Blocking Time, the heaviest-weighted Lighthouse
metric (30%)**.

**Fix.** Split along the seam that already existed. The inline half (state, toast, copy, storage,
prefs, profile, history, focus, `onReady`) is unchanged and still parses with the page. The engine
half moved to `src/lib/runtime/engines/<id>.ts`, one attach module per engine, reached through a
literal `import()` in `loaders.ts` so Vite emits one chunk each. `BaseLayout` emits
`<meta name="tt-engines">` from the tool's registry entry and the runtime loads only that.

Surfaces shared by several engines (`experience`, `viz`) are their own modules so Vite emits them
once as a shared chunk; the `transform` facade registers providers per kind so an encoding page does
not pull hashing.

No widget changed: the `onReady` contract already required widgets to defer engine work, so the only
difference is that the wait is one round-trip longer. `validate-registry` now cross-checks
`ENGINE_LOADERS` against `ENGINE_GLOBALS` and against every `ToyTools.*` a widget actually calls, so
an engine cannot lose its runtime silently (negative-tested: injecting `ToyTools.runJwt` into
`TextMetricWidget` fails the build with a pointed message).

## Cause 3 — Partytown was inert, and the simulation loop raced first paint

**Partytown** was configured to forward `dataLayer.push`, but nothing on the site is ever marked
`type="text/partytown"` — Google Analytics is injected as an ordinary async script by the runtime,
behind the analytics guard. So the integration intercepted nothing while still putting a ~4 KB
**parser-blocking** loader in every page's `<head>` and fetching a sandbox iframe. Removed, with a
note in `astro.config.mjs` explaining what re-adding it would require.

**Autoplay** started a 60 fps `requestAnimationFrame` loop the instant the module evaluated, so
physics integration, canvas drawing and readout formatting all competed with first paint. The static
first frame, readouts and controls now render immediately as before, but the loop waits behind an
`IntersectionObserver` on the canvas and then `requestIdleCallback`. A sim below the fold never
burns a frame; `prefers-reduced-motion` still means no autoplay at all.

## Result (after)

Real browser, gzipped, same pages:

| page | sheets | CSS raw / gz | JS raw / gz | HTML gz | TOTAL gz |
|---|---|---|---|---|---|
| physics sim | 3 | 48.4K / 9.6K | 25.3K / 10.3K | 16.5K | **36.4K** |
| math sim | 3 | 48.4K / 9.6K | 27.2K / 10.8K | 17.5K | **37.9K** |
| math calc | 3 | 48.4K / 9.6K | 31.5K / 12.8K | 17.3K | 39.7K |
| text tool | 3 | 44.6K / 9.1K | 5.2K / 2.5K | 21.1K | 32.7K |
| hash tool | 4 | 54.6K / 11.2K | 12.4K / 5.4K | 19.1K | 35.7K |
| guide | 2 | 79.6K / 9.4K | 4.1K / 2.0K | 12.6K | 24.1K |
| home | 2 | 37.0K / 7.5K | 4.1K / 2.0K | 12.0K | 21.5K |

Headline for the pages that prompted this: a simulation page went from **124.4K to 36.4K gzipped, a
71% cut**, with JS specifically down from 83.1K to 10.3K (-88%) and render-blocking stylesheets from
11 to 3.

## Verification

`npm run build` (all validators + strict TS), 1830 unit tests, and 546 Playwright E2E tests on
Desktop Chrome **and** Pixel 5 all pass.

## What was deliberately not done

- **Inlining the remaining CSS.** `titles.SSNogQ0G.css` (33 KB raw) is the shared chunk every page
  needs; inlining it would trade a cached request for per-page HTML bloat.
- **Splitting the shared CSS chunk further.** The remaining 3 sheets are genuinely used; the next
  win there would be unused-selector pruning, which needs a coverage run per page type, not a
  structural change.
- **Touching the sim models or draw code.** They were never the problem.
