# ToyTools Changelog

All notable changes to ToyTools are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [alpha-v8.2.1] - 2026-08-30

### Added

- **A platform page**, at `/platform/`. Every tool page has signed itself "Powered by ToyTools"
  since the Zone B rebuild, and that line pointed at the homepage, which reads as a catalog: a
  visitor following it learned that the site has a lot of tools, not that there is one thing
  underneath them. The new page is the other half of that sentence. It names the four layers
  (engines, the shared runtime, the derived knowledge graph, the build gates), lists the guarantees
  every tool inherits from the platform rather than promises individually, and prints the engine
  manifest itself. Every number and every row on it is derived from the same registries the build
  validates against, so it cannot claim a platform the code has stopped having. Reachable from the
  footer, from `/about/`, and from the signature on all 138 tool pages.

### Changed

- **The homepage now says what holds the catalog together.** A new section under the categories,
  "These are not 138 separate tools", makes the four claims that distinguish a platform from a
  folder: shared engines, one runtime loaded once, no server to send anything to, and byte budgets
  the build enforces. The intro line above it went from "a toolbox you do not have to think about"
  to "one platform, 138 doors into it", and the meta description and `WebSite` schema lead with the
  platform rather than the pile.
- **`/about/` gained a section on the platform**, "It is a platform, not a folder", covering why a
  fix to an engine lands for every tool on it at once and what a tool actually contributes. The
  lede and the "how it works" section were reworded to match.
- **Category pages name the engines their tools run on**, beside the tool count. This is the one
  page where a dozen tools are seen side by side, so it is where "these share their machinery" is
  worth saying; the engine names are derived from the tools listed, and the line links to
  `/platform/`.
- **The "Powered by ToyTools" signature links to `/platform/`** instead of the homepage.

## [alpha-v8.2] - 2026-08-29

### Added

- **Electron Configuration Calculator**, at `/tool/chemistry/electron-configuration-calculator/`.
  Build any element or ion one electron at a time and watch the electrons land in Madelung order, so
  4s is visibly occupied before 3d rather than that ordering being a line to memorise. Three things
  the incumbents get wrong or skip: the twenty ground states that break the aufbau order are stored
  as the electron transfer that produces them (chromium moves one from 4s to 3d for a half-filled
  d5), ions are supported and lose electrons from the outermost shell first so Fe2+ comes out
  [Ar] 3d6 rather than [Ar] 4s2 3d4, and the valence shell is highlighted on both the shell picture
  and the orbital bars instead of being left buried in a string.
- **Chemical Bond Calculator**, at `/tool/chemistry/chemical-bond-calculator/`. Pick two elements
  and watch the shared pair slide toward the greedier atom. The point of the tool is that bond
  character is a continuum: Pauling's relation is plotted as the smooth curve it is, with the
  familiar 0.4 and 1.7 cutoffs drawn as thin marks on it rather than as walls between three boxes.
  A bond within 0.15 of a boundary is flagged as a boundary case, and a nonmetal pair past the 1.7
  threshold is called out by name, because hydrogen fluoride sits at 1.78 and is a molecular gas
  rather than the ionic compound the cutoff claims.
- **A shared periodic table** at `src/lib/simulation/data/elements.ts`, carrying symbol, name and
  Pauling electronegativity for all 118 elements. Electronegativity is `null` where the scale
  defines no value, which the bond tool reports as no difference rather than defaulting to zero and
  calling every bond to helium wildly ionic.

### Changed

- Both new tools were picked by the Research Intelligence Engine rather than by hand. Three
  candidate records were added to `research/datasets/chemistry.json` and the engine ranked electron
  configuration at 79.6 (third in the whole catalogue) and chemical bond at 77.6, with molecular
  geometry outside the top ten.

## [alpha-v8.1] - 2026-08-29

### Added

- **An engine shape gate**, `npm run check:engines`, holding two ratchets: the number of engines
  with no cross-engine relationship at all, and the number declaring no shared widget. Engine to
  engine relationships have been derived and drawn on `/architecture/` since that page was built,
  but a picture is not a check, so an engine could drift into isolation with every gate green. The
  gate runs the same derivation and prints it as a table you can diff; `-- --report` adds the full
  inventory, per-category fan-out, widget reuse and the coupling list. It reads the registries
  rather than `dist/`, so it runs before the build in `npm run verify` and in PR CI.

### Fixed

- **The three chemistry simulators now link outside their own subject.** Related tools are derived
  from shared concepts, quantities and family, and each chemistry simulator is the only member of
  its family, so the set derived no link beyond itself: `chemistry-lab` shipped as an isolated
  engine on the architecture map. The reaction rate simulator now points at the ideal gas law
  simulator (a gas-phase rate starts from how often molecules collide) and at the nuclear reactor
  simulator (radioactive decay is first order kinetics); the Newman projection points at simple
  harmonic motion, which is what the thermal wobble in a conformer well actually is; crystal field
  splitting points at wave speed, since turning a splitting into a colour is the wavelength and
  frequency relation.
- **An authored `relationships` overlay on a simulation manifest now merges on top of the derived
  edges instead of replacing them.** The type is named an overlay and documented as "non-derivable
  workflow edges", but `resolveRelations` returned it wholesale, so authoring a single link would
  have silently dropped every derived sibling edge. No manifest set the field while that was true,
  so the branch had never run.

## [alpha-v8.0] - 2026-08-29

### Added

- **A Chemistry category**, at `/category/chemistry/`, with three simulators covering one branch of
  a first chemistry course each. Chemistry is the third domain plugin on the simulation platform
  after physics and applied math, so all three tools run the same canvas engine, the same live
  measurement cards, formula panel and graph, and the same offline behaviour.
- **Newman Projection Calculator** (organic), at `/tool/chemistry/newman-projection-calculator/`.
  Drag across the molecule to rotate the back carbon and the strain energy curve fills in
  underneath: torsional strain and steric strain reported separately, plus live anti and gauche
  populations from the Boltzmann factors. One slider slides the molecule from ethane to butane to
  bulkier groups, and the fits are exact at both named ends: ethane gets a 12 kJ/mol barrier with no
  steric term, butane gets 19 syn, 16 eclipsed, 3.8 gauche and 0 anti. The molecule librates around
  the set angle at an amplitude taken from equipartition, so raising the temperature visibly loosens
  the bond.
- **Crystal Field Splitting Calculator** (inorganic), at
  `/tool/chemistry/crystal-field-splitting-calculator/`. The spin state is decided rather than
  asserted: both the high-spin and the low-spin configuration are built and costed on every frame,
  and the cheaper one is drawn. That reproduces the delta versus P rule for d4 through d7 and
  correctly reports d1 to d3 and d8 to d10 as having no choice at all, with no per-count special
  case. Live CFSE, unpaired electrons, spin-only magnetic moment, the absorption wavelength and the
  complementary colour the complex actually looks. Tap the complex to switch between octahedral and
  tetrahedral, which applies both the four ninths splitting and the inverted orbital sets.
