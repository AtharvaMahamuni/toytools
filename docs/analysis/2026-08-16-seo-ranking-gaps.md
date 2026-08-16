# What is missing from the pages, and why they are not in the top 5

**Date:** 2026-08-16
**Version at time of writing:** alpha-v7.7
**Question asked:** what gaps do the current pages have, and why are they not ranking in the top 5?

**Method:** measured the shipped artefacts, not intuition. Sources: a full build of `dist/` (262
indexable pages after excluding redirect stubs), `npm run check:queries -- --report`, `npm run
seo:gate` on an eight tool sample, `docs/code-map.json`, `research/datasets/*.json`, the GitHub
Actions run history for `.github/workflows/indexing.yml`, and a link crawl of the built site.

## Baselines

| measure | value |
|---|---|
| indexable pages built | 262 (121 tool, 121 guide, 11 category, 9 standalone) |
| URLs in the sitemaps | 258 across 4 shards |
| tools with guide + FAQ + knowledge | 121 / 121 |
| `seo:gate` on 8 sampled tools | 77 to 87, all pass |
| query retrieval | 907 / 1021 (88.8%), floor 88.0% |
| query targeting | 272 / 361 (75.3%), floor 75.0% |
| tool pages with an H2 naming a concept | 121 / 121 |
| median unique (non boilerplate) words per tool page | 658 |
| repo history begins | 2026-07-03 (catalog dates to 2026-06-07) |

Every gate is green. That is the point of this document: the gaps are all in places nothing measures.

## Findings, ranked

### 1. There is no ranking or indexing data, and there never has been

`.github/workflows/indexing.yml` has run seven times on schedule since 2026-06-29 and reported
success every time. Inspecting the steps of the most recent run (`31358017287`, 2026-08-10):

| step | conclusion |
|---|---|
| Build (regenerates dist/indexnow-urls.json) | success |
| **Check indexing coverage** | **skipped** |
| **Skip notice** | **success** |

The step is gated on `if: ${{ env.GSC_SA_KEY_JSON != '' }}`. The secret has never been set, so every
run since the workflow landed has built the site, skipped the inspection, printed the notice, and
uploaded an empty artifact. `quality-guardian/reports/indexing/` contains only its `.gitkeep`.

The consequence is larger than a missing report. We do not know whether these pages are indexed at
all. For a domain roughly ten weeks old, the most probable answer to "why are we not in the top 5"
is that a large share of the 258 URLs are in "Discovered, currently not indexed" or "Crawled,
currently not indexed" and therefore hold no position whatsoever. Position work on a page Google has
not indexed is wasted effort, and we currently cannot tell those two situations apart.

Both prior audits set a re-measure checkpoint of September 2026 using `npm run check:indexing`
(`2026-08-03-text-cluster-ranking-factors.md`, `2026-08-04-query-to-tool-matching-audit.md`). That
checkpoint cannot be met as configured.

**This is the gap that blocks answering the question, and it costs two repository secrets.**

### 2. Every quality signal we have is self-referential

The gates are good and they measure real things. None of them compares a page to the pages that
actually rank.

- `seo:gate` scores `writingQuality`, `usefulness`, `seoCompleteness`, `toyToolsStyleScore` against
  `seo-engine/config/writing-rules.json`. All of that is how our prose reads, judged by our rules.
- `check:queries` scores retrieval and targeting against a corpus assembled from
  `research/datasets/*.json`, `src/data/search-aliases.ts`, and every `knowledge.ts` keyword. Every
  one of those is a phrase we wrote for ourselves.

So the honest reading of "word-counter scores 77 and passes" is "this page satisfies our own
standards for queries we chose to record". It is not evidence about the SERP.

