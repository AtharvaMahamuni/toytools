# Tool Classification — Choosing the Right Engine

Use this before writing any code. Picking the wrong engine requires a full refactor later (engine selection is permanent after a tool ships).

---

## Decision matrix

| User request describes... | Engine | Pattern |
|--------------------------|--------|---------|
| Convert text from one format to another (case, encoding style, etc.) | `text-processor` | `text-transform` |
| Remove, strip, or normalize text (whitespace, duplicates, tabs, etc.) | `text-processor` | `text-cleanup` |
| Encode binary/text to a safe transport format, or decode it back | `encoding` | `encode-decode` |
| Generate a one-way hash or checksum from text | `hashing` | `hash` |
| Count, measure, or analyze properties of text | `text-analysis` | `text-metric` |
| Parse, format, validate, or convert a structured data format (JSON, etc.) | `structured-data` | `structured-transform` or `structured-validate` |
| Decode a JWT into header/payload/claims | `jwt` | `token-decode` |
| Bespoke, non-transform live text interaction (diff, find/replace) | `text-interactive` | `text-interactive` |
| Stateless single-shot math on numbers (percentage, tip, margin, tax) | `calculator` | `calculate` |
| Persists user data across visits (notes, todos, timers) | `productivity` | `stateful` |
| Growth/planning money math (interest, inflation, savings, ROI) | `finance` | `finance-growth` or `finance-planning` |
| Parse/clean/compare CSV or TSV text | `csv` | `csv-transform` |
| Generate a credential, identifier, placeholder text, or code (password, UUID, lorem, QR) | `generation` | `generate-credential`/`generate-identifier`/`generate-placeholder`/`generate-code` |
| Interactive canvas physics simulation | `physics` (simulation, not a registry engine) | `simulate` |
| Date/duration/timezone/timestamp/cron math | `datetime` | `datetime-calculate`/`datetime-convert`/`datetime-schedule` |
| Interactive canvas math simulation (e.g. unit circle) | `math-lab` (simulation, not a registry engine) | `simulate` |
| Data-input math calculator (fractions, combinatorics, primes) | `math` | `math-calculate` |
| Health/fitness metric calculator (BMI, TDEE, body fat) | `wellness` | `health-calculate` |
| Repeat-entry habit/measurement log with streaks (water, weight, workouts) | `tracker` | `health-track` |
| Parse/convert/check a CSS color (HEX/RGB/HSL/HSV/OKLCH/CMYK, contrast) | `color` | `color-convert` or `color-contrast` |
| Convert CSS/mobile units (px/rem/em/pt/dp/sp) or solve an aspect ratio | `units` | `unit-convert` or `aspect-ratio` |

`physics` and `math-lab` are manifest-driven simulations, not registry engines — see the decision
tree in `SKILL.md` and skip this scaffold/classification flow entirely for a sim.

---

## Worked examples

```
snake_case converter
→ text-processor / text-transform
   (converts text to a different format)

Base64 encoder/decoder
→ encoding / encode-decode
   (bidirectional, reversible encoding)

MD5 / SHA-256 hash generator
→ hashing / hash
   (one-way, not reversible)

Word counter, reading time calculator
→ text-analysis / text-metric
   (measures a property of text, no output text)

JSON formatter / JSON minifier
→ structured-data / structured-transform
   (parses and reformats structured input)

JSON validator
→ structured-data / structured-validate
   (validates structured input, reports pass/fail)

Remove extra spaces
→ text-processor / text-cleanup
   (strips/normalizes text without semantic change)

URL encoder/decoder
→ encoding / encode-decode
   (percent-encoding is bidirectional and reversible)

HTML entity encoder/decoder
→ encoding / encode-decode
   (bidirectional encoding of special characters)

JWT decoder
→ jwt / token-decode
   (composite result: header + payload + claims, not a single string)

Password generator, UUID generator, QR code generator
→ generation / generate-credential (or generate-identifier / generate-code)
   (options in, a generated artifact out; nothing to "convert")

Compound interest calculator, ROI calculator
→ finance / finance-growth
   (SmartFieldDef input schema, InteractiveResult output — not a plain string transform)

Age calculator, cron expression parser
→ datetime / datetime-calculate (or datetime-convert / datetime-schedule)
   (same SmartFieldDef → InteractiveResult shape as finance, dated domain)

BMI calculator, TDEE calculator
→ wellness / health-calculate
   (same shape again; may publish/consume values via produces/consumes)

Water intake tracker, weight tracker
→ tracker / health-track
   (a repeat-entry log with streaks, not a one-shot calculation)

CSV to TSV converter, CSV diff
→ csv / csv-transform
   (plain-text tabular transform; csv-diff takes two input panes)

Color format converter, contrast checker
→ color / color-convert (or color-contrast)
   (bespoke widget calling the ToyTools.color namespace directly)

px to rem converter, aspect ratio calculator
→ units / unit-convert (or aspect-ratio)
   (bespoke widget calling the ToyTools.units namespace directly)

Tip calculator, margin calculator
→ calculator / calculate
   (stateless single-shot arithmetic, fully bespoke widget)

Notepad, todo list, pomodoro timer
→ productivity / stateful
   (persists user data across visits via ToyTools.state)

Find and replace, side-by-side text diff
→ text-interactive / text-interactive
   (live bespoke interaction beyond a pure text-processor transform)
```

---

## Distinguishing edge cases

**text-processor vs structured-data:**
- `text-processor` works on raw text where structure doesn't matter (`process(text)` → `string`).
- `structured-data` expects structured input and fails gracefully on invalid input (`execute(input)` → `{ok, output, error}`). If the input must be valid JSON/XML/CSV to process at all, use `structured-data`.

**encoding vs text-processor:**
- `encoding` always has a **decode direction** — the operation is reversible.
- `text-processor` operations are one-way (you can't un-uppercase text back to its original mixed case).
- If the tool has both "Encode" and "Decode" modes, it's `encoding`.

**text-analysis vs text-processor:**
- `text-analysis` produces **metrics** (numbers). There is no output text.
- `text-processor` produces **transformed text**. The output is the processed version of the input.

---

## When none of the above fit

There are 20 engines today (`src/data/engines.ts` is authoritative — check it, not just the tables
above, before concluding nothing fits). If the tool genuinely cannot be expressed by any existing
engine:
1. Confirm at least 2–3 tools would use the same new engine (single-tool engines are a sign of misclassification).
2. Read `references/add-engine.md` for the full engine creation process.
3. Do not invent a tool that renders its own widget logic against a shared widget's contract — but
   note that three engines (`calculator`, `productivity`, `text-interactive`) and two more
   (`color`, `units`) are *intentionally* bespoke/widget-free (see `references/engine-types.md`), so
   "this tool needs its own widget script" is not by itself a reason to create a new engine — it may
   just belong to one of those five.