- **Reaction Rate Calculator** (physical), at `/tool/chemistry/reaction-rate-calculator/`. Set an
  activation energy and a temperature and the reaction runs at the rate the Arrhenius equation
  gives, integrated in closed form for zero, first and second order. A rate constant spans about
  forty orders of magnitude across the sliders, so k and the half-life are reported as base-10
  logarithms and a time lapse slider multiplies the chemical clock by a power of ten, which makes a
  reaction with a half-life of a century watchable without pretending it is fast. The graph plots
  concentration against time in half-lives, where the three orders have universal shapes.
- Guides at `/guide/chemistry/how-newman-projections-work/`,
  `/guide/chemistry/how-crystal-field-splitting-works/` and
  `/guide/chemistry/how-reaction-rates-work/`, plus eight FAQs on each tool.

### Changed

- **The search page carries less duplicated vocabulary.** Every tool card shipped a hidden
  attribute holding its tags, keywords and family, which repeat each other and often repeat the tool
  name printed on the card. The attribute is now built against the card's own text and skips any
  phrase already present, which took about 10 KB off the page. Every dropped phrase is still a
  substring of what remains, so no search result changes.

## [alpha-v7.24] - 2026-08-24

### Fixed

- **JSON Formatter, JSON Minifier and every other two-pane text tool now scroll inside the box
  instead of stretching the page.** A pane holding a textarea or an output had no height ceiling, so
  it grew to match whatever it held: a few hundred lines of formatted JSON made the two panes on
  `/tool/developer-utilities/json-formatter/` over 7,000px tall, which pushed Copy, the validity
  line and the whole Paste / Clear / Download row thousands of pixels below the fold. Both panes are
  now capped against the viewport and their contents scroll in place, so the result and its controls
  stay on one screen. The cap reaches the CSV, converter, encoding and text tools built on the same
  panel.
- **The JSON Tree Viewer's two boxes are full height again on desktop.** They were collapsing to
  their own content rather than standing at the viewport-derived height the widget asks for: the
  empty state rendered a 70px input sliver that clipped its placeholder mid-line, and the tree ran
  off the bottom of the page instead of scrolling inside its box. The layout's equal-height mode was
  giving each pane a flex basis, which outranks the height. Both boxes now hold at roughly a screen
  minus the page chrome, floor 440px, and scroll internally.

## [alpha-v7.23] - 2026-08-23

### Added

- **Nuclear Reactor Calculator**, a new physics simulator at `/tool/physics/nuclear-reactor-calculator/`.
  Drag a control rod and watch a one-group point-kinetics chain reaction respond live: reactivity in
  dollars, the prompt-critical threshold at 1 $, a temperature feedback coefficient that can stabilize
  or destabilize the core, and an automatic trip (scram) that fires if power or temperature crosses a
  safety limit. Each substep is solved exactly via the kinetics matrix's two real eigenvalues rather
  than integrated numerically, so a hard prompt-critical excursion never destabilizes the simulation
  itself.
- The reactor's formula panel is a **rod-worth calculator**: type a rod position or a rod worth and
  it solves `ρrod = (x / 100 − 0.5) × 2 × W`, with the scene following the number you typed. It
  answers the question the slider cannot, which is where to put the rod to buy a given reactivity.
- A tripped reactor **restarts from the canvas**. Tapping it clears the trip and returns the core to
  rated power with every slider untouched, so retrying a scenario no longer costs the setup that
  produced it; Reset remains the way back to defaults. The canvas also gained a dashed **critical
  line** marking where rod reactivity crosses zero, and a labelled trip mark on the temperature
  gauge, so the rod's height and the core's heat both read against something.
- A scram now inserts a full **5 $ shutdown margin** rather than merely driving the operating rod to
  0%. Modelling it the shallow way left net reactivity at feedback minus rod worth, so the weakest
  rod (0.3 $) against the strongest positive coefficient (+0.8 $ at the trip temperature) stayed
  supercritical *after* the trip and climbed without limit.

## [alpha-v7.22.2] - 2026-08-23

### Added

- **Every engine now owes the test suite a contract, and the suite notices when one does not have
  one.** `contract.test.ts` covered 8 of the 18 engines; wellness and generation had reached 11 and
  9 tools respectively without a single cross-tool assertion between them. All four remaining
  dispatching engines (wellness, generation, csv, tracker) now have one, math-lab shares the
  simulation contract that previously ran for physics alone, and a meta-test fails the build when a
  newly registered engine is neither contract-tested nor explicitly recorded as bespoke. The
  generation contract drives each generator from its own declared field defaults and holds it to its
  `autoGenerate` flag, which is what caught that qr-code is the one generator that legitimately
  cannot produce output without user content.
- **A search corpus test that pins real queries to real tools.** The existing ranking tests score
  synthetic entries, so they prove the tiers behave without proving that typing "yml to json" finds
  the right converter. The new test asserts the documented near-miss cases against the live catalog,
  including that every tool stays findable by the name shown on its own page, and that a query for a
  tool the catalog does not have returns nothing rather than the closest loose match.
- **An incomplete tool directory fails in seconds instead of taking the whole build down.** A
  directory with a `config.ts` and no `Widget.astro` passed every validator, because the check that
  reads each widget treats a missing file as "no globals used". The failure surfaced instead
  midway through `astro build`, and since a static Astro build has no per-page error boundary, one
  incomplete directory failed the entire catalog and blocked every other tool's deploy.
  `validate-registry` now catches it before Astro starts and names the tool.
- **A version and changelog gate.** Shipping a change without bumping the version has been a hard
  rule with nothing enforcing it. `npm run check:version` fails when a diff touches shipped code and
  leaves `version.ts` alone, or when the version it declares has no CHANGELOG entry. It reads the
  working tree as well as committed history, so `verify` catches the omission before the commit
  rather than after the PR goes red, and it runs in both `scripts/verify.sh` and the PR workflow.

### Changed

- **Related-tools ranking stopped re-scanning itself.** Each tier of the four-tier cascade excluded
  the tiers above it with `Array.includes` inside a filter over the whole catalog, which is a linear
  scan inside a linear scan, three times over by the last tier. On a catalog where one engine holds a
  large share of the tools, one pass measured 3.7s at 5,000 tools and the build makes four of them.
  Tier membership is a Set now. Order, tier boundaries and the cross-family floor are untouched.
- **An engine declares its runtime globals on the same line that declares the engine.** The list of
  what each engine attaches to `window.ToyTools` lived in `runtime/loaders.ts`, one file away from
  the engine manifest that already described the same engines. It moved to `engines.ts`. It is
  deliberately not re-exported from `loaders.ts`: that file is browser code, and reaching the
  registry from it would pull every tool config into the runtime chunk.
