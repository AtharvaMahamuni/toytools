# ToyTools Changelog

All notable changes to ToyTools are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [alpha-v7.1.1] - 2026-08-07

The homepage stopped listing tools and started describing the catalog. It led with all 58
directory entries as bare names, which rendered as roughly 9,800px of undifferentiated grey links
on a Pixel 5: complete, but unreadable, and silent about what any category actually does.

### Added
- **A category index on the homepage.** Eleven rows, two columns on desktop and one on a phone,
  each with an accent dot, the category name, its tool count, a one-line tagline and three named
  example tools. The examples are authored per category, so they can name the tools people arrive
  looking for, including ones the directory hides behind a collapsed group entry (BMI Calculator
  and TDEE Calculator both sat inside a single "Health Calculator" link before).
- **A "Browse all 119 tools" disclosure** holding the full directory. It ships closed, so the
  complete catalog is still one click and still one internal link away from the homepage without
  being the first thing anyone has to read.

### Changed
- The homepage is now 2,438px tall on a Pixel 5, down from 9,815px, and 1,465px on desktop.
- The hero states what the site actually is: "119 tools", "Everything runs in your browser",
  "No sign-up, nothing uploaded", replacing "Lightweight / Private". The tool and category counts
  moved into that line, so the old counter row at the foot of the page is gone.
- The homepage renders at content width (1100px) rather than shell width (1440px), which keeps
  the category rows a readable line length instead of stretching them across the viewport.

## [alpha-v7.1] - 2026-08-06

Keep Screen Awake rebuilt around the two things the tool is actually for: proving an invisible
promise, and being looked at from across a room. No URL changed, and no registration moved.

### Added
- **Ambient mode** replaces the old "Remove Distractions" corner text. A centred full-screen clock
  with the session state, two dim levels for a dark room, controls that fade after four seconds and
  return on a tap, and a slow drift so a phone left on for hours does not risk OLED burn-in. It is
  padded with `env(safe-area-inset-*)`, which the previous overlay was not, so nothing hides behind
  a notch or the home indicator.
- **A battery guard.** Where the Battery Status API is available the current charge is shown, and a
  session releases itself at 15% while unplugged. Keeping a display lit is the largest power draw a
  page can cause, so the tool that asks for it is the one that should watch the cost.
- **End-of-session alerts**: an optional chime, a vibration, and an optional browser notification. A
  timed session ends exactly when nobody is looking at the screen.
- **A today line** (`Today: 2 sessions / 48m awake`), matching the Pomodoro stats row.
- **A shareable session length.** Choosing a duration writes `?d=<minutes>` with `replaceState`, so
  `?d=30` reopens the tool set to 30 minutes without filling the back button.
- `Space` toggles the session, matching Pomodoro's shortcut.
- `tests/e2e/keep-screen-awake.spec.ts`: ten specs on desktop and Pixel 5. The tool previously had
  only generic smoke coverage despite being the most stateful thing in its category. The Wake Lock
  API is stubbed via `addInitScript` because a headless browser is not a visible screen.

### Changed
- The widget is now composed from `IoPanel` instead of hand-written panel markup, and the timer is a
  hero numeral inside a progress ring rather than `--text-xl` body text. The answer is the timer;
  it used to render at the same size as the word "Sleeping".
- **The primary control is a full-width button, not a 32x18px switch.** The one control the tool
  lives by was a quarter of the platform's 48px minimum touch target. Every control in the widget
  now has a visible `:active` state, since phones have no hover.
- Mobile order is answer-first (`stackOrder="output-first"`): status above setup, not below it.
- Duration presets are visible on arrival instead of hidden behind a "Tool Settings" disclosure, and
  read as intents ("Until I stop") rather than glyphs (the bare infinity symbol).
- Six competing status elements collapsed to one: the ring glows gold while a lock is held.
- Settings moved from two dot-namespaced `localStorage` keys to `ToyTools.state`, so they now ride
  along in `ToyTools.data` exports. Existing keys migrate on first load.
- Unsupported browsers get the exact device setting for their platform instead of one generic line.
- The FAQ and guide said Safari and Firefox did not support the Wake Lock API. Safari has shipped it
  since 16.4 and Firefox since 126, so the tool's own compatibility answers were turning users away
  from a feature their browser had.

### Fixed
- **A lock dropped while the tab stayed visible was never re-acquired.** The release handler only
  registered a `visibilitychange` listener, which cannot fire on a page that never became hidden, so
  a lock revoked by a battery saver or an OS power policy was gone permanently while the UI went on
  showing "Awake" over a sleeping screen. Re-acquisition is now attempted every second from the
  ticker whenever the session is running, the page is visible and no lock is held, and a lock that is
  gone is reported as "Lock lost, reconnecting" rather than hidden. Pinned by an e2e spec.
