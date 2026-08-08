# Query to tool matching: audit and plan (2026-08-04)

**Question asked:** does the SEO engine actually surface the *right* tool for a user query, and are
the simulators showing up at all?

**Short answer:** on-site search resolved 86 percent of our own recorded evidence queries to the
right shipped tool, and the 27 that failed clustered hard on the simulators. Off-site, the
simulators had no "simulator" anchor left anywhere a search engine weights: the slug rename that
merged on 2026-08-04 removed the word from every URL, tool name, page title, and H1, and nothing
replaced it. The word survived only in body prose. Separately, nothing in the SEO engine ever
checked that a query resolves to its intended page, so both of these regressed silently.

Baseline for diffing: 119 registered tools, 14 simulations (11 physics, 3 applied math), 188
evidence queries across `research/datasets/*.json` that point at a shipped tool.

---

## What was measured

1. **On-site retrieval.** Built the real client search index (`buildClientIndex`) and ran every
   `searchQueries` entry from `research/datasets/*.json` through the real ranker (`rankEntries`),
   filtered to records whose `proposedTool` is actually shipped. Scored "is the intended tool in
   the top 3".
2. **On-page targeting.** Inspected built `dist/` HTML for the simulation pages: `<title>`,
   `<meta name="description">`, `<h1>`, headings, JSON-LD, and where the word "simulator" appears.
3. **Engine coverage.** Read `seo-engine/scripts/writing.ts`, `config/writing-rules.json`,
   `utils/queries.ts`, `utils/tool-profile.ts` to see what the gate scores.
4. **Wiring.** `src/lib/search/rank.ts`, `src/data/search-aliases.ts`,
   `src/lib/simulation/generate.ts`, `src/data/tool-redirects.ts`, category metadata.

---

## Findings, ranked

### 1. The simulators lost their intent word and got nothing back (highest impact)

`src/data/tool-redirects.ts` records the 2026-08-04 rename: all 11 physics sims and
`probability-simulator` went from `*-simulator` / `*-explorer` to `*-calculator` /
`*-solver`. The rename itself is defensible and evidence-backed ("ohms law calculator" is the
higher-volume head term). The problem is that the simulator half of the intent was dropped rather
than kept alongside it.

On `dist/tool/physics/pendulum-period-calculator/index.html` at audit time:

| surface | value | contains "simulator" |
|---|---|---|
| URL | `/tool/physics/pendulum-period-calculator/` | no |
| `<title>` | `Pendulum Period Calculator: Length, Gravity & Energy` | no |
| `<h1>` | `Pendulum Period Calculator` | no |
| meta description | `Drag the bob and let it swing...` | no |
| any `<h2>` | (none carried it) | no |
| body prose | "The simulator shows the period updating..." | yes, 5 times |

Every one of the 14 sims had this shape. So for the entire "X simulator" / "X simulation" /
"interactive X" query class, which is exactly what a physics or math sim wins on, our only signal
was unweighted body copy. The old `*-simulator` URLs are now `noindex` meta-refresh stubs, so any
authority they had is deliberately parked, not redirected with a 301 (a static host cannot issue
one). That is the right call for a static site, but it means the simulator term has to be earned
again on the new URL, and it was not being asked for anywhere.

Category pages did not pick up the slack either: `/category/physics/` shipped `<title>Physics</title>`
and `<h1>Physics</h1>`. The description says "Interactive physics simulations you can see, touch,
and experiment with", so the concept existed in the data and simply never reached a weighted slot.

### 2. The ranker required every query word to match, so generic head nouns killed good matches

`scoreEntry` in `src/lib/search/rank.ts` was a strict AND over query words: if any single word
scored 0, the whole entry dropped to 0. There was no stopword or generic-term handling. The result
was that appending the noun people habitually append destroyed the match:

| query | result at audit time | intended |
|---|---|---|
| `quadratic formula calculator` | no results | `quadratic-equation-solver` |
| `discriminant calculator` | no results | `quadratic-equation-solver` |
| `coefficient of friction calculator` | no results | `inclined-plane-calculator` |
| `keyword density tool` | no results | `word-frequency-counter` |
| `backwards text generator` | no results | `reverse-text` |
| `interactive unit circle` | no results | `unit-circle-calculator` |

`quadratic-equation-solver` carries the tag "quadratic formula". It still returned nothing for
"quadratic formula calculator", because the tool is a *Solver* and the word "calculator" appeared in
neither its name nor its terms. This was a systemic bug, not a per-tool content gap.

### 3. Query punctuation was never normalized

`normalizeQuery` lowercased, trimmed, and collapsed whitespace, then split on a literal space.
Target strings get split on `/[^a-z0-9]+/`, queries did not. So `V=IR calculator`, `pv=nrt
calculator`, and `T=1/f` arrived as single opaque tokens and matched nothing, even though those are
exactly the formula-shaped queries our physics content is written around and they are already
recorded in `research/datasets/physics.json`.

### 4. The evidence we already collect was never used as a check

`research/datasets/*.json` carries `searchQueries` per record. Consumers at audit time: the RIE
opportunity model, the SEO breadth scorer, the confidence scorer. Nothing asserted that a shipped
tool actually answers the queries that justified building it. We had the ground truth sitting in the
repo and no gate reading it. That is why finding 2 could exist unnoticed.

Measured coverage over the 188 evidence queries that point at shipped tools: **161 resolved into the
top 3 (86 percent), 26 returned nothing at all, 1 returned the wrong tools.** Thirteen of the 27
failures were simulations.

### 5. `seo:gate` scores prose quality, not query targeting

`config/writing-rules.json` weights clarity, readability, scannability, examples, teaching, jargon,
AI tells, comparison and mistake coverage. All of it is about how the prose reads. There was no
check anywhere that the title, H1, H2s, or meta description actually contain the query forms the
page is meant to rank for. A page could score 90 on the gate while targeting nothing. The gate is
good at what it does; it simply was not a targeting gate, and we had been treating it as if it were.

`seo-engine/scripts/utils/queries.ts` does generate query variants from a slug, but only for SERP
research fetching, and its `actionTokens` list was `encoder, decoder, converter, generator,
calculator, formatter`. "simulator", "solver", "tracker", "viewer", and "planner" were absent, so
even the research stage under-generated for the sim cluster.

### 6. Alias and tag coverage for sims was uneven

`presentation.tags` is the only field that reaches the search index (`seo.keywords` flows to
`knowledge.keywords`, which the index does not read). Tags carried a simulator phrase for 10 of 14
sims. `frequency-period-calculator`, `unit-circle-calculator`, and `quadratic-equation-solver`
carried none, and `inclined-plane-calculator` and `doppler-effect-calculator` only carried the
generic "physics simulator" rather than their own subject. `searchAliases` covered 13 of 14 sims
(`frequency-period-calculator` was missing entirely) and no sim alias contained "simulator" or
"simulation". This was hand-authored per sim, which is why it drifted.

### 7. Things that were already fine

Worth stating so nobody re-fixes them: sims are in the registry, sitemap, IndexNow list, search
index, and homepage directory. Internal linking is healthy (20 pages link to
`pendulum-period-calculator`, 27 to `projectile-motion-calculator`). JSON-LD emits
`LearningResource` + `SoftwareApplication` + `FAQPage` + `HowTo` + `BreadcrumbList`, which is the
right shape for a sim. The redirect stubs are correct and structurally detected by Quality Guardian.

---

## Plan

Ordered by impact per unit of work. Phases 1 and 2 are the durable fix (a gate that makes this
class of regression impossible); phase 3 is the simulator recovery the audit was asked about.

### Phase 1: fix the ranker (retrieval correctness, no content change)

Files: `src/lib/search/rank.ts`, `src/lib/search/rank.test.ts`.