- **The scaffold stopped emitting a placeholder for three engines that already have a widget.**
  `datetime`, `math` and `csv` each have a shared widget on disk, but were missing from the
  scaffold's map, so a new tool on any of them got `<p>TODO</p>` and a note to copy a sibling by
  hand. The comment beside that map already listed only the four genuinely bespoke engines, so this
  was an oversight rather than a decision.
- **The search index budget note records what has actually been tried.** It cited a measurement from
  114 tools; the index is now 9.6K of its 12K ceiling at 132, which is roughly 35 tools of headroom.
  The note carries today's number, the three payload experiments now spent (including two that made
  it worse), and what the structural answer is when it does trip.

## [alpha-v7.22.1] - 2026-08-22

### Changed

- **The homepage says what a toolbox means, instead of only naming one.** "The internet's little
  toolbox" was a claim that stopped there and left the reader to supply the rest. It now finishes
  the thought: open it, take out the one thing that does the job, close the tab. A short paragraph
  under the search says the same thing in plain terms, and it sits below the search rather than
  above it so the box most visitors came for stays where their thumb already is.
- **The hero stopped saying one thing twice.** The stats line read "Everything runs in your
  browser" directly beneath an h1 ending "In your browser." That slot now carries the offline
  claim.
- **The wrench moved to the README.** The gold dot is this site's mark, and an emoji sitting beside
  it in the hero competes with the thing it exists to reinforce. It still opens the README, where
  there is no mark for it to fight.

### Fixed

- **"Works offline" would have overstated what the site does.** The service worker precaches only
  the homepage and the offline page, then caches pages as they are visited, so a first-time visitor
  with no network gets the offline page and not the catalog. The line now reads "Works offline once
  opened", which is what `/offline/` has said all along.

## [alpha-v7.22] - 2026-08-22

### Added

- **Nine new tools**, at these URLs:
  - `/tool/generate/dice-roller/` rolls any pool by standard notation (`d20`, `4d6+2`) and says how
    often a roll like that one turns up.
  - `/tool/generate/coin-flipper/` flips once or five hundred times, and answers the "this is
    rigged" complaint with the share of runs that come out at least that lopsided.
  - `/tool/generate/random-name-picker/` draws names from a pasted list without repeats, and warns
    when a duplicated entry is quietly giving somebody two tickets.
  - `/tool/generate/random-choice-picker/` picks a winner or shuffles the lot into an order, and
    catches the one line that is really five options separated by commas.
  - `/tool/number/roman-numeral-converter/` converts both ways from I to MMMCMXCIX, reads the
    additive spellings off clock faces and monuments, then offers the modern one.
  - `/tool/number/number-to-words/` spells numbers out and reads words back, and cleans the currency
    symbol and thousands separators off an amount pasted from a spreadsheet.
  - `/tool/number/binary-converter/` converts numbers between decimal and base two, exactly past
    2^53, with hex, octal and the bit count alongside.
  - `/tool/text/text-repeater/` repeats text with a separator you choose, and refuses to build the
    multi-megabyte string an extra zero in the count would produce.
  - `/tool/text/character-map/` is a searchable grid of 362 special characters that also hands you
    the HTML entity, CSS escape and JavaScript escape for whichever one you tap.
- Each of the nine has a guide and an FAQ, and each ships one declared thoughtful touch. Craft
  coverage moved from 60.5% to 63.5%.
- **A "Chance & Picking" section on the generators page**, where the four new randomisers live.

### Changed

- **The homepage says what the site is meant to feel like.** The line under the heading is now "The
  internet's little toolbox 🔧", and the about page opens on what that implies: you take out the one
  thing that does the job and put it back, and nothing in a toolbox asks who you are first.
- **The same line now reaches everyone who asks what this site is**, in the four places each
  audience actually looks: the homepage meta description and its WebSite schema (search results),
  `llms.txt` (AI agents), the README (contributors), and the hero (visitors). It is deliberately
  absent from the footer, because repeating it there would put the same sentence twice on the one
  page that already opens with it.
- **Searching for "slug generator" now finds Slugify Text.** The tool has existed all along under a
  name nobody types. Aliases were added for the new tools at the same time.
- **Roman numerals, English words and base two are read in their own vocabulary.** The converter
  header on those three pages says "To Roman" and "To number" rather than "Encode" and "Decode",
  which is what the encoding engine had hardcoded since it shipped.

### Fixed

- **The `/search/` page was the heaviest HTML document on the site**, and adding nine tools pushed
  it over its budget. Every card carried a `data-search` attribute holding a second lowercase copy
  of that tool's name, description and category, none of which was displayed. The attribute now
  holds only the tags, keywords and family, which are the terms that never appear on screen, and
  the filter reads the card's own text for the rest. Matching is unchanged.
- **"hexadecimal" was ranking the new binary converter above the hex encoder.** The alias belongs to
  the tool named after it.

## [alpha-v7.21] - 2026-08-21

### Changed

- **Category pages stopped drawing a line between every tool.** On the text page that was a rule
  under each of thirty entries across four groups, which made a simple list look like a table.
  The lines under the page header, under each heading in the directory, and above the guides list
  are gone too. Space separates them now, as it does everywhere else on the site.
- **Every category page now says what its tools have in common.** Underneath the list there is a
  short piece about the group: what the tools are for, which ones get confused with each other, and
  where the edges are. Margin against markup on the number page, why the counters disagree on the
  text page, why a BMI is a starting point and not a measurement on the health page. It sits below
  the tools so anyone who came for a tool reaches it first.

### Fixed

- **Category pages were invisible to search engines as listings.** They already asked to be indexed
  and were already in the sitemap, but they carried no structured data at all, so nothing said the
  page was a list or what was on it. They now describe themselves as a collection, name every tool
  in it, and carry the same breadcrumb data the tool and guide pages have had all along.
- **An em-dash was rendering on nine category pages**, in the line describing grouped tools. The
  site's writing rule is that authored content has none.

## [alpha-v7.20] - 2026-08-21

### Added

- **Invisible Character Detector** at `/tool/text/invisible-character-detector/`, with a guide at
  `/guide/text/find-invisible-characters/`. When two strings look identical and an exact-match
  comparison says they differ, this names the character responsible, says where it sits and what it
  breaks, and hands back the text without it. It reports zero-width spaces and the byte order mark,
  spaces that are not U+0020, curly quotes, bidi controls and lookalike letters from other scripts.
  Plain ASCII, ordinary spaces, tabs and newlines are never reported, because a check that fires on
  every string is one people learn to dismiss.
- **Its craft: a warning when the text mixes scripts.** A Cyrillic letter that renders as its ASCII
  twin passes every visual review, which is how lookalike domains and disguised commits get
  approved. Pointing at the character is not enough when it is wearing another letter's face, so the
  tool says the text mixes scripts and that this is a technique rather than a typo. It stays silent
  for text that is simply not Latin, since flagging Russian for being Russian would be both wrong
  and useless.
- **`text-inspect`**, a pattern for tools that sit on the text-processor engine to report on input
  rather than transform it. Shipping this tool closes the `asymmetry:text-processor` silence that
  recommended it: nine tools produced transformed text and none could check any of it.

