# ToyTools Changelog

All notable changes to ToyTools are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [alpha-v7.4.1] - 2026-08-09

### Changed

- **Install now sits beside the favourite star, on every screen.** It used to be a mobile-only
  button below the tool. Chrome and Edge have supported installing web apps on the desktop the whole
  time, so there was no reason to hide it there; "keep this tool" and "install this tool" are the
  same intent, so they now share a place in the tool bar.
- The install sheet knows where it is. On a laptop it points at the install icon in the address bar,
  or Safari's File then Add to Dock, and it says which keys bookmark the page if that is all you
  wanted. On a phone it still gives the Chrome or iOS Share steps.
- The button hides itself in Firefox, which has no way to install a web app at all. A panel
  explaining that your browser cannot do the thing is worse than no button.
- The site icon lost the same gloss the tool icons did. The two were built on separate branches and
  had drifted apart, which is the exact thing "one family" is meant to prevent.
- **The theme switch left the tool bar on phones.** Four controls on a 393px row cost the tool's own
  name too much: it was wrapping onto a third and fourth line on seventeen pages. Names now fit on
  one line on 72 tools instead of 23. Your phone still follows its own dark mode automatically, the
  switch is still there on wider screens, and Settings has the explicit control on every page.

### Note

- There is no way for a website to add a browser bookmark for you. No browser exposes an API for it,
  by design, so a one-click bookmark button is not something any site can build. The favourite star
  is the one-click version of that inside ToyTools, installing is the one-click version on your
  device, and the sheet names the keyboard shortcut for a real browser bookmark.

## [alpha-v7.4] - 2026-08-09

Tool pages stop wearing ToyTools' chrome and start wearing their own.

### Changed

- **A tool page now opens with the tool's name, not the brand.** The site nav, the breadcrumb trail
  and the title block were three stacked rows saying whose site you were on before saying what you
  had come for. They are one sticky bar carrying the tool's icon, its name, the favourite star,
  search and the theme switch. The chrome above a tool fell from a third of a phone's first screen
  to a fifth, and only one tool in the catalogue now has nothing usable on the first screen, down
  from thirty when this work started.
- **The section below the tool is one line.** It was 682px, nearly a third of the whole page, and
  most of that was repetition: a related-tools list that appeared twice, links pointing at content
  sitting directly beneath them, and a feedback invite that the footer already carried. What is left
  is a single row: what the tool is used for, where the idea goes wrong, the questions, the guide,
  and the rest of the category.
- The feedback link moved into the footer, where it now names the tool you are on, so a report still
  arrives already knowing what it is about.
- Home, category, guide and information pages are unchanged. They are ToyTools' pages, so they keep
  ToyTools' header.

### Fixed

- Long tool names are never shortened in their own title bar. The bar grows instead.

## [alpha-v7.3.1] - 2026-08-09

A visual pass over the redesigned pages, fixing what only showed up once they were looked at on a
real phone rather than reasoned about in code.

### Changed

- **Tool marks are quieter.** The per-tool icon colours were stock bright palette values chosen
  before the site moved to Warm Paper, so every tool page had a neon square as its loudest element.
  They are now a muted, warm family that sits with the paper and the forest accent, with less gloss
  and gentler shading. Every category colour also passes the contrast bar for its white glyph, which
  three of them did not.
- **The Favourite button is a star alone on phones.** The word "Favourite" was 110px wide on a
  393px screen and was pushing tool names onto a second and third line. Titles that fit on one line
  went from 32 of 119 to 72.
- **The breadcrumb drops the current page on phones**, where it wrapped to two lines to repeat the
  name the heading gives two lines later. The full trail stays on wider screens and in the page's
  structured data.
- Twenty-three tools said "json", "jwt", "md5" or "csv" in lower case in their on-page headings,
  which read as a typo. They are capitalised properly now.

### Fixed

- Thirty-two tool pages showed an em-dash in their visible text, from engine notes and validation
  messages that the writing rule had never been able to see. Rewritten, and the build now checks
  engine prose for them. The HTML entity tool's reference table keeps its em-dash, since that
  character is the thing it exists to document.
