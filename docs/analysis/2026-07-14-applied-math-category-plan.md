# Applied Mathematics Category: Launch Plan

Date: 2026-07-14
Baseline: 94 tools, 8 categories, 15 engines. RIE datasets cover datetime / developer / finance /
physics / text; there is **no math evidence yet**, so the current `research:next` headline
(csv-column-picker, 70.8) cannot see this space. Phase 0 fixes that before anything is built.

## Goal

A new **Applied Mathematics** category of interactive, visual, "play with it" math tools for
students, teachers, learners, and enthusiasts. The physics cluster proved the formula: live
canvas + sliders beats the static ad-heavy calculator SERP incumbents (calculator.net,
omnicalculator, symbolab) and the dated-UX educational incumbents (PhET, mathsisfun). Math is the
same play with a far larger query universe.

## Why this fits the platform (near-zero new infrastructure)

- The simulation platform is **domain-neutral by design**: ARCHITECTURE.md ("Plugin seam") states a
  second subject is a new `src/lib/simulation/plugins/<domain>/` bundle added to `DOMAINS` with no
  engine changes. Math explorables ride the same manifest-derived content pipeline
  (config/knowledge/faq/guide/SEO all derived, `seo:gate:sim` gating, zero registry edits).
- `graphs/`, `render/` (math, vector, angle helpers), and `canvas.ts` already exist and are exactly
  what function plots, unit circles, and convergence charts need.
- The one genuinely new reusable core is a **safe math expression parser/evaluator** (no `eval`),
  built engine-first with unit tests. It powers the grapher and later unlocks derivative
  visualizers, inequality/polar/parametric graphers, and a scientific calculator.

## The 5 launch tools

Selection criteria: search demand, weak incumbents, interactivity ceiling (fun in a classroom, on
a phone), reuse of platform libraries, and what each unlocks. Final ranking is Phase 0's job; this
is the seeded candidate set.

### 1. `unit-circle-explorer` (Unit Circle Explorer)
- **Interaction:** drag the angle around the circle (touch-first); the reference triangle,
  sin/cos/tan values, degrees/radians, and a live-tracing sine wave update in real time.
- **Demand:** "unit circle" is a perennial top student query; incumbents are static charts, PDFs,
  and mathsisfun's dated page. Nobody owns a great mobile drag experience.
- **Platform fit:** simplest math sim; ships the `plugins/math/` domain bundle. Build **first**.
- **Unlocks:** trig-function-grapher, triangle-solver, degrees-radians-converter.

### 2. `quadratic-equation-explorer` (Quadratic Equation Explorer)
- **Interaction:** sliders for a/b/c morph a live parabola; roots, vertex, axis of symmetry, and
  discriminant update instantly, with a step-by-step quadratic formula readout.
- **Demand:** "quadratic formula calculator" / "quadratic equation solver" are massive evergreen
  queries. Incumbents (symbolab, calculator.net) are static forms, ad-heavy, paywalled steps.
- **Platform fit:** pure sim (params + canvas + equations panel). No parser needed.
- **Unlocks:** polynomial-explorer, completing-the-square-visualizer, inequality-solver.

### 3. `probability-simulator` (Probability Lab)
- **Interaction:** flip coins, roll dice, spin a weighted spinner; run 1 to 10,000 animated trials
  and watch the empirical frequency converge on the theoretical value (law of large numbers chart).
- **Demand:** "coin flip simulator", "dice probability calculator", "probability calculator".
  Incumbents are either bare dice rollers or static probability forms; none show convergence.
- **Audience:** the highest fun factor of the five; teachers project it in class.
- **Platform fit:** sim (the trial loop maps naturally onto the step/graph model).
- **Unlocks:** combinations-permutations-calculator, binomial-distribution-visualizer,
  monte-carlo-pi-estimator.

### 4. `statistics-visualizer` (Statistics Visualizer)
- **Interaction:** paste a list of numbers (class scores, survey data); mean/median/mode/range/
  standard deviation/quartiles render instantly alongside a live histogram and box plot.
- **Demand:** "standard deviation calculator" and "mean median mode calculator" are huge.
  Incumbents show tables of numbers with ads; none draw the distribution. Client-side privacy
  matters here (real student data never leaves the browser).
- **Platform fit:** the exception: text input, not sliders, so this is a **classic tool**
  (config.ts + bespoke Widget) on a new `math` engine (`src/lib/math/statistics.ts`, engine-first
  with unit tests), reusing the hero-metric + stat-grid design language.
