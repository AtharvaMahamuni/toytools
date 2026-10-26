# World, time and travel tools: analysis and roadmap

Date: 2026-10-23 (IST). Planning document only. No repo files were changed, nothing was pushed or posted, and toytoolsapp.com was not opened.
Asked by Atharva: "how many categories and tools can we schedule next? Create a complete comprehensive analysis file so we can work on these tools." He later added: the analysis must also cover our SEO GEO engine, the Reddit pipelines and the shared engine architecture.

**Method.** Read `AtharvaMahamuni/toytools` at `origin/main` 3336600c (alpha-v13.10) through `git show` and `git grep` after a `git fetch`. Also read `/workspace/specs/*`, `/workspace/arch-audit/toytools-multidomain-embed-report.md`. No build, no tests and no `npm run research:*` were run (no install in the clone), so any number that comes from a generated report is quoted from the committed file, not recomputed.

Related: `docs/pdf-tools-roadmap.md` (PDF and Files), a separate plan that also proposes a new category, so the two compete for the next major bump.

**Legend used everywhere**
- **[V]** verified: I read it in the repo or a spec, and the path is given.
- **[P]** proposed: my idea or recommendation. Not in the repo.
- **[TV]** to verify: a licence, a browser feature, a data property or a number I could not confirm from here. It must be checked before the work package that depends on it starts.
- Sizes: only numbers marked *measured* were measured (the earlier study). Everything else is a **target ceiling** (a budget we should hold) or "to measure". There are **no search volumes** in this document; none exist in the repo for these queries.

---

## 1. Executive summary

**Proposed total: 1 new category, 15 new tools, 1 upgrade of an existing tool, 1 new engine, 0 per-country pages.**

| | Count | Names |
|---|---|---|
| New category | **1** | **World and Travel** (`world-travel`, segment `world`) |
| Existing category extended | 1 | **Date and Time** (`date-time`) gets 4 of the 15 tools |
| New engine | 1 | `geo` (map, country data, quiz, sphere and sun maths) |
| Existing engine extended | 1 | `datetime` (planner primitives, lazy calculators) |
| New tools | **15** | 4 in Date and Time, 11 in World and Travel (table in section 2) |
| Upgraded existing tool | 1 | `timezone-converter` (links to the new planner, optional multi-target), not a new page |
| Ideas folded into another tool | 7 | best call window, work-week overlap, world clock wall, deadline checker, driving side and units, emergency numbers, languages and scripts map |
| Rejected | 2 | tipping and etiquette, currency conversion (full reasons in the appendix) |
| Deferred | 1 | public-holiday overlap (data licence not verified) |

**Why this shape**
1. **Time tools extend Date and Time, they do not get a category of their own.** [V] `datetime` already owns the patterns `datetime-convert` and `datetime-schedule`, an `Intl`-based `zones.ts` with a curated zone list, and a lazy-loaded calculator map (`src/lib/engines/datetime/lazy.ts`). [V] `timezone-converter` already exists and is the only candidate with a RIE score in the committed reports (71.9, status `already-exists`, gap `needs-improvement`, `research/reports/opportunities.json`). These tools need only a minor version bump and no new category or engine.
2. **Maps and travel prep get one new category.** Quizzes, map layers and travel lookups share one data table, one geometry file and one engine. Splitting them into two categories would duplicate that data and cost two category pages and two major bumps. Within one category, `category-sections.ts` can still group them by pattern ("Map quizzes", "Explore the map", "Travel prep") [V mechanism, P titles].
3. **The first pilot changes from my earlier study.** The earlier study (`countries-explore-study.md`) recommended the World Map Quiz as the pilot. With the repo evidence now read, **I recommend `meeting-time-finder` first, and the World Map Quiz second.** Reasons: (a) it needs no major bump, no new data pipeline and no border decision; (b) [V] the committed dataset already records two task-level failures for the timezone tool that the finder fixes ("the converted time is correct but nothing says whether it is a reasonable hour to call" and "the date rolls over across the conversion and the day change goes unnoticed", `research/datasets/datetime.json`), and lists "meeting planner" as a related problem and `worldtimebuddy` as the incumbent; (c) it lands in an already-indexed category. The map quiz stays the best first tool of the new category.
4. **Lookup-only tools fail the repo's own substitution test** (`docs/tool-design.md` [V]). "Plug type in Japan" is a one-line chat answer. So lookups are merged into a few tools that add something a chat does not: a home-to-destination pair check, a printable trip card, a dialling string builder, a map layer you explore.
5. **15 is a candidate list, not a commitment to build all 15.** Phases 1 to 2 (6 tools plus the category) are scheduled. Phases 3 to 4 (9 tools) are gated on evidence (section 4).

**What waits until after the Oct 26 recheck [V per the brief: 87 skipped pages under recheck on Oct 26]:** every new indexable page. Non-page groundwork (decisions, RIE records, SEO GEO plan, the search-terms budget fix) can start now.

---

## 2. The tools

Two tables, keyed by slug. Table A is what each tool is and what it costs; table B is how it is found, how risky it is and how its link works.

### Table A: identity, data and cost

Size column: **data** = bytes fetched at interaction time; **JS** = the lazy engine or calculator chunk. All sizes are **targets or estimates unless marked measured**. Page-level ceilings are the repo's own (tool page: CSS 18 KB, JS 24 KB, HTML 34 KB, total 61 KB gzipped [V `scripts/check-budget.ts`]).

