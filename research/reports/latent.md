# Latent Demand: what nobody is searching for

Generated: 2026-08-16T06:45:38.636Z

The roadmap ranks needs by how loudly they are already being asked for. This report ranks needs that produce no query at all, because the person does not yet have a word for the thing or does not yet know the failure is possible. The two scores are not comparable and are never merged.

12 structural silence(s) derived from the catalog; 2 proposal(s) considered, 0 anchored, 0 unanchored. Top latent score 0.

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

### `asymmetry:csv` (weight 0.27)
- **Observed:** The "csv" engine has 3 tool(s) that produce tabular data and none that check it.
- **Therefore:** Someone holding tabular data this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** csv-cleaner, csv-diff, csv-to-tsv

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

### `asymmetry:color` (weight 0.26)
- **Observed:** The "color" engine has 1 tool(s) that produce a color and none that check it.
- **Therefore:** Someone holding a color this engine produced has no way to find out it is wrong. They will not search for a checker, because the reason to want one is knowledge they do not have.
- **Evidence:** color-format-converter

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

_No proposal matched a derived silence._

## Unanchored proposals (reported, not recommended)

These were proposed as latent needs and matched no structural silence. They are kept visible because a proposal with no evidence behind it is a finding too - it is the thing this report is designed not to recommend.

_None._
