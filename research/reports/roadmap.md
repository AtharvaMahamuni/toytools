# ToyTools Research Roadmap

Generated: 2026-07-02T10:03:04.872Z

Discovered 27 signals -> 27 unique opportunities (17 recommended, 6 already shipped). Top score 81.6. Missing-engine candidates: 2.

## Immediate builds (top tier)
- **SIP Calculator** (`sip-calculator`) - score 80.9, reuses finance. High search demand; Weak / incomplete incumbents; Reuses the existing finance engine; Low implementation cost; Creates 5 internal links.
- **ROI Calculator** (`roi-calculator`) - score 79.1, reuses finance. High search demand; Reuses the existing finance engine; Low implementation cost; Creates 5 internal links.
- **JSON Escape / Unescape** (`json-escape`) - score 78.8, reuses structured-data. High search demand; Weak / incomplete incumbents; Reuses the existing structured-data engine; Low implementation cost; Creates 6 internal links.
- **CAGR Calculator** (`cagr-calculator`) - score 77.4, reuses finance. High search demand; Weak / incomplete incumbents; Reuses the existing finance engine; Low implementation cost; Creates 5 internal links.
- **ROT13 Encoder / Decoder** (`rot13-encoder-decoder`) - score 77.2, reuses encoding. Weak / incomplete incumbents; Reuses the existing encoding engine; Low implementation cost; Creates 6 internal links.
- **Remove Emoji** (`remove-emoji`) - score 75.3, reuses text-processor. Weak / incomplete incumbents; Reuses the existing text-processor engine; Low implementation cost; Creates 6 internal links.

## Quick wins (low effort, recommended)
- **Word Frequency Counter** (`word-frequency-counter`) - score 68.8, reuses text-analysis. Reuses the existing text-analysis engine; Low implementation cost; Creates 6 internal links.
- **Net Worth Calculator** (`net-worth-calculator`) - score 65.9, new budget engine. High search demand; Weak / incomplete incumbents; Implies a new budget engine; Low implementation cost; Creates 2 internal links.
- **CSV to TSV** (`csv-to-tsv`) - score 64, new csv engine. Weak / incomplete incumbents; Implies a new csv engine; Low implementation cost.

## Missing engines (new reusable engines this evidence justifies)
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
- **Systematic Investment Plan** (finance) - 1 tool(s), mean score 80.9.
- **Text Reversal** (text-processor) - 1 tool(s), mean score 80.8.
- **Slugification** (text-processor) - 1 tool(s), mean score 79.6.
- **Binary Encoding** (encoding) - 1 tool(s), mean score 79.1.
- **Return on Investment** (finance) - 1 tool(s), mean score 79.1.
- **JSON String Escaping** (structured-data) - 1 tool(s), mean score 78.8.
- **Compound Annual Growth Rate** (finance) - 1 tool(s), mean score 77.4.
- **ROT13** (encoding) - 1 tool(s), mean score 77.2.
- **Diacritic Removal** (text-processor) - 1 tool(s), mean score 77.
- **Emoji Removal** (text-processor) - 1 tool(s), mean score 75.3.
- **Checksum (CRC32)** (hashing) - 1 tool(s), mean score 72.5.
- **Word Frequency Analysis** (text-analysis) - 1 tool(s), mean score 68.8.
- **Loan Amortization** (loan) - 1 tool(s), mean score 67.2.
- **CSV Diff** (csv) - 1 tool(s), mean score 67.1.
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
- Systematic Investment Plan: 1 signal(s), mean demand 0.92, mean score 80.9.
- Text Reversal: 1 signal(s), mean demand 0.78, mean score 80.8.
- Slugification: 1 signal(s), mean demand 0.8, mean score 79.6.
- Binary Encoding: 1 signal(s), mean demand 0.74, mean score 79.1.
- Return on Investment: 1 signal(s), mean demand 0.88, mean score 79.1.
- JSON String Escaping: 1 signal(s), mean demand 0.76, mean score 78.8.
- Compound Annual Growth Rate: 1 signal(s), mean demand 0.82, mean score 77.4.
- ROT13: 1 signal(s), mean demand 0.64, mean score 77.2.
- Diacritic Removal: 1 signal(s), mean demand 0.7, mean score 77.
