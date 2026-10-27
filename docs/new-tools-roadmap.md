# New tools: ranked tool ideas and roadmap

Date: 2026-10-27 (IST). Planning document only. Nothing here is implemented, and no tool, category, engine or page is added by this file.
Read against `AtharvaMahamuni/toytools` at `origin/main` f2fffd4c (alpha-v13.16).

Related: `docs/pdf-tools-roadmap.md` (PDF and Files), `docs/world-time-tools-roadmap.md` (World and Travel). Where an idea is already planned there, this file points to it and does not repeat it.

**Legend**
- **[V]** verified in the repo at the commit above.
- **[P]** proposed. Not in the repo.
- **[TV]** to verify before the work package that depends on it starts.
- **Library sizes** in this file are planning estimates (min + gzip), not measured here, unless a source is given. Each must be measured on the pinned npm version (min + gzip) before its work package starts [TV]. The pdf-lib figure (207 KB gz, 1.17.1 UMD) is the measured one from `docs/pdf-tools-roadmap.md` section 4.
- **Extends** marks an idea that should improve an existing tool (the `improve-tool` skill) instead of adding a page.

---

## 1. Summary and ranking method

35 ranked tool ideas came out of a read-only review of browser tool sites on 27 Oct 2026. Each was put through the Phase 1 fit check of the `new-tool-skeleton` skill (job and substitution test, fit, overlap with the real catalog, category). The result:

- **30 new tools** fit as proposed, counting CSS Minifier and Beautifier as one tool.
- **1 idea is already planned:** the PDF Splitter, in `docs/pdf-tools-roadmap.md`.
- **1 idea extends an existing tool:** Duplicate JSON Key Finder, a check in `json-validator`.
- **3 ideas could go either way:** Add Line Numbers, Text Wrapper and Sort Lines are small pages or options on existing line tools (open decision 4).
- **4 of the new tools are heavy** (a library over the 24 KB page JS budget) and fit only if the library is loaded on demand: ASCII Art (fonts), Code to Image (highlighter), Excel and CSV Viewer (SheetJS) and SQL to ER Diagram (Mermaid). The PDF Splitter's pdf-lib is covered by the PDF roadmap.
- **1 new unranked item:** a standalone Countdown Timer (section 4).
- **No idea needs a server, an account, an upload or a runtime CDN.** Every one runs in the tab and saves nothing. No user data is sent anywhere; the only requests are the site's own self-hosted code chunks, fetched on demand.

**Ranking method.** The order is judgement, not search volume. No keyword volumes were pulled or measured for this file. An idea ranks higher when it has broad, evergreen everyday demand, a clear privacy edge (files and recordings stay on the device), small engineering cost, and a natural home in an existing category and engine. Effort (S, M, L) is a planning estimate, not a measurement.

**Shared constraint: search budgets.** `search-terms.json` (10,240 B cap) and `/search/` HTML (31,744 B cap) were within a few hundred bytes of their caps in the last measured builds (`new-tool-skeleton` Phase 2, step 7) [V]. Every new tool adds a search card and aliases. Budgets are never raised by an agent; open decision 1 asks how to make room before Phase 1.

## 2. Phases at a glance

| Phase | Theme | Tools | Count |
|---|---|---|---|
| 1 | Top 10 | Image Compressor and Resizer, PDF Splitter (see PDF roadmap), SQL Formatter, Markdown Editor and Preview, XML Formatter and Validator, EXIF Viewer and Remover, Typing Speed Test, CSS Minifier and Beautifier, Mouse and Click Test, Voice Recorder | 10 |
| 2 | Developer and Data | JSONPath Tester, JSON to .env Converter, Folder Tree Generator, Duplicate JSON Key Finder (extends), AWS ARN Parser, Mock Data Generator, Stack Trace Formatter | 7 |
| 2 | Text Cleaners and Generators | Add Line Numbers, Text Wrapper, Sort Lines and Numbers, Number Sequence Generator | 4 |
| 2 | Audio and Device Tests | Speaker and Left Right Audio Test, Audio Trimmer, Reaction Time Test | 3 |
| 2 | Money and Documents | Invoice Generator | 1 |
| 2 | Productivity (new item, unranked) | Countdown Timer | 1 |
| 3 | Games and Puzzles | Lights Out, 15 Puzzle, Simon Memory Game | 3 |
| 3 | Images and Visual | Image Diff and Screenshot Compare, ASCII Art Text Generator, Code to Image | 3 |
| 3 | SEO and Web | On-page SEO Checker | 1 |
| 3 | Heavy Data and Documents | Resume Builder, Excel and CSV Viewer, SQL to ER Diagram | 3 |

