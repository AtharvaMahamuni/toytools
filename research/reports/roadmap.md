# ToyTools Research Roadmap

Generated: 2026-07-31T09:18:50.711Z

Discovered 56 signals -> 56 unique opportunities (21 recommended, 34 already shipped). Top score 83.9. Missing-engine candidates: 2.

## Immediate builds (top tier)
- **Statistics Visualizer** (`statistics-visualizer`) - score 79.7, reuses math. High search demand; Reuses the existing math engine; Low implementation cost; Creates 4 internal links; Deterministic algorithm solves this exactly (AI adds nothing).
- **Matrix Calculator** (`matrix-calculator`) - score 77.8, reuses math. High search demand; Reuses the existing math engine; Low implementation cost; Creates 3 internal links; Deterministic algorithm solves this exactly (AI adds nothing).
- **Triangle Solver** (`triangle-solver`) - score 77.6, reuses math. High search demand; Reuses the existing math engine; Low implementation cost; Creates 4 internal links; Deterministic algorithm solves this exactly (AI adds nothing).
- **Normal Distribution Visualizer** (`normal-distribution-visualizer`) - score 76.4, reuses math-lab. High search demand; Weak / incomplete incumbents; Reuses the existing math-lab engine; Low implementation cost; Creates 3 internal links; Deterministic algorithm solves this exactly (AI adds nothing).
- **Linear Regression Playground** (`linear-regression-playground`) - score 75.5, reuses math-lab. Weak / incomplete incumbents; Reuses the existing math-lab engine; Low implementation cost; Creates 3 internal links; Deterministic algorithm solves this exactly (AI adds nothing).

## Quick wins (low effort, recommended)
- **WCAG Color Contrast Checker** (`color-contrast-checker`) - score 73, new color engine. High search demand; Implies a new color engine; Low implementation cost; Deterministic algorithm solves this exactly (AI adds nothing).
- **CSV Column Picker** (`csv-column-picker`) - score 71.9, reuses csv. Weak / incomplete incumbents; Reuses the existing csv engine; Low implementation cost; Creates 5 internal links.
- **Color Format Converter** (`color-format-converter`) - score 71.7, new color engine. High search demand; Implies a new color engine; Low implementation cost; Deterministic algorithm solves this exactly (AI adds nothing).
- **PX to REM Converter** (`px-to-rem-converter`) - score 71.3, new units engine. High search demand; Implies a new units engine; Low implementation cost; Deterministic algorithm solves this exactly (AI adds nothing).
- **PX to DP Converter** (`px-to-dp-converter`) - score 69.9, new units engine. Weak / incomplete incumbents; Implies a new units engine; Low implementation cost; Deterministic algorithm solves this exactly (AI adds nothing).
- **Aspect Ratio Calculator** (`aspect-ratio-calculator`) - score 69.5, new units engine. Implies a new units engine; Low implementation cost; Deterministic algorithm solves this exactly (AI adds nothing).
- **Net Worth Calculator** (`net-worth-calculator`) - score 67.3, new budget engine. High search demand; Weak / incomplete incumbents; Implies a new budget engine; Low implementation cost; Creates 2 internal links.
- **Color Shades & Tints Generator** (`color-shades-generator`) - score 66.8, new color engine. Weak / incomplete incumbents; Implies a new color engine; Low implementation cost; Deterministic algorithm solves this exactly (AI adds nothing).
- **Modular Type Scale Generator** (`type-scale-generator`) - score 66.5, new units engine. Weak / incomplete incumbents; Implies a new units engine; Low implementation cost; Deterministic algorithm solves this exactly (AI adds nothing).

## Missing engines (new reusable engines this evidence justifies)
### color (confidence 0.97) - unlocks 6
- 6 opportunities share the missing "color" engine.
- Cluster ≥ 3 → justifies a new reusable engine that unlocks 6 tools.
- Tools: color-contrast-checker, color-format-converter, color-shades-generator, colorblind-simulator, css-gradient-generator, image-palette-extractor

### units (confidence 0.95) - unlocks 4
- 4 opportunities share the missing "units" engine.
- Cluster ≥ 3 → justifies a new reusable engine that unlocks 4 tools.
- Tools: px-to-rem-converter, px-to-dp-converter, aspect-ratio-calculator, type-scale-generator

### loan (confidence 0.65) - unlocks 2
- 2 opportunities share the missing "loan" engine.
- Below the 3-tool bar for a new engine - revisit as more demand accrues.
- Tools: loan-calculator, mortgage-calculator

### budget (confidence 0.65) - unlocks 2
- 2 opportunities share the missing "budget" engine.
- Below the 3-tool bar for a new engine - revisit as more demand accrues.
- Tools: net-worth-calculator, salary-calculator

### retirement (confidence 0.5) - unlocks 1
- 1 opportunity share the missing "retirement" engine.
- Below the 3-tool bar for a new engine - revisit as more demand accrues.
- Tools: retirement-calculator