## [alpha-v7.19] - 2026-08-21

### Added

- **Encoding Detector** at `/tool/developer-utilities/encoding-detector/`, with a guide at
  `/guide/developer-utilities/identify-string-encoding/`. Paste a string and it says what encoding
  it is, what each possible reading decodes to, and when it is not encoded at all. It identifies
  Base64, Base64URL, hex, URL-encoding, HTML entities, binary and punycode by decoding each
  candidate and checking the result is readable, rather than by matching alphabets, because every
  English word matches the Base64 alphabet and "decade" is valid hex. It refuses to guess at ROT13,
  which no structural test can distinguish from ordinary prose.
- **Its craft: a decode that is still encoded says so.** A value that travelled through a URL is
  routinely Base64 wrapped in percent-encoding, and one decode returns something that looks exactly
  like corrupt data. The tool names the next layer and offers one tap to peel it, so the answer is
  three taps rather than three tabs.
- **`encode-detect`**, a pattern for tools that sit on an encoding engine to answer which codec
  applies rather than to apply one. It is the first pattern the research engine counts as verifying,
  which closes the `asymmetry:encoding` silence that recommended this tool: the catalog had eight
  tools producing encoded text and none that could check any of it.

### Changed

- **The processorId rule now asks per pattern, not per engine.** Every tool on a registry-backed
  engine had to name a processor, which is right for the thin wrappers that dispatch through one and
  impossible for a detector that has no codec to name until it has worked out which codec applies.
  Patterns that do not dispatch are declared in `src/data/engines.ts`; the rule keeps its full force
  everywhere else, and an unknown or duplicate id is still an error for every tool.

## [alpha-v7.18] - 2026-08-21

### Added

- **The research engine now scores whether we could rank for a tool at all**, not just whether the
  tool is worth building. Its old top three recommendations were a pregnancy due-date calculator, an
  ovulation calculator and a blood-pressure tracker, ranked above everything else on search demand
  and build cost. Those are the query classes where Google weights site-level trust hardest, and
  nothing on this site carries a citation or a named author, so a better calculator was never going
  to enter those results. Seed records now state `authorityRequired` alongside `demand` and
  `competition`, and the top recommendation moved to tools a correct implementation can actually win.
- **Five latent-demand proposals**, for needs with no search query behind them: an encoding detector,
  an invisible-character detector, a UUID inspector, a hash identifier and a date-format detector.
  Each is anchored to a structural silence the engine derives from the catalog itself, and each
  records the mid-task failures its users hit, so the craft decision has evidence behind it rather
  than being invented at scaffold time.

### Fixed

- **The research engine no longer reports two holes the catalog had already filled.** It read
  producer/verifier intent from a regex over pattern names, so it missed `color-contrast-checker`
  (it verifies, but its pattern name says nothing about checking) and could not see `csv-diff` at
  all, because tool-group members must share one pattern and `csv-to-tsv` has the same one. Roles are
  now declared against the registry, by family where a shared pattern cannot tell siblings apart, and
  the derived silences dropped from twelve to ten with both false positives gone.

## [alpha-v7.17.2] - 2026-08-21

### Changed

- **About, Privacy, Changelog and Settings now match the tools.** They were the last pages drawing
  a rule above every heading, and Settings drew one under every row of saved data. Space separates
  the sections instead, as it does everywhere else on the site.
- **The changelog opens with its releases listed.** Twelve releases of prose is a long page to
  scroll for one version, so every release is now a tap away from the top. Nothing is hidden or
  collapsed: the entries stay open and stay findable with a browser search.

### Fixed

- **Bulleted lists have bullets again** on About, Privacy and the changelog. The site strips list
  markers by default and these pages never asked for them back, so their lists were indented
  against nothing while the guides, which do ask, looked right.
- **Body text on five pages was using a hardcoded line height** rather than the one in the design
  tokens, because the token name was misspelled and the fallback quietly took over.

## [alpha-v7.17.1] - 2026-08-21

### Fixed

- **The last four separator lines, in places that only appear when you use the tool.** The JWT
  reader put a rule between every claim, the cron converter and the shell quoter each drew one
  above a note, and the simulators drew one above the worked formula. All four render only once
  there is something to show, which is why sweeping the pages in their default state missed them.
- **The password strength meter and the QR code stopped using colours invented on the spot.** The
  two middle steps of the meter and the QR's white backing are real palette entries now, the QR
  because a scanner needs true white in either theme.

### Changed

- **The no-lines rule is now checked by the build rather than trusted.** Adding a separator rule to
  any tool fails `npm run verify` with an explanation, so this cannot quietly come back. The same
  check now also reads the shared widgets that several tools are built from, which is where the
  boxes fixed in the last two releases had been hiding from it.

## [alpha-v7.17] - 2026-08-20

### Changed

- **The last twenty tools lost their boxes.** The previous release took the frames off everything
  built from the shared panels, which was most of the catalog but not the tools that draw their own.
  Counting what every one of the 121 tools actually paints on screen found twenty still framing
  their own sections: the JWT reader alone drew eight. Those are gone, and so are the rules that
  ran between sections on the counters, between the rows of a to-do list, and across the middle of
  a text comparison. Every tool page now draws only the edges that mark something you can operate:
  a button, a field, a colour swatch. The three exceptions kept on purpose are the line under a
  worked formula, the accent stripe on an explanation callout, and the aspect-ratio preview, whose
  border is the thing being previewed.

### Fixed

- **Four pages had no top or bottom padding at all**, and four tool sections had no space above
  them. All of them asked for a spacing step that was never defined, and CSS discards a whole
  declaration when one value in it is unknown, so About, Privacy, Changelog and Settings opened
  flush against the header. The step is defined now and those pages space out as they were written
  to. This is the same class of bug as the square-cornered trackers in the previous release.

## [alpha-v7.16] - 2026-08-20

### Changed

- **Every tool page lost the boxes it drew round its own contents.** A tool was built from framed
  panels, each with a rule under its label and an already-filled input sitting inside the frame, so
  the same page drew a box, a line and then another box to say one thing. The frames and the rules
  are gone across all 121 tools. The field keeps its fill, which is the one edge that was doing
  real work: it is what tells you where to type. Panels, ledger rows, grid cells and output rows
  are separated by space now, and a container that still needs to read as its own surface is filled
  rather than outlined.
- **Lines that mean something stayed.** An edge round a button, input, select, tab or stepper is
  what says "operate me", so those are untouched, as are the colour swatches (a near-white colour
  has no other edge and would vanish), the sticky action bar on phones, and the single rule that
  opens the reading section at the bottom of every tool page.