- A failed re-acquire called `setInactiveState()`, which never cleared the interval, leaving the
  timer running behind a "Sleeping" label until it fired a completion for a session that was not
  running. Every visible element now derives from one state object in one `render()`.
- The status label faded out and swapped text on a 150ms timeout, so rapid toggling could settle on
  the wrong label, and the status was invisible at the exact moment it was needed.
- `aria-live="polite"` sat on the ticking numerals, making a screen reader announce the clock once a
  second forever. The live region now carries state changes only.
- The custom-minutes ceiling was enforced by the `max` attribute alone, so a typed `9000` was
  accepted as 150 hours. Clearing the field no longer silently leaves the previous duration armed.

## [alpha-v7.0.1] - 2026-08-06

### Fixed
- `npm run version:bump` inlined its description argument straight into a single-quoted TS string
  literal, so a summary containing an apostrophe wrote a `src/lib/version.ts` that no longer
  parsed: the bump meant to record a release was the thing that broke the next build. Backslashes,
  quotes and newlines are now escaped, and the value round-trips exactly.

### Changed
- `CLAUDE.md` states the versioning rule the project had been following by habit: a PR that adds or
  modifies a tool is a minor bump, one that adds a category or an engine is a major bump, anything
  else that ships is a patch, and every one of them writes a CHANGELOG entry in the same PR.

## [alpha-v7.0] - 2026-08-04

Acting on `docs/analysis/2026-08-03-text-cluster-ranking-factors.md`, which found that the text
cluster ranks because of structure rather than content depth. No previously live URL broke.

### Added
- Five tools on the existing `wellness` engine, taken from the top of `npm run research:next`:
  **BMR Calculator**, **Calorie Deficit Calculator**, **Protein Intake Calculator**,
  **One Rep Max Calculator**, and **Running Pace Calculator**. Each ships with a guide, six FAQs,
  and a knowledge overlay, and each passes `seo:gate`.
- Per-calculator code splitting for the wellness engine (`src/lib/engines/wellness/lazy.ts`). A page
  now loads only the calculator it declares on `data-wellness` instead of all eleven, which cut
  wellness page JS from 24.1 KB to 13.1 KB gzipped and makes further fan-out on that engine free.
- Four tool groups on clusters that already shared an engine and pattern but linked only the three
  siblings `RelatedTools` derives: `body-metrics` (11 members, "Health Calculator"),
  `growth-calculators` (6), `everyday-calculators` (6), and `health-trackers` (3).

### Changed
- Every physics and applied-math simulation was renamed from what it is to what people search for:
  `pendulum-simulator` became `pendulum-period-calculator`, `shm-spring-simulator` became
  `simple-harmonic-motion-calculator`, `quadratic-equation-explorer` became
  `quadratic-equation-solver`, and eleven more. The pages themselves are unchanged; only the name
  and the address moved.
- All fourteen retired URLs serve a noindex stub that meta-refreshes to the new page and declares it
  canonical, so they hand over their link equity instead of falling through to the 404 page. The
  redirect route is now a rest param (`src/pages/tool/[...oldPath].astro`), because a slug rename
  keeps its segment and a per-segment stub route would collide with the generated tool route.
- The health calculators' above-the-fold rule now pins the hero answer and the start of its chart
  rather than the whole chart: the group switcher's pill row costs about 56px, which the three
  tallest calculators no longer have to spare.

### Fixed
- `src/lib/runtime/index.ts` was not awaiting an engine's `attach()`, so an async attach would never
  have finished before `TT.ready` flipped. The type already permitted `Promise<void>`.
- Numeric fields defaulting to zero are marked optional on the new calculators. `SmartInput` renders
  such a field blank, and the widget refuses to compute while a required field is blank, so the
  calorie-deficit goal weight and the running-pace hours and seconds silently blocked the result.

## [alpha-v6.0] - 2026-07-30

### Added
- Feedback & Product Discovery system at `/feedback/`: a structured form that collects **user problems** rather than feature requests (what are you trying to do, how do you do it today, what is frustrating, what would the ideal tool do), plus bug reports, improvement requests, and general feedback.
- Delivery is **`mailto:` only, with no third party of any kind**. A static page cannot send email, so the page composes the message and hands it to the visitor's own mail client. No backend, no relay, no access key, no setup.
- The composed message is always shown on the page with a Copy button and the address in selectable text, because a `mailto:` fails silently on a machine with no mail client configured.
- Feedback core (`src/lib/feedback/`): `templates.ts` owns both the form's questions and the email they produce as a single contract, pinned character for character by `templates.test.ts` so inbox filters cannot break silently. 100% line coverage across the module.
- `FeedbackLink`, auto-included by `ToolLayout`, so all 109 tools inherit one quiet entry point with zero per-tool edits.
- Bug-report reproduction opt-in (unticked by default) that attaches what the visitor had typed into the tool they came from, gated at **build time** by `allowsInputCapture(engine, pattern)`: on `jwt`, `hashing`, `encoding`, and `generate-credential` tools the capturing script is never even emitted.
- `'page'` content type in the Content Manifest (`STANDALONE_PAGES`), so standalone indexable pages reach the sitemap and IndexNow from the same single source the registry-derived surfaces use. New `sitemaps/pages.xml` bucket.
- `docs/feedback.md`: the email contract, the Gmail filter recipes, and the honest costs of the mailto approach.