Phase 2 and 3 order inside a group follows the ranking. A group can ship as one PR when the tools share an engine.

## 3. Per tool

Each entry gives: purpose; ToyTools category; what it can do; engine and UI split; privacy; size budget fit; heavy libraries; effort; closest existing tool to reuse; FAQ and SEO angle; fit check result. Privacy is the same for every tool unless an entry says more: **nothing is saved by default, no user data goes over the network (the only requests are the site's own code chunks), files and recordings stay in the tab, and output is a download the user triggers.** URL sync is `off` for files and recordings and `manual` for pasted content (`src/lib/url-state.ts`).

Size budget fit is against `BUDGETS.tool` in `scripts/check-budget.ts`: page JS 24 KB gz (entry, static deps and engine chunk), CSS 18 KB, HTML 34 KB, total 61 KB. "Fits" means the planned engine and widget are expected to stay inside it [TV on build]. A heavy library is reached only through a dynamic `import()` fired by user action (file pick, button press or input focus), never a static import and never a CDN, as `docs/pdf-tools-roadmap.md` section 5 sets out.

### Phase 1: top 10

**1. Image Compressor and Resizer** `image-compressor` [P]
- Purpose: make a photo smaller in bytes or pixels before sending or uploading it.
- Category: Design and CSS, or PDF and Files if that category is approved (PDF roadmap open question 4).
- Can do: JPEG, PNG and WebP in; quality slider; resize by width, height or percent with aspect lock; before and after size; batch of a few files.
- Engine and UI: new `image` engine [P] (canvas `drawImage` plus `toBlob`), a pure function for target dimensions and quality; the widget is a drop zone, preview and download. This is the same `image` engine as PDF roadmap Phase 4; build it once.
- Size: fits; canvas only, 0 KB library.
- Heavy libs: none.
- Effort: M.
- Reuse: `image-palette-extractor` (file pick and canvas read).
- FAQ and SEO: "compress image without uploading", "resize photo for a form under 100 KB"; FAQ on why WebP is smaller and why PNG barely shrinks.
- Fit: passes. Overlaps PDF roadmap Phase 4 "Image compress, resize, convert"; this file promotes it to Phase 1 and the two must be one plan (open decision 3).

**2. PDF Splitter** (planned)
- Fully covered by `docs/pdf-tools-roadmap.md` (Phase 1 pilot, `pdf` engine on pdf-lib 1.17.1, 207 KB gz as measured there, loaded on file pick, and its open questions 1 to 8). Not repeated here.
- Fit: passes there. Its rank here only says it belongs in the first wave.

**3. SQL Formatter** `sql-formatter` [P]
- Purpose: turn a one-line or messy SQL query into readable, indented SQL.
- Category: Developer Utilities.
- Can do: keyword case (upper or lower), indent width, one clause per line, commas leading or trailing, minify back to one line; common dialect keywords (Postgres, MySQL, SQLite).
- Engine and UI: `structured-data` engine, a hand-written tokenizer and printer, pure and Vitest-tested; reuse the structured transform widget.
- Size: fits with a hand-written formatter. The popular `sql-formatter` package is too large for the page budget [TV size].
- Heavy libs: none.
- Effort: M.
- Reuse: `json-formatter` (structured transform pattern, IoPanel).
- FAQ and SEO: "format SQL online without sending the query"; FAQ on why queries with credentials should not be pasted into upload sites.
- Fit: passes. No SQL tool exists today [V].

**4. Markdown Editor and Preview** `markdown-preview` [P]
- Purpose: write Markdown and see the rendered result as you type.
- Category: Text Utilities (or Prep for a model, open decision 5).
- Can do: live preview, headings, lists, links, code, tables; copy HTML; word count.
- Engine and UI: `text-processor` with a tiny parser, or lazy-load `marked` (about 40 KB, estimate) on first keystroke; output HTML is sanitised before it is shown (no script, no event attributes).
- Size: fits with a tiny parser; `marked` only behind a dynamic import.
- Heavy libs: `marked`, on demand only, if chosen.
- Effort: M.
- Reuse: `notepad` (editor surface), `llms-txt-generator` (text assembly).
- FAQ and SEO: "markdown preview online", "markdown table syntax"; FAQ on GitHub flavoured differences.
- Fit: passes. `keepInput` only if the page is marked private (skill Phase 2, step 5).

**5. XML Formatter and Validator** `xml-formatter` [P]
- Purpose: pretty print XML and show where it is malformed.
- Category: Developer Utilities.
- Can do: format, minify, validate with line and column of the first error, collapse tree.
- Engine and UI: `structured-data` engine using the built-in `DOMParser`; reuse the structured transform and validate widgets.
- Size: fits; 0 KB library.
- Heavy libs: none.
- Effort: S.
- Reuse: `json-formatter`, `json-validator`.
- FAQ and SEO: "format XML", "XML validator line number"; FAQ on namespaces and why XML is case sensitive.
- Fit: passes.

**6. EXIF Viewer and Remover** `exif-viewer` [P]
- Purpose: see what a photo reveals (camera, time, GPS) and save a clean copy.
- Category: Design and CSS, or PDF and Files (same decision as tool 1).
- Can do: read EXIF from JPEG, show GPS as plain coordinates, strip all metadata by re-encoding through canvas, before and after table.
- Engine and UI: `image` engine [P] plus a small hand-written EXIF reader (APP1 segment parse), pure and tested; the widget is drop zone, table and download.
- Size: fits.
- Heavy libs: none.
- Effort: S to M.
- Reuse: `image-palette-extractor`; shares the `image` engine with tool 1.
- FAQ and SEO: "remove location from photo", "see EXIF data without uploading"; strong privacy angle.
- Fit: passes. **Overlap:** PDF roadmap Phase 4 lists "optional EXIF stripping" inside image compress. Decide whether stripping lives here, there, or both (open decision 3).

**7. Typing Speed Test** `typing-speed-test` [P]
- Purpose: measure words per minute and accuracy.
- Category: Productivity, or Games (open decision 6).
- Can do: 1, 3 and 5 minute runs, WPM, raw WPM, accuracy, error highlights; passages bundled with the page.
- Engine and UI: a pure scoring function (`text-interactive` or `productivity`) tested in Vitest; the widget handles timing and keystrokes.
- Size: fits if the passage set is small; larger passage sets load on demand.
- Heavy libs: none.
- Effort: M.
- Reuse: `word-counter` (word rules), `pomodoro-timer` (timer).
- FAQ and SEO: "typing test 1 minute", "what is a good WPM"; FAQ on how WPM is counted (5 characters per word).
- Fit: passes. A personal best, if kept, is local only and opt-in.

**8. CSS Minifier and Beautifier** `css-minifier` [P]
- Purpose: shrink CSS for production, or expand minified CSS to read it.
- Category: Design and CSS (or Developer Utilities).
- Can do: minify (comments, whitespace, last semicolons), beautify with indent choice, bytes saved.
- Engine and UI: a hand-written tokenizer in `structured-data` or `text-processor`; one tool with two modes.
- Size: fits.
- Heavy libs: none.
- Effort: S to M.
- Reuse: `json-minifier` and `json-formatter` (same two-mode shape).
- FAQ and SEO: "minify CSS", "unminify CSS"; FAQ on what minifying cannot remove safely.
- Fit: passes. One tool, not two pages.

**9. Mouse and Click Test** `mouse-click-test` [P]
- Purpose: check every mouse button and scroll wheel, and measure clicks per second.
- Category: no device testing category exists [V]; Games or Fidgets for the CPS part (open decision 6).
- Can do: left, right, middle, back and forward detection; double click detector; wheel up and down; 5 and 10 second CPS run.
- Engine and UI: a pure CPS and double click scoring function; the widget listens to pointer and wheel events.
- Size: fits.
- Heavy libs: none.
- Effort: S.
- Reuse: `pop-it` and `switch-board` (pointer handling in `feel`).
- FAQ and SEO: "click speed test", "mouse double click test"; FAQ on why a worn switch double clicks.
- Fit: passes.

**10. Voice Recorder** `voice-recorder` [P]
- Purpose: record audio from the microphone and download it.
- Category: Music and Audio.
- Can do: record, pause, play back, download (WebM or Ogg as the browser supports); later screen and camera modes as a separate decision.
- Engine and UI: `audio` engine helpers for duration and file naming; the widget uses `getUserMedia` and `MediaRecorder`.
- Size: fits.
- Heavy libs: none.
- Effort: S (audio only). Screen and camera are separate pages if approved.
- Reuse: `equalizer-settings-generator` (audio engine), `keep-screen-awake` (browser API permissions pattern).
- FAQ and SEO: "voice recorder online no download"; FAQ on where the recording goes (nowhere, it stays in the tab until you download it).
- Fit: passes. Recordings are never stored; a reload loses them, which the page must say.

### Phase 2: Developer and Data

**15. JSONPath Tester** `jsonpath-tester` [P]
- Purpose: test a JSONPath expression against pasted JSON and see matches with their paths.
- Category: Developer Utilities.
- Can do: dot and bracket paths, wildcards, recursive descent, filters, list of matched paths and values.
- Engine and UI: `structured-data`, a small hand-written evaluator, tested against the common spec cases.
- Size: fits. Effort: M. Heavy libs: none.
- Reuse: `json-tree-viewer` (tree), `json-formatter`.
- FAQ and SEO: "jsonpath online", "jsonpath filter example".
- Fit: passes.

**20. JSON to .env Converter** `json-to-env` [P]
- Purpose: turn a JSON config into `KEY=value` lines.
- Category: Developer Utilities.
- Can do: flatten nested keys with a chosen separator, upper case keys, quote values that need it, reverse mode (.env to JSON).
- Engine and UI: `structured-data`; reuse the transform widget. URL sync `off` because configs hold secrets.
- Size: fits. Effort: S. Heavy libs: none.
- Reuse: `json-to-yaml-converter`, `shell-quote-escalator` (quoting rules).
- FAQ and SEO: "json to env", "convert .env to json"; FAQ on quoting and multiline values.
- Fit: passes.

**21. Folder Tree Generator** `folder-tree-generator` [P]
- Purpose: make a README style folder tree from an indented list or pasted paths.
- Category: Developer Utilities.
- Can do: indent or path input, box drawing or ASCII output, sort folders first, trailing slash for folders.
- Engine and UI: `text-processor`. Size: fits. Effort: S. Heavy libs: none.
- Reuse: `json-tree-viewer` (tree model).
- FAQ and SEO: "folder structure for README", "tree command output online".
- Fit: passes. Does not read the user's disk; input is pasted text.

**22. Duplicate JSON Key Finder** (Extends `json-validator`)
- Purpose: find keys repeated in the same object, which `JSON.parse` silently drops.
- Category: Developer Utilities.
- Can do: list each duplicate key with its path and line.
- Engine and UI: a duplicate-key pass inside the existing `structured-data` validate path; a notice in the existing widget.
- Size: fits. Effort: S. Heavy libs: none.
- Reuse: `json-validator` itself.
- FAQ and SEO: add an FAQ to `json-validator`: "why does my duplicate key disappear".
- Fit: **extends an existing tool**; not a new page.

**23. AWS ARN Parser** `aws-arn-parser` [P]
- Purpose: split an ARN into partition, service, region, account and resource.
- Category: Developer Utilities.
- Can do: parse and validate, explain each part, list several ARNs at once.
- Engine and UI: `structured-data` or a small pure parser; table output.
- Size: fits. Effort: S. Heavy libs: none.
- Reuse: `cidr-calculator` and `jwt-decoder` (parse and explain layout).
- FAQ and SEO: "ARN format", "parse AWS ARN".
- Fit: passes. Static rules only; no AWS call.

**25. Mock Data Generator** `mock-data-generator` [P]
- Purpose: make fake rows for testing as JSON, CSV or SQL inserts.
- Category: Generators.
- Can do: define columns (name, email, number range, date, UUID, choice), row count, seed for repeatable output, three output formats.
- Engine and UI: `generation`, with small bundled word lists; seeded random.
- Size: fits if word lists stay small; larger lists load on demand.
- Heavy libs: none. Effort: M.
- Reuse: `uuid-generator`, `random-name-picker`, `json-to-csv-converter`.
- FAQ and SEO: "fake data generator", "sample SQL insert data".
- Fit: passes.

**31. Stack Trace Formatter** `stack-trace-formatter` [P]
- Purpose: make a pasted stack trace readable and point at the first frame in your own code.
- Category: Developer Utilities.
- Can do: JavaScript, Python and Java traces; collapse library frames; highlight the error line.
- Engine and UI: `text-processor` parser per language. Size: fits. Effort: S. Heavy libs: none.
- Reuse: `find-replace` (line handling), `json-formatter` (layout).
- FAQ and SEO: "read a stack trace", "format Java stack trace".
- Fit: passes. URL sync `off` because traces can contain paths and tokens.

### Phase 2: Text Cleaners and Generators

**16. Add Line Numbers** `add-line-numbers` [P] (or Extends)
- Purpose: put a number in front of every line.
- Category: Text Utilities.
- Can do: start number, padding, separator, skip blank lines.
- Engine and UI: `text-processor`, same widget as `remove-blank-lines`.
- Size: fits. Effort: S. Heavy libs: none.
- Reuse: `remove-blank-lines`, `line-counter`.
- FAQ and SEO: "add line numbers to text".
- Fit: passes as a small page; could instead be an option on an existing line tool (open decision 4).

**17. Text Wrapper** `text-wrapper` [P] (or Extends)
- Purpose: wrap text at N characters for email, commit messages or fixed width output.
- Category: Text Utilities.
- Can do: width, break long words or not, keep paragraphs, unwrap mode.
- Engine and UI: `text-processor`. Size: fits. Effort: S. Heavy libs: none.
- Reuse: `remove-line-breaks` (the reverse job).
- FAQ and SEO: "wrap text at 72 characters", "commit message line length".
- Fit: passes; same extension question as tool 16.

**18. Sort Lines and Numbers** `sort-lines` [P] (or Extends)
- Purpose: sort lines alphabetically, naturally or numerically.
- Category: Text Utilities.
- Can do: A to Z, Z to A, natural order, numeric, by length, case insensitive, reverse, shuffle; optional dedupe.
- Engine and UI: `text-processor`. Size: fits. Effort: S. Heavy libs: none.
- Reuse: `remove-duplicate-lines` (closest; sorting could be an option there).
- FAQ and SEO: "sort lines alphabetically", "sort numbers online".
- Fit: passes; overlaps `remove-duplicate-lines` (open decision 4).

**19. Number Sequence Generator** `number-sequence-generator` [P]
- Purpose: list numbers from a start to an end by a step.
- Category: Generators (or Number Utilities).
- Can do: start, end, step (negative and decimal), separator, padding, prefix and suffix.
- Engine and UI: `generation`. Size: fits. Effort: S. Heavy libs: none.
- Reuse: `random-string-generator` (generator widget).
- FAQ and SEO: "number list 1 to 100", "generate number sequence".
- Fit: passes. Cap output size so a huge range cannot freeze the tab.

### Phase 2: Audio and Device Tests

**12. Speaker and Left Right Audio Test** `speaker-test` [P]
- Purpose: check that the left and right channels and the bass and treble work.
- Category: Music and Audio.
- Can do: left, right and both tones; frequency sweep; polarity check; volume warning.
- Engine and UI: `audio` engine (Web Audio oscillators and panner); a pure sweep schedule tested in Vitest.
- Size: fits. Effort: S. Heavy libs: none.
- Reuse: `equalizer-settings-generator` (audio engine).
- FAQ and SEO: "left right speaker test", "headphone test"; FAQ on safe volume.
- Fit: passes.

**13. Audio Trimmer** `audio-trimmer` [P]
- Purpose: cut a clip out of an audio file and download it.
- Category: Music and Audio.
- Can do: waveform, start and end handles, fade in and out, WAV export.
- Engine and UI: `audio` engine (decode with Web Audio, pure WAV encoder, tested); widget is waveform and handles.
- Size: fits with a hand-written WAV encoder. Effort: M. Heavy libs: none (MP3 export is out; it needs an encoder library).
- Reuse: `equalizer-settings-generator`; pairs with tool 10.
- FAQ and SEO: "trim audio online without uploading", "cut a ringtone".
- Fit: passes. A file size cap like PDF roadmap open question 7 applies.

**14. Reaction Time Test** `reaction-time-test` [P]
- Purpose: measure visual reaction time over several rounds.
- Category: Games (or Fidgets).
- Can do: random delay, early click detection, five rounds, average and best.
- Engine and UI: a pure scoring function; widget handles timing with `performance.now()`.
- Size: fits. Effort: S. Heavy libs: none.
- Reuse: `tic-tac-toe` (game shell), `pop-it`.
- FAQ and SEO: "reaction time test", "average human reaction time"; FAQ on display lag.
- Fit: passes.

### Phase 2: Money and Documents

**11. Invoice Generator** `invoice-generator` [P]
- Purpose: make a clean invoice and print it to PDF.
- Category: Money and Finance.
- Can do: line items, tax, discount, totals, currency, notes; print stylesheet so the browser's own "Save as PDF" makes the file.
- Engine and UI: `finance` engine for totals (rounding to the cent, tested); widget is a form and a print preview.
- Size: fits; no PDF library because printing does the work.
- Heavy libs: none. Effort: M.
- Reuse: `split-bill`, `tax-calculator`, `discount-calculator`.
- FAQ and SEO: "free invoice generator no signup", "GST invoice format"; FAQ on what an invoice must show.
- Fit: passes. Business details are entered each time, or kept only with opt-in `keepInput` on a private page. PDF roadmap lists GST and POS billing as off scope; this tool is a printable invoice, not billing software.

### Phase 2: Productivity (new item, unranked)

**New. Countdown Timer** `countdown-timer` [P]
- Purpose: count down a duration or to a clock time, with an alarm at zero.
- Category: Productivity.
- Can do: minutes and seconds or a target time, start, pause, reset, sound and title flash at zero, full screen view for a room or stage.
- Engine and UI: `productivity` engine timing helpers (pure remaining-time function, tested); widget is the display and controls.
- Size: fits. Effort: S. Heavy libs: none.
- Reuse: `pomodoro-timer` (timer and alarm), `keep-screen-awake` (wake lock).
- FAQ and SEO: "countdown timer online", "5 minute timer"; FAQ on what happens when the tab is in the background.
- Fit: passes. Not one of the 35 ranked ideas; added because no plan has a standalone timer. Overlap: the countdown mode of `event-time-converter` in the World and Travel roadmap counts to a shared event time; this tool counts a local duration, so the jobs differ.

### Phase 3: Games and Puzzles

**27. Lights Out** `lights-out` [P]
- Purpose: classic toggle puzzle.
- Category: Games.
- Can do: 5 by 5 board, solvable puzzles only, move count, hint.
- Engine and UI: `board-game` rules (pure, solvability check tested); BoardWidget.
- Size: fits. Effort: S. Heavy libs: none.
- Reuse: `tic-tac-toe`, `connect-4`.
- FAQ and SEO: "lights out puzzle", "how to solve lights out".
- Fit: passes.

**28. 15 Puzzle** `15-puzzle` [P]
- Purpose: slide numbered tiles into order.
- Category: Games.
- Can do: 3 by 3 and 4 by 4, solvable shuffles only, moves and time.
- Engine and UI: `board-game` rules with a parity check, tested; BoardWidget.
- Size: fits. Effort: S. Heavy libs: none.
- Reuse: `connect-4`.
- FAQ and SEO: "15 puzzle online", "why some sliding puzzles cannot be solved".
- Fit: passes.

**29. Simon Memory Game** `memory-sequence-game` [P]
- Purpose: repeat a growing colour and sound sequence.
- Category: Games.
- Can do: four pads, tones, speed up, best round.
- Engine and UI: `board-game` sequence state, tested; tones from the `audio` engine.
- Size: fits. Effort: S. Heavy libs: none.
- Reuse: `tic-tac-toe`, `speaker-test` (tones).
- FAQ and SEO: "simon game online", "memory sequence game". The name must avoid the trademark (open decision 7).
- Fit: passes.

### Phase 3: Images and Visual

**24. Image Diff and Screenshot Compare** `image-diff` [P]
- Purpose: show what changed between two screenshots.
- Category: Design and CSS (or Developer Utilities).
- Can do: pixel diff with threshold, highlight overlay, slider compare, percent changed, download the diff image.
- Engine and UI: `image` engine [P], pure pixel compare on `ImageData`, tested.
- Size: fits. Effort: M. Heavy libs: none.
- Reuse: `text-compare` (compare layout), `image-palette-extractor` (canvas read).
- FAQ and SEO: "compare two images", "screenshot diff".
- Fit: passes; depends on the `image` engine from Phase 1.

**30. ASCII Art Text Generator** `ascii-art-text` [P]
- Purpose: render text in large FIGlet style letters.
- Category: Text Utilities (or Generators).
- Can do: a few fonts, width, copy.
- Engine and UI: `text-processor` with a small FIGlet renderer; one default font bundled small, others fetched from the site on font pick.
- Size: fits with one small font; extra fonts load on demand.
- Heavy libs: FIGlet fonts, on demand only, self-hosted.
- Effort: M.
- Reuse: `character-map`, `text-repeater`.
- FAQ and SEO: "ascii art text", "big text for README".
- Fit: passes with lazy fonts. Font licences must be checked [TV].

**33. Code to Image** `code-to-image` [P]
- Purpose: turn a code snippet into a shareable picture.
- Category: Design and CSS (or Developer Utilities).
- Can do: theme, padding, window frame, font size, PNG download.
- Engine and UI: highlighter plus canvas or SVG export.
- Size: does not fit statically. The syntax highlighter (and any web font) loads only on first input [TV size].
- Heavy libs: highlighter and fonts, on demand only, self-hosted.
- Effort: L.
- Reuse: `css-gradient-generator` (background picker), `qr-code-generator` (image download).
- FAQ and SEO: "code screenshot", "code to image".
- Fit: passes only with lazy loading; ranked low because of weight.

### Phase 3: SEO and Web

**26. On-page SEO Checker** `seo-checker` [P]
- Purpose: check pasted HTML for title, meta description, headings, image alt text, links and structured data.
- Category: Developer Utilities.
- Can do: lengths and counts, missing alt, multiple H1, canonical, JSON-LD presence; a plain list of findings.
- Engine and UI: `structured-data` with `DOMParser`; the user pastes HTML. It never fetches a URL, because fetching other sites needs a server or a CORS proxy.
- Size: fits. Effort: M. Heavy libs: none.
- Reuse: `llms-txt-generator`, `json-validator` (findings list).
- FAQ and SEO: "check meta tags", "on-page SEO checklist".
- Fit: passes in paste-only form. A URL fetch version is rejected (needs a server).

### Phase 3: Heavy Data and Documents

**32. Resume Builder** `resume-builder` [P]
- Purpose: build a clean, ATS-friendly resume and print it to PDF.
- Category: Productivity.
- Can do: sections, reorder, two templates, print stylesheet for "Save as PDF".
- Engine and UI: plain data model plus print CSS; a large widget.
- Size: tight on HTML and CSS budgets with templates [TV]. Effort: L. Heavy libs: none (printing replaces a PDF library).
- Reuse: `invoice-generator` (print path, once built), `notepad`.
- FAQ and SEO: "resume builder no signup", "ATS friendly resume format".
- Fit: passes, but a big build; keeping a draft needs opt-in `keepInput` on a private page.

**34. Excel and CSV Viewer** `spreadsheet-viewer` [P]
- Purpose: open an .xlsx or .csv file and browse it without a spreadsheet app.
- Category: Developer Utilities, or PDF and Files if approved.
- Can do: sheet tabs, column filters, value counts, export a sheet as CSV.
- Engine and UI: `csv` engine for CSV; SheetJS for .xlsx only.
- Size: CSV fits; .xlsx does not fit statically. SheetJS (about 400 KB or more, estimate) loads only on picking an .xlsx file [TV size and licence].
- Heavy libs: SheetJS, on demand only, self-hosted.
- Effort: L.
- Reuse: `csv-cleaner`, `csv-column-picker`, `csv-diff`.
- FAQ and SEO: "open xlsx without Excel", "view CSV online".
- Fit: passes with lazy loading. Belongs with the PDF and Files plan if that category is approved.

**35. SQL to ER Diagram** `sql-to-er-diagram` [P]
- Purpose: draw tables and relationships from CREATE TABLE statements.
- Category: Developer Utilities.
- Can do: parse tables, columns, keys and foreign keys; draw a diagram; PNG or SVG download.
- Engine and UI: a pure DDL parser (shared with tool 3's tokenizer); Mermaid renders.
- Size: does not fit statically. Mermaid (over 1 MB, estimate) loads only on "Draw" [TV size].
- Heavy libs: Mermaid, on demand only, self-hosted.
- Effort: L.
- Reuse: `sql-formatter` (tokenizer, once built).
- FAQ and SEO: "ER diagram from SQL", "database schema diagram".
- Fit: passes only with lazy loading; the largest download on this list (open decision 2).

## 4. Overlaps

**With `docs/pdf-tools-roadmap.md`** (not duplicated here):
- **PDF Splitter** is that plan's Phase 1 pilot. Engine, sizes, security notes and open questions live there.
- **Image Compressor and Resizer** and **EXIF Viewer and Remover** overlap its Phase 4 (`image` engine: compress, resize, convert, optional EXIF stripping). This file proposes building that `image` engine earlier, with these two tools in Phase 1, and reusing it for Image Diff. One plan for the `image` engine, not two.
- **Excel and CSV Viewer** is a Files tool; if PDF and Files is approved it joins that category.
- **Invoice Generator** and **Resume Builder** make PDFs through the browser's print dialog, not pdf-lib, so they do not depend on the PDF engines.
- The same file size cap and on-demand loading rules (PDF roadmap section 5 and open question 7) apply to every file tool here.

**Extends existing tools instead of adding pages:**
- **Duplicate JSON Key Finder**: a check in `json-validator`.
- **Sort Lines**: an option in `remove-duplicate-lines`, or a page (open decision 4).
- **Add Line Numbers** and **Text Wrapper**: small `text-processor` pages, or options on an existing line tool (open decision 4).

**Merged or trimmed:**
- **CSS Minifier and Beautifier**: two ideas become one tool.
- **Voice Recorder**: the screen and camera recorder ideas are left out of this page and are a later decision.

**With other plans:** `docs/world-time-tools-roadmap.md` has no standalone Countdown Timer. Its only countdown is a live countdown mode inside `event-time-converter` (Phase 2 there), which counts down to an event time shared as a link. A standalone Countdown Timer (set a duration or a time, alarm when it ends) is therefore a new item here (section 3, Phase 2, Productivity), and it must not duplicate that mode.

**Rejected in the fit check:** a URL fetching SEO audit (needs a server), MP3 export in the Audio Trimmer (needs an encoder library), and any CDN loading of fonts, highlighters, SheetJS or Mermaid.

## 5. Open decisions for Atharva

These are not decided here.

1. **Search budget room.** Every tool needs search bytes and both search assets are nearly full. Is a trim or split of the search index a prerequisite PR before Phase 1 (the same question as PDF roadmap open question 6)?
2. **On-demand downloads.** Are Mermaid (over 1 MB, estimate), SheetJS (about 400 KB, estimate) and a highlighter (size to measure) acceptable under "lightweight" if loaded only on user action, or should tools 33 to 35 be dropped?
3. **The `image` engine.** Is a new `image` engine (a major bump) approved, does it ship with Phase 1 here instead of PDF roadmap Phase 4, and where does EXIF stripping live?
4. **Extend or add.** Should Sort Lines, Add Line Numbers and Text Wrapper be options on existing tools or their own pages?
5. **Markdown Editor home.** Text Utilities or Prep for a model?
6. **Device and test tools.** Mouse and Click Test, Typing Speed Test and Reaction Time Test have no exact category. Use Games, Productivity and Fidgets, or approve a new category (a major bump)?
7. **Names.** Confirm slugs and names, including a trademark-safe name for the memory sequence game.
8. **Order against other plans.** Which comes first: this Phase 1, the PDF pilot, or World and Travel?
