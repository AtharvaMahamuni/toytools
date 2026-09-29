# Prep slimming: measured before and after (beta-v12.1)

Widget height is measured exactly as the Prep UX audit did it (`/workspace/prep-ux/measure.cjs`):
from the bottom of `.tool-header` to the top of `.tool-signature`, divided by the viewport height.
`measure.cjs` in this folder is that script with the base URL and output folder made parameters,
plus the JSON Schema Validator error case from the audit's `sv.cjs`.

- **before** = `main` at 87cd32a (beta-v12.0.2), built locally with `PUBLIC_E2E=true npm run build`
- **after** = `feat/prep-slimming`, built the same way
- **audit** = the audit's `measurements.json`, taken on the live site before PR #232 shipped
- **empty** = page as loaded; **filled** = after the tool's Sample button (JSON to Schema: the
  audit's pasted object; Context Fit: the audit's 1,640-character text; validator errors: the
  audit's five-violation schema and data)

Chromium (Playwright), 390x844 phone (isMobile, DPR 2) and 1280x800 desktop.

## 390x844 phone, screens

| tool | audit | before empty | before filled | after empty | after filled |
|---|---|---|---|---|---|
| Prompt Packer | 2.43 | 1.40 | 1.40 | **0.91** | 1.42 (Sample opens More fields) |
| Chat Export Cleaner | 1.66 | 1.43 | 1.43 | **0.76** | **0.76** |
| JSON to JSON Schema | 1.39 | 1.24 | 1.48 | **0.72** | **0.72** |
| JSON Schema Validator | 1.00 | 0.77 | 0.77 | **0.62** | **0.63** |
| JSON Schema Validator, 5 errors | 1.27 | 0.77 | 1.04 | **0.62** | **0.81** |
| Context Fit Checker | 0.83 | 0.72 | 0.72 | **0.45** | **0.45** |
| llms.txt Generator | 1.59 | 1.31 | 1.29 | **1.04** | 1.35 (Sample opens Optional) |

## 1280x800 desktop, screens

| tool | audit | before empty | before filled | after empty | after filled |
|---|---|---|---|---|---|
| Prompt Packer | 2.49 | 1.41 | 1.41 | **0.62** | **1.04** |
| Chat Export Cleaner | 1.75 | 1.51 | 1.51 | **0.85** | **0.85** |
| JSON to JSON Schema | 0.99 | 1.06 | 1.06 | **0.54** | **0.58** |
| JSON Schema Validator | 0.66 | 0.54 | 0.54 | **0.40** | **0.41** |
| JSON Schema Validator, 5 errors | n/a | 0.54 | 0.82 | **0.40** | **0.60** |
| Context Fit Checker | 0.83 | 0.71 | 0.71 | **0.44** | **0.44** |
| llms.txt Generator | 1.68 | 1.36 | 1.36 | **0.71** | **1.01** |

Raw numbers, textarea heights and output positions: `before/measurements.json`,
`after/measurements.json`. Screenshots: `<slug>-<mobile|desktop>-first-screen.png` (page as
loaded) and `<slug>-<mobile|desktop>-widget-full.png` (the whole widget after Sample or fill).