1. **Soft generic terms.** A small closed set of head nouns and modifiers that a query may contain
   without being required to match: `calculator, tool, online, free, app, generator, maker,
   converter, solver, checker`. A soft term that matches still contributes its tier score; a soft
   term that misses is dropped instead of zeroing the entry, provided at least one non-soft term
   matched. "simulator" and "simulation" stay hard terms, since they genuinely discriminate between
   a sim and a plain calculator.
2. **Normalize query punctuation.** Split the query on the same `/[^a-z0-9]+/` boundary the targets
   use, so `V=IR` becomes `v ir` and `pv=nrt` becomes `pv nrt`.
3. Tests pinning every row in the finding-2 and finding-3 tables, so these exact queries can never
   silently break again.

Risk: loosening AND can add noise. Mitigated by requiring at least one hard-term match and by
phase 2, which measures precision as well as recall across all 188 queries.

### Phase 2: a query coverage gate (the durable fix)

New: `scripts/check-query-coverage.ts`, wired into `npm run verify` and `scripts/verify.sh`
alongside the other validators (and mirrored into `.github/workflows/quality-guardian.yml`, per the
same-commit rule in CLAUDE.md).

It assembles the full known-query corpus, deterministic and offline:

- `searchQueries` from `research/datasets/*.json`, for records whose `proposedTool` is shipped
- every phrase in `src/data/search-aliases.ts`
- `knowledge.keywords` and `concepts.aliases` for every tool, sims included
- generated modifier variants (see phase 3) so the corpus grows with the catalog

and asserts two things per query:

- **Retrieval:** the intended tool is in the ranker's top 3. Fails below a threshold that starts at
  the measured baseline and ratchets up as phases 1 and 3 land, so it locks in gains rather than
  blocking on the backlog.
- **Targeting:** the query's distinctive tokens (after dropping soft terms) appear in the built
  page's `<title>`, `<h1>`, an `<h2>`, or the meta description, not only in body prose. This is the
  check that would have caught finding 1 the moment the rename merged. It reads `dist/`, so it runs
  after the build like `check-budget.ts` does.

Output is a per-tool report of unmatched queries, which doubles as the content brief for whoever
fixes them.

### Phase 3: give the simulators their intent word back, mechanically

Do **not** revert the slugs. The URLs stay `*-calculator`, the rename is evidence-backed, and
churning them again would burn the redirect budget for nothing. Instead add the simulator surface
where it is cheap and derive it so it cannot drift:

1. **Derived modifier expansion** in `src/lib/simulation/generate.ts`: from `metadata.title` and
   `concepts.aliases`, generate `<subject> simulator`, `<subject> simulation`, and
   `interactive <subject>` into the tags for every sim, current and future. This fixes finding 6 and
   the tag half of finding 1 for all 14 at once, with no per-manifest editing.
2. **Weighted slots.** Extend the generated sim page so the intent word lands somewhere that counts:
   the `seo.description` gains the simulator phrasing, and the sim page emits an H2 using the
   `<subject> simulator` form. Keep the H1 and browser title as the calculator form (that is the
   head term); the simulator form rides in the description and an H2. Titles still come from
   `generatePageTitle`, so nothing is set per tool.
3. **Category pages.** `/category/physics/` becomes "Physics Simulations" and
   `/category/applied-math/` "Interactive Math" in `seoTitle` and H1, with the plain name kept for
   nav chrome. Cheap, and these are the two pages best placed to hold the head "physics simulator"
   term.
4. **Aliases.** Add the missing `frequency-period-calculator` entry and let phase 3.1 supply the
   simulator phrases, so `search-aliases.ts` stops being the place sims are hand-maintained.
5. **Research stage.** Add `simulator, solver, tracker, viewer, planner, visualizer` to
   `actionTokens` in `seo-engine/scripts/utils/queries.ts` so SERP research stops under-generating
   for these clusters.