- The tool icon floated to the middle of a heading that wrapped, instead of sitting on its first
  line.
- "Technical details" was the last disclosure on the site still drawing the browser's own arrow, so
  a single page could show three different ways of saying "this opens".

## [alpha-v7.3] - 2026-08-08

A ToyTools page used to open with a masthead: a large title, a description running to three lines on
a phone, a trust badge, an install button, and a horizontal rule. Measured across all 119 tools on a
Pixel 5, that spent a median 59% of the first screen before the tool began, and on 30 of them there
was nothing you could actually use on screen at all. This release turns the page around so the tool
leads and ToyTools signs its work.

### Changed

- **Every tool page now opens with the tool.** A tool's own icon, its name, one line, then the
  widget. Chrome above the tool fell from a median 59% of a phone's first screen to 34%, and the
  number of tools with nothing usable on the first screen fell from 30 to 6 (the remaining six are
  generators, where the result panel is meant to sit above the controls).
- **Tools wear their own icon.** The per-tool mark that has always been generated for the home
  screen now appears on the page, so 119 pages stop looking like 119 copies of one template.
- **Trust, installation and the ToyTools signature moved below the tool**, into a single quiet row
  reading "Powered by ToyTools ●". The brand still holds the nav, the page title and the footer.
- **Guides say they are guides**, with a `TOYTOOLS ● GUIDE` line above the title. A tool page has no
  such line, and its heading is smaller, so the two page types no longer open identically.
- Every tool has a short `tagline` for the line under its title. Descriptions stay long, because
  they are also the page's meta description.

### Added

- **Knowledge drawers below each tool**: what the tool is used for, where the idea goes wrong, and
  the questions. The first two were written for all 119 tools long ago and had never appeared
  anywhere on the site. Each drawer is closed by default and headed by the tool's own subject, so
  every page now describes itself to a search engine with something other than "Common Questions".
- A fold check that runs every tool on a Pixel 5 and fails the build if the chrome above a tool
  grows, so this cannot quietly come back.

### Fixed

- Seventeen tools were missing the words people actually search for. The HTML entity tool never used
  "escape", the uppercase converter never said "all caps", both YAML converters never said "yml",
  the MD5 tool never said "checksum", and the scientific calculator advertised "trig, logs" while
  people search "trigonometry" and "logarithm". Query targeting across the catalog went from 63% to
  75%.
- The install sheet's title was a page heading on all 119 tools, which meant every page told search
  engines about an install button instead of about the tool.
- The tool header drew a border the design system forbids, which is the line that most made a tool
  page read as an article.

## [alpha-v7.2.1] - 2026-08-08

Searching Google for ToyTools showed a title reading "ToyTools ● Lightweight, Private, Free" beside
a pale tan circle. Three adjectives about the site, no word anyone actually types, and a brand whose
first three letters say "toy" with nothing in the same line to correct the impression. The icon was
worse than plain: `favicon.ico` was a 32x32 file, below the square multiple of 48px Google asks for,
so the only qualifying icon was an SVG containing one muted circle, which is the shape most software
uses to mean "no icon at all".

### Changed

- The homepage title is now "Free Online Tools: Convert, Calculate, Encode ● ToyTools". It names
  three things a visitor can do before it names the brand, and fits in 56 characters so Google does
  not truncate it. The meta description carries the privacy claims instead, where they land after
  someone knows what the site is.
- The homepage `<h1>` was the single word "ToyTools", spending the page's strongest heading on a
  brand nobody searches for yet. It now reads "Convert, calculate, encode. In your browser." The
  brand still owns the nav, the title, the WebSite schema and the footer.
- The nav carries the site mark and a smaller wordmark. The mark does the recognising, so the
  brand reads at a glance while taking less of the eye than the tool a visitor came for.

### Added

- A site mark, composed by the same rules as the 119 tool install icons (`src/lib/icons/site-icon.ts`
  beside `tool-icon.ts`): a full-bleed forest field carrying the gold dot that already appears as
  "●" in every page title. Favicon and tool icons are now provably one family, and both are
  generated by `npm run icons:generate` rather than authored by hand.
