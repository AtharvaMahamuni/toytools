# ToyTools Research Roadmap

Generated: 2026-06-28T00:00:00.000Z

Discovered 19 signals -> 19 unique opportunities (11 recommended, 5 already shipped). Top score 81.6. Missing-engine candidates: 2.

## Immediate builds (top tier)
- **Text to Binary** (`text-to-binary`) - score 79.1, reuses encoding. Weak / incomplete incumbents; Reuses the existing encoding engine; Low implementation cost; Creates 6 internal links.
- **JSON Escape / Unescape** (`json-escape`) - score 78.8, reuses structured-data. High search demand; Weak / incomplete incumbents; Reuses the existing structured-data engine; Low implementation cost; Creates 6 internal links.
- **ROT13 Encoder / Decoder** (`rot13-encoder-decoder`) - score 77.2, reuses encoding. Weak / incomplete incumbents; Reuses the existing encoding engine; Low implementation cost; Creates 6 internal links.
- **Remove Emoji** (`remove-emoji`) - score 75.3, reuses text-processor. Weak / incomplete incumbents; Reuses the existing text-processor engine; Low implementation cost; Creates 6 internal links.

## Quick wins (low effort, recommended)
- **Word Frequency Counter** (`word-frequency-counter`) - score 68.8, reuses text-analysis. Reuses the existing text-analysis engine; Low implementation cost; Creates 6 internal links.
- **CSV to TSV** (`csv-to-tsv`) - score 64, new csv engine. Weak / incomplete incumbents; Implies a new csv engine; Low implementation cost.

## Missing engines (new reusable engines this evidence justifies)
### csv (confidence 0.95) - unlocks 4
- 4 opportunities share the missing "csv" engine.
- Cluster ≥ 3 → justifies a new reusable engine that unlocks 4 tools.
- Tools: csv-diff, csv-to-tsv, csv-cleaner, csv-column-picker

### datetime (confidence 0.97) - unlocks 5
- 5 opportunities share the missing "datetime" engine.
- Cluster ≥ 3 → justifies a new reusable engine that unlocks 5 tools.
- Tools: unix-timestamp-converter, age-calculator, date-difference-calculator, timezone-converter, cron-expression-parser

## Topic clusters
- **Line Break Removal** (text-processor) - 1 tool(s), mean score 81.6.
- **Text Reversal** (text-processor) - 1 tool(s), mean score 80.8.
- **Slugification** (text-processor) - 1 tool(s), mean score 79.6.
- **Binary Encoding** (encoding) - 1 tool(s), mean score 79.1.
- **JSON String Escaping** (structured-data) - 1 tool(s), mean score 78.8.
- **ROT13** (encoding) - 1 tool(s), mean score 77.2.
- **Diacritic Removal** (text-processor) - 1 tool(s), mean score 77.
- **Emoji Removal** (text-processor) - 1 tool(s), mean score 75.3.
- **Checksum (CRC32)** (hashing) - 1 tool(s), mean score 72.5.
- **Word Frequency Analysis** (text-analysis) - 1 tool(s), mean score 68.8.
- **CSV Diff** (csv) - 1 tool(s), mean score 67.1.
- **Timestamp Conversion** (datetime) - 1 tool(s), mean score 65.
- **CSV/TSV Conversion** (csv) - 1 tool(s), mean score 64.
- **CSV Cleaning** (csv) - 1 tool(s), mean score 62.9.
- **Age Calculation** (datetime) - 1 tool(s), mean score 62.5.
- **Date Difference** (datetime) - 1 tool(s), mean score 62.4.
- **CSV Column Selection** (csv) - 1 tool(s), mean score 59.6.
- **Timezone Conversion** (datetime) - 1 tool(s), mean score 56.2.
- **Cron Parsing** (datetime) - 1 tool(s), mean score 55.

## Emerging trends (by transformation)
- Line Break Removal: 1 signal(s), mean demand 0.84, mean score 81.6.
- Text Reversal: 1 signal(s), mean demand 0.78, mean score 80.8.
- Slugification: 1 signal(s), mean demand 0.8, mean score 79.6.
- Binary Encoding: 1 signal(s), mean demand 0.74, mean score 79.1.
- JSON String Escaping: 1 signal(s), mean demand 0.76, mean score 78.8.
- ROT13: 1 signal(s), mean demand 0.64, mean score 77.2.
- Diacritic Removal: 1 signal(s), mean demand 0.7, mean score 77.
- Emoji Removal: 1 signal(s), mean demand 0.66, mean score 75.3.
- Checksum (CRC32): 1 signal(s), mean demand 0.56, mean score 72.5.
- Word Frequency Analysis: 1 signal(s), mean demand 0.72, mean score 68.8.