### Phase 4: make targeting part of the content gate

Add a targeting section to `seo:writing-tool` / `seo:gate` that scores whether a tool's title, H1,
H2 set, and description cover its top query forms, reusing the phase 2 corpus. Weight it in
`config/writing-rules.json` alongside the prose criteria. Until this exists, a green `seo:gate`
means "reads well", not "targets anything", and we should stop reading it as the latter.

### Done condition

Every phase is done when `npm run verify` exits 0, and the sim content additionally passes
`npm run seo:gate:sim -- <slug>`. Phase 3 touches the built HTML of 14 tool pages plus 2 category
pages, so `npm run check:budget` matters there; the additions are a description and one heading, so
headroom is not a concern, but it is a real gate and it runs.

### Measurement

Retrieval is measurable immediately and locally (the phase 2 number). Ranking impact is not: the
rename landed 2026-08-04 and Search Console has no post-rename data yet. Re-measure indexing and
query coverage with `npm run check:indexing` around **September 2026**, the same checkpoint already
set for the cluster-structure work, and treat the two together since they touch the same URLs.

---

## Outcome (implemented 2026-08-05, all four phases)

`npm run verify` green on all seven steps.

| measure | before | after |
|---|---|---|
| retrieval, evidence corpus (995 queries) | 86.0% (856) | **88.8% (884)** |
| queries newly answered | | 28 |
| queries regressed | | 0 |
| targeting, real query phrasings (347) | not measured | **63.7% (221)** |
| sims with simulator vocabulary | 10 of 14 | **14 of 14** |

Every query in the finding-2 and finding-3 tables now resolves to its intended tool, and each is
pinned by a unit test.

Four things landed that the plan did not anticipate, all found by measuring rather than reasoning:

1. **Precision guards.** Loosening the AND let noise in: "free fall" returned the lowercase
   converter (because "fall" is one edit from "all"), and "v = i r" returned every "Remove ..."
   tool (because "r" starts "remove"). Fixed by three rules: an entry cannot be carried by
   typo-forgiveness alone, a single letter only matches as a whole word, and a term below three
   characters cannot substring-match.
2. **An alias-phrase tier.** "yml to json" lost its own alias to a three-word composite on
   `json-to-yaml-converter` and went to the tool that does the exact opposite. A whole query that IS
   a curated alias now outranks any composite, yielding only to the name itself.
3. **Exact word beats prefix.** "rem calculator" ranked "Remove Emoji" above
   `px-to-rem-converter`, because a name-initial partial-word prefix outscored an exact word match.
   `namePrefix` now requires a word boundary, with `namePartialPrefix` below `nameWordExact`.
4. **Stopwords.** "friction on a ramp calculator" returned nothing because "a" had to match. Grammar
   words are soft; "to" and "from" deliberately are not, since they carry direction.

Deviation from the plan, phase 3.2: authored meta descriptions were left alone rather than having a
mechanical simulator sentence appended to all 14. The H2 carries the term in a slot that actually
ranks, and machine-appending a clause to fourteen hand-written descriptions would have degraded
prose to satisfy our own checker. The one description that did change (`frequency-period`) was
edited by hand, because the gate caught a genuine gap: the page never asked for "cycles per second".

The stage H2 also fixed a real accessibility gap: the canvas panel was the only tile with no visible
heading, carrying an `aria-label` alone.

One wiring detail worth remembering: the CI `seo:gate` job runs in its own job that never built the
site, so `queryTargeting` would have reported "not measured" and skipped on every PR. That job now
builds and runs `check:queries` first. A criterion that degrades to "skipped" in CI is the same
silent pass this audit was written about.

### Explicitly out of scope

A `/simulations/` hub page landing the head "physics simulator" term is the obvious next lever, but
it is a new indexable page with its own content and internal-linking design, not a fix to an
existing one. Worth deciding on separately once phase 2 shows what the sim cluster actually
retrieves for.
