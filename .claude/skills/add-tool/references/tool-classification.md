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

If the tool genuinely cannot be expressed by any existing engine:
1. Confirm at least 2–3 tools would use the same new engine (single-tool engines are a sign of misclassification).
2. Read `references/add-engine.md` for the full engine creation process.
3. Do not invent a tool that renders its own widget logic — even custom tools must use a shared widget.