## Topic clusters
- **Unit Circle** (math-lab) - 1 tool(s), mean score 83.9.
- **Quadratic Equations** (math-lab) - 1 tool(s), mean score 83.8.
- **Fractions** (math) - 1 tool(s), mean score 82.1.
- **Line Break Removal** (text-processor) - 1 tool(s), mean score 81.8.
- **Combinatorics** (math) - 1 tool(s), mean score 81.7.
- **Systematic Investment Plan** (finance) - 1 tool(s), mean score 81.2.
- **Text Reversal** (text-processor) - 1 tool(s), mean score 81.1.
- **Number Theory** (math) - 1 tool(s), mean score 80.9.
- **Projectile Motion** (physics) - 1 tool(s), mean score 80.2.
- **Probability** (math-lab) - 1 tool(s), mean score 80.
- **Slugification** (text-processor) - 1 tool(s), mean score 80.
- **Descriptive Statistics** (math) - 1 tool(s), mean score 79.7.
- **Binary Encoding** (encoding) - 1 tool(s), mean score 79.6.
- **Return on Investment** (finance) - 1 tool(s), mean score 79.5.
- **Ohm's Law** (physics) - 1 tool(s), mean score 79.4.
- **JSON String Escaping** (structured-data) - 1 tool(s), mean score 79.2.
- **Simple Harmonic Motion** (physics) - 1 tool(s), mean score 79.
- **CSV Diff** (csv) - 1 tool(s), mean score 78.8.
- **Compound Annual Growth Rate** (finance) - 1 tool(s), mean score 78.
- **Matrices** (math) - 1 tool(s), mean score 77.8.
- **ROT13** (encoding) - 1 tool(s), mean score 77.8.
- **Diacritic Removal** (text-processor) - 1 tool(s), mean score 77.6.
- **Triangles** (math) - 1 tool(s), mean score 77.6.
- **Ideal Gas Law** (physics) - 1 tool(s), mean score 77.2.
- **Timestamp Conversion** (datetime) - 1 tool(s), mean score 76.9.
- **Normal Distribution** (math-lab) - 1 tool(s), mean score 76.4.
- **Emoji Removal** (text-processor) - 1 tool(s), mean score 76.1.
- **CSV/TSV Conversion** (csv) - 1 tool(s), mean score 76.
- **Doppler Effect** (physics) - 1 tool(s), mean score 75.7.
- **Linear Regression** (math-lab) - 1 tool(s), mean score 75.5.
- **CSV Cleaning** (csv) - 1 tool(s), mean score 74.9.
- **Momentum and Collisions** (physics) - 1 tool(s), mean score 74.6.
- **Age Calculation** (datetime) - 1 tool(s), mean score 74.5.
- **Date Difference** (datetime) - 1 tool(s), mean score 74.4.
- **Inclined Plane and Friction** (physics) - 1 tool(s), mean score 73.9.
- **Function Graphing** (math-lab) - 1 tool(s), mean score 73.6.
- **Checksum (CRC32)** (hashing) - 1 tool(s), mean score 73.5.
- **Contrast Ratio** (color) - 1 tool(s), mean score 73.
- **CSV Column Selection** (csv) - 1 tool(s), mean score 71.9.
- **Color Conversion** (color) - 1 tool(s), mean score 71.7.
- **CSS Unit Conversion** (units) - 1 tool(s), mean score 71.3.
- **Word Frequency Analysis** (text-analysis) - 1 tool(s), mean score 70.
- **Density Unit Conversion** (units) - 1 tool(s), mean score 69.9.
- **Aspect Ratio** (units) - 1 tool(s), mean score 69.5.
- **Timezone Conversion** (datetime) - 1 tool(s), mean score 68.7.
- **Loan Amortization** (loan) - 1 tool(s), mean score 68.5.
- **Cron Parsing** (datetime) - 1 tool(s), mean score 67.6.
- **Net Worth** (budget) - 1 tool(s), mean score 67.3.
- **Mortgage Amortization** (loan) - 1 tool(s), mean score 67.
- **Color Scale** (color) - 1 tool(s), mean score 66.8.
- **Type Scale** (units) - 1 tool(s), mean score 66.5.
- **Salary Conversion** (budget) - 1 tool(s), mean score 66.3.
- **Color Vision Simulation** (color) - 1 tool(s), mean score 65.
- **Retirement Projection** (retirement) - 1 tool(s), mean score 61.4.
- **Perceptual Gradient** (color) - 1 tool(s), mean score 60.9.
- **Palette Extraction** (color) - 1 tool(s), mean score 58.

## Emerging trends (by transformation)
- Unit Circle: 1 signal(s), mean demand 0.88, mean score 83.9.
- Quadratic Equations: 1 signal(s), mean demand 0.94, mean score 83.8.
- Fractions: 1 signal(s), mean demand 0.9, mean score 82.1.
- Line Break Removal: 1 signal(s), mean demand 0.84, mean score 81.8.
- Combinatorics: 1 signal(s), mean demand 0.78, mean score 81.7.
- Systematic Investment Plan: 1 signal(s), mean demand 0.92, mean score 81.2.
- Text Reversal: 1 signal(s), mean demand 0.78, mean score 81.1.
- Number Theory: 1 signal(s), mean demand 0.75, mean score 80.9.
- Projectile Motion: 1 signal(s), mean demand 0.9, mean score 80.2.
- Probability: 1 signal(s), mean demand 0.85, mean score 80.
