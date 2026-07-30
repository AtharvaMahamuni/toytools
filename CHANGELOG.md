# ToyTools Changelog

All notable changes to ToyTools are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/).

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
