# New tool spec: <Name>

Fill in every field before coding. Leave nothing as "TBD" without listing it under Open questions.

## 1. Identify

- **userJob (one sentence):**
- **Substitution test (why a chat answer is not enough):**
- **Fit check:** static-first [ ] no backend [ ] no account [ ] no upload [ ] no runtime CDN [ ]
- **Overlap searched (commands and what they found):**
- **Closest existing tools, and why this is not an improve-tool job:**
- **Category (`src/data/categories.ts` slug):**
- **Slug:**
- **Name (no '&'; no em dash here or anywhere in the PR):**
- **addedOn (ship day, YYYY-MM-DD):**
- **Seo title:**
- **Tagline (80 chars max):**

## 2. Conceptualise

- **Engine (`src/data/engines.ts`) and pattern:**
- **New engine?** no / yes (major bump, needs Atharva)
- **Pure engine API:**
  ```ts
  // export function <name>(input: <Input>): <Result>
  ```
- **Inputs (name, unit, range, default):**
- **Outputs (name, unit, precision):**
- **Interaction pattern (`docs/interaction-patterns.md`):**
- **Edge cases and what the page says for each:**
- **Craft (`tool-craft` skill): id, kind, the failure it solves:**
- **Privacy:** trustVariant: ___ / keepInput: no or yes (why) / url-state mode: off, manual or auto / nothing saved by default [ ] no credentials stored [ ]
- **Dependencies and size:** libraries (licence, gz size), loaded by dynamic import on: ___
- **Budgets (gz):** JS under 24,576 B [ ] CSS under 18,432 B [ ] HTML under 34,816 B [ ] total under 62,464 B [ ] /search/ under 31,744 B [ ] search-terms.json under 10,240 B [ ] (if one trips: trim or isolate, never raise)
- **citation.nonGoal (what it does not do):**
- **methodology (name and one-line detail):**

## 3. Skeleton

- [ ] `npm run scaffold:tool -- ... --dry-run` output reviewed
- [ ] Engine file and registry entry: `src/lib/engines/<engine>/...`
- [ ] Engine unit tests, plus a lazy-load test if the engine is lazily loaded:
- [ ] `src/tools/<segment>/<slug>/` config.ts, Widget.astro, faq.ts, Guide.astro, knowledge.ts
- [ ] `src/data/guide-published.ts` entry
- [ ] `knowledge.primaryConcepts[0]`:
- [ ] `src/data/search-aliases.ts` phrases:
- [ ] Unique glyph in `glyphs.ts` and `SLUG_GLYPH`, then `npm run icons:generate`
- [ ] `npm run registries:generate` and `npm run map:generate` (no hand-edited `*.generated.ts`)
- [ ] Research seed in `research/datasets/<domain>.json`, `npm run research:validate`, reports regenerated
- [ ] Seed `searchQueries`:
- [ ] `tests/e2e/<slug>.spec.ts`, and `fold.spec.ts` passes on Pixel 5
- [ ] Widget renders under the Tool Render Unit contract (no shell markup)
- [ ] llms: `dist/llms.txt` and `dist/llms-full.txt` read, `npm run llms:golden` run

## 4. PR checklist

- [ ] Version bump (`npm run version:bump minor "<summary>"`) and CHANGELOG entry
- [ ] PR body has `llms files: updated` or `llms files: no change needed` with a reason
- [ ] `npm run check:queries` targeting 100%
- [ ] `npm run check:craft` and `npm run check:budget` pass, no budget raised
- [ ] `npm run verify` alone, exit 0
- [ ] CI green: Content Gate, E2E (chromium), E2E (pixel5), PR Quality Check, GitGuardian

## Open questions for Atharva

1.