- **Fixed content running off the side of a phone.** Three tools pushed content past the screen
  edge at 360px, the narrowest common phone, and none of it showed on a desktop: a converter's
  panel, the weight tracker's stats, and the drawer headings on the systemd timer tool, whose topic
  name is a whole sentence. All three were the same root cause in different clothes, a panel
  refusing to narrow below its contents, so the fix is in the shared layout rather than in each
  tool. Colour and unit values that were being sliced mid-value now wrap instead.
- **The mode switcher no longer looks broken.** Tools that belong to a set carry a row of mode
  pills, and on 61 of them the row was wider than the screen with its scrollbar hidden, so the pill
  at the edge was chopped in half with nothing to say it could be scrolled. The row now fades out
  at its trailing edge. Wrapping it instead would have pushed the answer below the first screen on
  the calculators, which is a worse trade.
- **The three tracker tools lost their outlines too**, which the pass above had missed, and got
  their rounded corners back: they were asking for a corner size that does not exist in the design
  tokens, so the browser was quietly ignoring it and squaring them off.
- **Content lines up with the label that names it.** The panels carried insets that existed to hold
  their contents off a frame's edge. With the frames gone those only pushed content away from its
  own heading, so a result sat 26px to the right of the word RESULT. Labels and content now share
  one left edge with everything else on the page.

## [alpha-v7.15] - 2026-08-19

### Changed

- **The fourteen simulators lost the furniture around the physics.** Every simulation page carried
  six panels each wearing a header bar with four move arrows, so a page whose job is to show a
  pendulum swinging opened with 24 buttons for rearranging the panels around it. The arrows are
  gone, along with the saved panel order. Nothing about the pendulum, the sliders, the live
  numbers, the graph or the formula changed; there is simply less to look past to reach them.
- **The simulator reads as a set of groups rather than a wall.** With the panel borders gone, the
  space around a group was the only thing left saying where it ended, and there was not enough of
  it: the gap between two panels was exactly the gap a panel put between its own label and its
  content, so every gap on the page was the same 12px. Panels are now four times further apart than
  the things inside them.
- **Panel labels read as labels.** "Controls", "Graph", "Live measurements" and the rest take the
  small caps treatment the guides and the knowledge sections already use, so the eye skips them and
  lands on the content instead of reading them as another line of text. The simulator's own title
  stays the one full heading on the page, and the real-world examples drawer now matches the four
  drawers below it rather than looking like a different kind of thing. Buttons also gained a
  pressed state, which a phone needs because it never shows a hover.
- **The simulation lines up with its own controls.** The scene was capped in width so a tall
  scene could not push the dashboard off the first screen, but it was also centred, so it floated
  inside its column with Play under empty space to its left and the speed buttons sticking out past
  its right edge. The scene, the playback row and the graph strip below it now share one left edge
  and one right edge. The cap is worked out when the page is built rather than after the simulation
  code loads, so the scene also stops jumping from a full-width sliver to its real size on load.
- **Fixed three smaller alignment faults.** The two centred formula lines sat on axes 14px apart,
  because the global reading-width cap for paragraphs happened to catch the lower one and not the
  larger one above it. On a phone, formula terms were laid out in two columns too narrow for them,
  wrapping labels and values mid-term; each term now gets its own row. And the number boxes in the
  formula were pushed sideways by whatever width their unit happened to be, so "1 m" and
  "9.81 m/s2" stacked their boxes 20px apart; the unit column is now a fixed width.
- **The simulator answers before it asks.** The live readings now sit between the scene and the
  sliders rather than below them, which is the answer-first order every other tool follows, and the
  reading the tool is named for (period, wave speed, current, range) is set larger than the three
  supporting it. Four numbers at one size gave the page nothing to land on.
- **Less to look at while the simulation runs.** The min and max captions under every slider are
  gone: the slider shows where you are in its travel, and the presets name the interesting values
  (Earth, Moon, Jupiter) better than "1.6 to 25" did. The sentence telling you to type into the
  formula is gone, because the boxes look like boxes. The speed control lost its "Speed" caption
  and reads as quiet text rather than four more buttons beside Play, with the same tap targets.
- **Real-world examples moved into a drawer**, matching the four the page already carries below the
  tool. It is background reading rather than part of running the simulation, and it was the longest
  thing on the page. Closed drawers are still read by crawlers, so nothing left the HTML. Together
  with the above, a simulator page on a phone is about a fifth shorter.
- **The simulator dashboard reads as one surface instead of nine.** The tiles holding the
  measurements, the formula and the graph never drew an edge of their own, but their contents did:
  each live reading sat in a bordered card, the formula in a bordered box, the graph canvas in a
  bordered rectangle, giving every simulator a page of boxes inside boxes. Those edges are now
  space, and the graph matches the scene canvas it sits beside. The panel labels ("Controls",
  "Graph", "Formula") are quiet captions rather than headings that competed with the simulation
  for attention; they remain headings for screen readers and the page outline. The simulator's own
  title is unchanged and still leads the page.

## [alpha-v7.14.1] - 2026-08-18

### Fixed

- **Every tool page now links to related tools again.** 47 of the 121 tool pages linked to no other
  tool at all, and the typical page linked only to its own tool-group siblings, which are
  near-identical by design. A layout cleanup had removed the related-tools block on the grounds that
  the category page is one click away either way. That is true when you are reading and false when
  a search engine is crawling, so the links are back as five entries in a collapsed drawer in the
  row that already exists: one more chip on screen, nothing pushed down, 0.2KB added to a page with
  3.2KB of room.
- **Related tools stop recommending five near-identical siblings.** Any tool on a large engine used
  to fill its whole list from that engine, so all eighteen text cleanup tools pointed only at each
  other. One slot now goes to the closest tool from a different family, which is how Trim Text
  reaches the word counter and the colour converter reaches the contrast checker. Lists that already
  reached outside their family are untouched.

## [alpha-v7.14] - 2026-08-18

### Added

- **The eighteen text tools can now tell you when you are on the wrong one.** They sit one paste
  apart and look nearly identical from a listing, so it is easy to land on Remove Extra Spaces when
  you wanted Trim Text, get a correct-looking result, and leave with the job half done. Each one now
  says what it deliberately left alone and links to the tool that finishes it: the space remover
  points out the line edges it kept, the trimmer points out the gaps it left inside the lines,
  Remove Blank Lines explains a no-op instead of looking broken, and Slugify warns when a line had
  no ASCII characters and became nothing at all. Remove Duplicate Lines goes further and counts how
  many more lines would go if the text were trimmed or lowercased first.
- **The nine health calculators now say where their estimate is weakest, in your numbers.** Every
  result already carried a caution, which is exactly why nobody read it: the same sentence on every
  answer is boilerplate. These fire only when your input has landed somewhere the formula struggles.
  A marathon predicted from a 5K is flagged as eight times past the range the model holds for. The
  four ideal-weight formulas report how far apart they are at your height rather than pretending to
  one target. A one rep max from a set of twelve says how much the formulas disagree. Your protein
  target is divided by your meal count against the point where a single serving stops helping. And
  a BMI that comes out impossible offers the reading you get if that weight was in pounds.