- **Unlocks:** linear-regression-playground, z-score-calculator, normal-distribution-visualizer.

### 5. `function-grapher` (Function Grapher)
- **Interaction:** type `f(x)`, get a live plot; parameter sliders (a, b, k), multiple curves,
  zoom/pan, tap-to-trace coordinates.
- **Demand:** enormous ("graph a function online", "function plotter", long-tail "plot sin(x)/x").
  Desmos and GeoGebra are strong but heavy, account-pushing, and slow to first paint; target the
  long-tail "plot X quickly" intent, not the head "graphing calculator" term.
- **Platform fit:** sim for rendering, plus the new **expression parser** reusable core. Biggest
  lift of the five; build **last**, after the plugin and design language are proven.
- **Unlocks:** derivative-visualizer, polar-grapher, parametric-grapher, inequality-grapher,
  fourier-series-visualizer.

## Phased execution

### Phase 0: Evidence (RIE seeding) - before any code
1. Author `research/datasets/math.json`: one record per candidate above plus the backlog, with
   real queries, incumbents (desmos, symbolab, calculator.net, mathsisfun, omnicalculator, PhET),
   weaknesses, and demand/competition/evergreen scores. Dataset authorship stays in the main
   session (never delegated).
2. Add a `math` domain to `src/lib/research/taxonomy.ts` with transformations (Trigonometry,
   Algebra, Probability, Statistics, Graphing) and expected slugs.
3. `npm run research:validate` then `npm run research`; confirm the math tools rank on the same
   scoreboard as the CSV/physics backlog and adopt the RIE's ordering if it disagrees with the
   intuition above.

### Phase 1: Category + plumbing (one PR)
- `src/data/categories.ts`: `{ slug: 'applied-math', name: 'Applied Mathematics', segment: 'math' }`
  with a distinct accent (candidate: a slate blue, distinct from physics `#0369A1`).
- `src/data/engines.ts`: declare the `math-lab` engine (category `applied-math`) and the `math`
  engine for data-input tools; add pattern rows in `src/data/category-sections.ts`. Decision point
  at implementation: whether `math-lab` can share the existing `simulate` pattern or needs its own
  `math-explore` pattern (validators decide; never edit the validators).
- Scaffold `src/lib/simulation/plugins/math/` and add it to `DOMAINS`.
- Add an e2e boot spec (`tests/e2e/math.spec.ts`) mirroring `physics.spec.ts`.

### Phase 2: Build (one fully-ready PR per tool, in this order)
1. unit-circle-explorer (establishes the math plugin end to end)
2. quadratic-equation-explorer
3. probability-simulator
4. statistics-visualizer (establishes the `math` engine + statistics lib)
5. function-grapher (expression parser core first, exposed for reuse, then the sim)

Sims are eligible for `tool-builder` agents in worktree isolation once the plugin exists (parallel
2 and 3); the statistics engine and the expression parser are engine-selection judgment calls that
stay in the main session. Every tool ships with model tests, manifest content passing
`seo:gate:sim` (or `seo:gate` for statistics), `npm run build`, and desktop + Pixel 5 e2e green.

### Phase 3: Content and launch
- Guides per tool (student "how to" + teacher "classroom" angle), FAQs targeting the seeded
  queries, knowledge overlays; no em-dashes anywhere.
- Cross-link with the physics cluster (shared "simulate, don't memorize" positioning) and the
  percentage/number tools.
- Post-deploy: IndexNow is automatic; watch `npm run check:indexing` in the weekly sweep.

## Backlog (expected slugs for the taxonomy)

matrix-calculator, linear-regression-playground, triangle-solver, fraction-calculator,
prime-factorization, gcd-lcm-calculator, combinations-permutations-calculator,
normal-distribution-visualizer, derivative-visualizer, monte-carlo-pi-estimator,
fourier-series-visualizer, scientific-calculator.

## Effort and risk

- unit-circle / quadratic / probability: comparable to a physics sim each (the shipped cluster
  averaged about a day per sim with the platform mature).
- statistics-visualizer: plus a half day for the engine lib and tests.
- function-grapher: 2-3x a sim; the parser is the risk (edge cases, implicit multiplication,
  domain errors). Mitigate with an exhaustive unit-test suite and by shipping it last.
- SERP risk: graphing head terms are Desmos-owned; win the long tail and the "instant, no
  account, private" positioning instead. All five degrade gracefully to static render if JS
  features are limited on old devices (same guarantee as physics sims).
