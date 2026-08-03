# Why the text and word tools rank and the later clusters do not

**Date:** 2026-08-03
**Trigger:** The `text-utilities` cluster ranks top in search while later clusters (health-fitness,
design-tools, physics, money-finance) do not. Question asked: what did we do right there that we
stopped doing elsewhere?

**Method:** measured the shipped artefacts, not intuition. Sources: `docs/code-map.json` for the
tool inventory, `git log --diff-filter=A` per tool directory for cluster age, on-disk
`Guide.astro`/`faq.ts`/`knowledge.ts` for content volume, and a link crawl of the built `dist/`
(291 HTML pages) for inbound internal links per tool URL.

## Baselines at time of writing

104 registry tools across 11 categories. Cluster arrival dates:

| category | n | first tool | last tool |
|---|---|---|---|
| text-utilities | 29 | 2026-06-07 | 2026-07-02 |
| number-utilities | 7 | 2026-06-07 | 2026-07-07 |
| productivity | 4 | 2026-06-07 | 2026-06-07 |
| developer-utilities | 25 | 2026-06-13 | 2026-07-04 |
| money-finance | 8 | 2026-06-29 | 2026-07-04 |
| generate | 5 | 2026-07-05 | 2026-07-05 |
| physics | 11 | 2026-07-07 | (sim-derived) |
| date-time | 5 | 2026-07-08 | 2026-07-10 |
| applied-math | 6 | 2026-07-16 | (sim-derived) |
| health-fitness | 9 | 2026-07-23 | 2026-07-23 |
| design-tools | 5 | 2026-07-31 | 2026-07-31 |

## The finding that rules out the obvious answer

It is not content depth. Average authored guide prose per tool, longest first:

| category | guide words | FAQ items | FAQ words | knowledge words |
|---|---|---|---|---|
| productivity | 1326 | 14.0 | 978 | 274 |
| generate | 1314 | 22.8 | 1432 | 288 |
| developer-utilities | 842 | 8.5 | 576 | 303 |
| number-utilities | 834 | 7.7 | 517 | 296 |
| applied-math | 832 | 9.0 | 638 | 248 |
| health-fitness | 721 | 6.0 | 463 | 251 |
| date-time | 654 | 5.0 | 330 | 285 |
| design-tools | 651 | 5.0 | 343 | 308 |
| money-finance | 645 | 8.2 | 593 | 318 |
| **text-utilities** | **602** | 8.8 | 610 | 301 |

The ranking cluster has the **shortest** guides on the site. Writing more words per page is not the
lever that produced the result, and treating "raise the word count" as the fix would spend effort on
the one variable the evidence rules out.

## What is actually different

### 1. One page per exact query, not one page per concept

`text-utilities` is 29 tools over roughly six concepts. Counting alone is nine pages: `word-counter`,
`character-counter`, `letter-counter`, `sentence-counter`, `paragraph-counter`, `line-counter`,
`space-counter`, `word-frequency-counter`, `reading-time-calculator`. Cleanup is another twelve.
Every slug is the phrase a person types.

Later clusters ship one tool per distinct idea and stop. `physics` is eleven tools over eleven
concepts, with slugs like `pendulum-simulator`, a string with close to no search volume (the query
is "pendulum period calculator"). `design-tools`, `date-time` and `generate` have the same shape:
correct tools, no variant coverage.

### 2. Variant fan-out was affordable because the engine came first

18 of 29 text widgets are sub-900-byte wrappers over a shared engine widget. The marginal cost of
the ninth counter was close to zero, so a page per query was the rational call. Later clusters did
build engines first (`wellness`, `finance`, `datetime` all have thin wrappers too) but never spent
the resulting cheapness on query coverage: `wellness` powers bmi/body-fat/ideal-weight/tdee and
stopped at four pages.

### 3. Tool groups, which only two clusters have

| category | grouped | ungrouped |
|---|---|---|
| text-utilities | 25 | 4 |
| developer-utilities | 23 | 2 |
| every other category | 0 | 55 |

Measured inbound internal links per tool page from the built site:

| category | avg inbound pages | max |
|---|---|---|
| text-utilities | 19.6 | 42 |
| developer-utilities | 16.9 | 38 |
| physics | 12.9 | 25 |
| number-utilities | 12.4 | 16 |
| money-finance | 12.4 | 18 |
| health-fitness | 12.0 | 20 |
| date-time | 11.0 | 12 |
| design-tools | 11.0 | 12 |
| generate | 11.0 | 12 |

Cluster age confounds that table, so the same measurement was run **within** a single category,
which holds age, category page, and knowledge-graph derivation constant:

| category | grouped avg | ungrouped avg |
|---|---|---|
| text-utilities | 20.5 (n=25) | 14.2 (n=4) |
| developer-utilities | 17.7 (n=23) | 8.5 (n=2) |

The ungrouped stragglers inside the winning clusters are the low outliers: `jwt-decoder` at 4,
`text-compare` at 8, `json-validator` at 13. `GroupSwitcher` (rendered by `ToolPage.astro`) makes
every member link to every sibling, so an N-member group hands each member N-1 inbound links.

This is net of a real cost. `ToolDirectory.astro` collapses a group to a **single** homepage entry
pointing at `group.members[0]`, so non-first members lose their homepage link.

### 3a. How much of that gap grouping actually causes (correction)

The two tables above overstate the causal effect of grouping, and the difference changes what is
worth doing first. Two things inflate them:

