# Latent Demand: what nobody is searching for

Generated: 2026-09-20T12:30:10.974Z

The roadmap ranks needs by how loudly they are already being asked for. This report ranks needs that produce no query at all, because the person does not yet have a word for the thing or does not yet know the failure is possible. The two scores are not comparable and are never merged.

7 structural silence(s) derived from the catalog; 7 proposal(s) considered, 1 anchored, 0 unanchored. Top latent score 69.4.

## Derived silences (from the catalog alone, nobody proposed these)

### `asymmetry:generation` (weight 0.29)
- **Observed:** The "generation" engine has 6 tool(s) that produce a credential and none that check it.
- **Therefore:** Someone holding a credential this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** lorem-ipsum-generator, password-generator, qr-code-generator, random-string-generator, uuid-generator, uuid-inspector

### `dead-end:encoded-text` (weight 0.28)
- **Observed:** Encoded text is produced by encoding and consumed by no engine in the catalog.
- **Therefore:** Whatever a visitor does with encoded text next, they do off-site. The step after ours is the one we cannot see, and it is the one they are still doing by hand.
- **Evidence:** base64-encoder-decoder, binary-converter, binary-text-converter, encoding-detector, hex-encoder-decoder, html-entity-encoder-decoder, json-escape, number-to-words, punycode-converter, roman-numeral-converter, rot13-encoder-decoder, url-encoder-decoder

### `asymmetry:datetime` (weight 0.26)
- **Observed:** The "datetime" engine has 2 tool(s) that produce a date/time and none that check it.
- **Therefore:** Someone holding a date/time this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** timezone-converter, unix-timestamp-converter

### `asymmetry:units` (weight 0.26)
- **Observed:** The "units" engine has 2 tool(s) that produce a measured quantity and none that check it.
- **Therefore:** Someone holding a measured quantity this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** px-to-dp-converter, px-to-rem-converter

### `dead-end:credential` (weight 0.26)
- **Observed:** A credential is produced by generation and consumed by no engine in the catalog.
- **Therefore:** Whatever a visitor does with a credential next, they do off-site. The step after ours is the one we cannot see, and it is the one they are still doing by hand.
- **Evidence:** coin-flipper, dice-roller, lorem-ipsum-generator, password-generator, qr-code-generator, random-choice-picker, random-name-picker, random-string-generator, uuid-generator, uuid-inspector

### `dead-end:hash` (weight 0.24)
- **Observed:** A hash digest is produced by hashing and consumed by no engine in the catalog.
- **Therefore:** Whatever a visitor does with a hash digest next, they do off-site. The step after ours is the one we cannot see, and it is the one they are still doing by hand.
- **Evidence:** crc32-hash-generator, hash-identifier, md5-hash-generator, sha1-hash-generator, sha256-hash-generator, sha512-hash-generator

### `handoff:jwt->structured-data` (weight 0.21)
- **Observed:** The "jwt" engine emits structured data and "structured-data" consumes it, across 10 tools, with no tool spanning the join.
- **Therefore:** The join is currently the clipboard. A workflow people perform in two tabs has no name, so it has no query - and it is still the thing they came to do.
- **Evidence:** jwt-decoder, csv-to-json-converter, json-diff, json-formatter

## Anchored candidates

### Date Format Detector  (`date-format-detector`)

**Latent score:** 69.4 / 100 (build-worthy)

- **The need, as behaviour:** Eyeballing a column for values above 12 to work out which field is the month.
- **Why there is no query for it:** Every date is unambiguous to the person who wrote it. The ambiguity exists only in the handoff, and the reader cannot know it is there, so the failure is discovered downstream by someone who never saw the original string.
- **What it costs when unmet:** Opens a European CSV export in a US locale and twelve rows silently shift month and day.; Pastes a timestamp with no zone and the stored date lands one day earlier than intended.; Reads a date that is unambiguous in one row and ambiguous in the next without noticing the difference.; Assumes a two-digit year maps to 20xx when the source system pivots at a different century.
- **Engine:** `datetime` (existing)
- **Reachable from:** timezone-converter, unix-timestamp-converter, date-difference-calculator, age-calculator, cron-expression-parser, systemd-timer-converter

**Anchored to:**
- `asymmetry:datetime` - Sits on "datetime", which can produce but cannot check.

**Signals:** anchorStrength 0.36, consequence 0.78, reachability 1, namelessness 0.64, algorithmicFit 0.95.

## Unanchored proposals (reported, not recommended)

These were proposed as latent needs and matched no structural silence. They are kept visible because a proposal with no evidence behind it is a finding too - it is the thing this report is designed not to recommend.

_None._
