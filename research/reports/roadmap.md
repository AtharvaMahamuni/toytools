# ToyTools Research Roadmap

Generated: 2026-06-29T09:03:43.701Z

Discovered 27 signals -> 27 unique opportunities (18 recommended, 5 already shipped). Top score 81.6. Missing-engine candidates: 3.

## Immediate builds (top tier)
- **Text to Binary** (`text-to-binary`) - score 79.1, reuses encoding. Weak / incomplete incumbents; Reuses the existing encoding engine; Low implementation cost; Creates 6 internal links.
- **JSON Escape / Unescape** (`json-escape`) - score 78.8, reuses structured-data. High search demand; Weak / incomplete incumbents; Reuses the existing structured-data engine; Low implementation cost; Creates 6 internal links.
- **ROT13 Encoder / Decoder** (`rot13-encoder-decoder`) - score 77.2, reuses encoding. Weak / incomplete incumbents; Reuses the existing encoding engine; Low implementation cost; Creates 6 internal links.
- **Remove Emoji** (`remove-emoji`) - score 75.3, reuses text-processor. Weak / incomplete incumbents; Reuses the existing text-processor engine; Low implementation cost; Creates 6 internal links.

## Quick wins (low effort, recommended)
- **SIP Calculator** (`sip-calculator`) - score 69.7, new investment engine. High search demand; Weak / incomplete incumbents; Implies a new investment engine; Low implementation cost; Creates 2 internal links.
- **Word Frequency Counter** (`word-frequency-counter`) - score 68.8, reuses text-analysis. Reuses the existing text-analysis engine; Low implementation cost; Creates 6 internal links.
- **ROI Calculator** (`roi-calculator`) - score 67.9, new investment engine. High search demand; Implies a new investment engine; Low implementation cost; Creates 2 internal links.
- **CAGR Calculator** (`cagr-calculator`) - score 66.2, new investment engine. High search demand; Weak / incomplete incumbents; Implies a new investment engine; Low implementation cost; Creates 2 internal links.
- **Net Worth Calculator** (`net-worth-calculator`) - score 65.9, new budget engine. High search demand; Weak / incomplete incumbents; Implies a new budget engine; Low implementation cost; Creates 2 internal links.
- **CSV to TSV** (`csv-to-tsv`) - score 64, new csv engine. Weak / incomplete incumbents; Implies a new csv engine; Low implementation cost.

## Missing engines (new reusable engines this evidence justifies)
### investment (confidence 0.8) - unlocks 3
- 3 opportunities share the missing "investment" engine.
- Cluster ≥ 3 → justifies a new reusable engine that unlocks 3 tools.
- Tools: sip-calculator, roi-calculator, cagr-calculator

### loan (confidence 0.65) - unlocks 2
- 2 opportunities share the missing "loan" engine.
- Below the 3-tool bar for a new engine - revisit as more demand accrues.
- Tools: loan-calculator, mortgage-calculator

### csv (confidence 0.95) - unlocks 4
- 4 opportunities share the missing "csv" engine.
- Cluster ≥ 3 → justifies a new reusable engine that unlocks 4 tools.
- Tools: csv-diff, csv-to-tsv, csv-cleaner, csv-column-picker

### budget (confidence 0.65) - unlocks 2
- 2 opportunities share the missing "budget" engine.
- Below the 3-tool bar for a new engine - revisit as more demand accrues.
- Tools: net-worth-calculator, salary-calculator

### datetime (confidence 0.97) - unlocks 5
- 5 opportunities share the missing "datetime" engine.
- Cluster ≥ 3 → justifies a new reusable engine that unlocks 5 tools.
- Tools: unix-timestamp-converter, age-calculator, date-difference-calculator, timezone-converter, cron-expression-parser

### retirement (confidence 0.5) - unlocks 1
- 1 opportunity share the missing "retirement" engine.
- Below the 3-tool bar for a new engine - revisit as more demand accrues.
- Tools: retirement-calculator

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
- **Systematic Investment Plan** (investment) - 1 tool(s), mean score 69.7.
- **Word Frequency Analysis** (text-analysis) - 1 tool(s), mean score 68.8.
- **Return on Investment** (investment) - 1 tool(s), mean score 67.9.
- **Loan Amortization** (loan) - 1 tool(s), mean score 67.2.
- **CSV Diff** (csv) - 1 tool(s), mean score 67.1.
- **Compound Annual Growth Rate** (investment) - 1 tool(s), mean score 66.2.
- **Net Worth** (budget) - 1 tool(s), mean score 65.9.
- **Mortgage Amortization** (loan) - 1 tool(s), mean score 65.5.
- **Timestamp Conversion** (datetime) - 1 tool(s), mean score 65.
- **Salary Conversion** (budget) - 1 tool(s), mean score 64.8.
- **CSV/TSV Conversion** (csv) - 1 tool(s), mean score 64.
- **CSV Cleaning** (csv) - 1 tool(s), mean score 62.9.
- **Age Calculation** (datetime) - 1 tool(s), mean score 62.5.
- **Date Difference** (datetime) - 1 tool(s), mean score 62.4.
- **CSV Column Selection** (csv) - 1 tool(s), mean score 59.6.
- **Retirement Projection** (retirement) - 1 tool(s), mean score 59.5.
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
- Systematic Investment Plan: 1 signal(s), mean demand 0.92, mean score 69.7.
