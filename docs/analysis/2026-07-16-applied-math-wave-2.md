# Applied Math Wave 2: Five Tools, Phase-wise

Date: 2026-07-16
Baseline: 95 tools (unit-circle-explorer shipped on branch `applied-math-unit-circle` with the
category, the math-lab domain, and the one-viewport simulation dashboard). RIE evidence and
ordering: docs/analysis/2026-07-14-applied-math-category-plan.md (Phase 0 result section).

## The five (evidence order, scores from research/reports)

1. **quadratic-equation-explorer** (71.3, math-lab sim) - sliders for a/b/c morph a live parabola;
   drag the vertex on the canvas; roots, vertex, discriminant readouts; formula tile doubles as a
   discriminant calculator. No graph tile (the canvas IS the graph); the dashboard collapses that
   slot automatically.
2. **fraction-calculator** (69.4, math engine) - add/subtract/multiply/divide two fractions or
   mixed numbers with the simplification worked step by step. Ships the NEW `math` engine.
3. **combinations-permutations-calculator** (69.0, math engine) - nCr and nPr with the formula
   expanded, with/without repetition, and plain-language "ways to choose" phrasing.
4. **prime-factorization-calculator** (68.1, math engine) - factor a number (exponent form +
   divisibility steps) plus GCF and LCM against an optional second number.
5. **probability-simulator** (67.2, math-lab sim) - animated coin/dice trials with a seeded
   deterministic RNG; the stream graph shows empirical frequency converging on the theoretical
   value (law of large numbers); tap the canvas to run one trial.

## The `math` engine (new, ships inside the fraction-calculator commit)

Mirrors the datetime engine exactly: a consumer of the platform layers, no parallel infrastructure.

- `src/lib/engines/math/`: `types.ts` (MathTool = SmartFieldDef fields + InteractiveResult out),
  `models.ts` (pure math: gcd/lcm, factorial, nCr/nPr, prime factorization, fraction arithmetic,
  all bigint-safe within documented ranges), `validation.ts`, `registry.ts` (MATH_CALCULATORS +
  `runMath`), `calculators/<id>.ts`, `examples.ts`, `manifest.ts`, unit tests per module.
- `src/tools/_shared/MathWidget.astro`: thin DateTimeWidget clone (SmartInput form +
  ExperienceRenderer output, live on input, state persistence, Load Example / Reset / Copy).
- Wiring: `runMath` on the ToyTools global; engine row in `src/data/engines.ts` (id `math`,
  category `applied-math`, pattern `math-calculate`, sharedWidget MathWidget.astro); pattern row
  in `category-sections.ts` ({ title: 'Calculators', order: 2 }); `math: MATH_CALCULATORS` in both
  validators' engine-registry maps.
- Each tool: 3-line Widget.astro wrapper + config.ts + knowledge.ts + faq.ts + Guide.astro,
  `registries:generate`, seo:gate as done-condition.

## Commit plan (one push per commit, this branch)

1. This plan document.
2. quadratic-equation-explorer: model + draw + manifest + unit tests + e2e boot slug +
   seo:gate:sim + build + e2e.
3. math engine + fraction-calculator (engine lands with its first consumer so the unused-processor
   sweep stays quiet): engine lib + widget + wiring + tool + content + gate + e2e interaction test.
4. combinations-permutations-calculator: calculator + tool + content + gate.
5. prime-factorization-calculator: calculator + tool + content + gate.
6. probability-simulator: model + draw + manifest + tests + e2e slug + gate.

Done-condition per commit: `npm run test`, `npm run build` (all validators), the tool's seo gate
(`seo:gate` / `seo:gate:sim`), and the affected Playwright suites green on desktop + Pixel 5.

## Risks / decisions taken up front

- Quadratic at a = 0 stops being quadratic: the model clamps the effective a away from zero and an
  observation explains the degenerate line case; every measurement stays finite (platform rule).
- Roots can be complex: roots are narrated (observations/explanation) rather than forced into
  numeric measurement cards; the discriminant, vertex, and intercept cards are always finite.
- Probability needs randomness but models must stay deterministic and testable: a seeded LCG lives
  in `vars`, so runs are reproducible and the narrative sweep stays total.
- Fraction inputs are text ("3/4", "1 2/3", "-5/8"): the calculator owns parsing and returns
  validation-error results, never throws; denominators are capped to keep exact integer math safe.
- Combinatorics overflows fast: nCr/nPr computed with BigInt and rendered with grouping; n is
  capped at 170 in the UI and the cap is explained in an assumption card.
