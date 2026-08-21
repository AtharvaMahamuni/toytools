# Latent Demand: what nobody is searching for

Generated: 2026-08-21T14:39:26.551Z

The roadmap ranks needs by how loudly they are already being asked for. This report ranks needs that produce no query at all, because the person does not yet have a word for the thing or does not yet know the failure is possible. The two scores are not comparable and are never merged.

10 structural silence(s) derived from the catalog; 7 proposal(s) considered, 5 anchored, 0 unanchored. Top latent score 81.5.

## Derived silences (from the catalog alone, nobody proposed these)

### `asymmetry:encoding` (weight 0.32)
- **Observed:** The "encoding" engine has 8 tool(s) that produce encoded text and none that check it.
- **Therefore:** Someone holding encoded text this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** base64-encoder-decoder, binary-text-converter, hex-encoder-decoder, html-entity-encoder-decoder, json-escape, punycode-converter, rot13-encoder-decoder, url-encoder-decoder

### `asymmetry:text-processor` (weight 0.32)
- **Observed:** The "text-processor" engine has 9 tool(s) that produce text and none that check it.
- **Therefore:** Someone holding text this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** camel-case-converter, kebab-case-converter, lowercase-converter, reverse-text, sentence-case-converter, slugify-text, snake-case-converter, title-case-converter, uppercase-converter

### `asymmetry:generation` (weight 0.29)
- **Observed:** The "generation" engine has 5 tool(s) that produce a credential and none that check it.
- **Therefore:** Someone holding a credential this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** lorem-ipsum-generator, password-generator, qr-code-generator, random-string-generator, uuid-generator

### `asymmetry:hashing` (weight 0.29)
- **Observed:** The "hashing" engine has 5 tool(s) that produce a hash digest and none that check it.
- **Therefore:** Someone holding a hash digest this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** crc32-hash-generator, md5-hash-generator, sha1-hash-generator, sha256-hash-generator, sha512-hash-generator

### `asymmetry:datetime` (weight 0.27)
- **Observed:** The "datetime" engine has 2 tool(s) that produce a date/time and none that check it.
- **Therefore:** Someone holding a date/time this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** timezone-converter, unix-timestamp-converter

### `asymmetry:units` (weight 0.27)
- **Observed:** The "units" engine has 2 tool(s) that produce a measured quantity and none that check it.
- **Therefore:** Someone holding a measured quantity this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** px-to-dp-converter, px-to-rem-converter

### `dead-end:encoded-text` (weight 0.27)
- **Observed:** Encoded text is produced by encoding and consumed by no engine in the catalog.
- **Therefore:** Whatever a visitor does with encoded text next, they do off-site. The step after ours is the one we cannot see, and it is the one they are still doing by hand.
- **Evidence:** base64-encoder-decoder, binary-text-converter, hex-encoder-decoder, html-entity-encoder-decoder, json-escape, punycode-converter, rot13-encoder-decoder, url-encoder-decoder

### `dead-end:credential` (weight 0.24)
- **Observed:** A credential is produced by generation and consumed by no engine in the catalog.
- **Therefore:** Whatever a visitor does with a credential next, they do off-site. The step after ours is the one we cannot see, and it is the one they are still doing by hand.
- **Evidence:** lorem-ipsum-generator, password-generator, qr-code-generator, random-string-generator, uuid-generator

### `dead-end:hash` (weight 0.24)
- **Observed:** A hash digest is produced by hashing and consumed by no engine in the catalog.
- **Therefore:** Whatever a visitor does with a hash digest next, they do off-site. The step after ours is the one we cannot see, and it is the one they are still doing by hand.
- **Evidence:** crc32-hash-generator, md5-hash-generator, sha1-hash-generator, sha256-hash-generator, sha512-hash-generator