- `favicon-48.png` and `favicon-96.png`, the sizes Google will actually accept, plus
  `apple-touch-icon.png` at 180 for pages that are not tools. Tool pages keep their own per-tool
  touch icon, so installing a tool still installs that tool rather than the site.

### Fixed

- The homepage Organization logo in JSON-LD pointed at an SVG, which has no intrinsic size and is
  ineligible for Google's logo treatment. It points at a 512px raster now.
- The homepage meta description and its WebSite schema description were two separate copies of the
  same sentence and could drift apart. They are one constant.


## [alpha-v7.2] - 2026-08-08

Searching the site for a tool that exists could return nothing at all. "quadratic formula
calculator" found no results, because the tool is a *Solver* and the ranker required every word of
a query to match, so the habitual word "calculator" vetoed it. Twenty-six phrasings from our own
research datasets, the ones that justified building each tool, returned an empty page. Separately,
the 2026-08-04 simulation rename had stripped the word "simulator" from every URL, title, H1 and
meta description in one commit, leaving it only in body prose where it carries almost no weight.
Nothing checked either of these, which is why both went unnoticed. Now something does.

### Added
- **A query coverage gate** (`npm run check:queries`), part of `npm run verify` and CI. It builds
  one corpus from evidence already in the repo (the `searchQueries` in `research/datasets/*.json`,
  every search alias, every knowledge keyword and entity alias) and asserts two things: that the
  intended tool is in the top 3 of the real ranker, and that a query's distinctive words appear in
  the built page's title, H1, an H2 or meta description. Body prose deliberately does not count.
  Both are ratchets that fail on a drop, and the report doubles as a content brief listing the exact
  phrases each tool is not yet earning.
- **A query targeting score in `seo:gate`.** The gate gained a `queryTargeting` criterion reading
  the artifact the coverage gate writes, so the corpus is defined once. A tool nobody has measured
  reports as unmeasured and skips the criterion rather than passing it.
- **Simulator vocabulary for every simulation, derived from its manifest.** "Pendulum Period
  simulator", "interactive Unit Circle" and their siblings are now generated rather than
  hand-listed, so a new simulation is searchable by the word people use for simulations without
  anyone remembering to type it into a tag list.

### Changed
- **Search matches the way people type.** Habitually appended nouns ("calculator", "tool",
  "online") and grammar words ("on", "a", "the") no longer veto an otherwise perfect match, and
  queries split on punctuation so formula-shaped searches like "V=IR" and "pv=nrt" resolve.
  "simulator" stays mandatory, because it distinguishes a simulation from a plain calculator, and so
  do "to" and "from", because they carry direction and "json to csv" is not "csv to json".
  Twenty-eight previously dead queries now find their tool, with no regressions.
- **Every simulation names itself on its stage.** The canvas panel was the one tile with no visible
  heading, carrying an `aria-label` alone; it now has an H2 in the words people search for.
- **The physics and applied-math category pages say what they hold.** "Physics" and "Applied Math"
  remain the nav labels, while the page title and H1 read "Physics Simulations" and "Interactive
  Math Simulations".
- **The SEO engine researches every tool type it ships.** Its query generator knew six tool-type
  nouns and had never been extended past the original developer utilities, so simulations,
  trackers, viewers and planners were researched with fewer query variants than a base64 encoder.

### Fixed
- Search results carried by a typo alone: "free fall" returned the lowercase converter, because
  "fall" is one edit from "all". A match must now be real somewhere before typo-forgiveness counts.
- Single letters matching inside unrelated words, which put every "Remove ..." tool above the Ohm's
  law calculator for "v = i r".
- "yml to json" resolving to the converter that does the exact opposite, because a verbatim alias
  tied a composite of separate word matches and lost the tiebreak alphabetically.
- "rem calculator" ranking "Remove Emoji" above the px-to-rem converter, because a partial-word
  prefix at the start of a name outscored an exact whole-word match.
- The Frequency and Period simulator never asking for "cycles per second", found by the new gate.

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