| # | slug | name | category | What it does | Data needed and free licensed source | Size (gz) | Effort |
|---|---|---|---|---|---|---|---|
| 1 | `meeting-time-finder` | Meeting Time Finder | date-time | Add 2 to 8 cities. A row per city shows the 24 hours with working hours shaded. Pick the overlap. Marks day changes and unsociable hours. Includes the "best call window" view (2 cities, polite hours), a "now" view (the world clock wall), and a weekend-aware work week. "Copy as invite text" and "Copy link". | Time zones: the browser's `Intl` (IANA via ICU), no bundled tz data [V pattern in `zones.ts`]. City-to-zone aliases: a small table we author, optionally seeded from Natural Earth populated places (public domain, [TV] row counts). Weekend days: `Intl.Locale#getWeekInfo` where supported [TV support in Safari and Firefox] with a fallback table from CLDR `weekData` [TV Unicode licence terms]. | JS target ≤ 5 KB; city table not measured (target ≤ 8 KB) | L |
| 2 | `event-time-converter` | Event Time Converter | date-time | Enter an event time and zone. Get a link that shows each reader the time in their own zone, with a live countdown. Includes the "deadline ends at" mode ("5 PM UTC, what is that for me?"). | `Intl` only. The reader's zone comes from `Intl.DateTimeFormat().resolvedOptions().timeZone`, read on the device, never sent. | JS target ≤ 3 KB | M |
| 3 | `dst-change-calendar` | Daylight Saving Change Calendar | date-time | For a year and a zone (or a set of zones), the exact dates the clocks change, the shift, and a warning for recurring meetings. | `Intl` offset scan across the year (finds transitions with no data). Zone-to-country grouping: IANA `zone1970.tab` or `zone.tab` [TV public-domain status and file choice]. | JS target ≤ 4 KB | M |
| 4 | `jet-lag-planner` | Jet Lag Planner | date-time | From zone, to zone, flight date and usual bedtime: a day-by-day sleep shift plan. | `Intl` for the offset. The shift rule (hours per day east or west) must come from a cited public source [TV: pick and cite one; do not hardcode folklore]. | JS target ≤ 3 KB | M |
| 5 | `world-map-quiz` | World Map Quiz | world-travel | Tap the country (Learn and Practice), continent presets, typed-name mode as the accessible alternative, score and missed list in memory only. | Geometry: Natural Earth admin-0 (public domain). **Measured:** world-atlas 2.0.2 `countries-110m.json` = 107,761 B raw, **38,495 B gz**, 177 countries; 50m = **230 KB gz**. Country table: Wikidata (CC0) for capitals and names, built at build time. | Geometry 38,495 B (measured, 110m); JS target ≤ 6 KB; country table ≈ 8 KB (earlier estimate, to measure) | M |
| 6 | `capitals-flags-quiz` | Capitals and Flags Quiz | world-travel | Name the capital or the country from the flag. Modes in one page (`?mode=capitals` or `?mode=flags`) so it is not two near-duplicate pages. | Wikidata capitals (CC0). Flags: `flag-icons` (MIT). **Measured:** 271 SVGs, 1.93 MB raw, 652 KB gz in total, **median 398 B gz per flag**; heavy ones rs 50 KB, mx 30 KB, bo 25 KB. One file per flag, loaded when shown. Flag emoji are not used (tofu on Windows). | Country table shared with #5; flags 398 B median each (measured) | S |
| 7 | `higher-or-lower-countries` | Higher or Lower: Countries | world-travel | Which country has more people (or a bigger area)? Streak game. | Population: Natural Earth `POP_EST` (an estimate, say so on the page) or World Bank (CC BY 4.0, attribution). Area: computed from geometry or Wikidata (CC0) [TV property and method]. | Reuses the country table; adds ≈ 2 KB (to measure) | S |
| 8 | `true-size-map` | True Size Map | world-travel | Drag a country over another place to see its real size against the Mercator distortion. | Same Natural Earth geometry, **stored in longitude and latitude**, reprojected at runtime. | Same geometry file; JS target ≤ 5 KB (projection and drag) | M |
| 9 | `world-facts-map` | World Facts Map | world-travel | One map, layer pills: driving side, plug type, calling code, official languages, scripts, landlocked, population band, number of time zones. Tap a country for a card. The "explore" tool from the pokeindia idea, without the Pokémon. | Wikidata (CC0) for driving side, calling code, languages [TV property ids]. Plug type and voltage: see #10. Script: Wikidata or CLDR [TV]. | Reuses geometry and table; layer data ≈ 6 to 10 KB (to measure) | L |
| 10 | `plug-adapter-checker` | Plug and Voltage Checker | world-travel | Pick your home country and the destination. Get which plug types each uses, whether you need an adapter, and whether your charger's voltage range covers the destination. | Needs a curated table of plug types, voltage and frequency per country. Candidate sources, **none verified**: IEC "World Plugs" (IEC copyright [TV reuse]); Wikipedia "Mains electricity by country" (CC BY-SA, share-alike [TV compatibility]); Wikidata coverage [TV]. Safest route: hand-curate from primary sources, cite each row, date the table. | Table ≈ 5 KB for ~195 rows (estimate) | M (data curation is most of it) |
| 11 | `travel-card` | Trip Card | world-travel | Pick a destination (and optional home): driving side, speed units, calling code and how to dial from home, emergency numbers, plug and voltage summary, time difference. A copyable and printable card. | Same country table. Emergency numbers: Wikidata [TV] or official sources [TV]; each row cited and dated. | Reuses table; adds ≈ 3 KB (to measure) | M |
| 12 | `international-dialing-helper` | International Dialling Helper | world-travel | "How do I call a number in India from the US?" Builds the exact digit string: exit code, country code, trunk prefix dropped. | Calling codes: Wikidata or ITU E.164 [TV]. Exit codes and trunk prefixes: ITU or Wikipedia (CC BY-SA) [TV licence, accuracy]. | Table ≈ 3 KB (estimate) | M |
| 13 | `distance-flight-time-calculator` | Distance and Flight Time Calculator | world-travel | Great-circle distance between two places, bearing, approximate flight time, and the route drawn on the world map. | Maths only for coordinates. Places: Natural Earth populated places (public domain, [TV row count at 50m]) or GeoNames cities (CC BY 4.0, attribution on the page). Airports, if wanted: OurAirports [TV licence]. | JS target ≤ 3 KB; places table not measured | M |
| 14 | `sunrise-sunset-compare` | Sunrise and Sunset: Two Places | world-travel | Sunrise, sunset and day length for two places on a date, side by side. | NOAA solar equations (pure maths) [TV exact source and accuracy statement]. Places table shared with #13. | JS target ≤ 3 KB | M |
| 15 | `day-night-map` | Day and Night Map | world-travel | The day and night line on the world map for any moment, with a time slider. | Solar position maths plus the shared geometry. | JS target ≤ 3 KB | M |

Upgrade (not a new tool): `timezone-converter` gets a "plan a meeting with these zones" link into #1, and can optionally accept several target zones. [V] It already carries `TT.url` state (DateTime widgets read and write URL params), so the change is small.

### Table B: SEO, queries, privacy, risk and links

"SEO value" is my read only (no volume data exists). "Target queries" are **query patterns** to validate in Search Console or the RIE, not volumes. Link design: query parameters on the clean tool URL, canonical to that clean URL, never in the sitemap [V: canonical to the clean URL already holds on param URLs, `parameterized-queries-2026-10-21.md`; the sitemap is registry-derived and only lists tool, guide, category and standalone pages].