### Changed
- Search no-results state now carries the unmatched query into `/feedback/?type=new&q=…`, turning the clearest unmet-demand signal on the site into a prefilled suggestion instead of discarding it.
- 404 page cancels its five-second redirect home on any interaction, so the new suggestion link is not yanked away mid-thought.
- Sitewide footer carries a "Suggest a tool" link.

### Fixed
- Over-long `mailto:` bodies are trimmed on whole code points rather than characters. Slicing mid-emoji leaves a lone surrogate and `encodeURIComponent` throws `URIError` on it, and the fitting loop measures encoded length because it is not proportional to character count.

## [alpha-v5.0] - 2026-07-16

### Added
- Applied Math category (the 100th tool milestone): Unit Circle Explorer, Quadratic Equation Explorer, Probability Lab (math-lab simulation domain), and Fraction, Combinations & Permutations, and Prime Factorization calculators (new math engine, BigInt-exact with worked steps).
- Math Calculator Engine (`src/lib/engines/math/`) exposed as `ToyTools.runMath`, consuming the platform SmartField/InteractiveResult layers via the shared MathWidget.
- One-viewport simulation dashboard: canvas, controls, live measurements, graph, formula, and narrative as reorderable tiles with spatially-truthful arrows; graph y-axis header row.
- Research Intelligence Engine `algorithmicFit` signal: every candidate tool is scored on whether a deterministic algorithm (vs AI) serves the need.

### Changed
- Demand-mapped FAQ expansion on the six math tools (+18 questions, each targeting a declared search intent).

## [alpha-v4.0] - 2026-06-29

### Added
- Money & Finance category with the first five tools: Compound Interest, Rule of 72, Inflation, Savings Goal, and Emergency Fund calculators.
- Finance Engine (`src/lib/engines/finance/`) — a never-throwing, registry-driven calculation engine exposed as `ToyTools.runFinance`.
- Reusable, engine-agnostic platform layers that finance is the first consumer of:
  - Smart Input system (`src/components/inputs/`, `src/lib/inputs/`) with natural-number parsing, adaptive stepping, grouped/compact formatting, presets, and full keyboard/touch accessibility.
  - Interactive-result + visualization contracts (`src/lib/results/`, `src/lib/visualization/`).
  - Experience layer (`src/components/experience/`) — `ExperienceRenderer` with a config-driven section layout, capability flags, progressive disclosure, and UI-state contract.
  - Concept and worked-example registries (`src/lib/concepts/`, `src/lib/examples/`) and cross-tool interaction memory (`ToyTools.prefs`).
- Full guides, FAQs, and knowledge-graph entries for all five finance tools.
- Content Intelligence and Research Intelligence integration for the finance ecosystem, plus an evidence-backed expansion roadmap (`docs/finance-roadmap.md`).

### Info
- New finance utility tools now available.

## [alpha-v1.0] - 2026-06-07

### Changed
- Major UI revamp under progress — comprehensive design system updates

### Info
- New text utilities now available

## [alpha-v0.2.0] - 2026-06-08

### Added
- Text processor system for transform/cleanup operations
- Per-case converter tools (uppercase, lowercase, title-case, sentence-case, camel-case, snake-case, kebab-case)
- Text cleanup tools (remove extra spaces, blank lines, duplicates, trim, normalize whitespace, remove tabs)
- Shared `TextProcessorWidget` component for consistent UI

### Fixed
- WCAG AA contrast failures across text tokens, navigation, and badges
- Improved color token compliance with accessibility standards

### Changed
- Lengthened 4 tool meta descriptions to meet 50-character minimum for SEO

## [alpha-v0.1.0] - 2026-01-15

### Added
- Initial public release
- Text analysis tools (word counter, character counter, sentence counter, paragraph counter, reading time)
- Developer tools (Base64 encoder/decoder)
- Productivity tools (todo list, notepad, keep-screen-awake, pomodoro timer)
- Number utilities (percentage calculator)
- Dark mode support
- Analytics integration (GA4)
- Responsive design with mobile-first approach
- SEO pipeline (research, extraction, auditing)