## [alpha-v7.13] - 2026-08-18

### Added

- **The six everyday calculators now name the arithmetic people get wrong.** Backing tax out of a
  total by subtracting the rate under-reports the price every time, so the tax tool shows what that
  method would have given. The percentage calculator separates a 25% change from a gap of 5
  percentage points, but only when both values are themselves rates. Margin and markup call a price
  below cost what it is: money leaving per unit, not a percentage. The tip calculator reports what
  rounding the total up actually tipped. And the discount calculator can stack a second discount
  onto the discounted price, because "30% off, extra 20% at the till" is 44% off and almost everyone
  adds it to 50%. Each line is silent unless the input exhibits the problem.
- **The three unit converters catch the conversion one step before it fails.** 16:9 at width 1000 is
  562.5 pixels, which ffmpeg rejects for divisibility rather than for the ratio, so the aspect
  calculator names the nearest even pair on the same ratio and one tap applies it. 5dp is three
  quarters of a pixel at ldpi, so the dp converter names the densities that break and the nearest
  value on the 4dp grid. The rem converter points out that em is relative to the parent, not the
  root, and compounds when nested.
- **Text Compare can tell you when a diff is entirely whitespace.** A Windows file against the same
  file from git differed on every line with nothing saying why. It now names the normalization that
  would help and how many changed lines are noise. The toggle normalizes the comparison only; your
  two texts are never rewritten.
- **The colour converter reads an eight-digit hex out loud.** CSS defines it as `#RRGGBBAA`, Android
  writes `#AARRGGBB`, and the same eight characters are two colours that both parse. The tool names
  the other reading and offers the swap.

### Changed

- Keep Screen Awake's status line is now a declared thoughtful touch. Nothing about it changed: it
  has been derived from the live wake-lock sentinel since the tool shipped, so a dropped lock has
  always been reported and retried rather than hidden behind an "Awake" label.
- Text Compare's similarity sentence no longer uses an em-dash, which the writing rules forbid in
  shipped copy.

## [alpha-v7.12] - 2026-08-17

### Added

- **The five hash generators can check a digest against the one you were given.** Paste the expected
  hash, or a whole line of `sha256sum` output, and the tool answers. It reads the shapes people
  actually copy: `sha256sum` output with the filename attached, Docker's `algo:hex` prefix,
  uppercase from Windows `certutil`, whitespace from a terminal. **The case it exists for is the
  wrong algorithm** — a 40-character digest in the SHA-256 box is a SHA-1 digest, and every tool
  that just says "no match" sends somebody re-downloading a file that was never broken.
- **The JSON tools offer the fix instead of naming a character offset.** `JSON.parse` reports
  "Unexpected token } at position 47", and the two commonest causes are not the user's mistake: a
  trailing comma that is legal in JavaScript, and the smart quotes Word, Docs, Notion and Slack
  insert silently. Both are one tap away now, on the five JSON-input tools. It only ever offers a
  repair that actually parses.
- **Every text counter now says one true thing the number does not show.** The sentence counter flags
  abbreviations that inflate its total; the paragraph counter explains why a wall of text counts as
  one; the reading time names the words-per-minute rate it assumed. Silent whenever the input does
  not actually exhibit it.
- **The password generator's exclude-ambiguous option is now the tool's declared guardrail** —
  O against 0 and l against 1 are indistinguishable in most fonts, and a password gets typed by hand
  off a screen or read down a phone.

### Changed

- The JWT decoder's live validity panel and the contrast checker's suggest-a-passing-colour button
  are now declared craft. Both were already built and already silent until needed; only the
  declaration was missing.

## [alpha-v7.10] - 2026-08-17

### Added

- **Every category page now lists its guides.** No category page linked a single guide before this:
  guides were reachable only from their own tool page and from each other, which left 56 of 121 at
  click depth 3 from the homepage. All 121 are now at depth 2. A plain list of links below the tool
  rows, because the tools are what a category page is for.
- **Twenty tools now name the published method they implement**, in one line under the tool. BMI
  cites the WHO classification, BMR and TDEE the Mifflin-St Jeor equation, body fat the US Navy
  circumference method, ideal weight the Devine, Robinson, Miller and Hamwi formulas, heart-rate
  zones the Karvonen method over a Tanaka maximum, one-rep max the Epley, Brzycki and Lombardi
  formulas, running pace the Riegel model, the colour checker the WCAG relative-luminance ratio, and
  the finance tools periodic compounding, CAGR, the Rule of 72 or the annuity formula. Every one is
  what the engine actually runs and what its unit tests pin. Nothing on a tool page previously said
  where its numbers came from, which matters most where we compete with health bodies and banks.
  The physics simulations are deliberately excluded: they already render their equation in a
  dedicated panel, and PV = nRT is not one method among several.
- **Curated workflow links on nineteen tools** that had none, each carrying the reason it exists:
  BMI to ideal weight and body fat, TDEE to BMR and on to macros, cron to systemd timers, unix
  timestamps to time zones, HTML entities to URL encoding and on to JSON escaping.

### Changed

- **Every tool now answers the words people actually type.** Query targeting went from 75.3% to
  **100% (361 of 361 known phrasings)**. `remove-line-breaks` matched 1 of its 7 and never used
  "join lines", "newlines" or "strip" anywhere weighted. The colour checker never said "contrast
  ratio". The ROT13 tool never said "Caesar cipher", which is what it is. The SIP calculator never
  said "mutual fund". `px-to-dp` never said "density independent". BMR now names Harris-Benedict as
  the equation Mifflin-St Jeor replaced, which is true and is what people search for.
- **All fourteen simulations pass their content gate**, up from eleven. The three that failed never
  said what they model: the probability lab now talks about dice, odds and running an experiment;
  the spring simulation names SHM, spring oscillation and Hooke's law; the gas simulation names
  Boyle's law, Charles's law and kinetic theory, and its "pressure comes from the gas weight"
  heading now states the answer rather than only the misconception.
- **Pixel 5 is a pull-request gate.** It ran locally and weekly but not on a PR, and
  `tests/e2e/fold.spec.ts` skips off Pixel 5 entirely, so the fold ratchet never ran on a pull
  request and a phone regression could merge green on a phone-first catalog. Both projects now run
  as parallel CI legs.
- **Tapping a control now looks like tapping a control.** Every interactive class in
  `tool-widget.css` declared a `:hover` state and none declared `:active`, so on a phone, where
  there is no hover, pressing a button, a stepper, a preset chip or a stat row produced no
  acknowledgement at all. All eleven now have a pressed state, honouring `prefers-reduced-motion`.
- The return key on calculator inputs is labelled **Done** (`enterkeyhint`), which puts the keyboard
  away and reveals the result instead of leaving an unlabelled action.

### Fixed