| # | slug | SEO value (my read) | Target query patterns | Privacy fit | Risk | Shareable link |
|---|---|---|---|---|---|---|
| 1 | `meeting-time-finder` | High. Existing category, existing incumbent known (`worldtimebuddy`, dataset). Head terms are crowded. | "meeting planner time zones", "world meeting planner", "find a meeting time across time zones", "best time to call [country] from [country]", "overlap working hours time zones" | Excellent. Cities in the URL are not personal. [V] A `private` trust tool uses URL mode `manual`: the page never writes the URL itself, Copy link builds it (`src/lib/url-state.ts`). | Medium. City-to-zone mapping errors; DST edge cases; `getWeekInfo` support. Large widget. | `?c=Asia/Kolkata,America/New_York,Europe/London&d=2026-11-05&w=9-18` |
| 2 | `event-time-converter` | Medium. Overlaps "time zone converter" queries with the existing page, so differentiate by job (make a link vs convert once). | "convert event time to my time zone", "what time is 8pm IST in my time zone", "deadline 5pm UTC in my time", "countdown to [time] UTC" | Excellent. The reader's zone is read on the device only. | Medium. Cannibalisation with `timezone-converter`. Free text in a `n=` title param must be escaped (render as text). | `?t=2026-11-05T20:00&z=Asia/Kolkata&n=Launch` |
| 3 | `dst-change-calendar` | Medium. Seasonal spikes (spring and autumn), big incumbents (timeanddate). | "when does daylight saving time start [year]", "when do clocks change [year]", "which countries have daylight saving time", "does [country] have daylight saving" | Excellent | Medium. Future years depend on the browser's tz database version, so say so. | `?y=2027&z=Europe/London` |
| 4 | `jet-lag-planner` | Low to medium. Health-adjacent, so unhedged claims are a risk. | "jet lag calculator", "how to adjust sleep for time zone change" | Good. Bedtime is personal, so use manual URL mode. | Medium. Needs a cited rule; wording must not claim medical outcomes. | `?from=Asia/Kolkata&to=America/New_York&d=2026-12-01` (bedtime stays out of the link by default) |
| 5 | `world-map-quiz` | High ceiling, heavy incumbents (Seterra, Sporcle, JetPunk, from the earlier study). Our angle: tiny, private, keyboard and screen-reader friendly. | "world map quiz", "countries of Africa quiz", "countries of Europe map quiz", "country map game" | Excellent. Nothing saved by default. | **High border risk** (decision D1). Tiny states below the hit target at 110m. | `?mode=practice&region=africa` |
| 6 | `capitals-flags-quiz` | Medium. High competition, easy to be thin. | "capitals quiz", "country capitals game", "flag quiz", "guess the flag" | Excellent | Disputed capitals (Jerusalem, Western Sahara, others) need a stated policy line. | `?mode=flags&region=europe` |
| 7 | `higher-or-lower-countries` | Low for search, medium for sharing and return visits. | "which country has a bigger population", "population higher or lower game" | Excellent | Staleness of estimates (label them as estimates with a date). | `?stat=population` |
| 8 | `true-size-map` | Medium. The effect surprises people and is shareable. | "true size of countries", "mercator projection comparison", "how big is [country] compared to [country]" | Excellent | Geometry at 110m is coarse for small countries. | `?a=BR&b=US` (ISO alpha-2) |
| 9 | `world-facts-map` | Medium. Replaces the per-country page idea with layers on one URL. | "driving side by country map", "plug types by country map", "countries calling codes map", "official languages by country map" | Excellent | Border decision D1; data staleness; thin-content watch because each layer is a topic. | `?layer=driving-side&country=JP` |
| 10 | `plug-adapter-checker` | Medium to high (travellers do search these). | "plug type for [country]", "do I need an adapter for [country]", "voltage in [country]", "type A vs type B plug" | Excellent | **Safety-adjacent**: wrong voltage advice can damage a device. Show the source, the date and "check your device label". Licence unverified. | `?from=IN&to=JP` |
| 11 | `travel-card` | Medium. Substitution-test borderline: the printable card is the artifact. | "emergency number in [country]", "which side of the road do they drive on in [country]", "country calling code [country]" | Excellent | **Emergency numbers are a safety fact**; a wrong row is worse than none. Ship that section last, with citations. | `?country=JP&home=IN` |
| 12 | `international-dialing-helper` | Medium. A real action query. | "how to call [country] from [country]", "how to dial [country] from [country]", "international dialling format", "[country] country code" | Excellent. A typed phone number must never go into the URL (only the two countries do). | Medium. Trunk-prefix rules have exceptions; table accuracy. | `?from=US&to=IN` |
| 13 | `distance-flight-time-calculator` | Medium to low. Google answers the head terms directly. | "distance between [city] and [city]", "flight time from [city] to [city]", "great circle distance calculator", "coordinates distance calculator" | Excellent | Flight time is an estimate (say so). Do not use device location. | `?a=28.61,77.21&b=51.51,-0.13` |
| 14 | `sunrise-sunset-compare` | Low. Per-city answers are owned by Google and timeanddate. | "sunrise and sunset time in [city]", "day length comparison" | Excellent | Accuracy near the poles; low demand. | `?p=BLR&q=LON&d=2026-12-21` (place ids) |
| 15 | `day-night-map` | Low to medium. | "day and night map", "where is it night right now" | Excellent | Competes with established live maps; decorative unless the slider is useful. | `?t=2026-12-21T12:00Z` |

**Craft status [V rule, P ideas].** `check:craft` holds a coverage ratio and the `next-tool` skill says never invent a craft candidate. Only #1 has recorded `userFailures` in the dataset today (the two above, both a `guardrail` and an `orientation` fit). The other 14 would carry **CRAFT RISK** until `userFailures` are added to their seed records with real evidence, or the PR states that the tool ships craftless. I do not list invented craft touches here.

---

## 3. Shared engines and architecture

### 3.1 What exists [V]

| Piece | Where | Relevance |
|---|---|---|
| Registry as the single source | `src/data/registry.ts` plus `*.generated.ts`; `docs/code-map.json` | Routes, sitemap, llms files, search index, PWA manifests, icons, knowledge graph all derive from it. New tools appear everywhere without hand edits. |
| Engine manifest | `src/data/engines.ts` (`ENGINE_IDS`, `PATTERN_IDS`, `engineDefs`) | A new engine is a major bump. |
| Runtime loaders | `src/lib/runtime/loaders.ts` (`ENGINE_LOADERS`, one literal `import()` per engine) | Each page downloads only the engine it declares. |
| Lazy calculators | `src/lib/engines/datetime/lazy.ts`, `finance` the same way; `check-budget.ts` charges a page for the key on `data-datetime` or `data-finance` | The pattern for "one chunk per tool". |
| Zones | `src/lib/engines/datetime/zones.ts` | A curated IANA zone list, offsets read through `Intl.DateTimeFormat`, no bundled tz data. |
| Story layer | `src/lib/engines/datetime/story.ts`: `insight`, `milestone`, `assumption`, and `DATETIME_LINKED_TOOLS` (slug to segment) | Engines return `{ slug, segment }`, the renderer builds the href with `toolPath()`. "A decision to a not-yet-built sibling returns null and lights up once that tool's slug is added in its own PR." |
| Board-game engine | `src/lib/runtime/engines/board-game.ts`, `rules/*`, a `RULES` registry | The closest template for "one engine, many tools, data per tool". |
| Shell-independence contract | `ARCHITECTURE.md` "Tool Render Unit" | See 3.4. |
| URL state | `src/lib/url-state.ts` | `auto`, `manual` or `off`; a `private` tool downgrades `auto` to `manual`. |