### `handoff:jwt->structured-data` (weight 0.22)
- **Observed:** The "jwt" engine emits structured data and "structured-data" consumes it, across 9 tools, with no tool spanning the join.
- **Therefore:** The join is currently the clipboard. A workflow people perform in two tabs has no name, so it has no query - and it is still the thing they came to do.
- **Evidence:** jwt-decoder, csv-to-json-converter, json-formatter, json-minifier

## Anchored candidates

### Encoding Detector  (`encoding-detector`)

**Latent score:** 81.5 / 100 (build-worthy)

- **The need, as behaviour:** Pasting the string into three different decoders in turn until one returns something readable.
- **Why there is no query for it:** You cannot search for the encoding of a string while you still believe you know what it is. The query only forms after someone tells you the assumption was wrong, so the search that would find this tool happens after the failure it prevents.
- **What it costs when unmet:** Pastes standard base64 into a base64url decoder, gets mojibake, and blames the source data.; Decodes once, sees another encoded string, and cannot tell it was double-encoded rather than corrupt.; Assumes a hex digest is base64 because both look like random characters of similar length.; Strips padding that was load-bearing and gets a silently truncated final byte.
- **Engine:** `encoding` (existing)
- **Reachable from:** base64-encoder-decoder, hex-encoder-decoder, url-encoder-decoder, punycode-converter, json-escape, binary-text-converter

**Anchored to:**
- `asymmetry:encoding` - Sits on "encoding", which can produce but cannot check.
- `dead-end:encoded-text` - Touches encoded text, which nothing in the catalog consumes today.

**Signals:** anchorStrength 0.8, consequence 0.72, reachability 1, namelessness 0.66, algorithmicFit 0.96.

### Invisible Character Detector  (`invisible-character-detector`)

**Latent score:** 77.1 / 100 (build-worthy)

- **The need, as behaviour:** Retyping the string by hand until the comparison passes, without ever learning why.
- **Why there is no query for it:** The defect is invisible by definition. The person sees two identical strings and concludes the comparison is broken, so the query they eventually type is about the comparison rather than about the character that is actually there.
- **What it costs when unmet:** Copies text out of a PDF and a zero-width space breaks an exact-match lookup with no error.; Pastes from a word processor and a non-breaking space stops a CSS class from matching.; Reviews a domain containing a Cyrillic character that renders identically to its ASCII twin.; Trims a string and the trailing character survives because it is not the space they expected.
- **Engine:** `text-processor` (existing)
- **Reachable from:** remove-line-breaks, normalize-whitespace, slugify-text, text-compare, camel-case-converter, kebab-case-converter

**Anchored to:**
- `asymmetry:text-processor` - Sits on "text-processor", which can produce but cannot check.

**Signals:** anchorStrength 0.6, consequence 0.82, reachability 1, namelessness 0.59, algorithmicFit 0.97.

### UUID Inspector  (`uuid-inspector`)

**Latent score:** 76.9 / 100 (build-worthy)

- **The need, as behaviour:** Regenerating the identifier and retrying, hoping the next one is accepted.
- **Why there is no query for it:** A UUID looks correct to a human at every level except the two bits that encode its version and variant. Nobody searches for a checker because nobody can see the thing that is wrong, and the rejection downstream almost never says wrong UUID version.
- **What it costs when unmet:** Supplies a v4 UUID where the schema requires v7 and learns it only from a rejected insert.; Pastes a UUID missing one character and the resulting error names an unrelated field.; Treats a v1 UUID as random when it embeds a timestamp and a MAC address.; Generates a nil UUID as a placeholder and it passes shape validation everywhere downstream.
- **Engine:** `generation` (existing)
- **Reachable from:** uuid-generator, random-string-generator, password-generator, lorem-ipsum-generator, qr-code-generator

**Anchored to:**
- `asymmetry:generation` - Sits on "generation", which can produce but cannot check.
- `dead-end:credential` - Touches a credential, which nothing in the catalog consumes today.

**Signals:** anchorStrength 0.8, consequence 0.64, reachability 0.83, namelessness 0.7, algorithmicFit 0.97.

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
