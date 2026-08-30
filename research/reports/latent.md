# Latent Demand: what nobody is searching for

Generated: 2026-08-29T12:53:57.454Z

The roadmap ranks needs by how loudly they are already being asked for. This report ranks needs that produce no query at all, because the person does not yet have a word for the thing or does not yet know the failure is possible. The two scores are not comparable and are never merged.

8 structural silence(s) derived from the catalog; 7 proposal(s) considered, 3 anchored, 0 unanchored. Top latent score 80.2.

## Derived silences (from the catalog alone, nobody proposed these)

### `asymmetry:generation` (weight 0.29)
- **Observed:** The "generation" engine has 5 tool(s) that produce a credential and none that check it.
- **Therefore:** Someone holding a credential this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** lorem-ipsum-generator, password-generator, qr-code-generator, random-string-generator, uuid-generator

### `asymmetry:hashing` (weight 0.29)
- **Observed:** The "hashing" engine has 5 tool(s) that produce a hash digest and none that check it.
- **Therefore:** Someone holding a hash digest this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** crc32-hash-generator, md5-hash-generator, sha1-hash-generator, sha256-hash-generator, sha512-hash-generator

### `dead-end:encoded-text` (weight 0.29)
- **Observed:** Encoded text is produced by encoding and consumed by no engine in the catalog.
- **Therefore:** Whatever a visitor does with encoded text next, they do off-site. The step after ours is the one we cannot see, and it is the one they are still doing by hand.
- **Evidence:** base64-encoder-decoder, binary-converter, binary-text-converter, encoding-detector, hex-encoder-decoder, html-entity-encoder-decoder, json-escape, number-to-words, punycode-converter, roman-numeral-converter, rot13-encoder-decoder, url-encoder-decoder

### `dead-end:credential` (weight 0.27)
- **Observed:** A credential is produced by generation and consumed by no engine in the catalog.
- **Therefore:** Whatever a visitor does with a credential next, they do off-site. The step after ours is the one we cannot see, and it is the one they are still doing by hand.
- **Evidence:** coin-flipper, dice-roller, lorem-ipsum-generator, password-generator, qr-code-generator, random-choice-picker, random-name-picker, random-string-generator, uuid-generator

### `asymmetry:datetime` (weight 0.26)
- **Observed:** The "datetime" engine has 2 tool(s) that produce a date/time and none that check it.
- **Therefore:** Someone holding a date/time this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** timezone-converter, unix-timestamp-converter

### `asymmetry:units` (weight 0.26)
- **Observed:** The "units" engine has 2 tool(s) that produce a measured quantity and none that check it.
- **Therefore:** Someone holding a measured quantity this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** px-to-dp-converter, px-to-rem-converter

### `dead-end:hash` (weight 0.24)
- **Observed:** A hash digest is produced by hashing and consumed by no engine in the catalog.
- **Therefore:** Whatever a visitor does with a hash digest next, they do off-site. The step after ours is the one we cannot see, and it is the one they are still doing by hand.
- **Evidence:** crc32-hash-generator, md5-hash-generator, sha1-hash-generator, sha256-hash-generator, sha512-hash-generator

### `handoff:jwt->structured-data` (weight 0.22)
- **Observed:** The "jwt" engine emits structured data and "structured-data" consumes it, across 9 tools, with no tool spanning the join.
- **Therefore:** The join is currently the clipboard. A workflow people perform in two tabs has no name, so it has no query - and it is still the thing they came to do.
- **Evidence:** jwt-decoder, csv-to-json-converter, json-formatter, json-minifier

## Anchored candidates

### UUID Inspector  (`uuid-inspector`)

**Latent score:** 80.2 / 100 (build-worthy)

- **The need, as behaviour:** Regenerating the identifier and retrying, hoping the next one is accepted.
- **Why there is no query for it:** A UUID looks correct to a human at every level except the two bits that encode its version and variant. Nobody searches for a checker because nobody can see the thing that is wrong, and the rejection downstream almost never says wrong UUID version.
- **What it costs when unmet:** Supplies a v4 UUID where the schema requires v7 and learns it only from a rejected insert.; Pastes a UUID missing one character and the resulting error names an unrelated field.; Treats a v1 UUID as random when it embeds a timestamp and a MAC address.; Generates a nil UUID as a placeholder and it passes shape validation everywhere downstream.
- **Engine:** `generation` (existing)
- **Reachable from:** uuid-generator, random-string-generator, password-generator, coin-flipper, dice-roller, lorem-ipsum-generator

**Anchored to:**
- `asymmetry:generation` - Sits on "generation", which can produce but cannot check.
- `dead-end:credential` - Touches a credential, which nothing in the catalog consumes today.

**Signals:** anchorStrength 0.8, consequence 0.64, reachability 1, namelessness 0.7, algorithmicFit 0.97.

### Hash Identifier and Verifier  (`hash-identifier`)

**Latent score:** 76.8 / 100 (build-worthy)

- **The need, as behaviour:** Re-downloading a large file repeatedly because the checksum keeps failing.
- **Why there is no query for it:** A digest carries no label. The person holding one believes it is the checksum, singular, so the possibility that they are comparing two different algorithms never becomes a thought, let alone a query.
- **What it costs when unmet:** Compares a SHA-1 against a SHA-256 and concludes the download is corrupt.; Sees an uppercase digest beside a lowercase one and reads a mismatch that is not one.; Cannot distinguish a truncated digest from a different algorithm of the same prefix.; Pastes a digest with a trailing filename from a .sha256 file and gets no match.
- **Engine:** `hashing` (existing)
- **Reachable from:** sha256-hash-generator, md5-hash-generator, sha1-hash-generator, crc32-hash-generator, sha512-hash-generator

**Anchored to:**
- `asymmetry:hashing` - Sits on "hashing", which can produce but cannot check.
- `dead-end:hash` - Touches a hash digest, which nothing in the catalog consumes today.

**Signals:** anchorStrength 0.8, consequence 0.68, reachability 0.83, namelessness 0.62, algorithmicFit 0.98.

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