### 3.2 Proposed engines [P]

**A. Time-zone engine = extend `datetime`, no new engine.**
- New pure modules under `src/lib/engines/datetime/`: `planner.ts` (working-hours overlap across zones, day-change detection, polite-hours scoring), `transitions.ts` (scan a year of offsets to find DST changes), `jetlag.ts`.
- Single-answer tools (#2 event converter, #3 DST calendar, #4 jet lag) can be lazy calculators behind the existing `DateTimeWidget`, keyed in `lazy.ts` (cheap, S to M).
- The meeting finder (#1) is a multi-row timeline, not a SmartField form, so it needs a bespoke widget. [V] Patterns that do not dispatch through a processor are declared in `NON_DISPATCHING_PATTERNS`; a new pattern such as `datetime-plan` would be declared there and in `category-sections.ts`. [V] "A new pattern rides along with whatever else the PR does" and never forces a major on its own. **[TV: Builder confirms against `validate-registry` and `check:engines`, which holds bespoke engines at a ceiling of 5. The `datetime` engine keeps its shared widget, so this should not raise the ceiling.]**

**B. Map engine = a new `geo` engine** (category `world-travel`, major bump).
- Pure modules: `geo/countries` (country table access, alias and accent normalisation for typed answers), `geo/map` (geometry decode, runtime projection, hit-testing by `data-id`, continent viewBox presets), `geo/quiz` (question picking, scoring, missed list), `geo/sphere` (haversine, bearing, great-circle points), `geo/sun` (solar position, terminator, sunrise), `geo/places`.
- Attach module `src/lib/runtime/engines/geo.ts`, registered in `ENGINE_LOADERS` and in the `globals` list in `engines.ts`. **Per-tool lazy chunks** keyed by a `data-geo` attribute, like datetime and finance.
- **Budget-script trap [V]:** `check-budget.ts` finds lazy chunks with `data-(?:datetime|finance)=`. A `data-geo` key is **not charged** until that regular expression is extended in the first geo PR. Without the change the new tools would be silently unmeasured, which is exactly the "weakening a check" the repo forbids. The same file's `INTERACTION_ASSETS` list is where geometry and country-data fetches get their own ceilings ("a missing asset is a failure").

**C. Country and places data.**
- [P] `scripts/geo-build.ts`: deterministic, pinned inputs (Natural Earth 5.x, a dated Wikidata snapshot, flag-icons), committed outputs, with a byte-ceiling ratchet that only falls.
- **Correction to the earlier study [P]:** the study proposed pre-projected SVG `d` strings. That works for the quiz only. `true-size-map` and `day-night-map` need the geometry **in longitude and latitude**, projected at runtime. So the shared file should be quantised lon/lat arcs (like the measured 38,495 B TopoJSON) plus a small decoder and projection in the engine. The decoder and projection size is **not measured**; target ≤ 5 KB gzipped for both.
- Tiny countries missing at 110m (the study notes Singapore and Malta are not in it) need circle markers or the 50m file on demand. Not silently dropped.

### 3.3 Lazy loading, and how a tool stays inside the budgets

1. The page ships HTML and the widget markup only. `ToyTools.onReady` wraps anything that computes on load [V CLAUDE.md].
2. The engine chunk is fetched for the declared engine; the per-tool calculator chunk only for its `data-*` key.
3. Geometry, the country table, the places table and flags are **fetched on first interaction** from same-origin static files, not bundled, so they do not count towards the page's JS. They get `INTERACTION_ASSETS` ceilings so they cannot grow unseen.
4. [TV] Whether a fetched static JSON works offline depends on the service worker precache rules (`platform.sw.test.ts`). Builder checks this in the first geo PR. Do not claim "works offline" until it is tested in standalone mode.
5. **CSS:** [V] 18,431 of 18,432 B is the worst existing tool page. [V] Productivity widgets share one `import.meta.glob`, so every productivity page downloads every productivity widget stylesheet. **If the new `world` segment hoists widget CSS the same way, every world page pays for every world widget.** [TV] Builder confirms how the `game` and `datetime` segments avoid this, and the geo widgets follow it. Plan: shared map styles in one small file under 3 KB gz, state through SVG attributes and `data-state`, the existing tokens, `:global()` for script-drawn buttons (the board-UI lesson [V]), no new icon font, flags as `<img>`.
6. **Search budget [V]:** `search-terms.json` is 10,042 of 10,240 B (198 B left), and the budget file records about **69 B per tool** (measured at 132 tools). 15 tools would add roughly 1,000 B, about five times the headroom. **This must be fixed structurally before the third new tool ships**, not by raising the cap: the budget file's own note says the answer is to split the always-fetched half from the term arrays, and `followups-243.md` already lists a search-terms trim. It is Phase 0 work (section 4).
7. **Version rule [V]:** one bump per PR; the first geo PR (category plus engine plus first tool) is a single **major**, alpha-v14.0 (or the next major if #266 and others move the base). Every other tool PR is a minor.

### 3.4 Every tool renders without the page shell

[V] The contract (`ARCHITECTURE.md`, "Tool Render Unit") says: inputs are the registry config plus a build-time surface, never `Astro.url`; one root `[data-tool=<slug>]`; slug-prefixed IDs; queries from that root, not `document`; no reliance on Nav, Footer or `ToolBar`; `is:global` only under the widget's own root class; **engines return slugs and the builder makes links**; forbidden off the page: analytics, service worker, install prompt, feedback capture, DOM outside the root, page-level shortcuts. [V] "Every tool renders without the page shell" is also a standing rule from Atharva.

How the new tools meet it [P]:
- Map widgets scope all queries to their root and add their own `<svg>`; no `document.querySelector` and no global key handlers (arrow keys on the map are listeners on the root).
- No hardcoded `/tool/` links. Cross-links go through `DATETIME_LINKED_TOOLS`-style slug maps or `toolPathBySlug` in guides. [V] `url-literals.test.ts` and `href-contract.test.ts` fail raw literals.
- No device APIs: no geolocation (the user picks places), no wake lock, no notifications.
- No raw storage. [V] "Nothing is saved by default"; if a score is ever saved it is opt-in through `ToyTools.state`.
- **Embed readiness.** [V] `embeddable` is derived and true for every tool except 7 page-only tools (`src/data/embeddable.ts`); nothing consumes it yet and no embed route exists. [V] The embed report (main at 87cd32a, 2026-09-27, 166 tools) classed **45 tools "Ready"** (no location or share coupling, no hardcoded hrefs, no raw storage), **115 "Minor coupling"**, and 6 heavy. **Target for the new tools: "Ready" is not reachable for any tool that uses `?param` links (URL state and share-link are the coupling the report counts), so aim for "Minor coupling at worst"**: URL state and sharing as optional hooks that a surface may leave out, and nothing else. The 45 figure is a snapshot from 27 Sep, not recomputed here.
- Test [P]: per tool, an e2e that renders the widget alone, asserts no third-party request, no `history.replaceState` with inputs, and no GA.

---

## 4. Phased roadmap (PR-sized work packages)

All versions below are "next minor or major **after whatever main is at merge time**". Do not hard-code numbers: [V] PR #266 (board UI polish, alpha-v13.11) is open, so the base will move. [V] Rules for every PR: `npm run verify` exits 0 after rebase on `origin/main` before the PR opens; PR body carries an llms line; every tool renders without the shell; versions stay `alpha`; one bump per PR; no stale branches; Atharva's own words approve merges.

### Phase 0: decisions and groundwork (starting now, no new indexable pages)

| Item | What | Bump | Notes |
|---|---|---|---|
| 0.1 Atharva decisions | D1 to D7 in section 6. | none | Blocks Phase 2 data generation (D1) and the geo bump (D3). |
| 0.2 RIE records | Add records for the candidate tools to `research/datasets/datetime.json` (time tools) and a new `research/datasets/geography.json` (map and travel tools) and a `geography` domain in `src/lib/research/taxonomy.ts`. Run `research:status`, `research:validate`, `research:report`. | none (research datasets only) | [V] No dataset or taxonomy entry for these exists today. Scores come out of the rubric; I do not invent them. |
| 0.3 SEO GEO plan | Plan-only review by the SEO GEO agent: titles, headings, FAQ literal answers, cannibalisation with `timezone-converter`, ≤ 60 character titles. | none | [V] Standing step before Builder. |
| 0.4 `search-terms` structural fix | Split terms so 15 more tools fit; no cap raise. | patch | Prerequisite for Phase 1 beyond 2 tools. |
| 0.5 Data spike (off repo) | Prototype `geo-build` in `/workspace`: measure the real lon/lat arcs, the country table, the places table, the decoder; check Wikidata property ids and each [TV] licence in section 7. | none | Replaces the estimates in this document with measurements. |

### Phase 1: time tools (after the Oct 26 recheck result is read; no category or engine change)

| PR | Scope | Bump | Tests | Budget notes | llms note |
|---|---|---|---|---|---|
| **1.1 `meeting-time-finder` (pilot)** | `planner.ts` primitives, bespoke widget, guide and FAQ, link to and from `timezone-converter`. Cities table (curated). | minor | Unit: overlap, day-change, DST-week and half-hour zones (India, Nepal, Newfoundland) with fixed instants; mutation pass (the repo has had surviving-mutant follow-ups). e2e: 320 px fit, keyboard, no third-party request, no shell. Intl-dependent tests pin the Node ICU version [TV]. | JS ≤ 5 KB target; widget CSS ≤ 3 KB; page ceilings unchanged. | `llms files: updated`: new block in `llms-full.txt`, run `npm run llms:golden`, specific `citation.nonGoal`. |
| 1.2 `event-time-converter` + `timezone-converter` link | Share link with countdown; deadline mode; cross-links. | minor | Escape `n=` title as text; reader-zone fallback when `Intl` fails. | JS ≤ 3 KB | updated |
| 1.3 `dst-change-calendar` | `transitions.ts`, calendar view. | minor | Known 2026 transitions (US, EU, Australia, Brazil) as fixtures [TV: pin the ICU version]. | JS ≤ 4 KB | updated |

Gate to continue after Phase 1: four weeks of GSC with no new "Crawled - currently not indexed" among the new URLs (the repo's own guardrail [V `parameterized-queries`]).

### Phase 2: the map foundation and the first quiz (major bump)

| PR | Scope | Bump | Tests | Budget notes | llms note |
|---|---|---|---|---|---|
| **2.1 World and Travel + `geo` engine + `world-map-quiz`** | Category entry (3 intro paragraphs, 3 highlights), engine, `category-sections.ts` rows, loader registration, `data-geo` lazy key, **`check-budget.ts` regex and `INTERACTION_ASSETS` entries**, `geo-build` outputs and validators, first tool and guide. POV per D1. | **major** (category and engine) | Data validators (every country has a capital or an explicit "no map" reason, aliases unique, byte ratchet). Map a11y: typed mode never needs the map, countries are focusable and named, live region, no colour-only feedback (the chess lesson [V]), 44 px targets, pinch zoom allowed. e2e at 320 px. | Geometry 38,495 B (measured, 110m) fetched lazily; JS ≤ 6 KB; CSS ≤ 3 KB; no budget raised. | `llms files: updated`: [V] `llms.txt`'s category sentence is generated from the category list, so the new category appears automatically; new tool in `llms-full.txt`; golden regenerated. Decide whether any new tool joins the curated CORE list (default: no). |
| 2.2 `capitals-flags-quiz` | Country table consumer, flags loader. | minor | Typed-answer normalisation (accents, "the", case), flag lazy load. | Flags 398 B median each (measured); table shared. | updated |
| 2.3 `higher-or-lower-countries` | Pure game on the table. | minor | Deterministic seeded sequence in tests. | ≈ 2 KB data (estimate). | updated |

### Phase 3: explore and measure (only if Phase 1 and 2 signals are healthy)

| PR | Scope | Bump | Notes |
|---|---|---|---|
| 3.1 `true-size-map` | Runtime Mercator reprojection and drag. | minor | Needs lon/lat geometry (section 3.2). |
| 3.2 `world-facts-map` | Layer pills, country card, layers from Wikidata. | minor | One URL for all layers. Cap the layers at what has verified data. |
| 3.3 `distance-flight-time-calculator` | Places table, haversine, route on the map. | minor | Coordinates input first (no city table needed), city search second. |

### Phase 4: gated on licence checks and evidence

| PR | Scope | Gate |
|---|---|---|
| 4.1 `plug-adapter-checker` | Curated plug and voltage table. | Licence or primary-source plan ([TV]); citation per row. |
| 4.2 `travel-card` | Trip card, emergency numbers section last. | Verified emergency-number source ([TV]). |
| 4.3 `international-dialing-helper` | Dialling string builder. | Verified exit-code and trunk-prefix source ([TV]). |
| 4.4 `jet-lag-planner` | Sleep shift plan. | A cited rule ([TV]) and hedged wording. |
| 4.5 `sunrise-sunset-compare`, `day-night-map` | Solar maths on the shared places and geometry. | Evidence that the earlier tools earn impressions. |

**Kill and stop rules [P, matching the earlier study].** If the GSC routine shows low impressions 4 to 6 weeks after a phase, stop at that phase. One tool per region-level job, never a generated page per item.

---

## 5. SEO and GEO plan

### 5.1 What the SEO GEO system is today [V]

| Component | What it does | Where |
|---|---|---|
| **seo-engine** (local, deterministic, no paid APIs) | `seo:research` (SERP discovery via DuckDuckGo with Bing fallback, competitor fetch, Reddit titles) then `seo:extract` (entities, questions, gaps) then `seo:validate` and `seo:audit` then `seo:scaffold` (an authoring brief and stubs, never touching `src/`). `seo:status -- <slug>` is the orchestrator and gives the exact next command. | `seo-engine/README.md`, `seo-engine/ARCHITECTURE.md` |
| **SEO score and GEO score** (0 to 100, pure functions) | SEO: entities ≥ 5 (20) and ≥ 10 (+10), questions ≥ 10 (20) and ≥ 20 (+10), content gaps ≥ 3 (15), competitor headings ≥ 5 (15), competitor FAQs ≥ 3 (10), primary intent (10), secondary intent (5). GEO: definition question (20), comparison question (20), troubleshooting question (15), entities ≥ 5 (20), competitor FAQs ≥ 3 (15), related topics (10), plus up to +10 from the Reddit demand blend. | `seo-engine/README.md` "Validation" |
| **Content gate** | `seo:gate -- <slug>`: overall 75; writingQuality 70, usefulness 60, seoCompleteness 50, toyToolsStyleScore 70, queryTargeting 50; `maxEmDashes` 0; AI-tell vocabulary banned. Runs in `verify` and PR CI on changed tool directories. | `CLAUDE.md`, `seo-engine/config/content-intelligence-rules.json` |
| **Query coverage** | `check:queries`, a ratchet whose corpus is phrases we authored (so green means internally consistent, not competitive). | `CLAUDE.md`, `docs/analysis/2026-08-16-seo-ranking-gaps.md` |
| **Search aliases** | `src/data/search-aliases.ts`: phrase to tool slug, lowercase and unique, enforced by `validate-registry`. Every alias costs search-terms bytes. | repo |
| **Indexing** | `indexing.yml`: weekly (Monday 04:00 UTC) GSC URL Inspection sweep, never in the deploy path. `deploy.yml` runs IndexNow after deploy for new URLs. | `.github/workflows`, `docs/indexing.md`, `docs/indexnow.md` |
| **Known weakness** | The research tier does not scale: SERP discovery is bot-blocked from many networks and the Reddit path is just as fragile; the 2026-07-13 analysis calls the "5000+ tools" claim true of the cache and false of the acquisition path. | `docs/analysis/2026-07-13-engines-and-agent-scalability.md` |

### 5.2 How the new tools feed it [P]

| Step | Existing command | What we do for the candidates |
|---|---|---|
| Choose and justify | `research:status`, `research:next` (the `next-tool` skill) | Add seed records (Phase 0.2). Do not hand-edit reports. |
| Research a tool | `seo:research -- <slug>` | **Caveat [V]:** the query generator builds searches from slug tokens (the first token is the subject). `world-map-quiz` would search "world", `meeting-time-finder` would search "meeting". Add an explicit query list per slug before running it (an idea for Builder, small change in `seo-engine/scripts/reddit.ts` and `queries.ts`). |
| Write content | `seo:scaffold`, then author, then `seo:gate` | Hand-written guides. [V] Known audit faults to avoid: titles over 60 characters (the 2026-10-05 audit found several), keyword-dump paragraphs, privacy FAQs that do not end with the exact line. |
| Check | `seo:doctor`, `check:queries`, `check:craft`, `check:engines`, `check-budget` | All are run by `verify` and CI [V `quality-guardian.yml`]. |
| Observe | `research:signal` | After launch, log GSC patterns as `search-console` signals. [V] Signals raise confidence, never the score. |

### 5.3 Titles that describe the action [V rationale, P wording]

[V] The action-query study found our titles name the tool noun, while searchers type the action. Wording below is a draft for the SEO GEO review, each ≤ 60 characters before the `● ToyTools` suffix is added by `generatePageTitle` [V never set a title inside a tool file]:

| slug | Draft title | H1 |
|---|---|---|
| meeting-time-finder | Find a Meeting Time Across Time Zones | Meeting Time Finder |
| event-time-converter | Share an Event Time in Everyone's Time Zone | Event Time Converter |
| dst-change-calendar | When Do the Clocks Change? Daylight Saving Dates | Daylight Saving Change Calendar |
| jet-lag-planner | Jet Lag Plan: Shift Your Sleep Before You Fly | Jet Lag Planner |
| world-map-quiz | World Map Quiz: Tap the Country | World Map Quiz |
| capitals-flags-quiz | Capitals and Flags Quiz | Capitals and Flags Quiz |
| higher-or-lower-countries | Higher or Lower: Country Population Game | Higher or Lower: Countries |
| true-size-map | True Size Map: Compare Countries Without Distortion | True Size Map |
| world-facts-map | World Map by Country: Driving Side, Plugs, Codes | World Facts Map |
| plug-adapter-checker | Do I Need a Travel Adapter? Plug and Voltage Check | Plug and Voltage Checker |
| travel-card | Trip Card: Dialling, Driving Side, Emergency Numbers | Trip Card |
| international-dialing-helper | How to Dial a Number in Another Country | International Dialling Helper |
| distance-flight-time-calculator | Distance and Flight Time Between Two Places | Distance and Flight Time |
| sunrise-sunset-compare | Sunrise and Sunset Times for Two Places | Sunrise and Sunset Compare |
| day-night-map | Day and Night Map: Where It Is Dark Now | Day and Night Map |

### 5.4 Literal FAQ answers, structured data, llms [V mechanics, P content]

- **FAQ:** 3 to 5 literal questions per tool in `faq.ts`, answered in the first sentence with a worked example (for example "What is the best time to call India from New York?" with a computed range, in the meeting-finder FAQ). [V] `FAQPage` JSON-LD already exists. Each privacy FAQ ends with the exact privacy line [V audit finding].
- **Structured data:** [V] `SoftwareApplication` JSON-LD with `description` = tagline + description + privacy, and `abstract` from `citation` (the "when to send someone here" text). Nothing hidden by CSS.
- **llms files [V]:** `llms.txt` (short overview, 46 links at the 2026-09-30 snapshot) and `llms-full.txt` (a four-line block per published tool, 166 blocks then) are rendered from the registry through `toolFacts()` and pinned by `src/lib/llms/golden/`. Each tool PR runs `npm run llms:golden` and commits the diff, sets a **specific** `citation.nonGoal` (the ratchet rejects the generic line; [V] scaffolded `TODO` would pass, so review it), and says `llms files: updated` in the PR body. [V] The per-tool `index.md` (L4) and the removal of the generic "Does not" line (L5) were approved on 2026-09-30; I found no per-tool `index.md` route on main at 3336600c, so I treat L4 as not shipped [TV status]. Nothing here depends on it.
- **GEO lines per tool [P]:** one plain sentence an assistant can quote: what the tool does, that it runs on the device, and what it does not do (for example "does not know public holidays" for #1, "estimates flight time, not airline schedules" for #13).

### 5.5 Internal links [V mechanics]

- [V] Tool pages render only `KnowledgeDrawers` related tools, derived by a four-tier cascade (same pattern and engine, same engine, same family, same category). `config.relatedTools` is read only when all four tiers are empty (dead data for most tools), and `knowledge.usedWith` / `nextSteps` do not render on tool pages. The levers that work: guide body links through `toolPathBySlug`, the derived cascade (so give the time tools a shared pattern and family), and the engine story `DATETIME_LINKED_TOOLS` decisions.
- [V] The 2026-10-05 audit found guides with no peer inbound links. Each new guide needs at least two inbound links from other tool or guide pages on the day it ships. Reciprocal links: `timezone-converter` guide to the meeting finder and event converter; `unix-timestamp-converter` to the event converter; `date-difference-calculator` to the DST calendar; quiz to capitals to higher-or-lower; true size to distance.

### 5.6 Canonical and parameter strategy, and the thin-page guardrails

- `?country=XX`, `?from=..&to=..`, `?c=...` links are for sharing and for internal links. [V] Canonical already points to the clean tool URL. **They are not added to the sitemap** (the sitemap is registry-derived and cannot list them).
- **No per-country, per-city or per-route pages.** [V] The 87 skipped pages are the cost of that pattern; recheck Oct 26.
- Answers for the most-searched countries live **inside** the guide as a hand-written reference table (for plugs: maybe 15 to 20 rows, each cited and dated), not as pages. Watch "Crawled - currently not indexed" for 4 weeks after each phase and roll back if the guides land there [V guardrail].
- `check:duplication` (WARN-only) is run before each batch, because sibling tools trip it (#5, #6, #7 share a data table and a game loop).
- Disputed-border wording appears on the tool page and in the guide, not only in a footer.

### 5.7 Reddit: what exists, and an idea if we want more [V vs P, plainly]

**Verified, what exists:**
- **A Reddit research collector** in the SEO engine (`seo-engine/scripts/reddit.ts`, `types/reddit.ts`). It runs inside `seo:research`. It searches Reddit's public `search.json` for a few queries built from the slug (`<subject>`, `<subject> <token2>`, `vs`, `problem`, `question`), falls back to `site:reddit.com` search results when blocked (which halves `dataConfidence`), drops removed, deleted, NSFW and stickied posts, keeps the top 20 by engagement, and clusters titles into six signal buckets (questions, pain points, use cases, comparisons, terminology, misconceptions). It adds up to +10 to the GEO score.
- **Hard rule [V]:** Reddit is **intent discovery only**. Never copy or paraphrase post text into content. Raw posts live in `seo-engine/research/reddit/*`, which is gitignored (`.gitignore` line 42). The `content-writer` agent and the `seo-content` skill repeat the rule.
- **The RIE's Reddit provider is a stub** that returns `[]` (`src/lib/research/providers/reddit/index.ts`, built by `_stub.ts`). So Reddit never influences a RIE score today.
- **The only engagement signal kinds** the RIE accepts are `x-probe`, `x-reply`, `search-console`, `feedback`, `support-thread` (`constants.ts`). A Reddit thread where someone works around a missing tool fits `support-thread`.
- **There is no Reddit posting pipeline.** No code, no credential and no workflow in the repo posts, comments or votes on Reddit. The nearest thing is the X flow, which is explicitly human-only: [V] "Nothing here ever posts to X -- there is no credential in this repo and no intention to add one" (`scripts/generate-x-content.ts`, `x-content` skill).

**Proposed idea (not built, not requested as a build; for Atharva to accept or drop):**
1. *Intent research, manual, local.* Before each tool's brief, run the existing collector with an explicit seed list (for example "time zone meeting", "plug adapter country", "countries quiz"), read the clusters, and write original prose. Needs only the small query-list change in 5.2. No credential, no posting. The fragility note above applies, so treat it as nice to have, never a gate.
2. *Evidence back into the RIE.* When a real thread shows people working around a missing tool, record it by hand with `npm run research:signal -- --tool <slug> --kind support-thread --strength N --observation "…" --url <thread>` [V command shape]. It raises confidence only.
3. *Posting, if ever, stays human.* Same shape as the X flow: the tool drafts a plain, helpful answer for a relevant thread, **Atharva reads it and posts it himself**, disclosing that he built the tool, following each subreddit's self-promotion rules [TV per subreddit]. No bot account, no API credential, no automation, no voting, no mass posting. Nothing is posted without his explicit go for that specific post.
4. This fits the privacy and no-backend rules: no server, no accounts, no tracking, nothing stored by the site.

---

## 6. Risks and decisions needed from Atharva

| # | Decision | Options and my recommendation | Blocks |
|---|---|---|---|
| **D1** | **Disputed borders** (India's included; also Kashmir, Crimea, Taiwan, Kosovo, Western Sahara, Palestine) | (a) one Natural Earth point of view site-wide with a stated footnote, (b) the India-POV layer Natural Earth provides [V earlier study: NE has POV variants], (c) a per-locale POV (inconsistent, shared links differ). I recommend (a) or (b), **one POV for the whole site, stated on the tool page and in the guide, plus a one-line "boundaries are simplified and approximate"**. India has strict norms on depicting its external boundary [earlier study; [TV] legal read before shipping an India-facing map]. | Phase 2 data generation. |
| **D2** | **Exam prep or general world practice** | General world practice for the pilot (the pokeindia audience is UPSC-style India physical geography, a different and heavier product). | Phase 2 scope. |
| **D3** | **Major version bump** (alpha-v14.0) for the new category and engine | Yes, the repo rule is a major for category plus engine. Phase 1 needs no major. | Phase 2.1. |
| **D4** | **Public-holiday overlap** | Defer. Floating and lunar holidays need yearly updates and a licensed source. Candidates **not verified**: Nager.Date, the `date-holidays` npm package, Wikidata, OpenHolidays [TV licence and coverage]. The finder ships with weekends plus a local "mark a day off" toggle (no data). | Later. |
| **D5** | **Currency** | Skip. No live rates (conflicts with no-network, and head terms are owned by Google and xe [V parameterized-queries]); an offline rate would be wrong the day after the snapshot. | none |
| **D6** | **Order of the first two tools** | Meeting finder first (this document's recommendation), world map quiz second. The alternative is the quiz first, as the earlier study said. | Phase 1 vs 2 order. |
| **D7** | **Reddit idea in 5.7** | Accept the research-only parts (1 and 2)? Keep posting out of scope? | Nothing blocks on this. |
| D8 | **Emergency numbers** | Ship only with a verified, cited, dated source, and last. | Phase 4.2. |
| D9 | **What "Explore" means** | [V] There is no Explore route in the repo. I treated it as the category shelves plus category pages plus search. A new nav entry would be extra work. | Navigation. |

**Other risks [P]**
- **Cannibalisation:** `event-time-converter` and `meeting-time-finder` overlap `timezone-converter` queries. Mitigation: distinct jobs and titles, cross-links, and a recheck in GSC after Phase 1.
- **Thin and near-duplicate content:** #5, #6, #7, #9 share a dataset. One page per job, real guide content, no per-item pages, `check:duplication` before shipping.
- **Data staleness:** population, plug tables and emergency numbers go stale. Every table carries a "data as of" date and a source in the guide.
- **Wrong advice risk:** plug and voltage, emergency numbers, jet lag are safety-adjacent. Cite, date, hedge.
- **Browser support:** `Intl.supportedValuesOf`, `Intl.Locale#getWeekInfo` and the exact tz data version vary by browser. Fall back to the curated zone list and a weekend table. [TV]
- **Accessibility:** a map is not an accessible answer by itself. Typed mode, named focusable countries, live regions, no colour-only state.
- **Bandwidth:** geometry and flags only on interaction. Mobile-first at 320 px.
- **Builder serial lane:** [V] one implementer; the plan is 13+ PRs, so expect weeks, not days.
- **Search-terms budget:** see 3.3, item 6. Must be fixed first.
- **Free-text in links:** the `n=` event title is user text arriving from a URL; render only as text.

### Items marked "to verify" (consolidated)

1. `Intl.Locale#getWeekInfo` support in Safari and Firefox; fallback via CLDR `weekData` and its Unicode licence terms.
2. `Intl.supportedValuesOf('timeZone')` support and ICU version differences between Node 22 (tests) and browsers.
3. IANA `zone.tab` or `zone1970.tab` public-domain status and which file fits.
4. Natural Earth populated-places row counts (110m and 50m) and the 5.x admin-0 POV file names.
5. Wikidata property ids (capital, population, area, driving side, calling code, official language, emergency number, plug type) and their coverage and quality per country.
6. Plug and voltage source: IEC "World Plugs" reuse terms; Wikipedia "Mains electricity by country" (CC BY-SA share-alike fit); whether to hand-curate from primary sources.
7. Exit codes and trunk prefixes: ITU or Wikipedia (CC BY-SA); accuracy.
8. Emergency number source.
9. GeoNames cities (CC BY 4.0 attribution) versus Natural Earth places; OurAirports licence.
10. NOAA solar equations: exact source and accuracy statement.
11. Jet lag rule: a citable public source.
12. Holiday data (D4): all candidates.
13. Whether the offline service worker precaches fetched static JSON.
14. Whether a bespoke widget on `datetime` fits `validate-registry` and `check:engines` without a ceiling change; whether the `world` segment hoists widget CSS the way productivity does.
15. Decoder and projection JS size; real country, places and layer table sizes.
16. A legal read on depicting India's boundary (D1).
17. The `seo-engine/scripts/queries.ts` change for explicit seed queries (existing behaviour verified; the change is an idea).
18. Reddit self-promotion rules per subreddit if idea 5.7 step 3 is ever used.
19. Whether L4 (per-tool `index.md`) has shipped (I found no route at 3336600c).
20. The "45 Ready" embed count is a 2026-09-27 snapshot over 166 tools; it was not recomputed. The brief says the catalog is now 192 tools.

---

## 7. Appendix: rejected, folded and deferred

| Idea | Decision | Why |
|---|---|---|
| Per-country pages (profile, "plug in Japan", "time in France") | **Rejected** | About 195 near-identical value-filled pages is the thin, near-duplicate pattern behind the 87 skipped pages [V]. Use `?country=XX` links and a reference table in one guide. |
| Compare-two-countries profile tool | **Rejected for now** | Weak on the substitution test (a chat compares well) and goes stale. [V earlier study] |
| Tipping and etiquette cheat sheet | **Rejected** | Needs careful sourcing, opinion-heavy, thin-content risk, and a chat answers it. |
| Currency quick convert | **Rejected** | No live rates in a no-backend site; offline rates are wrong quickly; head queries are owned by Google and xe. [V] |
| Pokémon layer, accounts, cloud sync, a monolithic single file | **Rejected** | Nintendo IP; ToyTools has no accounts or tracking; one 7.4 MB file is the opposite of the weight rules. [V earlier study] |
| Best call window as its own tool | **Folded** into #1 (a two-city view with polite-hours shading) | Same engine and the same job; a second page would cannibalise. |
| Work-week overlap | **Folded** into #1 (weekend days per city) | Holiday part deferred (D4). |
| World clock wall | **Folded** into #1 as a "now" view | Head term "world clock" is answered instantly by Google and incumbents; a separate page fails the substitution test. Reconsider only on GSC evidence. |
| Deadline "ends at" checker | **Folded** into #2 as a mode | Same conversion, plus a countdown. |
| Driving side and units | **Folded** into #9 (a layer) and #11 | A one-line fact is a lookup, which fails the test alone. |
| Emergency numbers by country | **Folded** into #11, last | Safety fact; needs verified source. |
| Languages and scripts map | **Folded** into #9 as a layer | Low demand alone; thin as a page. |
| Public-holiday overlap | **Deferred** | Data licence not verified (D4). |
| Physical-geography atlas for exams (rivers, peaks) | **Deferred** | This is the pokeindia content: a heavy curation job and a different audience (D2). |
| Moving all time tools into a new "Time and Travel" category | **Rejected** | `date-time` already has the engine, the patterns and the indexed authority; a new category costs a major bump and splits the cluster. |
| Two new categories (Geography, Travel) | **Rejected** | One engine and one data table; two categories double the category overhead for no search gain. |