- **`RelatedTools` already links siblings.** `ToolPage.astro` excludes group members from
  `RelatedTools` because the switcher covers them, so grouping partly *replaces* links rather than
  adding them. Measured in `dist/`, every tool in every ungrouped candidate group already links to
  exactly **3** siblings.
- **Selection effect.** The ungrouped stragglers inside the winning clusters (`jwt-decoder` at 4,
  `text-compare` at 8) are one-off tools with few natural relations. They are low because they are
  unlike their neighbours, not only because they are ungrouped.

Modelled per member, from measured current state:

| candidate group | n | sibling links now | after grouping | net per member |
|---|---|---|---|---|
| wellness body metrics | 6 | 3.0 | 5 | +2, minus 1 homepage |
| finance growth | 6 | 3.0 | 5 | +2, minus 1 homepage |
| number-utilities calculate | 7 | 3.0 | 6 | +3, minus 1 homepage |

So roughly **+1 to +2 inbound links per page**, not the +6 the headline control suggested. Group
size is what makes it pay: a nine-member text group yields 8 sibling links against the same 3
baseline. Grouping is cheap, safe, and worth doing, but it is a supporting move. The ranking result
came from factors 1 and 2, which put more pages against more exact queries.

### 4. Niche authority requirements

"word counter" has no authority gate. `bmi-calculator` competes with CDC and Mayo Clinic,
`sip-calculator` and `compound-interest-calculator` with banks and brokerages. Those are YMYL
queries where Google requires site-level trust that a young static site does not have, regardless of
page quality. The RIE scores `competition` at weight 0.16 (`src/lib/research/config.ts`) but has no
signal separating "crowded" from "authority-gated", which is a harsher and differently-shaped
problem. Health and money-finance may be partly unwinnable on content alone.

### 5. Age

text-utilities has had roughly eight weeks of crawl history, design-tools three days. Real, and it
inflates the headline table, but it does not explain the within-category grouped/ungrouped gap in
the control above.

## The transferable rule

Before shipping a cluster:

1. Choose slugs that are literal search phrases, not concept names.
2. Spend the engine's cheapness on query coverage: one page per phrase variant, not one per concept.
3. Declare a tool group in `src/data/tool-groups.ts` and set `toolGroup` on every member.
4. Prefer niches with no authority gate. Treat YMYL clusters as a different, slower game.

Do not treat guide word count as the lever. The data says it is not one.

## Candidate follow-ups, in cost order

**Retrofit tool groups on existing engine-sharing clusters.** No URL changes, no new pages, no
content. It is a `toolGroup` field per member plus a `src/data/tool-groups.ts` entry.
`validate-registry.ts` enforces bidirectional membership and same engine/pattern across members, so
the constraint is that members must already share an engine and pattern. Valid candidates, by
engine/pattern, measured from the registry:

| group | engine/pattern | n | members |
|---|---|---|---|
| wellness body metrics | `wellness`/`health-calculate` | 6 | bmi, body-fat, heart-rate-zone, ideal-weight, macro, tdee |
| health trackers | `tracker`/`health-track` | 3 | body-weight, move-today, water-intake |
| finance growth | `finance`/`finance-growth` | 6 | cagr, compound-interest, inflation, roi, rule-of-72, sip |
| finance planning | `finance`/`finance-planning` | 2 | emergency-fund, savings-goal |
| everyday calculators | `calculator`/`calculate` | 7 | discount, margin, markup, percentage, scientific, tax, tip |
| datetime calculate | `datetime`/`datetime-calculate` | 2 | age, date-difference |
| datetime convert | `datetime`/`datetime-convert` | 2 | timezone, unix-timestamp |
| px converters | `units`/`unit-convert` | 2 | px-to-dp, px-to-rem |
| credential generators | `generation`/`generate-credential` | 2 | password, random-string |

Worth knowing before doing this: **only `TextProcessorWidget` and `ConverterWidget` implement the
shared `group:{id}` state key.** `WellnessWidget`, `FinanceWidget`, `MathWidget`, `DateTimeWidget`
and `GeneratorWidget` do not, so a retrofitted group renders the switcher (real crawlable links,
works without JS) without carrying input across members. For calculators that is correct behaviour
rather than a gap: BMI takes height and weight, macro takes goals, and sharing those would be wrong.
The shared-input workspace only makes sense where members operate on the same input, which is why
text has it.

Prefer the larger groups. At n=2 the net is close to zero once the homepage collapse is counted.

**Variant fan-out on shipped engines.** New pages on existing engines, which is the text cluster's
actual playbook. Route through the RIE rather than intuition, per the standing rule in `CLAUDE.md`.

**Physics slug intent.** `*-simulator` slugs likely miss the calculator-intent queries. Renaming is
a URL migration needing noindex redirect stubs in `src/data/tool-redirects.ts` and would reset the
crawl history on those URLs. Worth its own decision, not a drive-by fix.

## Effect on crawled URLs

Recorded here because it gates which follow-up is safe to do first:

- Adding tool groups changes **no URL**. The manifest, sitemap, and `dist/indexnow-urls.json` are
  registry-derived from slugs, which do not move. It changes internal link graph shape only, plus
  one lost homepage link per non-first group member.
- Variant fan-out is purely additive: new URLs enter the sitemap and IndexNow, nothing existing
  moves.
- Slug renames are the only option here that invalidates crawled URLs, and they need redirect stubs.