The engine already has the missing half. `npm run seo:research` collects the real SERP and
competitor pages, and `seo:extract` derives competitor headings and content gaps into
`research/processed/<tool>/research.json`. That output is gitignored and regenerable, which is
correct, but **no gate reads it**, so competitor coverage is never a condition of shipping. The
2026-08-04 audit made exactly this observation one level down ("a page could score 90 on the gate
while targeting nothing"). The same shape holds one level up: a page can score 87 and pass every
gate while missing what the top five results all contain.

### 3. Nothing on any page speaks to authority, and half the catalog is YMYL

Measured over all 121 tool pages in `dist/`:

- **0** carry a single external outbound citation to a source, standard, or authority.
- **0** name an author or reviewer. The `SoftwareApplication` schema is `name`, `description`,
  `url`, `applicationCategory`, `operatingSystem`, `offers`, and nothing else.
- No `publisher`, no credential, no methodology statement.

For the text and developer clusters this barely matters, which is consistent with those clusters
being the ones that rank. For the 14 health tools and 8 finance tools it is decisive. `bmi-calculator`
is competing against the CDC and the NHS on a query class where Google explicitly weights
site level trust. Our BMI page cites nothing, is signed by nobody, and shows no date. The
2026-08-03 analysis flagged the authority gate as a category selection problem; this is the same
problem stated as a page level one, and part of it is addressable on the page.

### 4. 102 of 121 guide pages emit invalid Schema.org dates

`GuideLayout.astro:56-57` feeds `updatedAt` directly into the `Article` schema:

```ts
datePublished: updatedAt,
dateModified: updatedAt,
```

but `src/data/types.ts:36` documents that field as `// display string, e.g. "Jun 2026"`, and the
configs supply exactly that. Measured in the built output:

| value emitted | pages |
|---|---|
| `"Jul 2026"` | 52 |
| `"Jun 2026"` | 43 |
| `"Aug 2026"` | 7 |
| valid ISO 8601 | 19 |

`datePublished` is identically affected. 102 of 121 guides publish a date Google's parser cannot
read, so the dates are dropped and the `Article` item is degraded on every guide in health,
physics, finance, text cleanup, developer, generate, design and productivity.

The 19 valid ones are valid by accident: somebody typed an ISO date into a field meant for display,
which then renders "Updated 2026-06-07" to the visitor. Both surfaces are wrong, in opposite
directions, depending on the tool. One field is doing two jobs and failing both.

### 5. Tool pages carry no freshness or authorship signal at all

Guides at least declare `author: { '@type': 'Organization', name: 'ToyTools' }`. Tool pages declare
nothing: no `dateModified`, no `author`, no `publisher`. Grepping `dist/` for `dateModified` returns
121 files, all of them guides.

The tool page is the page meant to win the head term. It is the one page type on the site with no
recency signal of any kind, on a site whose entire competitive claim is that the tools work now.

### 6. 55 of 121 tool titles are truncated in the SERP

Title length, measured on the built `<title>`:

| segment | p50 | over 60 chars |
|---|---|---|
| health | 65 | **14 / 14** |
| math | 63 | 4 / 6 |
| datetime | 62 | 3 / 6 |
| physics | 61 | 6 / 11 |
| text | 60 | 14 / 29 |
| developer-utilities | 56 | 10 / 26 |
| design | 33 | 0 / 5 |

Catalog wide: p50 60, p90 67, max 73, and 55 of 121 over 60. The distinctive half of the title is
what gets cut, because the pattern is `Name: qualifier, qualifier ● ToyTools` and the qualifiers
carry the query. `Combinations & Permutations Calculator: nCr, nPr ● ToyTools` loses `nCr, nPr`,
which is the part somebody typed.

Every health tool is affected, which is the cluster that can least afford a weak snippet.

### 7. 114 evidence queries retrieve nothing, and 89 phrasings appear in no weighted slot

From `npm run check:queries -- --report`. The gate passes because both ratchets sit at their floor,
but the floor is a record of today, not a target. The failures cluster:

- **Text cleanup:** `normalize-whitespace` retrieves 2 of 6 and targets 0 of 1. "fix messy spacing",
  "whitespace normalization" and "collapse tabs and spaces" reach nothing.
- **Physics and math sims:** `simple-harmonic-motion-calculator` targets 3 of 7,
  `probability-calculator` 3 of 7, `unit-circle-calculator` 4 of 7. The 2026-08-05 simulator
  vocabulary work fixed the tags and one H2; the remaining phrasings still live only in body prose.
- **`remove-line-breaks` targets 1 of 7**, the worst single page on the site, missing "remove line
  breaks from text", "strip newlines", "join lines" and three more.
- **`systemd-timer-converter` targets 3 of 6**, missing the OnCalendar phrasings that are the
  entire reason the tool exists.

This list is a ready made content brief and needs no further research to act on.

### 8. 75 of 121 shipped tools have no recorded demand evidence

`research/datasets/*.json` holds 73 records. 46 of them point at a shipped tool. So for **62% of
the catalog** there is no recorded search query, no competitor set, and no demand or competition
score from before it was built. Among the 46 that do have evidence, recorded competition runs 16 to
80 with a median near 58, and none is classified as high.

Some of those 75 are legitimate variant fan out, where the parent's evidence covers the family and a
per tool record would be noise. But it means that for most of the catalog we cannot distinguish
"this page is not in the top 5" from "nobody searches for this at all", and the standing rule in
`CLAUDE.md` about evidence driven tool selection is being satisfied for new builds while most of the
existing catalog predates it.

### 9. Guides are near-orphans

| measure | tool pages | guide pages |
|---|---|---|
| inbound internal links, min | 4 | **1** |
| inbound internal links, p50 | 13 | **5** |
| inbound internal links, max | 29 | 14 |
| click depth 3 from the homepage | 0 | **56 / 121** |

37 of 121 guides have two or fewer inbound links. `how-to-validate-json`, `what-is-a-jwt`,
`what-is-punycode`, `what-is-rot13`, `what-is-url-encoding` and `yaml-to-json-converter` have
exactly one. The guide is the page that answers the informational query, which is the query class a
young domain can realistically win first, and it is the page type we link to least.

The lowest linked tool pages are the ungrouped ones, which reproduces the 2026-08-03 finding
exactly: `jwt-decoder` at 4, then `emergency-fund-calculator`, `doppler-effect-calculator` and
`ideal-gas-law-calculator` at 5. Physics remains entirely ungrouped, 0 of 11.

## What is already fine, so nobody re-fixes it

Stated explicitly because several of these look like the usual suspects:

- **Sitemaps and robots.** 258 URLs across 4 valid shards, `lastmod` present with 21 distinct
  values, correct `robots.txt`, correct sitemap index. Not a discovery problem at the file level.
- **No duplicate metadata anywhere.** 0 duplicate `<title>` groups and 0 duplicate meta description
  groups across all 262 indexable pages. Descriptions are 53 to 159 characters, none missing, none
  over the limit.
- **Canonicals and noindex.** Every page carries a canonical. Exactly 4 pages are noindex
  (`/architecture/`, `/offline/`, `/search/`, `/settings/`), all deliberate.
- **Tool and guide pages are not cannibalizing.** Shingle containment between a tool page and its
  guide has a median of 0.07 and a maximum of 0.17. The 39 guides that share a slug with their tool
  are differentiated by intent in the title (`Fraction Calculator with Steps` against `How Fraction
  Arithmetic Works, Step by Step`). This was worth checking and it is genuinely healthy.
- **Content coverage is complete.** All 121 tools have a guide, a FAQ and a knowledge file.
- **Page weight.** Every page is inside its budget, enforced on every build.
- **Structured data shape.** `BreadcrumbList` + `SoftwareApplication` + `FAQPage` on every tool page
  is the right set. The gaps in finding 4 and 5 are missing and malformed properties, not a missing
  schema strategy.
- **Body depth.** Median 658 unique non boilerplate words per tool page, p10 475. Thin content is
  not the problem, and the 2026-08-03 finding that word count is not the lever still holds.

## The short answer to the question asked

Three different things are being conflated under "not ranking in the top 5", and they need
different work:

1. **Pages that are not indexed.** Unknown in size, unmeasured for seven weeks, and probably the
   largest bucket on a ten week old domain. Finding 1.
2. **Pages that are indexed and rank outside the top 5 on merit.** Against these, our on page
   evidence is good but our authority evidence is nil (finding 3), our snippets are truncated
   (finding 6), and our dates are invalid or absent (findings 4 and 5).
3. **Pages ranking for queries nobody types.** Finding 8, and by construction we cannot currently
   see which they are.

We have been optimizing bucket 2 with gates that only compare us to ourselves, while bucket 1 is
unmeasured and bucket 3 is unknown.

## Candidate follow-ups, in cost order

Not implemented here. Each is separable and each has a measurable done condition.

1. **Set `GSC_SITE_URL` and `GSC_SA_KEY_JSON`** and let the existing weekly workflow run for real.
   Two secrets, no code. `docs/indexing.md` has the setup. Everything below is easier to prioritise
   once one report exists, and some of it may turn out to be unnecessary.
2. **Fix the guide date bug.** Split `updatedAt` into an ISO field for schema and a derived display
   string, or format the display string from the ISO value at render time. 102 pages corrected,
   and a validator assertion stops it recurring.
3. **Add `dateModified` to the tool page schema**, sourced from the tool's existing ISO `updatedAt`
   in `config.ts`, which is already correct and already unused for this.
4. **Trim the 55 long titles** to put the discriminating words before the cut, health first. This
   interacts with the `queryTargeting` ratchet, so it must be measured with `check:queries` in the
   same change rather than assumed safe.
5. **Work the 89 untargeted phrasings**, starting with `remove-line-breaks` at 1 of 7. Pure content,
   the brief already exists, and the ratchet locks each gain in.
6. **Raise the guides out of orphan status.** 37 guides at two or fewer inbound links is a linking
   change, not a content change.
7. **Retrofit tool groups on physics** (0 of 11 grouped), which is the same recommendation the
   2026-08-03 analysis left open and the same cluster that still has the lowest linked pages.
8. **Decide whether competitor coverage becomes a gate.** The research stage already produces the
   data; the question is whether a `competitorCoverage` criterion joins `queryTargeting` in
   `seo:gate`. This is the durable fix for finding 2 and the largest piece of work on the list, so
   it should wait for the data from item 1.
9. **Add authority signals to the YMYL clusters**, or accept that health and finance are a slower
   game and spend the effort on text, developer and design instead. This is a strategy call, not a
   task.

Items 1 to 3 are the ones where the current state is unambiguously a defect rather than a tradeoff.