- **Every guide page published a date search engines could not read.** `datePublished` and
  `dateModified` were emitted as `"Jul 2026"` on 102 of the 121 guides, which is not ISO 8601, so
  Google dropped both properties and the `Article` markup was degraded everywhere. One field was
  doing two jobs: `guide.updatedAt` was documented as a display string and fed straight into the
  schema. It is an ISO date now, and the visible "Updated Jun 2026" line is derived from it at render
  time by `formatMonthYear` (`src/lib/dates.ts`).
- **The 19 guides that were already valid were showing a raw `2026-06-07` to readers**, the same bug
  from the other side. All 121 now read "Updated Jun 2026" and all 121 emit a valid date.
  `validate-registry` fails the build on a non-ISO date now, on the guide and the tool alike.
- **Nothing on a tool page said when it was last touched, or who publishes it.** The
  `SoftwareApplication` markup gained `dateModified` (from the tool's own ISO date, which every
  config already carried and nothing used) and a `publisher`. Guides had both; the page that carries
  the head term had neither. No ratings were invented to go with them.
- **Seventeen guides were absent from the knowledge graph entirely.** `RELATED_GUIDE` is derived
  through a helper that excludes self, so a guide was only ever reachable from *sibling* tools, and
  any guide no sibling ranked had no edge at all, `guide:word-counter` among them. A tool now points
  at its own guide via a distinct `HAS_GUIDE` relation, which leaves every rendered list unchanged.
  Orphans 17 to 0; graph edges 1921 to 2080.
- **The query-coverage checker was scoring punctuation rather than coverage.** It stripped
  apostrophes from a visitor's query but not from the page, so a page correctly writing "Hooke's law"
  could never match somebody typing "hookes law", and the apparent remedy was to misspell the prose.
  Both sides are normalized now.
- Six text tools had been **failing the content gate unnoticed**. The gate only runs on tool
  directories a branch touches, and nothing had touched theirs since the gate was written.

### Removed

- **The privacy FAQ that appeared, word for word, on sixteen pages.** "Does the simulator send my
  data anywhere?" and its answer were byte-identical across seven physics simulations, and six more
  carried the same answer lightly reworded so it never showed up as a duplicate. `age-calculator`
  and `date-difference-calculator` shared theirs too. It was always the last question, and every
  page already says the same thing better: the "Private ● Runs entirely in your browser" badge sits
  under the tool with a tooltip that explains it. Near-duplicate content pairs across the catalog
  dropped from 33 to 8, and nothing now sits above 79% similarity.

## [alpha-v7.7] - 2026-08-16

### Added

- **Cron to systemd Timer Converter** at `/tool/datetime/systemd-timer-converter/`. Paste a crontab
  line, get the `OnCalendar=` expression and a ready-to-save `.timer` unit. Crontab shorthands
  (`@daily`, `@weekly`, ...) expand and translate; `@reboot` is answered with `OnBootSec=` rather
  than a parse error, because a syntax error sends people hunting for a typo that is not there.
- **Its craft is a divergence check** (`systemd-divergence`), and it is the reason the tool exists.
  When a crontab line restricts both the day of the month and the day of the week, cron fires when
  either matches and systemd fires only when both do. `0 0 13 * 5` is roughly sixty runs a year under
  cron and one or two as a timer. Both grammars accept the translation, neither reports anything, and
  the job simply stops happening. The tool evaluates both day rules across the next 400 days and
  names the first date they disagree, staying silent when only one day field is restricted and the
  two rules coincide.
- The translation and both semantics live in `src/lib/engines/datetime/systemd.ts` beside the
  existing cron parser it reuses, with 26 unit tests split between what it reports and what it must
  not.
- Two worked examples, one that translates exactly and one that does not.

### Changed

- Craft coverage ratchet raised to 4.6% (5/107).

## [alpha-v7.6] - 2026-08-16

### Added

- **Shell Quote Escalator** at `/tool/developer-utilities/shell-quote-escalator/`, the catalog's
  first system-administration tool. Pick where a command has to travel (ssh, sudo, `bash -c`,
  `docker exec`, or a chain of them) and it quotes the command once per shell in the path.
- **The ladder is the point.** A correctly quoted command is a wall of apostrophes that can only be
  trusted or not, so every intermediate stage is shown: what you type, what each shell hands to the
  next, and what finally executes. A missing level of quoting becomes visible at the stage it
  happens rather than in a stack trace on a real server.
- **Its craft is an orientation line** (`shell-expansion-points`): single quoting protects `$HOME`,
  globs, backticks and `~` rather than expanding them, so they resolve against the far end and not
  your machine, and the quoted output looks identical either way. The line names the tokens it found
  and which shell resolves them, and stays silent for commands that have none.
- An unbalanced quote in the command is reported before anything is quoted, because quoting a broken
  command produces a valid-looking string that fails somewhere else entirely.
- The `text-interactive` engine gained a `shell` runtime surface (`src/lib/shell/quote.ts`), so the
  quoting logic is unit-tested library code rather than widget script.

### Changed

- Craft coverage ratchet raised to 3.7% (4/106): the first tool built craft-first rather than
  retrofitted.
- The `shell-quote-escalator` research record's `query` field was a full sentence rather than a
  phrasing anyone types. Corrected to real search phrasings, which is what the query-coverage corpus
  is built from.

## [alpha-v7.5.3] - 2026-08-15

### Added

- **The Research Intelligence Engine can now be asked what nobody is searching for.**
  `npm run research:latent` writes `research/reports/latent.md`, a second ranking that shares no
  axes with the roadmap. The existing one cannot answer this question at any weighting:
  `searchDemand` is its heaviest single weight and `scoreConfidence` treats demand under 60 as a
  signal that did not fire, so a need with no query behind it is invisible to it by construction,
  and having a query requires already having a name for the thing.
- **Structural silences, derived from the catalog with nothing authored first.** A new engine IO
  graph (`src/lib/research/analyzers/io-graph.ts`) writes down what each engine consumes and emits,
  which makes four kinds of hole fall out of the registry on inspection: an engine that produces
  artifacts and has no tool that checks any of them (`asymmetry`), a format we emit that nothing
  consumes (`dead-end`), a converter handing off to an engine with nothing spanning the join
  (`handoff`), and recorded mid-task failures on a tool the demand ranking left below the bar
  (`unserved-failure`). Run against today's 119 tools it reports 11, the headline being that the
  catalog produces artifacts on eight engines and can check exactly one of them (`json-validator`).
- **An anchor gate, because this analyzer's failure mode is confident and silent.** `namelessness`
  treats the absence of a search term as evidence, and a tool nobody wants is also missing a search
  term. So a proposal matching no derived silence is reported as `unanchored` with a stated reason
  rather than scored, `validate.ts` asserts that on every run, and roughly half of
  `latent-demand.test.ts` asserts silence rather than output.
- **Seed evidence for two Linux and system-administration tools**, the first in that area:
  `systemd-timer-converter` (cron to systemd `OnCalendar`, latent score 69.8) and
  `shell-quote-escalator` (quoting through ssh, sudo and container layers, 87.4). Seed records may
  now carry a `latent` block (`whyUnnamed`, `consequence`, `observedBehaviour`); records without one
  are ordinary demand-driven opportunities and the latent analyzer ignores them entirely.

