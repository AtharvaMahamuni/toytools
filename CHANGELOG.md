# ToyTools Changelog

All notable changes to ToyTools are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/).

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