## [alpha-v7.5.2] - 2026-08-15

### Changed

- **The site icon's field is ink green, so the parent stops looking like one of its children.** Tool
  install icons are coloured by their category accent, and the site mark used `--color-accent`
  directly, which measures 8.2 (CIE76) from the Productivity accent and 11.5 from Money & Finance.
  Anything under about 15 reads as the same colour at icon size, so on a home screen the site icon
  was indistinguishable from the Pomodoro Timer. The field is now 28.7 from its nearest accent: the
  categories stay the coloured things and the parent becomes the dark ground they sit on, which also
  lifts the gold mark from 4.04:1 to 9.03:1.

  `--color-accent` is untouched, so links, focus rings and the rest of the UI stay forest. Only the
  icon moved, because an icon has a different job than a text colour on paper: survive at 16px, on a
  foreign background, beside its own children.

### Fixed

- **The collision that caused this is now measured on every build.** It appeared silently when the
  category palette was retoned (2026-08-09) and nothing compared the two, so a unit test now checks
  the site field against every category accent and fails below a distance of 20. A future retone
  that walks a category back into the parent's colour fails the build instead of shipping.

## [alpha-v7.5.1] - 2026-08-14

### Changed

- **The site icon is a board now, not a dot.** A single gold circle centred on a green field is the
  construction of the flag of Bangladesh, and at the size a favicon is actually seen (a tab strip, a
  search result, a bookmark bar) that is what it read as rather than as a brand. The new mark reads
  at three distances: a gold T at 16px, the T standing among ranks of modules at 48px, and at full
  size those modules resting on two solid rails. The modules are the tools, uniform because they are
  all produced the same way; the rails are the engines underneath them, which is how the site
  actually works (a handful of engines render 119 tools whose widgets are three lines each). So the
  parent icon says what no single tool icon can: these were made by something.

  The letter is drawn as paths, so the SVG favicon renders identically everywhere instead of
  borrowing the viewer's fonts. The green field, the gold, and the gloss are unchanged, so it still
  reads as the parent of the 119 tool install icons, which are untouched. New everywhere the old
  mark appeared: the nav, browser tabs, the iOS home-screen icon, the social preview image, and the
  Organization logo in the homepage structured data.

### Fixed

- **The mark now clears the contrast floor it was quietly under.** Gold on the forest field measured
  2.85:1, below the 3:1 minimum for non-text contrast, which a favicon needs more than anything else
  does: 16px, antialiased, and often rescaled by the browser. The gold is brightened to 4.04:1. The
  field, the palette and every category accent are unchanged. A unit test now holds the floor, so a
  future retheme that dims the mark fails the build instead of shipping an icon that reads as a
  smudge in a tab strip.

- **`favicon.ico` is generated rather than committed by hand.** It was the one icon no script
  produced, so this redesign would have left every browser that prefers an `.ico` showing the old
  mark indefinitely. `npm run icons:generate` now emits it alongside the SVG and the PNGs.

## [alpha-v7.5] - 2026-08-11

### Added

- **Every tool now earns its own reason to exist.** Measured across the catalog: 80 of 105 tools
  were a single self-closing tag with nothing of their own, so the Base64, Hex and URL encoders
  differed by one string in a config file. A tool now declares one **craft**, the single thoughtful
  touch that comes from knowing what that tool's users are actually doing, and
  `npm run check:craft` holds it as a ratio that only rises: adding a tool with nothing of its own
  lowers the fraction and fails the build, so there is no "add it later".

- **Base64 now fixes the input instead of only diagnosing it.** Pasting a data URI
  (`data:text/plain;base64,…`), a base64url token out of a JWT, or a value whose `=` padding was
  stripped in transit used to produce a correct and useless rejection like
  `Unexpected character ":" near position 5`. Each now offers a one-tap fix under the error, and
  applying it decodes what you actually pasted. Offers only appear when the repair demonstrably
  produces readable text, so ordinary typing never triggers one.

- **URL decoding recovers from the three ways it breaks.** A double-encoded value, a form-encoded
  `+` that should be a space, and a stray `%` from ordinary prose ("50% off", which used to fail
  the entire decode) each get the same one-tap fix.

- **A `tool-craft` skill and a `tool-crafter` agent**, so the analysis behind a touch (what the tool
  solves, where its users actually fail, which of five kinds applies) happens before the code rather
  than after. `add-tool` and `tool-builder` now require a craft declaration for every new tool.

### Changed

- **Word Counter reads as one tool again.** Its word goal sat in a filled, bordered card and its
  three word insights in three more bordered tiles, on a page that already had panels. They are now
  inline rows. Its word goal is what the tool is declared on: nobody counts words for the number
  itself, they are writing to a limit.

- **Two clutter ceilings now ratchet downward** alongside the craft coverage floor: the worst single
  widget's count of bordered cards, and hardcoded colours in widget styles. The tools that had
  added something for themselves were also the most box-heavy pages in the catalog, so restraint is
  gated rather than left to taste.

- **Word Counter now says what it is for.** Its description covered neither of the two things
  people actually arrive asking ("how many words", "essay length"), reaching them in body copy
  only, so it scored zero on query targeting. It now names both, which the word goal makes
  accurate rather than promotional, and it gained a short on-page tagline.

- **The URL guide explains when *not* to use it.** A new section compares the browser console,
  `jq`, a language runtime and this tool, including where each one fails: `decodeURIComponent`
  throws on a stray "%", and Python and Java disagree with JavaScript about spaces.

### Fixed

- **Word Counter's "nearly at goal" progress state** used a hardcoded `#d97706` against the rule
  that every colour comes from a token. The palette has no warning colour and the filling bar
  already showed proximity, so the state was removed rather than retinted.

- **Hedging language removed** from the Word Counter guide and FAQ and the URL guide ("typically
  counts as one word" became "counts as one word"). Both tools were below the content quality bar
  before this release and are now above it.

- **The content gate no longer invents a tool.** It derives which tools to check from the changed
  paths under `src/tools/`, and two shared widgets have subdirectories, so touching
  `src/tools/_shared/converter/` gated a nonexistent tool named "converter" and failed the build on
  its missing content. `_shared` is platform code and is now excluded, in both `scripts/verify.sh`
  and the CI workflow.

- **The content gate scored every tool's topic cluster against a file that was not there.** That
  criterion reads `seo-engine/cache/content-graph.json`, which is gitignored, so it existed on any
  machine that had ever generated it and never in a fresh CI checkout. The same tool measured 67
  there and 100 locally, a five point swing in the overall score, which meant a local pass said
  nothing about CI. Both now regenerate the graph before gating, the way the sibling
  `queryTargeting` artifact already did and the way `seo:gate:sim` already chained it.

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
